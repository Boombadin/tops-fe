import { CART_TYPES } from './types';

export const CART_INITIAL_STATE = {
  debouncingProducts: [],
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_TYPES.ADD_DEBOUNCING_PRODUCT: {
      return {
        ...state,
        debouncingProducts: [
          ...state.debouncingProducts,
          action.payload.productSku,
        ],
      };
    }
    case CART_TYPES.REMOVE_DEBOUNCING_PRODUCT: {
      return {
        ...state,
        debouncingProducts: state.debouncingProducts.filter(
          productSku => productSku !== action.payload.productSku,
        ),
      };
    }
    default: {
      return state;
    }
  }
};
