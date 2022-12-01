import { CART_TYPES } from '@client/contexts/cart/types';

export const CartAction = ({ cartDispatch }) => ({
  addDebouncingProduct: ({ productSku }) =>
    cartDispatch({
      type: CART_TYPES.ADD_DEBOUNCING_PRODUCT,
      payload: {
        productSku,
      },
    }),
  removeDebouncingProduct: ({ productSku }) =>
    cartDispatch({
      type: CART_TYPES.REMOVE_DEBOUNCING_PRODUCT,
      payload: {
        productSku,
      },
    }),
});
