import axios from 'axios';
import { find, get as prop, isArray, isEmpty, map, orderBy } from 'lodash';

import config from '@app/config';
import ProductModel from '@app/models/productModel';
import {
  addFieldToQueryBuilder,
  addFiltersToQueryBuilder,
  addSortingToQueryBuilder,
} from '@app/utils';
import magentoService from '@app/utils/magentoService';
import { transfromProductBundle } from '@app/utils/product';
import MAQB, { fieldConditions as Conditions } from '@client/utils/maqb';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const dataTeamApiUrl = config.data_team_api_base_url;
const tokenDataTeam = config.data_team_api_token;

const dataTeamApiUrlA = config.data_team_api_base_url;
const dataTeamApiUrlB = config.data_team_api_base_url_b;
const tokenDataTeamA = config.data_team_api_token;
const tokenDataTeamB = config.data_team_api_token_b;

async function catalogServiceResponseTransform(searchResult, store) {
  if (!searchResult) return {};

  return ProductModel.products({
    items: await transfromProductBundle(
      prop(searchResult, 'products', []),
      store,
    ),
    filters: searchResult.filters,
    sorting: searchResult.sorting,
    total_count: searchResult.total_count,
    search_criteria: {
      ...searchResult.search_criteria,
      page_size: searchResult.search_criteria.size,
    },
  });
}

async function get(store, query = '') {
  try {
    const searchResult = await magentoService({
      url: `/catalog-service/${store}/V1/products/search?${query}`,
      method: 'GET',
    });
    const transformProducts = await catalogServiceResponseTransform(
      searchResult,
      store,
    );

    return transformProducts;
  } catch (error) {
    // TODO: better remove and handle error in controller
    return {};
  }
}

const search = (store, query = '') => {
  const newQuery = `${query}&searchCriteria[requestName]=catalog_view_container`;
  const params = {
    url: `${magentoApiUrl}/${store}/V2/search?${newQuery}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => {
      let filters = prop(response, 'data.filters');

      if (!isEmpty(filters)) {
        // Sort order
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
          findBrand.items = findBrand.items.slice(0, 50);
          findBrand.items = orderBy(findBrand.items, 'label', 'asc');
        }

        response.data.filters = filters;
      }

      return response.data;
    })
    .catch(e => {
      return {};
    });
};

const getV1 = (store, query = '') => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/products?${query}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const getOne = (store, id) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/products/url-key/${id}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return {};
    });
};

const getOneBySku = (sku, store) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V2/products/${sku}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return null;
    });
};

const getCatalogServiceBySku = (
  skus,
  store,
  pageSize = 1,
  plpFilter = false,
) => {
  const queryBuilder = new MAQB();

  if (plpFilter && (plpFilter === true || plpFilter === 'true')) {
    queryBuilder
      .field('$product.status', '1', 'eq')
      .field('stock.is_in_stock', '1', 'eq')
      .field('price', '0', 'gt')
      .fieldGroup(['visibility,2,eq', 'visibility,4,eq']);
  }
  queryBuilder
    .field('sku.0', skus, Conditions.IN)
    .size(pageSize)
    .page(1)
    .sort('name', 'ASC');

  const query = queryBuilder.build();

  const params = {
    url: `${magentoApiUrl}/catalog-service/${store}/V1/products/search?${query}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(async response => {
      const products = await transfromProductBundle(
        prop(response, 'data.products', []),
        store,
      );
      const productModal = {
        products,
        filters: response.data.filters,
        sorting: response.data.sorting,
        total_count: response.data.total_count,
        search_criteria: {
          ...response.data.search_criteria,
          page_size: response.data.search_criteria.size,
        },
      };
      return productModal;
    })
    .catch(e => {
      console.error(prop(e, 'message', ''));
      return null;
    });
};

const getRelatedForProduct = (store, id) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/products/${id}/related-products`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const getByIds = ({ storeCode, ids, ...qry }) => {
  try {
    const filter = qry;
    const queryBuilder = new MAQB();
    queryBuilder.size(filter.page_size || 8).page(filter.page_number || 1);

    if (filter.field) {
      if (typeof filter.field === 'string') {
        addFieldToQueryBuilder(queryBuilder, filter.field);
      } else if (typeof filter.field === 'object') {
        for (let i = filter.field.length - 1; i >= 0; i--) {
          const field = filter.field[i];
          addFieldToQueryBuilder(queryBuilder, field);
        }
      }
    }

    if (filter.filters) {
      if (typeof filter.filters === 'string') {
        addFiltersToQueryBuilder(queryBuilder, filter.filters);
      } else if (typeof filter.filters === 'object') {
        filter.filters.map(item => {
          addFiltersToQueryBuilder(queryBuilder, item);
        });
      }
    }

    if (filter.sort) {
      addSortingToQueryBuilder(queryBuilder, filter.sort);
    }

    queryBuilder.field('entity_id', ids, Conditions.IN);

    const query = queryBuilder.build();

    return get(storeCode, query);
  } catch (e) {
    return null;
  }
};

const getBase = ({ storeCode, params, limit, page }) => {
  const queryBuilder = new MAQB();

  if (isEmpty(params.sku)) {
    return null;
  }

  queryBuilder
    .field('$product.status', 1, Conditions.EQUAL)
    .size(limit)
    .page(page)
    .sort('name', 'ASC');

  Object.keys(params).forEach(i => {
    if (isArray(params[i])) {
      queryBuilder.field(i, params[i], Conditions.IN);
    } else {
      queryBuilder.field(i, params[i], Conditions.EQUAL);
    }
  });

  return get(storeCode, queryBuilder.build());
};

const getBySkus = ({ storeCode, skus }) => {
  return getBase({
    storeCode,
    limit: 1000,
    page: 1,
    params: {
      sku: skus,
    },
  });
};

const getProductSimilarity = (
  sku,
  storeCode,
  userId,
  isGoogleOptimizeSimilarity,
) =>
  new Promise((resolve, reject) => {
    let apiUrl = dataTeamApiUrlA;
    let apiKey = tokenDataTeamA;

    if (isGoogleOptimizeSimilarity === 'true') {
      apiUrl = dataTeamApiUrlB;
      apiKey = tokenDataTeamB;
    }

    const params = {
      url: `${apiUrl}/recommendation/products/similarity/${sku ||
        ''}?store=${storeCode || ''}&userId=${userId || 0}`,
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getProductAssociation = (
  sku,
  storeCode,
  userId,
  isGoogleOptimizeAssociation,
) =>
  new Promise((resolve, reject) => {
    let apiUrl = dataTeamApiUrlA;
    let apiKey = tokenDataTeamA;

    if (isGoogleOptimizeAssociation === 'true') {
      apiUrl = dataTeamApiUrlB;
      apiKey = tokenDataTeamB;
    }

    const params = {
      url: `${apiUrl}/recommendation/products/association/${sku ||
        ''}?store=${storeCode || ''}&userId=${userId || 0}`,
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getProductRecommendPersonal = (userId, apiUrl, apiKey) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${apiUrl}/recommendation/users/${userId || 0}`,
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getProductBadge = store => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/productbadge/search?searchCriteria[filter_groups][0][filters][0][field]=active&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      console.log({ e });
      return {};
    });
};

export default {
  search,
  get,
  getOne,
  getOneBySku,
  getCatalogServiceBySku,
  getV1,
  getRelatedForProduct,
  getBySkus,
  getBase,
  getByIds,
  getProductSimilarity,
  getProductAssociation,
  getProductRecommendPersonal,
  getProductBadge,
};
