import { isEmpty, concat, reduce, find, orderBy, uniqBy } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import CheckoutApi from '../apis/checkout';
import {
  filterStoreWithContain,
  filterStoreWithLevenshtein,
} from '../utils/storeLocator';

export const TYPES = {
  FETCH_STORELOCATOR_START: 'FETCH_STORELOCATOR_START',
  FETCH_STORELOCATOR_COMPLETED: 'FETCH_STORELOCATOR_COMPLETED',
  SEARCH_STORELOCATOR_COMPLETED: 'SEARCH_STORELOCATOR_COMPLETED',
  RESET_SEARCH_STORE: 'RESET_SEARCH_STORE',
};

let interval = null;

export const fetchStoreLocator = () => async dispatch => {
  try {
    dispatch(fetchStoreLocatorStart());
    const { stores, afterLangStore } = await CheckoutApi.getStorLocator();

    dispatch(fetchStoreLocatorCompleted(stores, afterLangStore));
  } catch (e) {
    dispatch(fetchStoreLocatorCompleted([]));
  }
};

export const searchStoreLocator = search => {
  return async (dispatch, getState) => {
    const { storeLocator, locale } = getState();
    const translate = getTranslate(locale);

    let searchResult = {};

    if (interval) {
      clearTimeout(interval);
    }
    interval = setTimeout(async () => {
      if (!isEmpty(search)) {
        const concatPickupStore = concat(
          storeLocator?.items,
          storeLocator?.afterLangStore,
        );

        let storeResults = [];
        if (concatPickupStore?.length > 0) {
          storeResults = filterStoreWithContain(concatPickupStore, search);
          storeResults = uniqBy(orderBy(storeResults, 'id', 'asc'), 'id');

          if (storeResults?.length <= 0) {
            storeResults = filterStoreWithLevenshtein(
              concatPickupStore,
              search,
            );
            storeResults = uniqBy(
              orderBy(storeResults, 'percent', 'desc'),
              'id',
            );
          }
        }

        if (storeResults?.length > 0) {
          const compareStoreLangCurrent = reduce(
            storeResults,
            (result, store) => {
              const findStoreLocator = find(
                storeLocator?.items,
                val => val?.id === store?.id,
              );
              if (!isEmpty(findStoreLocator)) {
                result.push(findStoreLocator);
              }
              return result;
            },
            [],
          );

          searchResult = { items: compareStoreLangCurrent, error: '' };
        } else {
          searchResult = {
            items: [],
            error: translate('search_store_locator.not_found'),
          };
        }

        dispatch(searchStoreLocatorCompleted(searchResult));
      } else {
        dispatch(resetSearchStore());
      }
    }, 1000);
  };
};

export const fetchStoreLocatorStart = () => ({
  type: TYPES.FETCH_STORELOCATOR_START,
});
export const fetchStoreLocatorCompleted = (stores, afterLangStore) => ({
  type: TYPES.FETCH_STORELOCATOR_COMPLETED,
  payload: { stores, afterLangStore },
});
export const searchStoreLocatorCompleted = stores => ({
  type: TYPES.SEARCH_STORELOCATOR_COMPLETED,
  payload: { stores },
});
export const resetSearchStore = () => ({
  type: TYPES.RESET_SEARCH_STORE,
});

const initialState = {
  items: [],
  afterLangStore: [],
  search: {
    items: [],
    error: '',
  },
  loading: false,
  loaded: false,
};

const storeLocatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_STORELOCATOR_START: {
      return { ...state, loading: true };
    }

    case TYPES.FETCH_STORELOCATOR_COMPLETED: {
      const { stores, afterLangStore } = action.payload;
      return {
        ...state,
        items: stores,
        afterLangStore,
        loading: false,
        loaded: true,
      };
    }

    case TYPES.SEARCH_STORELOCATOR_COMPLETED: {
      const { stores } = action.payload;
      return { ...state, search: stores };
    }

    case TYPES.RESET_SEARCH_STORE: {
      return { ...state, search: { items: [], error: '' } };
    }

    default:
      return state;
  }
};

export default storeLocatorReducer;
