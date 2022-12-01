import { filter, find, isEmpty } from 'lodash';
import * as TYPES from './types';

const initialState = {
  loading: false,
  productsLoading: false,
  wishlist: {},
  removedItems: []
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.WISHLIST_FETCH_STARTED:
      return {
        ...state,
        loading: true
      };

    case TYPES.WISHLIST_FETCHED:
      return {
        ...state,
        loading: false,
        wishlist: action.payload !== null ? action.payload : state.wishlist
      };

    case TYPES.ADD_TO_WISHLIST_STARTED: {
      return {
        ...state,
        wishlist: !isEmpty(state.wishlist)
          ? {
            ...state.wishlist,
            items: [
              ...(state.wishlist.items || []),
              {
                product_id: action.payload
              }
            ]
          }
          : {
            items: [
              {
                product_id: action.payload
              }
            ]
          }
      };
    }

    case TYPES.WISHLIST_FETCH_PRODUCTS_STARTED:
      return {
        ...state,
        productsLoading: true
      };

    case TYPES.WISHLIST_PRODUCTS_FETCHED:
      return {
        ...state,
        productsLoading: false
      };

    case TYPES.REMOVE_FROM_WISHLIST_STARTED:
      return {
        ...state,
        wishlist: {
          items: filter(state.wishlist.items, item => item.product_id !== action.payload)
        },
        removedItems: [...state.removedItems, find(state.wishlist.items, item => item.product_id === action.payload)]
      };

    case TYPES.REMOVE_FROM_WISHLIST_FINISHED:
      return {
        ...state,
        removedItems: filter(state.removedItems, item => item.product_id !== action.payload)
      };

    case TYPES.REMOVE_FROM_WISHLIST_FAILED:
      return {
        ...state,
        wishlist: {
          items: [...state.wishlist.items, find(state.removedItems, item => item.product_id === action.payload)]
        }
      };

    default:
      return state;
  }
};
