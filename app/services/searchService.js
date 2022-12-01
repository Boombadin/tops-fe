import axios from 'axios';
import { map, isEmpty, get as prop, find, orderBy } from 'lodash';
import config from '@app/config';
import ProductModel from '@app/models/productModel';
import { transfromProductBundle } from '@app/utils/product';
import MAQB from '@client/utils/maqb';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const fetchProducts = async ({
  query,
  store,
  sort,
  categoryId,
  page = 1,
  filters,
  userId,
  intentAlias,
}) => {
  const queryEncode = encodeURIComponent(query);
  const queryBuilder = new MAQB();

  queryBuilder
    .size(15)
    .page(page)
    .field('$product.status', '1', 'eq')
    .field('stock.is_in_stock', '1', 'eq')
    .field('price', '0', 'gt');

  // const url = `${dataTeamApiUrl}/search-service/${store}/products?searchCriteria[requestName]=catalog_view_container`
  const url = `${magentoApiUrl}/catalog-service/${store}/V1/products/search`;

  if (query) {
    queryBuilder.field('search_term', queryEncode, 'eq');
  }

  if (categoryId) {
    queryBuilder.field('category.category_id', categoryId, 'eq');
  }

  if (sort) {
    const [sortField, sortDir] = sort.split(',');
    queryBuilder.sort(sortField, sortDir.toUpperCase());
  }

  if (!isEmpty(filters)) {
    if (typeof filters === 'string') {
      filters = JSON.parse(filters);
    }

    map(filters, (filterValue, filterKey) => {
      queryBuilder.field(filterKey, encodeURIComponent(filterValue), 'in');
    });
  }
  queryBuilder.fieldGroup(['visibility,2,eq', 'visibility,4,eq']);
  const builder = queryBuilder.build();

  const fullUrl = `${url}?${builder}`;
  const params = {
    url: fullUrl,
    method: 'GET',
    headers: {
      ...headers,
      'x-user-id': userId,
      'x-intent-alias': intentAlias,
      // 'x-api-key': tokenDataTeam,
      client: 'web',
    },
  };

  return axios(params)
    .then(async response => {
      return ProductModel.products({
        items: await transfromProductBundle(
          prop(response, 'data.products', []),
          store,
        ),
        filters: response.data.filters,
        sorting: response.data.sorting,
        total_count: response.data.total_count,
        search_criteria: {
          ...response.data.search_criteria,
          page_size: response.data.search_criteria.size,
        },
      });
    })
    .catch(async e => {
      const response = await fetchMagentoProducts(store, queryBuilder.build());
      return response;
    });
};

const fetchMagentoProducts = async (store, queryBuilder) => {
  const url = `${magentoApiUrl}/catalog-service/${store}/V1/products/search`;

  const fullUrl = `${url}&${queryBuilder}`;
  const params = {
    url: fullUrl,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => {
      let filters = prop(response, 'data.filters');
      if (filters) {
        const sortOrder = [
          'promotion_type',
          'country_of_product',
          'brand_name',
        ];
        filters = map(filters, filter => {
          const filterAttr = filter.attribute_code;
          const indexOfCurrentFilter = sortOrder.indexOf(filterAttr);
          filter.position =
            indexOfCurrentFilter === -1 ? 999 : indexOfCurrentFilter;
          return filter;
        });

        filters = orderBy(filters, 'position', 'asc');

        const findBrand = find(filters, f => f.attribute_code === 'brand_name');
        if (findBrand) {
          findBrand.items = findBrand.items.slice(0, 10);
        }

        response.data.filters = filters;
      }

      return response.data;
    })
    .catch(e => {
      return null;
    });
};

const fetchSuggestions = async ({ query, store }) => {
  const queryEncode = encodeURIComponent(query);
  const params = {
    url: `${magentoApiUrl}/catalog-service/${store}/V1/products/suggest?q=${queryEncode}`,
    method: 'GET',
    headers,
  };

  return (await axios(params)).data;
};

export default {
  fetchSuggestions,
  fetchProducts,
};
