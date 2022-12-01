/* eslint-disable react/no-multi-comp */
import { cleanup, render, waitFor } from '@testing-library/react';
import PQueue from 'p-queue';
import React, { useEffect } from 'react';

import CartApi from '@client/apis/cart';
import CustomerApi from '@client/apis/customer';
import CartProvider, {
  addProductQueue,
  changeProductQtyQueue,
  deleteProductBundleQueue,
  deleteProductQueue,
  transformPackProduct,
  transformProduct,
  useCartContext,
} from '@client/contexts/CartContext';
import { useReduxContext } from '@client/contexts/ReduxContext';
import {
  addCartItem,
  changeCartItemQty,
  closeNoStockModal,
  deleteCartItem,
  endAddTOCart,
  endLoadingCart,
  fetchCartCompleted,
  fetchCartFail,
  fetchCartTotals,
  fetchShippingMethods,
  notifyLimitQty,
  notifyMaxQty,
  notifyOutOfStock,
  replaceCartItem,
  resetNotifyLimitQty,
  resetNotifyMaxQty,
  resetNotifyOutOfStock,
  showNoStockModal,
  startLoadingCart,
} from '@client/reducers/cart';
import { showDeliveryToolBar } from '@client/reducers/customer';
import * as cartUtils from '@client/utils/cart';
import { unsetCookie } from '@client/utils/cookie';

const mockLocation = { pathname: '/somepath', search: '?queryA=2' };
const mockProduct = {
  sku: '123',
  extension_attributes: { stock_item: { is_in_stock: true } },
};

const mockSetRetryProductSkus = jest.fn().mockImplementation(cb => cb([]));
const mockReactRouterHistory = { push: jest.fn() };

jest.mock('react-router-dom', () => ({
  useHistory: () => mockReactRouterHistory,
  useLocation: jest.fn().mockImplementation(() => mockLocation),
}));
jest.mock('@client/contexts/ReduxContext', () => ({
  useReduxContext: jest.fn().mockReturnValue({
    reduxState: { customer: {} },
    reduxAction: { dispatch: jest.fn() },
  }),
}));
jest.mock('@client/reducers/customer', () => ({
  showDeliveryToolBar: jest.fn(),
}));
jest.mock('@client/reducers/cart', () => ({
  addCartItem: jest.fn(),
  changeCartItemQty: jest.fn(),
  closeNoStockModal: jest.fn(),
  deleteCartItem: jest.fn(),
  endAddTOCart: jest.fn(),
  endLoadingCart: jest.fn(),
  fetchCartCompleted: jest.fn(),
  fetchCartFail: jest.fn(),
  fetchCartTotals: jest.fn(),
  notifyLimitQty: jest.fn(),
  notifyMaxQty: jest.fn(),
  notifyOutOfStock: jest.fn(),
  replaceCartItem: jest.fn(),
  resetNotifyLimitQty: jest.fn(),
  resetNotifyMaxQty: jest.fn(),
  resetNotifyOutOfStock: jest.fn(),
  showNoStockModal: jest.fn(),
  startLoadingCart: jest.fn(),
  fetchShippingMethods: jest.fn(),
}));
jest.mock('@client/apis/cart', () => ({
  addItem: jest.fn(),
  changeItemQty: jest.fn(),
  deleteCart: jest.fn(),
  deleteItem: jest.fn(),
  deleteItemBundle: jest.fn(),
  fetchCart: jest.fn(),
  get: jest.fn(),
}));
const mockPqueueAdd = jest.fn().mockImplementation((cb = jest.fn()) => cb());
const mockPqueueClear = jest.fn();
jest.mock('p-queue', () => jest.fn());
jest.mock('@client/utils/cookie', () => ({ unsetCookie: jest.fn() }));
jest.mock('@client/features/gtm/models/Product', () => ({
  Product: jest.fn(),
  ProductEmarsys: jest.fn(),
  ProductListPriceInclTax: jest.fn(),
  ProductWithPriceInclTax: jest.fn().mockReturnValue({}),
}));
jest.mock('@client/apis/product', () => ({
  getBySkus: jest.fn().mockReturnValue({ items: [] }),
}));
jest.mock('@client/apis/customer', () => ({ getShippingInfo: jest.fn() }));

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

afterEach(cleanup);

describe('contexts/CartContext', () => {
  beforeEach(() => {
    PQueue.mockImplementation(() => ({
      add: mockPqueueAdd,
      clear: mockPqueueClear,
      size: 0,
      pending: 0,
    }));
  });

  describe('fetchCart', () => {
    const renderFetchCartComponent = () => {
      const TestComponent = () => {
        useCartContext();

        return <div />;
      };
      render(<TestComponent />, { wrapper });
    };

    test('it should do nothing if user is not sign-in', () => {
      renderFetchCartComponent();

      expect(startLoadingCart).not.toHaveBeenCalled();
    });

    test('it should dispatch fetchCartFail if CartApi.get catch', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { currentShipping: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.get.mockRejectedValue();

      renderFetchCartComponent();

      await waitFor(() => expect(fetchCartFail).toHaveBeenCalled());
    });

    test('it should reload page if server response with storeNotMatch', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { currentShipping: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.get.mockImplementation(() => ({
        data: {
          cart: {
            isStoreNotMatch: true,
          },
        },
      }));

      delete window.location;
      window.location = { reload: jest.fn() };

      renderFetchCartComponent();

      expect(startLoadingCart).toHaveBeenCalled();
      await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
    });

    test('it should dispatch fetchCartTotals if store is match', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { currentShipping: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.get.mockImplementation(() => ({
        data: {
          cart: {
            isStoreNotMatch: false,
          },
        },
      }));

      renderFetchCartComponent();

      await waitFor(() => expect(fetchCartTotals).toHaveBeenCalled());
    });

    test('it should push dataLayer and dispatch fetchCartCompleted if fetchCartTotals return with value', async () => {
      fetchCartTotals.mockImplementation(() => ({ items: [] }));

      useReduxContext.mockImplementation(() => ({
        reduxState: {
          customer: {
            currentShipping: {},
          },
        },
        reduxAction: {
          dispatch: jest.fn(arg => arg),
        },
      }));

      CartApi.get.mockImplementation(() => ({
        data: {
          cart: {
            isStoreNotMatch: false,
            items: [{ sku: '123', qty: 1 }],
          },
        },
      }));

      window.dataLayer = { push: jest.fn() };
      jest.spyOn(cartUtils, 'formatCartBundle').mockImplementation();
      renderFetchCartComponent();
      await waitFor(() => expect(window.dataLayer.push).toHaveBeenCalled());
      await waitFor(() => expect(fetchCartCompleted).toHaveBeenCalled());
    });
  });

  describe('addProduct', () => {
    const renderAddProductComponent = ({ product, beforeAction }) => {
      const TestComponent = () => {
        const { cartAction } = useCartContext();
        useEffect(() => {
          cartAction.addProduct(
            product,
            beforeAction && {
              beforeAction,
            },
          );
        }, []);

        return <div />;
      };
      render(<TestComponent />, { wrapper });
    };

    test('it should call beforeAction if there is any', () => {
      const beforeAction = jest.fn();

      renderAddProductComponent({ product: mockProduct, beforeAction });
      expect(beforeAction).toHaveBeenCalledWith(mockProduct);
    });

    test('it should redirect to login page with ref query when user is not authorized', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: null },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderAddProductComponent({ product: mockProduct });
      await waitFor(() =>
        expect(mockReactRouterHistory.push).toHaveBeenCalledWith(
          `/login?ref=${mockLocation.pathname}${mockLocation.search}`,
        ),
      );
    });

    test('it should setProductToCookies and show delivery toolbar if customer has no shipping address', () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { items: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      const spyAddProductSkusToCookies = jest
        .spyOn(cartUtils, 'addProductSkusToCookies')
        .mockImplementation(jest.fn());

      renderAddProductComponent({ product: mockProduct });
      expect(spyAddProductSkusToCookies).toHaveBeenCalled();
      expect(showDeliveryToolBar).toHaveBeenCalled();
    });

    test('it should dispatch to update cart and to show loading on cart then add a queue if customer is authorized and has shipping address', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { currentShipping: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderAddProductComponent({ product: mockProduct });
      expect(addCartItem).toHaveBeenCalled();
      expect(startLoadingCart).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).toHaveBeenCalled();
    });

    test('it should dispatch to update cart and to show loading on cart then add a queue if customer is authorized, has shipping address, and adding pack product', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { currentShipping: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      const mockPackProduct = {
        sku: '123',
        type_id: 'bundle',
        extension_attributes: { stock_item: { is_in_stock: true } },
      };

      renderAddProductComponent({ product: mockPackProduct });
      expect(addCartItem).toHaveBeenCalled();
      expect(startLoadingCart).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).toHaveBeenCalled();
    });

    test('it should dispatch to update cart and to show loading on cart then add a queue but do not dispatch endLoadingCart if customer is authorized, has shipping address, and queue is not empty', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { currentShipping: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      PQueue.mockImplementation(() => ({
        add: mockPqueueAdd,
        clear: mockPqueueClear,
        size: 1,
        pending: 0,
      }));

      renderAddProductComponent({ product: mockProduct });

      expect(addCartItem).toHaveBeenCalled();
      expect(startLoadingCart).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).not.toHaveBeenCalled();
    });
  });

  describe('addProductQueue', () => {
    test('it should show noStockModal if product is out of stock', async () => {
      const mockOosProduct = {
        sku: '123',
        extension_attributes: { stock_item: { is_in_stock: false } },
      };

      addProductQueue({
        product: mockOosProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      // The current logic will notify only the boolean is toggled
      await waitFor(() => expect(closeNoStockModal).toHaveBeenCalled());
      expect(showNoStockModal).toHaveBeenCalledWith(
        mockOosProduct,
        'out_of_stock',
      );
      expect(deleteCartItem).toHaveBeenCalledWith(mockOosProduct.sku);
    });

    test('it should redirect user to login page and remove the product from cart if server return status 401', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { customer: { currentShipping: {} } },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.addItem.mockImplementation(() => ({
        data: { error: {}, status: 401 },
      }));

      addProductQueue({
        product: mockProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
        history: mockReactRouterHistory,
      });

      await waitFor(() =>
        expect(unsetCookie).toHaveBeenCalledWith('user_token'),
      );
      expect(mockReactRouterHistory.push).toHaveBeenCalledWith(
        '/login?token_expired=true',
      );
      expect(deleteCartItem).toHaveBeenCalled();
    });

    test('it should call setRetryProductSkus if server return status 404', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          customer: {
            currentShipping: {},
          },
          storeConfig: { current: { code: 'tops_sa_432_th' } },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      const errorMessage = 'No such entity with %fieldName = %fieldValue';
      CartApi.addItem.mockImplementation(() => ({
        data: { error: { message: errorMessage }, status: 404 },
      }));

      CustomerApi.getShippingInfo.mockReturnValue({
        current_store: 'tops_sa_432',
      });

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockImplementation(() => errorMessage);

      const reduxState = {
        storeConfig: { current: { code: 'tops_sa_432_th' } },
      };

      addProductQueue({
        product: mockProduct,
        reduxState,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() => expect(spyGetErrorType).toHaveBeenCalled());
      expect(mockSetRetryProductSkus).toHaveBeenCalled();
      expect(deleteCartItem).toHaveBeenCalledWith(mockProduct.sku);
    });

    test('it should not call setRetryProductSkus but still revert back cartItem if server return status 404, errorMsg does not mean cart empty, and customerStorecode same as currentStoreCode', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          customer: {
            currentShipping: {},
          },
          storeConfig: { current: { code: 'tops_sa_432_th' } },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      const errorMessage = 'No handle error msg';
      CartApi.addItem.mockImplementation(() => ({
        data: { error: { message: errorMessage }, status: 404 },
      }));

      CustomerApi.getShippingInfo.mockReturnValue({
        current_store: 'tops_sa_432',
      });

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockImplementation(() => errorMessage);

      const reduxState = {
        storeConfig: { current: { code: 'tops_sa_432_th' } },
      };

      addProductQueue({
        product: mockProduct,
        reduxState,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() =>
        expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage),
      );
      expect(mockSetRetryProductSkus).not.toHaveBeenCalled();
      expect(deleteCartItem).toHaveBeenCalledWith(mockProduct.sku);
    });

    test('it should show notify limit qty if user add the product out of limit for the product group', async () => {
      const errorMessage = 'product_group_limit';
      CartApi.addItem.mockImplementation(() => ({
        data: { error: { message: errorMessage } },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockReturnValue('product_group_limit');

      addProductQueue({
        product: mockProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() =>
        expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage),
      );
      expect(resetNotifyLimitQty).toHaveBeenCalled();
      expect(notifyLimitQty).toHaveBeenCalled();
      expect(deleteCartItem).toHaveBeenCalledWith(mockProduct.sku);
    });

    test('it should show notify out of stock if user add the product that is not in stock', async () => {
      const errorMessage =
        'Product that you are trying to add is not available.';
      CartApi.addItem.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockReturnValue('out_of_stock');

      addProductQueue({
        product: mockProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() =>
        expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage),
      );
      expect(resetNotifyOutOfStock).toHaveBeenCalled();
      expect(notifyOutOfStock).toHaveBeenCalled();
      expect(deleteCartItem).toHaveBeenCalledWith(mockProduct.sku);
    });

    test('it should show notify limit qty if user add product to exceed 200 qty', async () => {
      const errorMessage = 'Cart item limit exceeded';
      CartApi.addItem.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockReturnValue('limit_qty_200');

      addProductQueue({
        product: mockProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() =>
        expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage),
      );
      expect(resetNotifyLimitQty).toHaveBeenCalled();
      expect(notifyLimitQty).toHaveBeenCalled();
      expect(deleteCartItem).toHaveBeenCalledWith(mockProduct.sku);
    });

    test('it should show no stock modal if server return unhandle error message', async () => {
      const errorMessage = 'any string';
      CartApi.addItem.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockReturnValue(errorMessage);

      addProductQueue({
        product: mockProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() =>
        expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage),
      );
      expect(closeNoStockModal).toHaveBeenCalled();
      expect(showNoStockModal).toHaveBeenCalled();
      expect(deleteCartItem).toHaveBeenCalledWith(mockProduct.sku);
    });

    test('it should push dataLayer then dispatch replaceCartItem and endAddTOCart if add product successfully', async () => {
      CartApi.addItem.mockImplementation(() => ({
        data: { item: {} },
      }));

      window.dataLayer = { push: jest.fn() };

      addProductQueue({
        product: mockProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() => expect(window.dataLayer.push).toHaveBeenCalled());
      expect(replaceCartItem).toHaveBeenCalled();
      expect(endAddTOCart).toHaveBeenCalled();
    });

    test('it should not push dataLayer then dispatch replaceCartItem and endAddTOCart if add product successfully but no data item return back', async () => {
      CartApi.addItem.mockImplementation(() => ({
        data: { item: null },
      }));

      window.dataLayer = { push: jest.fn() };

      addProductQueue({
        product: mockProduct,
        reduxDispatch: jest.fn(),
        setRetryProductSkus: mockSetRetryProductSkus,
      });

      await waitFor(() => expect(window.dataLayer.push).not.toHaveBeenCalled());
      expect(replaceCartItem).not.toHaveBeenCalled();
      expect(endAddTOCart).not.toHaveBeenCalled();
    });
  });

  describe('changeProductQty', () => {
    const renderAddProductComponent = ({ productSku, qty }) => {
      const TestComponent = () => {
        const { cartAction } = useCartContext();
        useEffect(() => {
          cartAction.changeProductQty({ productSku, qty });
        }, []);

        return <div />;
      };
      render(<TestComponent />, { wrapper });
    };

    test('it should do nothing if productSku does not exist in cart', () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: { cart: { cart: { items: [] } }, customer: {} },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderAddProductComponent({ productSku: '123', qty: 2 });
      expect(changeCartItemQty).not.toHaveBeenCalled();
    });

    test('it should notify outOfStock if user tries to add product that exceed stock qty but less than max sale qty', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [
                {
                  sku: productSku,
                  qty: 1,
                  extension_attributes: {
                    stock_item: { qty: 1, max_sale_qty: 2 },
                  },
                },
              ],
            },
          },
          customer: {},
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderAddProductComponent({ productSku, qty: 2 });
      await waitFor(() => expect(resetNotifyOutOfStock).toHaveBeenCalled());
      expect(notifyOutOfStock).toHaveBeenCalled();
      expect(changeCartItemQty).toHaveBeenCalledTimes(2);
    });

    test('it should notify maxSaleQty if user tries to add product that exceed max sale qty', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [
                {
                  sku: productSku,
                  qty: 1,
                  extension_attributes: {
                    stock_item: { qty: 1, max_sale_qty: 1 },
                  },
                },
              ],
            },
          },
          customer: {},
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderAddProductComponent({ productSku, qty: 2 });
      await waitFor(() => expect(resetNotifyMaxQty).toHaveBeenCalled());
      expect(notifyMaxQty).toHaveBeenCalled();
      expect(changeCartItemQty).toHaveBeenCalledTimes(2);
    });

    test('it should dispatch startLoadingCart, add changeProductQtyQueue to the queue after that dispatch endLoadingCart if qty does not exceed maxSale and stock qty', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [
                {
                  sku: productSku,
                  qty: 1,
                  extension_attributes: {
                    stock_item: { qty: 10, max_sale_qty: 10 },
                  },
                },
              ],
            },
          },
          customer: {},
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderAddProductComponent({ productSku, qty: 2 });

      expect(startLoadingCart).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).toHaveBeenCalled();
    });

    test('it should dispatch startLoadingCart, add changeProductQtyQueue to the queue but not dispatch endLoadingCart if qty does not exceed maxSaleQty, stock qty, and queue is not empty', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [
                {
                  sku: productSku,
                  qty: 1,
                  extension_attributes: {
                    stock_item: { qty: 10, max_sale_qty: 10 },
                  },
                },
              ],
            },
          },
          customer: {},
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      PQueue.mockImplementation(() => ({
        add: mockPqueueAdd,
        clear: mockPqueueClear,
        size: 1,
        pending: 0,
      }));

      renderAddProductComponent({ productSku, qty: 2 });

      expect(startLoadingCart).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).not.toHaveBeenCalled();
    });
  });

  describe('changeProductQtyQueue', () => {
    test('it should do nothing if product is not in the cart anymore', async () => {
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [] } },
        },
      };

      await changeProductQtyQueue({ reduxStateRef, productSku: '123' });

      expect(CartApi.changeItemQty).not.toHaveBeenCalled();
    });

    test('it should show notify limitQty, and re-call changeProductQty with remaining qty if server response with product_group_limit error', async () => {
      const remainingQty = 2;
      const errorMessage = 'product_group_limit';
      CartApi.changeItemQty.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
            parameters: { remain_qty: remainingQty },
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockImplementation(() => 'product_group_limit');

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
        },
      };

      const mockChangeProductQty = jest.fn();

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
        changeProductQty: mockChangeProductQty,
      });

      expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage);
      expect(resetNotifyLimitQty).toHaveBeenCalled();
      expect(notifyLimitQty).toHaveBeenCalled();
      expect(mockChangeProductQty).toHaveBeenCalled();
      // TODO find solution to spy with object arg
      // expect(changeProductQty).toHaveBeenCalledWith({
      //   productSku,
      //   qty: remainingQty,
      // });
    });

    test('it should show notify limitQty if server response with product_group_limit error and has no remaining qty', async () => {
      const errorMessage = 'product_group_limit';
      CartApi.changeItemQty.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockImplementation(() => 'product_group_limit');

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
        },
      };

      const mockChangeProductQty = jest.fn();

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
        changeProductQty: mockChangeProductQty,
      });

      expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage);
      expect(resetNotifyLimitQty).toHaveBeenCalled();
      expect(notifyLimitQty).toHaveBeenCalled();
      // TODO find solution to spy with object arg
      // expect(changeProductQty).toHaveBeenCalledWith({
      //   productSku,
      //   qty: remainingQty,
      // });
    });

    test('it should redirect user to login page and revert the product qty in cart if server return status 401', async () => {
      CartApi.changeItemQty.mockImplementation(() => ({
        data: { error: { message: 'any string' }, status: 401 },
      }));

      jest
        .spyOn(cartUtils, 'getErrorType')
        .mockImplementation(() => 'any string');

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
        },
      };

      changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
        history: mockReactRouterHistory,
      });

      await waitFor(() =>
        expect(unsetCookie).toHaveBeenCalledWith('user_token'),
      );
      expect(mockReactRouterHistory.push).toHaveBeenCalledWith(
        '/login?token_expired=true',
      );
      expect(changeCartItemQty).toHaveBeenCalled(); // revert qty back
    });

    test('it should reload page if server return status 404', async () => {
      const errorMessage = 'No such entity with %fieldName = %fieldValue';
      CartApi.changeItemQty.mockImplementation(() => ({
        data: {
          error: { message: errorMessage },
          status: 404,
        },
      }));
      CustomerApi.getShippingInfo.mockReturnValue({
        current_store: 'tops_sa_432',
      });

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockImplementation(() => errorMessage);

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
          storeConfig: { current: { code: 'tops_sa_432_th' } },
        },
      };

      delete window.location;
      window.location = { reload: jest.fn() };

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
      });

      expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage);
      expect(window.location.reload).toHaveBeenCalled();
      expect(changeCartItemQty).toHaveBeenCalled(); // revert qty back
    });

    test('it should not reload page but still revert qty back if server return status 404, errorMsg does not mean cart empty, and customerStorecode same as currentStoreCode', async () => {
      const errorMessage = 'No handle error msg';
      CartApi.changeItemQty.mockImplementation(() => ({
        data: {
          error: { message: errorMessage },
          status: 404,
        },
      }));
      CustomerApi.getShippingInfo.mockReturnValue({
        current_store: 'tops_sa_432',
      });

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockImplementation(() => errorMessage);

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
          storeConfig: { current: { code: 'tops_sa_432_th' } },
        },
      };

      delete window.location;
      window.location = { reload: jest.fn() };

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
      });

      expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage);
      expect(window.location.reload).not.toHaveBeenCalled();
      expect(changeCartItemQty).toHaveBeenCalled(); // revert qty back
    });

    test('it should show notify out of stock if user change qty of the product that is not already oos', async () => {
      const errorMessage =
        'Product that you are trying to add is not available.';
      CartApi.changeItemQty.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockReturnValue('out_of_stock');

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
        },
      };

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
      });

      expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage);
      expect(resetNotifyOutOfStock).toHaveBeenCalled();
      expect(notifyOutOfStock).toHaveBeenCalled();
      expect(changeCartItemQty).toHaveBeenCalled(); // revert qty back
    });

    test('it should show notify limit qty if user add product to exceed 200 qty', async () => {
      const errorMessage = 'Cart item limit exceeded';
      CartApi.changeItemQty.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockReturnValue('limit_qty_200');

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
        },
      };

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
      });

      expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage);
      expect(resetNotifyLimitQty).toHaveBeenCalled();
      expect(notifyLimitQty).toHaveBeenCalled();
      expect(changeCartItemQty).toHaveBeenCalled(); // revert qty back
    });

    test('it should show no stock modal if server return unhandle error message', async () => {
      const errorMessage = 'any string';
      CartApi.changeItemQty.mockImplementation(() => ({
        data: {
          error: {
            message: errorMessage,
          },
        },
      }));

      const spyGetErrorType = jest
        .spyOn(cartUtils, 'getErrorType')
        .mockReturnValue(errorMessage);

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku, qty: 1 }] } },
        },
      };

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
      });

      expect(spyGetErrorType).toHaveBeenCalledWith(errorMessage);
      expect(closeNoStockModal).toHaveBeenCalled();
      expect(showNoStockModal).toHaveBeenCalled();
      expect(changeCartItemQty).toHaveBeenCalled(); // revert qty back
    });

    test('it should push dataLayer if product qty was changed successfully for the incresing case', async () => {
      CartApi.changeItemQty.mockImplementation(() => ({
        data: { item: {} },
      }));

      window.dataLayer = { push: jest.fn() };

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku }] } },
        },
      };

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
        newProductQty: 2,
        memorizedQty: 1,
      });

      expect(window.dataLayer.push).toHaveBeenCalled();
    });

    test('it should push dataLayer if product qty was changed successfully for the decreasing case', async () => {
      CartApi.changeItemQty.mockImplementation(() => ({
        data: { item: {} },
      }));

      window.dataLayer = { push: jest.fn() };

      const productSku = '123';
      const reduxStateRef = {
        current: {
          cart: { cart: { items: [{ sku: productSku }] } },
        },
      };

      await changeProductQtyQueue({
        reduxStateRef,
        productSku,
        reduxDispatch: jest.fn(),
        newProductQty: 1,
        memorizedQty: 2,
      });

      expect(window.dataLayer.push).toHaveBeenCalled();
    });
  });

  describe('deleteCart', () => {
    const renderDeleteCartComponent = () => {
      const TestComponent = () => {
        const { cartAction } = useCartContext();
        useEffect(() => {
          cartAction.deleteCart();
        }, []);

        return <div />;
      };
      render(<TestComponent />, { wrapper });
    };

    test('it should do nothing if user does not have any cart', () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: { cart: { id: null }, loaded: false },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderDeleteCartComponent();
      expect(CartApi.deleteCart).not.toHaveBeenCalled();
    });

    test('it should redirect user to login page if server return status 401', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: { cart: { id: 123 }, loaded: true },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.deleteCart.mockImplementation(() => ({
        data: { error: {}, status: 401 },
      }));

      renderDeleteCartComponent();

      await waitFor(() =>
        expect(unsetCookie).toHaveBeenCalledWith('user_token'),
      );
      expect(mockReactRouterHistory.push).toHaveBeenCalledWith(
        '/login?token_expired=true',
      );
    });

    test('it should reload page if server return status 404', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: { cart: { id: 123 }, loaded: true },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.deleteCart.mockImplementation(() => ({
        data: { error: {}, status: 404 },
      }));

      delete window.location;
      window.location = { reload: jest.fn() };

      renderDeleteCartComponent();

      await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
    });

    test('it should not push dataLayer if there is any error', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: { cart: { id: 123 }, loaded: true },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.deleteCart.mockImplementation(() => ({
        data: { error: {} },
      }));

      window.dataLayer = { push: jest.fn() };

      renderDeleteCartComponent();

      await waitFor(() => expect(window.dataLayer.push).not.toHaveBeenCalled());
    });

    test('it should push dataLayer and clear the current queue if the cart exist on and user is authorized', async () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: { cart: { id: 123 }, loaded: true },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      CartApi.deleteCart.mockImplementation(() => ({
        data: {},
      }));

      window.dataLayer = { push: jest.fn() };

      renderDeleteCartComponent();

      await waitFor(() => expect(window.dataLayer.push).toHaveBeenCalled());
      expect(mockPqueueClear).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    const renderDeleteProductComponent = ({ productSku }) => {
      const TestComponent = () => {
        const { cartAction } = useCartContext();
        useEffect(() => {
          cartAction.deleteProduct({ productSku });
        }, []);

        return <div />;
      };
      render(<TestComponent />, { wrapper });
    };

    test('it should do nothing if productSku is not exist in cart', () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [],
            },
          },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderDeleteProductComponent({ productSku: '123' });

      expect(deleteCartItem).not.toHaveBeenCalled();
    });

    test('it should deleteCartItem and add request into queue if productSku exist in user cart', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [{ sku: productSku }],
            },
          },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderDeleteProductComponent({ productSku });

      expect(deleteCartItem).toHaveBeenCalledWith(productSku);
      expect(startLoadingCart).toHaveBeenCalledTimes(2);
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).toHaveBeenCalled();
      expect(fetchShippingMethods).toHaveBeenCalled();
    });

    test('it should deleteCartItem and add request into queue but not dispatch endLoadingCart if productSku exist in user cart and queue is not empty', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [{ sku: productSku }],
            },
          },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      PQueue.mockImplementation(() => ({
        add: mockPqueueAdd,
        clear: mockPqueueClear,
        size: 1,
        pending: 0,
      }));

      renderDeleteProductComponent({ productSku });

      expect(deleteCartItem).toHaveBeenCalledWith(productSku);
      expect(startLoadingCart).toHaveBeenCalledTimes(2);
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).not.toHaveBeenCalled();
    });
  });

  describe('deleteProductQueue', () => {
    test('it should redirect user to login page and revert the product to cart if server return status 401', async () => {
      CartApi.deleteItem.mockImplementation(() => ({
        data: { error: {}, status: 401 },
      }));

      deleteProductQueue({
        cartId: '123',
        memorizedProduct: { item_id: '123' },
        reduxDispatch: jest.fn(),
        history: mockReactRouterHistory,
      });

      await waitFor(() => expect(CartApi.deleteItem).toHaveBeenCalled());

      expect(unsetCookie).toHaveBeenCalledWith('user_token');
      expect(mockReactRouterHistory.push).toHaveBeenCalledWith(
        '/login?token_expired=true',
      );
      expect(addCartItem).toHaveBeenCalled(); // revert qty back
    });

    test('it should reload page if server return status 404', async () => {
      CartApi.deleteItem.mockImplementation(() => ({
        data: {
          error: {},
          status: 404,
        },
      }));

      delete window.location;
      window.location = { reload: jest.fn() };

      deleteProductQueue({
        cartId: '123',
        memorizedProduct: { item_id: '123' },
        reduxDispatch: jest.fn(),
      });

      await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
      expect(addCartItem).toHaveBeenCalled(); // revert product back
    });

    test('it should not dispatch addCartItem if server response as item does not exist in cart', async () => {
      CartApi.deleteItem.mockImplementation(() => ({
        data: {
          error: {
            message:
              'The "undefined" value\'s type is invalid. The "int" type was expected. Verify and try again.',
          },
        },
      }));

      deleteProductQueue({
        cartId: '123',
        memorizedProduct: { item_id: '123' },
        reduxDispatch: jest.fn(),
      });

      await waitFor(() => expect(addCartItem).not.toHaveBeenCalled());
    });

    test('it should dispatch addCartItem if server return with any un-specifies error', async () => {
      CartApi.deleteItem.mockImplementation(() => ({
        data: {
          error: { message: 'any error' },
        },
      }));

      deleteProductQueue({
        cartId: '123',
        memorizedProduct: { item_id: '123' },
        reduxDispatch: jest.fn(),
      });

      await waitFor(() => expect(addCartItem).toHaveBeenCalled()); // revert product back
    });

    test('it should push dataLayer if server delete product successfully', async () => {
      CartApi.deleteItem.mockImplementation(() => ({
        data: {},
      }));

      window.dataLayer = { push: jest.fn() };

      deleteProductQueue({
        cartId: '123',
        memorizedProduct: { item_id: '123' },
        reduxDispatch: jest.fn(),
      });

      await waitFor(() => expect(window.dataLayer.push).toHaveBeenCalled());
    });
  });

  describe('deleteProductBundle', () => {
    const renderDeleteProductBundleComponent = ({ productSkus } = {}) => {
      const TestComponent = () => {
        const { cartAction } = useCartContext();
        useEffect(() => {
          cartAction.deleteProductBundle({ productSkus });
        }, []);

        return <div />;
      };
      render(<TestComponent />, { wrapper });
    };

    test('it should dispatch startLoadingCart then endLoadingCart if deleteProductBundle is triggered', () => {
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [],
            },
          },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderDeleteProductBundleComponent();

      expect(startLoadingCart).toHaveBeenCalled();
      expect(endLoadingCart).toHaveBeenCalled();
      expect(fetchShippingMethods).toHaveBeenCalled();
    });

    test('it should dispatch changeCartItemQty and add request into queue if productSkus exist', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [{ sku: productSku, qty: 1 }],
            },
          },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderDeleteProductBundleComponent({ productSkus: [productSku] });

      expect(changeCartItemQty).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
    });

    test('it should dispatch changeCartItemQty and add request into queue even if remaining qty less than 0', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [{ sku: productSku, qty: -1 }],
            },
          },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      renderDeleteProductBundleComponent({ productSkus: [productSku] });

      expect(changeCartItemQty).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
    });

    test('it should deleteCartItem and add request into queue but not dispatch endLoadingCart if productSku exist in user cart and queue is not empty', async () => {
      const productSku = '123';
      useReduxContext.mockImplementation(() => ({
        reduxState: {
          cart: {
            cart: {
              items: [{ sku: productSku, qty: 1 }],
            },
          },
          customer: { currentShipping: {} },
        },
        reduxAction: { dispatch: jest.fn() },
      }));

      PQueue.mockImplementation(() => ({
        add: mockPqueueAdd,
        clear: mockPqueueClear,
        size: 1,
        pending: 0,
      }));

      renderDeleteProductBundleComponent({ productSkus: [productSku] });

      expect(startLoadingCart).toHaveBeenCalledTimes(2);
      expect(changeCartItemQty).toHaveBeenCalled();
      await waitFor(() => expect(mockPqueueAdd).toHaveBeenCalled());
      expect(endLoadingCart).not.toHaveBeenCalled();
    });
  });

  describe('deleteProductBundleQueue', () => {
    test('it should redirect user to login page and throw error if server return status 401', async () => {
      CartApi.deleteItemBundle.mockImplementation(() => ({
        data: { error: {}, status: 401 },
      }));

      let isError = false;
      try {
        await deleteProductBundleQueue({
          cartId: '123',
          product: { item_id: '123', sku: '123' },
          remainingQty: 1,
          history: mockReactRouterHistory,
        });
      } catch (e) {
        isError = true;
      }

      expect(isError).toBeTruthy();
      expect(CartApi.deleteItemBundle).toHaveBeenCalled();

      expect(unsetCookie).toHaveBeenCalledWith('user_token');
      expect(mockReactRouterHistory.push).toHaveBeenCalledWith(
        '/login?token_expired=true',
      );
    });

    test('it should reload page and throw error if server return status 404', async () => {
      CartApi.deleteItemBundle.mockImplementation(() => ({
        data: {
          error: {},
          status: 404,
        },
      }));

      delete window.location;
      window.location = { reload: jest.fn() };

      let isError = false;
      try {
        await deleteProductBundleQueue({
          cartId: '123',
          product: { item_id: '123', sku: '123' },
          remainingQty: 1,
        });
      } catch (e) {
        isError = true;
      }

      expect(isError).toBeTruthy();
      expect(window.location.reload).toHaveBeenCalled();
    });

    test('it should not redirect or reload page and throw error if server response un-specifies error', async () => {
      CartApi.deleteItemBundle.mockImplementation(() => ({
        data: {
          error: {
            message: 'any error',
          },
        },
      }));

      delete window.location;
      window.location = { reload: jest.fn() };

      let isError = false;
      try {
        await deleteProductBundleQueue({
          cartId: '123',
          product: { item_id: '123', sku: '123' },
          remainingQty: 1,
        });
      } catch (e) {
        isError = true;
      }

      expect(isError).toBeTruthy();
      expect(mockReactRouterHistory.push).not.toHaveBeenCalled();
      expect(window.location.reload).not.toHaveBeenCalled();
    });

    test('it should not throw error if server successfully delete', async () => {
      CartApi.deleteItemBundle.mockImplementation(() => ({
        data: {},
      }));

      delete window.location;
      window.location = { reload: jest.fn() };

      let isError = false;
      try {
        await deleteProductBundleQueue({
          cartId: '123',
          product: { item_id: '123', sku: '123' },
          remainingQty: 1,
        });
      } catch (e) {
        isError = true;
      }

      expect(isError).toBeFalsy();
      expect(mockReactRouterHistory.push).not.toHaveBeenCalled();
      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });
});
