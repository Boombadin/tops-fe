import { sumItemsInCart, sumCartRowBundleItems } from '../index';
import { cartBundleItemsTypeBOGO, cartBundleItemsTypeBXGV, cartBundleItemsTypeBOGOAndBXGV } from '../__mocks__/cart';
describe('Checkout util', () => {
  describe('sumItemsInCart function', () => {
    describe('when product simple in cart', () => {
      test('Count product simple ', () => {
        const mockupProductData = [
          { item_id: 8023048, sku: '8850039719136', type_id: 'simple', qty: 1 },
        ];
        const result = sumItemsInCart(mockupProductData);
        expect(result).toEqual(1);
      });
    });
    describe('when product bundle in cart', () => {
      test('Count product bundle ', () => {
        const mockupProductData = [
          {
            item_id: 8023034,
            sku: '0000047999282',
            type_id: 'bundle',
            qty_per_pack: 3,
            qty: 1,
          },
        ];
        const result = sumItemsInCart(mockupProductData);
        expect(result).toEqual(4);
      });
    });
    describe('when product bundle and simple in cart', () => {
      test('Count product bundle and simple', () => {
        const mockupProductData = [
          {
            item_id: 8023034,
            sku: '0000047999282',
            type_id: 'bundle',
            qty_per_pack: 3,
            qty: 1,
          },
          { item_id: 8023048, sku: '8850039719136', type_id: 'simple', qty: 1 },
        ];
        const result = sumItemsInCart(mockupProductData);
        expect(result).toEqual(5);
      });
    });
  });

  describe('sumCartRowBundleItems function', () => {
    describe('add product bundle type BOGO in cart', () => {
      test('Count row Bundle Item', () => {
        const result = sumCartRowBundleItems(cartBundleItemsTypeBOGO);
        expect(result).toEqual(2);
      });
    });
  });
  describe('add product bundle type BXGV in cart', () => {
    test('Count row Bundle Item', () => {
      const result = sumCartRowBundleItems(cartBundleItemsTypeBXGV);
      expect(result).toEqual(1);
    });
  });
  describe('add product bundle type BOGO and BXGV in cart', () => {
    test('Count row Bundle Item', () => {
      const result = sumCartRowBundleItems(cartBundleItemsTypeBOGOAndBXGV);
      expect(result).toEqual(3);
    });
  });
});
