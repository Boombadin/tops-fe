import {
  get as prop,
  isEmpty,
  find,
  orderBy,
  compact,
  filter,
  map,
} from 'lodash';
import CategoryApi from '../apis/category';
import { asyncActionTypes } from '../utils/actionTypes';
import { reducerCreator } from '../utils/reducerCreator';
import { getActiveCategoryList } from '../utils/category';
// Constants
const FETCH_ALL_CATEGORY = asyncActionTypes('FETCH_ALL_CATEGORY');
const FETCH_ACTIVE_CATEGORY_COMPLETED = 'FETCH_ACTIVE_CATEGORY_COMPLETED';
const FETCH_PRODUCT_IN_SUBCATEGORY_START = 'FETCH_PRODUCT_IN_SUBCATEGORY_START';
const FETCH_PRODUCT_IN_SUBCATEGORY = 'FETCH_PRODUCT_IN_SUBCATEGORY';
const FETCH_MAIN_CATEGORY_COMPLETED = 'FETCH_MAIN_CATEGORY_COMPLETED';

export const fetchCategoryRequest = () => ({
  type: FETCH_ALL_CATEGORY.REQUEST,
});
export const fetchCategorySuccess = data => ({
  type: FETCH_ALL_CATEGORY.SUCCESS,
  data,
});
export const fetchCategoryFailure = error => ({
  type: FETCH_ALL_CATEGORY.FAILURE,
  error,
});
export const fetchCategory = () => async dispatch => {
  try {
    dispatch(fetchCategoryRequest());

    const resp = await CategoryApi.getCategories();

    if (prop(resp, 'data')) {
      const { categories } = resp.data;

      if (!isEmpty(categories)) {
        dispatch(fetchCategorySuccess(categories));
      }

      return categories;
    }
  } catch (e) {
    localStorage.clear();
    return dispatch(fetchCategorySuccess([]));
  }
};

export const fetchProductInSubcategory = (urlPath, urlRewriteId) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const categories = prop(state, 'category.items');

  dispatch(fetchProductSetsStart());

  try {
    const category = find(
      categories,
      categ => categ.url_path === urlPath && categ.entity_id === urlRewriteId,
    );
    const childrens = category.children.split(',');
    let subCateList = childrens.map(childrenId => {
      return find(categories, categ => categ.id.toString() === childrenId);
    });

    subCateList = orderBy(subCateList, 'position', 'asc');
    const subCategories = getActiveCategoryList(compact(subCateList));
    const filterSubCate = filter(subCategories, subCate => {
      return prop(subCate, 'extension_attributes.product_count') > 0;
    });

    const subCateId = [];
    map(filterSubCate, async val => {
      subCateId.push(val.entity_id);
    });

    const { productSets } = await CategoryApi.getProductSets(subCateId);

    return dispatch(fetchProductSets(productSets));
  } catch (error) {
    return dispatch(fetchProductSets([]));
  }
};

export const fetchActiveCategory = slug => {
  return async (dispatch, getState) => {
    const { category } = await CategoryApi.getOne(slug);
    const activeCate = prop(category, 'items[0]', {});
    dispatch(fetchActiveCategoryComplete(activeCate));
    return category;
  };
};

export const fetchActiveCategoryComplete = category => ({
  type: FETCH_ACTIVE_CATEGORY_COMPLETED,
  payload: {
    category,
  },
});

export const fetchProductSetsStart = () => ({
  type: FETCH_PRODUCT_IN_SUBCATEGORY_START,
});

export const fetchProductSets = productSets => ({
  type: FETCH_PRODUCT_IN_SUBCATEGORY,
  payload: {
    productSets,
  },
});

export const fetchMainCategoryComplete = category => ({
  type: FETCH_MAIN_CATEGORY_COMPLETED,
  payload: {
    category,
  },
});

const initialState = {
  items: [],
  mainCategory: [],
  active: {},
  loading: false,
  error: '',
  productSets: [],
  loadingProductSets: false,
};

const reducer = (state = initialState, action) => {
  // Reducer Creators
  const { setState } = reducerCreator(state, action);
  // Switch Case
  switch (action.type) {
    case FETCH_ALL_CATEGORY.REQUEST:
      return setState({
        loading: true,
        error: '',
      });
    case FETCH_ALL_CATEGORY.SUCCESS:
      return setState({
        loading: false,
        items: action.data,
        error: '',
      });
    case FETCH_ALL_CATEGORY.FAILURE:
      return setState({
        loading: false,
        error: action.error.message,
      });
    case FETCH_ACTIVE_CATEGORY_COMPLETED: {
      const { category } = action.payload;
      return {
        ...state,
        ...{
          active: category,
          loading: false,
        },
      };
    }
    case FETCH_PRODUCT_IN_SUBCATEGORY_START: {
      return {
        ...state,
        loadingProductSets: true,
      };
    }
    case FETCH_PRODUCT_IN_SUBCATEGORY: {
      const { productSets } = action.payload;
      return {
        ...state,
        productSets,
        loadingProductSets: false,
      };
    }

    case FETCH_MAIN_CATEGORY_COMPLETED:
      return setState({
        // loading: false,
        mainCategory: action.payload.category,
        error: '',
      });
    default:
      return state;
  }
};

export default reducer;
