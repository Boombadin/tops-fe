import { reducer, TYPES } from '@client/reducers/cart';

describe('reducers/cart', () => {
  describe('reducer', () => {
    describe('TYPES.CHANGE_CART_ITEM_QTY', () => {
      test('it should not update cart item qty if product sku is not matched with any item in cart', () => {
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku: '111', qty: 2 },
        };
        const cartItems = [
          { sku: '123', qty: 1 },
          { sku: '456', qty: 2 },
          { sku: '789', qty: 3 },
        ];
        const state = {
          cart: {
            items: cartItems,
          },
        };

        const newState = reducer(state, action);
        const updatedCartItems = newState.cart?.items;

        expect(updatedCartItems[0].qty).toBe(cartItems[0].qty);
        expect(updatedCartItems[1].qty).toBe(cartItems[1].qty);
        expect(updatedCartItems[2].qty).toBe(cartItems[2].qty);
      });

      test('it should update cart qty if product sku is matched', () => {
        const productSku = '123';
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku, qty: 2 },
        };
        const state = {
          cart: {
            items: [{ sku: productSku, qty: 1 }],
          },
        };

        const newState = reducer(state, action);
        const updatedCartItems = newState.cart?.items;

        expect(updatedCartItems[0].sku).toBe(productSku);
        expect(updatedCartItems[0].qty).toBe(2);
      });

      test('it should not push or delete any item in array if productSku is not match with itemsBundle', () => {
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku: '111', qty: 2 },
        };
        const state = {
          itemsBundle: [{ items: [{ sku: '123', qty: 1 }] }],
        };

        const newState = reducer(state, action);
        expect(newState.itemsBundle?.[0]?.items?.length).toBe(1);
      });

      test('it should not mutate the array if productSku is not matched with itemsBundle', () => {
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku: '111', qty: 4 },
        };
        const prodcutSku = '123';
        const state = {
          cart: {
            items: [{ sku: prodcutSku, qty: 2 }],
          },
          itemsBundle: [
            {
              items: [
                { sku: prodcutSku, qty: 1 },
                { sku: prodcutSku, qty: 1 },
              ],
            },
          ],
        };

        const newState = reducer(state, action);

        expect(newState.itemsBundle?.[0]?.items?.length).toBe(2);
      });

      test('it should not mutate the array if productSku is matched with itemsBundle but the qty is unchanged', () => {
        const productSku = '123';
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku, qty: 2 },
        };
        const state = {
          cart: {
            items: [{ sku: productSku, qty: 2 }],
          },
          itemsBundle: [
            {
              items: [
                { sku: productSku, qty: 1 },
                { sku: productSku, qty: 1 },
              ],
            },
          ],
        };

        const newState = reducer(state, action);

        expect(newState.itemsBundle?.[0]?.items?.length).toBe(2);
      });

      test('it should push til the bundle items length equals with new qty if productSku is matched with itemsBundle and it is increasing case', () => {
        const productSku = '123';
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku, qty: 4 },
        };
        const state = {
          cart: {
            items: [{ sku: productSku, qty: 2 }],
          },
          itemsBundle: [
            {
              items: [
                { sku: productSku, qty: 1 },
                { sku: productSku, qty: 1 },
              ],
            },
          ],
        };

        const newState = reducer(state, action);

        expect(newState.itemsBundle?.[0]?.items?.length).toBe(4);
      });

      test('it should delete array element til the bundle items length equals with new qty if productSku is matched with itemsBundle and it is decreasing case', () => {
        const productSku = '123';
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku, qty: 2 },
        };
        const state = {
          cart: {
            items: [{ sku: productSku, qty: 4 }],
          },
          itemsBundle: [
            {
              items: [
                { sku: productSku, qty: 1 },
                { sku: productSku, qty: 1 },
                { sku: productSku, qty: 1 },
                { sku: productSku, qty: 1 },
              ],
            },
          ],
        };

        const newState = reducer(state, action);

        expect(newState.itemsBundle?.[0]?.items?.length).toBe(2);
      });

      test('it should not update any of itemExcludeBundle qty if productSku is not matched', () => {
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku: '111', qty: 4 },
        };
        const productSku = '123';
        const state = {
          cart: {
            items: [{ sku: productSku, qty: 1 }],
          },
          itemsExcludeBundle: [{ sku: productSku, qty: 1 }],
        };

        const newState = reducer(state, action);

        expect(newState.itemsExcludeBundle?.[0]?.qty).toBe(1);
      });

      test('it should update itemExcludeBundle qty if productSku is matched', () => {
        const productSku = '123';
        const action = {
          type: TYPES.CHANGE_CART_ITEM_QTY,
          payload: { productSku, qty: 4 },
        };
        const state = {
          cart: {
            items: [{ sku: productSku, qty: 1 }],
          },
          itemsExcludeBundle: [{ sku: productSku, qty: 1 }],
        };

        const newState = reducer(state, action);

        expect(newState.itemsExcludeBundle?.[0]?.qty).toBe(4);
      });
    });
  });
});
