import { get as prop, uniqBy } from 'lodash';
import { hideLoading } from 'react-redux-loading-bar';

import SearchApi from '../apis/search';
import { asyncActionTypes } from '../utils/actionTypes';
import { fetchNewProductCompleted, fetchProductCompleted } from './product';

export const TYPES = {
  SEARCH_PRODUCTS_COMPLETED: 'SEARCH_PRODUCTS_COMPLETED',
  SEARCH_LOADING_START: 'SEARCH_LOADING_START',
  SEARCH_LOADING_END: 'SEARCH_LOADING_END',
  CLEAR_PRODUCT: 'CLEAR_PRODUCT',
  REMOVE_SUGGESTIONS: 'REMOVE_SUGGESTIONS',
};

// New Action Types
const FETCH_SUGGESTIONS = asyncActionTypes('FETCH_SUGGESTIONS');

export const fetchSuggestionsRequest = () => ({
  type: FETCH_SUGGESTIONS.REQUEST,
});
export const fetchSuggestionsSuccess = data => ({
  type: FETCH_SUGGESTIONS.SUCCESS,
  data,
});
export const fetchSuggestionsFailure = error => ({
  type: FETCH_SUGGESTIONS.FAILURE,
  error,
});
export const fetchSuggestions = query => dispatch => {
  dispatch(fetchSuggestionsRequest());
  return SearchApi.fetchSuggestions(query)
    .then(res => dispatch(fetchSuggestionsSuccess(res.data)))
    .catch(error => dispatch(fetchSuggestionsFailure(error)));
};

export const searchProducts = (
  query,
  sort,
  categoryId,
  page,
  filters,
  abtest,
) => {
  return async (dispatch, getState) => {
    dispatch(searchLoadingStart());
    // dispatch(showLoading());

    const customerId = prop(getState(), 'customer.items.id', 0);
    const response = await SearchApi.searchProducts(
      query,
      sort,
      categoryId,
      page,
      filters,
      customerId,
      abtest,
    );

    const products = response.data;

    if (!products) {
      dispatch(searchLoadingEnd());
      // dispatch(hideLoading());
      return dispatch(searchProductsCompleted(query, { items: [] }));
    }

    if (query) {
      await dispatch(searchProductsCompleted(query, products));
    }

    if (page === 1) {
      await dispatch(fetchNewProductCompleted(products));
    } else {
      await dispatch(fetchProductCompleted(products));
    }

    dispatch(searchLoadingEnd());
    dispatch(hideLoading());
  };
};

export const clearProductProp = query => ({
  type: TYPES.CLEAR_PRODUCT,
  payload: {
    query,
  },
});

export const removeSuggestions = () => {
  return async dispatch => {
    dispatch(fetchSuggestionsCompleted([]));
  };
};

export const fetchSuggestionsCompleted = suggestions => ({
  type: TYPES.REMOVE_SUGGESTIONS,
  payload: {
    suggestions,
  },
});

export const searchProductsCompleted = (query, products) => ({
  type: TYPES.SEARCH_PRODUCTS_COMPLETED,
  payload: {
    query,
    products,
  },
});

export const searchLoadingStart = () => ({
  type: TYPES.SEARCH_LOADING_START,
});

export const searchLoadingEnd = () => ({
  type: TYPES.SEARCH_LOADING_END,
});

const initialState = {
  productsByQuery: {},
  suggestions: [],
  isFetching: false,
  loading: false,
  error: '',
};

const searchReducer = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case FETCH_SUGGESTIONS.REQUEST: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case FETCH_SUGGESTIONS.SUCCESS: {
      return {
        ...state,
        isFetching: false,
        suggestions: action.data,
      };
    }
    case FETCH_SUGGESTIONS.FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error.message,
      };
    }

    case TYPES.SEARCH_PRODUCTS_COMPLETED: {
      const { query, products } = action.payload;
      const oldProducts = prop(state.productsByQuery, query);

      return {
        ...state,
        productsByQuery: {
          ...state.productsByQuery,
          [query]: {
            ...oldProducts,
            ...products,
            items: uniqBy(
              [
                ...prop(oldProducts, 'items', []),
                ...prop(products, 'items', []),
              ],
              'sku',
            ),
          },
        },
      };
    }

    case TYPES.SEARCH_LOADING_START: {
      return {
        ...state,
        loading: true,
      };
    }

    case TYPES.CLEAR_PRODUCT: {
      const { query } = action.payload;
      const oldProducts = prop(state.productsByQuery, query);

      return {
        ...state,
        productsByQuery: {
          ...state.productsByQuery,
          [query]: {
            ...oldProducts,
            items: [],
          },
        },
      };
    }

    case TYPES.SEARCH_LOADING_END: {
      return {
        ...state,
        loading: false,
      };
    }

    case TYPES.REMOVE_SUGGESTIONS: {
      return {
        ...state,
        suggestions: [],
      };
    }

    default:
      return state;
  }
};

export default searchReducer;
