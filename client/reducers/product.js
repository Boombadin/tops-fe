import {
  filter,
  find,
  get as prop,
  isEmpty,
  map,
  omit,
  result,
  uniqBy,
} from 'lodash';
import queryString from 'query-string';
import { getTranslate } from 'react-localize-redux';
import { hideLoading, showLoading } from 'react-redux-loading-bar';

import ProductApi from '../apis/product';

export const TYPES = {
  FETCH_PRODUCTS: 'FETCH_PRODUCTS',
  FETCH_ONE_PRODUCTS: 'FETCH_ONE_PRODUCTS',
  FETCH_PRODUCTS_COMPLETED: 'FETCH_PRODUCTS_COMPLETED',
  FETCH_NEW_PRODUCTS_COMPLETED: 'FETCH_NEW_PRODUCTS_COMPLETED',
  FETCH_PRODUCTS_FAILED: 'FETCH_PRODUCTS_FAILED',
  FETCH_ACTIVE_PRODUCT_LOADED: 'FETCH_ACTIVE_PRODUCT_LOADED',
  CLEAR_PRODUCTS: 'CLEAR_PRODUCTS',
  SET_ACTIVE_SORTING: 'SET_ACTIVE_SORTING',
  FETCH_RELATE_COMPLETED: 'FETCH_RELATE_COMPLETED',
  FETCH_BUNDLE_COMPLETED: 'FETCH_BUNDLE_COMPLETED',
  FETCH_BUNDLE_START: 'FETCH_BUNDLE_START',
  FETCH_SIMILAR_STARTED: 'FETCH_SIMILAR_STARTED',
  FETCH_SIMILAR_COMPLETED: 'FETCH_SIMILAR_COMPLETED',
  FETCH_PRODUCT_BADGE_COMPLTED: 'FETCH_PRODUCT_BADGE_COMPLTED',
  FETCH_CAMPAIGN_CATALOG_COMPLETED: 'FETCH_CAMPAIGN_CATALOG_COMPLETED',
};

export const fetchProductByFilter = (
  key,
  slug,
  condition,
  sort,
) => async dispatch => {
  try {
    dispatch(fetchProductLoading());
    const { products } = await ProductApi.getByFilter(
      key,
      slug,
      condition,
      sort,
    );
    return products;
  } catch (e) {
    dispatch(fetchProductFailed());
    return {};
  }
};

export const fetchProductByCategorySet = params => async dispatch => {
  dispatch(showLoading());
  dispatch(fetchProductLoading());
  try {
    const paramString = queryString.stringify(params);
    const { products } = await ProductApi.getByCategorySet(paramString);
    dispatch(fetchNewProductCompleted(products));
    dispatch(hideLoading());
    return products;
  } catch (e) {
    dispatch(fetchProductFailed());
    dispatch(hideLoading());
    return {};
  }
};

export const fetchProduct = params => async dispatch => {
  dispatch(fetchProductLoading());
  try {
    const paramString = queryString.stringify(params);
    const { products } = await ProductApi.get(paramString);

    if (
      prop(params, 'product_recommend') &&
      prop(params, 'page_number', 0) === 1
    ) {
      const productDatalake = JSON.parse(prop(params, 'product_recommend', {}));
      const newSortItem = [];
      prop(productDatalake, 'product', {}).map(sku => {
        const filterItem = find(prop(products, 'items', []), item => {
          return item.sku === sku;
        });

        if (!isEmpty(filterItem)) {
          newSortItem.push(filterItem);
        }
      });

      if (!isEmpty(products)) {
        products.items = newSortItem.concat(products.items);
      }
    }

    dispatch(fetchProductCompleted(products));
    return products;
  } catch (e) {
    dispatch(fetchProductFailed());
    return {};
  }
};

export const fetchNewProduct = params => async dispatch => {
  dispatch(fetchProductLoading());
  const paramString = queryString.stringify(params);
  try {
    const { products } = await ProductApi.get(paramString);
    dispatch(fetchNewProductCompleted(products));
    return products;
  } catch (e) {
    dispatch(fetchProductFailed());
    return {};
  }
};

export const fetchPromotions = params => async dispatch => {
  dispatch(fetchProductLoading());
  const paramString = queryString.stringify(params);
  try {
    const { products } = await ProductApi.getPromotion(paramString);
    dispatch(fetchProductCompleted(products));
    return products;
  } catch (e) {
    dispatch(fetchProductFailed());
    return {};
  }
};

export const fetchProductRecommendPersonal = product_recommend => async (
  dispatch,
  getState,
) => {
  try {
    const products = await ProductApi.getRecommendPersonal(product_recommend);

    return { product: prop(products, 'product[0].data[0].item', []) };
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return [];
  }
};

export const fetchProductBundle = promoNo => async dispatch => {
  try {
    dispatch(fetchProductBundleStart());
    const search = `field=promotion_no,${promoNo},eq&page_number=1&page_size=99&sort=name,asc`;
    const { products } = await ProductApi.get(search);
    dispatch(fetchProductBundleComplete(products));
    return products;
  } catch (e) {
    dispatch(fetchProductFailed());
    return null;
  }
};

export const setActiveSorting = (sortData, props) => () => {
  const { history, location } = props;
  const search = queryString.parse(location.search);
  const newSearch = queryString.stringify({ ...search, sort: sortData });

  history.push({
    pathname: location.pathname,
    search: newSearch,
  });
};

const setInitialFilter = filters => {
  const parsedSearchQuery = queryString.parse(window.location.search);
  const currentFilters = omit(parsedSearchQuery, [
    'category_id',
    'sort',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'gclsrc',
    'affiliate_id',
    'offer_id',
    'fbclid',
    'sc_src',
    'sc_lid',
    'sc_uid',
    'sc_llid',
    'sc_customer',
    'sc_eh',
  ]);

  filters.forEach(filter => {
    map(currentFilters, (filterValue, filterKey) => {
      const filterValues = filterValue.split(',');

      if (filter.attribute_code === filterKey) {
        filter.items.forEach(item => {
          item.checked = filterValues.includes(item.value);
        });
      }
    });
  });

  return filters;
};

export const setActiveFilter = (filterData, props) => (dispatch, getState) => {
  const { history, location } = props;
  const { name, value, checked } = filterData;
  const currentFilters = getState().product.filters;
  const search = queryString.parse(location.search);
  const filters = {};

  const selectedInput = find(
    result(
      find(currentFilters, obj => {
        return obj.attribute_code === name;
      }),
      'items',
    ),
    obj => obj.value === value,
  );

  selectedInput.checked = checked;

  currentFilters.map(filter => {
    const localParam = [];

    filter.items.map(item => {
      if (item.checked) {
        localParam.push(item.value);
      }
    });

    if (localParam.length > 0) {
      const filterKey = filter.attribute_code;
      const filterValue = localParam.toString();
      filters[filterKey] = filterValue;
    }
  });

  history.push({
    pathname: location.pathname,
    search: queryString.stringify({
      category_id: search.category_id,
      sort: search.sort,
      ...filters,
    }),
  });
};

export const resetFilter = props => (dispatch, getState) => {
  const { history, location } = props;
  history.push({
    pathname: location.pathname,
    search: '',
  });
};

export const formatFilter = filters => (dispatch, getState) => {
  const storeConfig = getState().storeConfig.current;
  const translate = getTranslate(getState().locale);

  const formatedFilters = map(filters, filterItem => {
    const thisAttrCode = prop(filterItem, 'attribute_code');

    if (thisAttrCode !== 'promotion_type') return filterItem;

    const filterByPromotionTypeItems = [];
    map(prop(filterItem, 'items'), item => {
      const promoType = [
        'sale',
        'redhot',
        'bogo',
        'b2g1',
        'b3g1',
        'b1gv',
        'b2gv',
        'b3gv',
        'moneyback',
      ];
      const checkPromotionType = filter(promoType, type => {
        return (
          type ===
          prop(item, 'value', '')
            .toLowerCase()
            .replace(' ', '')
        );
      });

      if (checkPromotionType.length > 0) {
        filterByPromotionTypeItems.push(item);
      }
    });

    const formatedFilterItem = map(filterByPromotionTypeItems, item => {
      const baseMediaUrl = prop(storeConfig, 'base_media_url', '');
      const storeImage = prop(storeConfig, 'extension_attributes', {})[
        `${prop(item, 'value', '')
          .toLowerCase()
          .replace(' ', '')}_image`
      ];
      const label = item.label.toLowerCase();
      const data = {
        ...item,
        label: translate(`promotion.${label.replace(' ', '')}`),
        icon: `${baseMediaUrl}${storeImage}`,
      };

      return data;
    });

    return {
      ...filterItem,
      items: formatedFilterItem,
    };
  });

  return formatedFilters;
};

export const fetchCampaignCatalog = banner => async (dispatch, getState) => {
  const storeConfig = getState().storeConfig.current;
  const campaignCatalogStore = filter(
    prop(banner, '0.extension_attributes.slides', []),
    slide => {
      return !isEmpty(
        filter(prop(slide, 'store_ids', {}), storeId => {
          return storeId === prop(storeConfig, 'id', '');
        }),
      );
    },
  );

  const campaignCatalogSku = prop(
    campaignCatalogStore,
    '0.extension_attributes.sku',
    '',
  );

  try {
    let items = {};
    if (!isEmpty(campaignCatalogSku)) {
      items = await ProductApi.getByCampaignCatalog(campaignCatalogSku);
    }

    const campaignCatalog = {
      name: prop(campaignCatalogStore, '0.name', ''),
      deepLink: prop(campaignCatalogStore, '0.url', ''),
      displayFrom: prop(campaignCatalogStore, '0.display_from', ''),
      displayTo: prop(campaignCatalogStore, '0.display_to', ''),
      products: prop(items, 'product_campaign.items', []),
    };

    dispatch(fetchCampaignCatalogCompleted(campaignCatalog));

    return campaignCatalog;
  } catch (e) {
    return {};
  }
};

export const clearProductProp = () => ({
  type: TYPES.CLEAR_PRODUCTS,
});

export const fetchProductLoading = () => ({
  type: TYPES.FETCH_PRODUCTS,
});

export const fetchOneProductLoading = () => ({
  type: TYPES.FETCH_ONE_PRODUCTS,
});

export const fetchProductCompleted = products => ({
  type: TYPES.FETCH_PRODUCTS_COMPLETED,
  payload: {
    products,
  },
});

export const fetchProductBundleStart = () => ({
  type: TYPES.FETCH_BUNDLE_START,
});

export const fetchProductBundleComplete = products => ({
  type: TYPES.FETCH_BUNDLE_COMPLETED,
  payload: {
    products,
  },
});

export const fetchRelativeCompleted = products => ({
  type: TYPES.FETCH_RELATE_COMPLETED,
  payload: {
    products,
  },
});

export const fetchSimilarStarted = () => ({
  type: TYPES.FETCH_SIMILAR_STARTED,
});

export const fetchSimilarCompleted = products => ({
  type: TYPES.FETCH_SIMILAR_COMPLETED,
  payload: {
    products,
  },
});

export const fetchNewProductCompleted = products => ({
  type: TYPES.FETCH_NEW_PRODUCTS_COMPLETED,
  payload: {
    products,
  },
});

export const fetchProductFailed = () => ({
  type: TYPES.FETCH_PRODUCTS_FAILED,
});

export const fetchActiveproductLoaded = activeProduct => ({
  type: TYPES.FETCH_ACTIVE_PRODUCT_LOADED,
  payload: {
    activeProduct,
  },
});

export const fetchProductBadgeComplete = productBadge => ({
  type: TYPES.FETCH_PRODUCT_BADGE_COMPLTED,
  payload: {
    productBadge,
  },
});

export const fetchCampaignCatalogCompleted = campaignCatalog => ({
  type: TYPES.FETCH_CAMPAIGN_CATALOG_COMPLETED,
  payload: {
    campaignCatalog,
  },
});

const initialState = {
  loading: false,
  activeLoading: false,
  items: [],
  activeProduct: null,
  filters: [],
  sorting: [],
  search_criteria: {},
  total_count: 0,
  failed: false,
  related: [],
  similar: [],
  bundle: [],
  bundleLoading: false,
  loadingSimilar: true,
  campaignCatalog: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_PRODUCTS: {
      return { ...state, loading: true, failed: false };
    }

    case TYPES.FETCH_ONE_PRODUCTS: {
      return { ...state, activeLoading: true, related: [] };
    }

    case TYPES.FETCH_PRODUCTS_COMPLETED: {
      const { products } = action.payload;
      const newProducts = uniqBy([...state.items, ...products.items], 'sku');

      return {
        ...state,
        items: newProducts,
        loading: false,
        filters: products.filters ? setInitialFilter(products.filters) : [],
        sorting: products.sorting || [],
        search_criteria: products.search_criteria || {},
        total_count: products.total_count,
      };
    }

    case TYPES.FETCH_NEW_PRODUCTS_COMPLETED: {
      const { products } = action.payload;

      return {
        ...state,
        items: products.items,
        loading: false,
        filters: products.filters ? setInitialFilter(products.filters) : [],
        sorting: products.sorting || [],
        search_criteria: products.search_criteria || {},
        total_count: products.total_count,
      };
    }

    case TYPES.FETCH_RELATE_COMPLETED: {
      const { products } = action.payload;

      return {
        ...state,
        related: products.items,
      };
    }

    case TYPES.FETCH_SIMILAR_COMPLETED: {
      return {
        ...state,
        similar: action.payload.products,
        loadingSimilar: false,
      };
    }

    case TYPES.FETCH_BUNDLE_START: {
      return {
        ...state,
        bundle: [],
        bundleLoading: true,
      };
    }

    case TYPES.FETCH_BUNDLE_COMPLETED: {
      const { products } = action.payload;

      return {
        ...state,
        bundle: products.items,
        bundleLoading: false,
      };
    }

    case TYPES.FETCH_PRODUCTS_FAILED: {
      return { ...state, failed: true, bundleLoading: false };
    }

    case TYPES.FETCH_ACTIVE_PRODUCT_LOADED: {
      const { activeProduct } = action.payload;
      return {
        ...state,
        activeProduct,
        activeLoading: false,
      };
    }

    case TYPES.CLEAR_PRODUCTS: {
      const newState = { items: [], loading: false, search_criteria: {} };
      return { ...state, ...newState };
    }

    case TYPES.FETCH_SIMILAR_STARTED: {
      return { ...state, loadingSimilar: true };
    }

    case TYPES.FETCH_PRODUCT_BADGE_COMPLTED: {
      const { productBadge } = action.payload;
      return { ...state, productBadge };
    }

    case TYPES.FETCH_CAMPAIGN_CATALOG_COMPLETED: {
      const { campaignCatalog } = action.payload;
      return { ...state, campaignCatalog };
    }

    default:
      return state;
  }
};

export default reducer;
