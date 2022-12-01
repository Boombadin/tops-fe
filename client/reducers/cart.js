import Cookies from 'js-cookie';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import merge from 'lodash/merge';
import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';
import without from 'lodash/without';

import CartApi from '@client/apis/cart';
import CustomerApi from '@client/apis/customer';
import ProductApi from '@client/apis/product';
import { hitTimeStamp } from '@client/constants/hitTimeStamp';
import { Product, ProductEmarsys } from '@client/features/gtm/models/Product';
import { findIsNyb } from '@client/features/nyb/redux/nybSelector';
import { showDeliveryToolBar } from '@client/reducers/customer';
import { setSidebar, toggleLogin } from '@client/reducers/layout';
import {
  getCurrentStoreConfigSelector,
  isCustomerLoggedSelector,
} from '@client/selectors';
import { formatCartBundle, getErrorType } from '@client/utils/cart';
import { setItemsAuto } from '@client/utils/cart';
import { unsetCookie } from '@client/utils/cookie';

const loginTabIndex = 3;

export const TYPES = {
  FETCH_CART: 'FETCH_CART',
  FETCH_CART_START: 'FETCH_CART_START',
  END_LOADING: 'END_LOADING',
  SHOW_NO_STOCK_MODAL: 'SHOW_NO_STOCK_MODAL',
  CLOSE_NO_STOCK_MODAL: 'CLOSE_NO_STOCK_MODAL',
  FETCH_SHIPPING_METHODS_STARTED: 'FETCH_SHIPPING_METHODS_STARTED',
  FETCH_SHIPPING_METHODS: 'FETCH_SHIPPING_METHODS',
  CHOOSE_SHIPPING_TIME: 'CHOOSE_SHIPPING_TIME',
  START_CART_PRODUCT_LOADING: 'START_CART_PRODUCT_LOADING',
  END_CART_PRODUCT_LOADING: 'END_CART_PRODUCT_LOADING',
  START_APPLY_COUPON_LOADING: 'START_APPLY_COUPON_LOADING',
  END_APPLY_COUPON_LOADING: 'END_APPLY_COUPON_LOADING',
  START_DELETE_COUPON_LOADING: 'START_DELETE_COUPON_LOADING',
  END_DELETE_COUPON_LOADING: 'END_DELETE_COUPON_LOADING',
  START_SET_PREFERENCE: 'START_SET_PREFERENCE',
  END_SET_PREFERENCE: 'END_SET_PREFERENCE',
  NOTIFY_LIMIT_QTY: 'NOTIFY_LIMIT_QTY',
  NOTIFY_MAX_QTY: 'NOTIFY_MAX_QTY',
  NOTIFY_OUT_OF_STOCK: 'NOTIFY_OUT_OF_STOCK',
  RESET_NOTIFY_MAX_QTY: 'RESET_NOTIFY_MAX_QTY',
  RESET_NOTIFY_OUT_OF_STOCK: 'RESET_NOTIFY_OUT_OF_STOCK',
  RESET_NOTIFY_LIMIT_QTY: 'RESET_NOTIFY_LIMIT_QTY',
  ERROR_NORMAL_TO_NYB: 'ERROR_NORMAL_TO_NYB',
  ERROR_NYB_TO_NOMARL: 'ERROR_NYB_TO_NOMARL',
  CLOSE_MODAL_ERROR_NYB: 'CLOSE_MODAL_ERROR_NYB',
  END_ADD_TO_CART: 'END_ADD_TO_CART',
  MODAL_NOT_SELECT_METHOD: 'MODAL_NOT_SELECT_METHOD',
  FETCH_CART_TOTALS_COMPLETED: 'FETCH_CART_TOTALS_COMPLETED',
  NOT_DEFAULT_SHIPPING: 'NOT_DEFAULT_SHIPPING',
  CLOSE_MODAL_STORE_SELECTOR: 'CLOSE_MODAL_STORE_SELECTOR',
  FETCH_CART_FAIL: 'FETCH_CART_FAIL',
  ADD_CART_ITEM: 'ADD_CART_ITEM',
  CHANGE_CART_ITEM_QTY: 'CHANGE_CART_ITEM_QTY',
  DELETE_CART_ITEM: 'DELETE_CART_ITEM',
  REPLACE_CART_ITEM: 'REPLACE_CART_ITEM',
};

export const fetchCartProducts = nextStoreConfig => {
  return async (_dispatch, getState) => {
    const state = getState();
    const storeCode = nextStoreConfig
      ? state.storeConfig?.next?.code || nextStoreConfig
      : getCurrentStoreConfigSelector(state).code;
    const cartItems = state.cart.cart.items;
    const skus = cartItems.map(item => item.sku);
    const products = await ProductApi.getCatalogServiceBySku({
      storeCode,
      skus,
    });
    return products;
  };
};

export const fetchProductByStore = storeCode => {
  return async (_dispatch, getState) => {
    const state = getState();
    const cartItems = state.cart.cart.items;
    const skus = cartItems.map(item => item.sku);
    const products = await ProductApi.getBySkus({ storeCode, skus });

    return products;
  };
};

export const fetchInitialCart = (isCartLoad = false, isTotalsLoad = false) => {
  return async (dispatch, getState) => {
    dispatch(startLoadingCart());
    const store = getState();

    try {
      const cartId = get(store, 'cart.cart.id', '');
      const cartLoad = cartId ? isCartLoad : true;
      const totalsLoad = cartId ? isTotalsLoad : true;

      if (!isCustomerLoggedSelector(store)) {
        dispatch(
          fetchCartCompleted({
            ...cart,
            items: [],
          }),
        );
        return null;
      }

      const cart = get(store, 'cart.cart');
      const customerId = get(store, 'customer.items.id');

      if (!customerId) {
        return null;
      }

      const cartTotalsResponse = await dispatch(
        fetchCartTotals(cartId, totalsLoad),
      );

      if (!cartTotalsResponse) {
        try {
          return await dispatch(fetchCart());
        } catch (e) {
          return null;
        }
      }

      if (!cart.id) {
        cart.id = parseInt(cartTotalsResponse.extension_attributes.cart_id);
      }

      const cartItems = map(cartTotalsResponse.items, item => {
        item.sku = item.extension_attributes.sku;
        return item;
      });

      const updatedCart = {
        ...cart,
        items: merge(cartItems),
      };

      // GTM Abandon Cart
      const products = map(updatedCart.items, item => ProductEmarsys(item));
      dataLayer.push({
        event: 'CartContentUpdate',
        CartContent: products,
      });

      const formatCart = formatCartBundle(updatedCart);
      await dispatch(fetchCartCompleted(formatCart));

      return formatCart;
    } catch (e) {
      dispatch(fetchCartFail());
    }
  };
};

export const fetchCart = (isCartLoad = false, isTotalsLoad = false) => {
  return async (dispatch, getState) => {
    dispatch(startLoadingCart());
    const store = getState();

    try {
      const cartId = get(store, 'cart.cart.id', '');
      const cartLoad = cartId ? isCartLoad : true;
      const totalsLoad = cartId ? isTotalsLoad : true;
      let cart = get(store, 'cart.cart');

      if (!isCustomerLoggedSelector(store)) {
        dispatch(
          fetchCartCompleted({
            ...cart,
            items: [],
          }),
        );
        return null;
      }

      const customerId = get(store, 'customer.items.id');

      if (!customerId) {
        return null;
      }

      const cartResponse = await CartApi.get(cartId, cartLoad);

      const currentAddress = get(store, 'customer.currentShipping', null);

      if (
        !isEmpty(currentAddress) &&
        !isEmpty(Cookies.get('product_add_to_cart'))
      ) {
        return await dispatch(autoAddToCart());
      }

      if (get(cartResponse, 'data.cart.isStoreNotMatch')) {
        return window.location.reload();
      }

      const cartTotalsResponse = await dispatch(
        fetchCartTotals(cartId, totalsLoad),
      );

      if (!cartResponse || !cartTotalsResponse) {
        return null;
      }

      cart = cartResponse.data.cart;

      let updatedCart = {
        ...cart,
        items: merge(cart.items, cartTotalsResponse.items),
      };

      const baseUrl = getState().storeConfig.current.base_media_url;
      updatedCart = {
        ...updatedCart,
        items: map(updatedCart.items, item => ({
          ...item,
          imageUrl: `${baseUrl}catalog/product${item.image}`,
        })),
      };
      // GTM Abandon Cart
      const products = map(updatedCart.items, item => ProductEmarsys(item));
      dataLayer.push({
        event: 'CartContentUpdate',
        CartContent: products,
      });

      const formatCart = formatCartBundle(updatedCart);
      await dispatch(fetchCartCompleted(formatCart));
    } catch (e) {
      dispatch(fetchCartFail());
    }
  };
};

export const fetchCartTotals = (cartId, isTotalsLoad) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const storeId = getCurrentStoreConfigSelector(state).id;

      const { cartTotals } = await CartApi.getTotals(
        cartId,
        isTotalsLoad,
        storeId,
      );

      await dispatch(fetchCartTotalsCompleted(cartTotals));
      return cartTotals;
    } catch (e) {
      return null;
    }
  };
};

export const autoAddToCart = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const storeCode = state.storeConfig.current.code;

    // No shiping address
    const currentAddress = get(state, 'customer.currentShipping', null);

    if (isEmpty(currentAddress)) {
      return;
    }

    try {
      const action = get(
        JSON.parse(Cookies.get('product_add_to_cart')),
        'action',
        '',
      );
      const skus = get(
        JSON.parse(Cookies.get('product_add_to_cart')),
        'product',
        {},
      );
      const { items } = await ProductApi.getBySkus({ storeCode, skus });

      let product = {};
      if (items.length > 0) {
        product = items[0];
      }

      if (action === 'add_product') {
        Cookies.remove('product_add_to_cart');
        await dispatch(addItem(product));
      }

      return true;
    } catch (e) {
      return null;
    }
  };
};

export const addItem = (product, ref = '') => {
  return async (dispatch, getState) => {
    const state = getState();
    const storeCode = state.storeConfig.current.code;
    const isLogedIn = get(state, 'customer.items');
    const cartItems = get(state, 'cart.cart.items', []);
    const { cart: cartStore } = state;

    let { cart } = cartStore;

    if (cartStore.loadingProduct[product.sku]) {
      return null;
    }

    dispatch(startCartProductLoading(product.sku));
    dispatch(startLoadingCart());

    if (!isLogedIn) {
      window.location.href = `${ref === '' ? '/login' : `/login?ref=${ref}`}`;
      return;
    }

    // No shiping address
    const currentAddress = get(state, 'customer.currentShipping', null);

    if (isEmpty(currentAddress)) {
      setItemsAuto(product);
      return dispatch(showDeliveryToolBar());
    }

    if (get(cart, 'items', {}).length <= 0) {
      cart = await dispatch(fetchInitialCart(false, false));
    }

    let item = { sku: product.sku, qty: 1 };
    let itemQty = 1;
    if (get(product, 'type_id', '') === 'bundle') {
      const bundleOptions = head(
        get(product, 'extension_attributes.bundle_product_options'),
        [],
      );

      const pack = get(bundleOptions, 'product_links.0.qty');
      const qtyPerPack = get(item, 'qty', 1) * pack;
      itemQty = qtyPerPack + get(item, 'qty', 1);
      item = {
        ...item,
        product_option: {
          extension_attributes: {
            bundle_options: [
              {
                option_id: get(bundleOptions, 'option_id', ''),
                option_qty: pack,
                option_selections: [
                  parseInt(get(bundleOptions, 'product_links.0.id', '')),
                ],
              },
            ],
          },
        },
      };
    }
    const sumQty = sumBy(cartItems, item => {
      if (item.type_id === 'bundle') {
        return item.qty_per_pack + item.qty;
      }
      return item.qty;
    });
    if (sumQty + itemQty > 199) {
      await dispatch(resetNotifyLimitQty());
      dispatch(endLoadingCart());
      dispatch(endCartProductLoading(product.sku));
      return dispatch(notifyLimitQty('limit_qty_200', get(product, 'sku')));
    }

    if (cartStore.loadingProduct[product.sku]) {
      return null;
    }

    if (get(product, 'extension_attributes.stock_item.is_in_stock') === false) {
      dispatch(endLoadingCart());
      dispatch(endCartProductLoading(product.sku));
      return dispatch(showNoStockModal(product, 'out_of_stock'));
    }

    // --- @NYB [START] - CHECK NEW YEAR BASKET IN CART ---
    const isNyb = findIsNyb(product);
    const checkNyb = cartItems.every(pro => findIsNyb(pro) !== isNyb);
    const checkNybResult = checkNyb && cartItems.length > 0;
    if (checkNybResult) {
      // if (!isNyb) {
      //   dispatch(handleCheckoutModalErrorNormal(true));
      // } else {
      //   dispatch(handleCheckoutModalErrorNyb(true));
      // }
      dispatch(endLoadingCart());
      dispatch(endCartProductLoading(product.sku));
      return null;
    }
    // --- @NYB [END] - CHECK NEW YEAR BASKET IN CART ---
    const addItemResponse = await CartApi.addItem(cart.id, item);
    // error 401 Authen
    if (get(addItemResponse, 'data.status') === 401) {
      unsetCookie('user_token');
      return (window.location.href = '/login?token_expired=true');
    }

    const error = getErrorType(get(addItemResponse, 'data.error.message'));
    const itemSku = get(product, 'sku');

    // error 404 cart emptry
    if (get(addItemResponse, 'data.status') === 404) {
      const userToken = Cookies.get('user_token');
      const customerShippingInfo = await CustomerApi.getShippingInfo(userToken);

      const customerStoreCode = get(customerShippingInfo, 'current_store');
      const currentStoreCode = storeCode.replace(/_en|_th/gi, '');

      if (
        (!isEmpty(customerStoreCode) &&
          customerStoreCode !== currentStoreCode) ||
        get(addItemResponse, 'data.error.message', '') ===
          'No such entity with %fieldName = %fieldValue' ||
        get(addItemResponse, 'data.error.message', '') ===
          'Current customer does not have an active cart.'
      ) {
        setItemsAuto(product);
        return window.location.reload();
      }

      await dispatch(resetNotifyLimitQty());
      dispatch(notifyLimitQty(error, itemSku));
      dispatch(endLoadingCart());
      dispatch(endCartProductLoading(product.sku));
      return;
    }

    if (error) {
      if (error === 'add_normal_to_nyb' || error === 'add_nyb_to_normal') {
        dispatch(showModalErrorNYB(error));
      } else if (error === 'product_group_limit') {
        await dispatch(resetNotifyLimitQty());
        dispatch(
          notifyLimitQty(
            get(
              addItemResponse,
              'data.error.parameters.product_group_error',
              '',
            ),
            product.sku,
          ),
        );
      } else {
        if (get(addItemResponse, 'data.status') !== 404) {
          await dispatch(resetNotifyLimitQty());
          dispatch(showNoStockModal(product, error));
        }
        if (error === 'out_of_stock') {
          await dispatch(resetNotifyOutOfStock());
          dispatch(notifyOutOfStock(itemSku));
        } else {
          await dispatch(resetNotifyLimitQty());
          dispatch(notifyLimitQty(error, itemSku));
        }
      }
      dispatch(endLoadingCart());
      dispatch(endCartProductLoading(product.sku));
      return null;
    }

    if (!addItemResponse.data.item) {
      dispatch(endLoadingCart());
      dispatch(endCartProductLoading(product.sku));
      return null;
    }

    cart = getState().cart.cart;

    const updatedCart = {
      ...cart,
      items: [
        ...cart.items,
        {
          ...item,
          ...addItemResponse.data.item,
        },
      ],
    };
    dataLayer.push({
      event: 'eec.AddToCart',
      ecommerce: {
        currencyCode: 'THB',
        add: {
          products: [Product(product)],
        },
      },
      hit_timestamp: hitTimeStamp,
    });

    const reducerTab = getState().layout.sidebarActiveTab;

    if (reducerTab !== -1) {
      const cartTab = 0;
      dispatch(setSidebar(cartTab));
    }

    dispatch(endAddTOCart(item));
    dispatch(fetchCartCompleted(updatedCart));
    dispatch(fetchCart(true, true));
    dispatch(endCartProductLoading(product.sku));
  };
};

export const addItems = products => {
  return async (dispatch, getState) => {
    const userToken = Cookies.get('user_token');
    const state = getState();
    const storeCode = state.storeConfig.current.code;
    const cartItems = get(state, 'cart.cart.items', []);
    const { cart: cartStore } = state;

    const customerShippingInfo = await CustomerApi.getShippingInfo(userToken);

    if (
      get(customerShippingInfo, 'current_store', '') !== '' &&
      storeCode.replace(/_en|_th/gi, '') !==
        get(customerShippingInfo, 'current_store', '')
    ) {
      return window.location.reload();
    }

    if (!isCustomerLoggedSelector(state)) {
      if (window.innerWidth < 991) {
        return dispatch(toggleLogin());
      }

      return dispatch(setSidebar(loginTabIndex));
    }

    const { cart } = cartStore;

    if (!cart.id) {
      return;
    }

    const items = products;

    dispatch(startLoadingCart());
    let checkError = false;
    // --- @NYB [START] - CHECK NEW YEAR BASKET IN CART ---
    products.forEach(product => {
      const isNyb = findIsNyb(product);
      const checkNyb = cartItems.every(pro => findIsNyb(pro) !== isNyb);
      const checkNybResult = checkNyb && cartItems.length > 0;
      if (checkNybResult) {
        // if (!isNyb) {
        //   dispatch(handleCheckoutModalErrorNormal(true));
        // } else {
        //   dispatch(handleCheckoutModalErrorNyb(true));
        // }
        dispatch(endLoadingCart());
        dispatch(endCartProductLoading(product.sku));
        checkError = true;
      }
    });
    if (checkError) return;
    // --- @NYB [END] - CHECK NEW YEAR BASKET IN CART ---

    for (let i = 0; i < items.length; ++i) {
      const item = items[i];

      let itemAdd = { sku: item.sku, qty: get(item, 'qty', 1) };
      if (get(item, 'extension_attributes.stock_item.is_in_stock') !== false) {
        if (
          get(item, 'qty', 1) >
          get(item, 'extension_attributes.stock_item.qty', 1)
        ) {
          itemAdd = {
            ...itemAdd,
            qty: get(item, 'extension_attributes.stock_item.qty', 1),
          };
        }

        if (get(item, 'type_id', '') === 'bundle') {
          const bundleOptions = head(
            get(item, 'extension_attributes.bundle_product_options'),
            [],
          );
          const pack = get(bundleOptions, 'product_links.0.qty');
          itemAdd = {
            ...itemAdd,
            product_option: {
              extension_attributes: {
                bundle_options: [
                  {
                    option_id: get(bundleOptions, 'option_id', ''),
                    option_qty: pack,
                    option_selections: [
                      parseInt(get(bundleOptions, 'product_links.0.id', '')),
                    ],
                  },
                ],
              },
            },
          };
        }
        await CartApi.addItem(cart.id, itemAdd);
      }
    }

    await dispatch(fetchCart(true, true));
    return true;
  };
};

export const updateDiffCartItems = (diffItems, redirect) => {
  return async (dispatch, getState) => {
    const { cart: cartStore, storeConfig } = getState();
    const { cart } = cartStore;
    const { current } = storeConfig;
    dispatch(startLoadingCart());

    const response = await CartApi.updateDiffCartProduct({
      diffItems: map(diffItems, diffItem => {
        const item = {
          item_id: get(diffItem, 'item_id'),
          sku: get(diffItem, 'sku'),
          error: get(diffItem, 'error'),
        };
        return item;
      }),
      cartId: get(cart, 'id', ''),
      storeCode: get(current, 'code', ''),
    });

    if (get(response, 'message', '') === 'done') {
      if (!isEmpty(redirect)) {
        window.location.href = redirect;
      } else {
        await dispatch(fetchCart(true, true));
      }
    }

    dispatch(endLoadingCart());
  };
};

export const setCustomerPreferences = preferences => {
  return async (dispatch, getState) => {
    dispatch(setPreferencesStart());
    const { cart: cartStore } = getState();
    const { cart } = cartStore;
    const { id: cartId } = cart;

    try {
      const response = await CartApi.setCustomerPreferences(
        cartId,
        preferences,
      );
      dispatch(setPreferencesEnd());
      return response;
    } catch (e) {
      dispatch(setPreferencesEnd());
      return e;
    }
  };
};

export const transferCart = ({ diffItems = [], storeCode, currentCode }) => {
  return async (dispatch, getState) => {
    let {
      cart: {
        cart: { id: cartId },
      },
      storeConfig: {
        current: { code },
      },
    } = getState();
    if (currentCode) {
      code = currentCode;
    }

    const customerId = get(getState(), 'customer.items.id');

    if (!isEmpty(diffItems)) {
      diffItems = map(diffItems, item => {
        return {
          sku: get(item, 'sku', ''),
          error: get(item, 'error', ''),
        };
      });
    }

    if (code !== storeCode) {
      await CartApi.transferCart({
        cartId,
        storeCode: code,
        nextStoreCode: storeCode,
        customerId: customerId,
        diffItems,
      });
    }

    await fetchCart(true, true);
  };
};

export const fetchShippingMethods = cartId => {
  return async (dispatch, getState) => {
    const state = getState();
    const currentShipping = get(state, 'customer.currentShipping');
    const { subdistrict_id } = currentShipping;

    if (!isCustomerLoggedSelector(state)) {
      if (window.innerWidth < 991) {
        return dispatch(toggleLogin());
      }

      return dispatch(setSidebar(loginTabIndex));
    }

    dispatch(fetchShippingMethodsStarted());
    const response = await CartApi.fetchShippingMethods(cartId, subdistrict_id);
    if (get(response, 'response.status') === 401) {
      return (window.location.href = '/login?token_expired=true');
    }
    dispatch(fetchShippingMethodsCompleted(response));
    // dispatch(fetchShippingMethodsCompleted(intervals));
  };
};

export const putCoupon = coupon => {
  return async (dispatch, getState) => {
    dispatch(startLoadingCoupon());

    const totals = getState().cart.cartTotals;
    const replaceCoupon = coupon.replace(/\s/g, '');

    let fetchCoupon = [];
    if (get(totals, 'coupon_code')) {
      fetchCoupon = totals.coupon_code.split(',');
    }

    const response = await CartApi.putCoupon(replaceCoupon, fetchCoupon);
    await dispatch(fetchCart(false, true));
    dispatch(endLoadingCoupon());
    return response;
  };
};

export const deleteCoupon = coupon => {
  return async (dispatch, getState) => {
    dispatch(startLoadingDeleteCoupon());

    const totals = getState().cart.cartTotals;

    let fetchCoupon = [];
    if (get(totals, 'coupon_code')) {
      fetchCoupon = totals.coupon_code.split(',');
    }

    const response = await CartApi.deleteCoupon(coupon, fetchCoupon);

    await dispatch(fetchCart(false, true));
    dispatch(endLoadingDeleteCoupon());

    return response;
  };
};

export const checkDefaultShipping = product => {
  return async (dispatch, getState) => {
    const state = getState();
    const shippingString = Cookies.get('shipping_address_cookie');
    let regionId = '';
    let districtId = '';
    let subdistrictId = '';
    let zipcode = '';

    if (shippingString) {
      const shippingArr = shippingString.split(',');
      regionId = shippingArr[0];
      districtId = shippingArr[1];
      subdistrictId = shippingArr[2];
      zipcode = shippingArr[3];
    }

    if (regionId && districtId && subdistrictId && zipcode) {
      return true;
    }

    if (!isCustomerLoggedSelector(state)) {
      if (window.innerWidth < 991) {
        return dispatch(toggleLogin());
      }

      return dispatch(setSidebar(loginTabIndex));
    }

    Cookies.set(
      'product_add_to_cart',
      JSON.stringify({
        action: 'set_product',
        product: get(product, 'sku', ''),
      }),
    );
    dispatch(notDefaultShipping());
    return false;
  };
};

export const modalNotSelectMethod = visible => ({
  type: TYPES.MODAL_NOT_SELECT_METHOD,
  payload: {
    visible,
  },
});

export const startLoadingCoupon = () => ({
  type: TYPES.START_APPLY_COUPON_LOADING,
});

export const endLoadingCoupon = () => ({
  type: TYPES.END_APPLY_COUPON_LOADING,
});

export const startLoadingDeleteCoupon = () => ({
  type: TYPES.START_DELETE_COUPON_LOADING,
});

export const endLoadingDeleteCoupon = () => ({
  type: TYPES.END_DELETE_COUPON_LOADING,
});

export const startLoadingCart = () => ({
  type: TYPES.FETCH_CART_START,
});

export const endLoadingCart = () => ({
  type: TYPES.END_LOADING,
});

export const startCartProductLoading = sku => ({
  type: TYPES.START_CART_PRODUCT_LOADING,
  payload: {
    sku,
  },
});

export const endCartProductLoading = sku => ({
  type: TYPES.END_CART_PRODUCT_LOADING,
  payload: {
    sku,
  },
});

export const fetchCartCompleted = cart => ({
  type: TYPES.FETCH_CART,
  payload: {
    cart,
  },
});

export const fetchCartFail = () => ({
  type: TYPES.FETCH_CART_FAIL,
});

export const fetchCartTotalsCompleted = cartTotals => ({
  type: TYPES.FETCH_CART_TOTALS_COMPLETED,
  payload: {
    cartTotals,
  },
});

export const showNoStockModal = (item, error) => ({
  type: TYPES.SHOW_NO_STOCK_MODAL,
  payload: {
    item,
    error,
  },
});

export const endAddTOCart = item => ({
  type: TYPES.END_ADD_TO_CART,
  payload: {
    item,
  },
});

export const showModalErrorNYB = error => ({
  type: TYPES.ERROR_NORMAL_TO_NYB,
  payload: {
    error,
  },
});

export const closeNoStockModal = () => ({
  type: TYPES.CLOSE_NO_STOCK_MODAL,
});

export const closeModalErrorNYB = () => ({
  type: TYPES.CLOSE_MODAL_ERROR_NYB,
});

export const fetchShippingMethodsStarted = () => ({
  type: TYPES.FETCH_SHIPPING_METHODS_STARTED,
  payload: {},
});

export const fetchShippingMethodsCompleted = shippingMethods => ({
  type: TYPES.FETCH_SHIPPING_METHODS,
  payload: shippingMethods,
});

export const setPreferencesStart = () => ({
  type: TYPES.START_SET_PREFERENCE,
});

export const setPreferencesEnd = () => ({
  type: TYPES.END_SET_PREFERENCE,
});

export const notifyMaxQty = sku => ({
  type: TYPES.NOTIFY_MAX_QTY,
  payload: {
    sku,
  },
});

export const notifyOutOfStock = sku => ({
  type: TYPES.NOTIFY_OUT_OF_STOCK,
  payload: {
    sku,
  },
});

export const notifyLimitQty = (errorMessage, sku) => {
  return {
    type: TYPES.NOTIFY_LIMIT_QTY,
    payload: {
      errorMessage,
      sku,
    },
  };
};

export const resetNotifyMaxQty = () => ({
  type: TYPES.RESET_NOTIFY_MAX_QTY,
});

export const resetNotifyOutOfStock = () => ({
  type: TYPES.RESET_NOTIFY_OUT_OF_STOCK,
});

export const resetNotifyLimitQty = () => ({
  type: TYPES.RESET_NOTIFY_LIMIT_QTY,
});

export const notDefaultShipping = () => ({
  type: TYPES.NOT_DEFAULT_SHIPPING,
});

export const closeModalStoreSelector = () => ({
  type: TYPES.CLOSE_MODAL_STORE_SELECTOR,
});

export const addCartItem = item => ({
  type: TYPES.ADD_CART_ITEM,
  payload: {
    item,
  },
});

export const changeCartItemQty = ({ productSku, qty }) => ({
  type: TYPES.CHANGE_CART_ITEM_QTY,
  payload: {
    productSku,
    qty,
  },
});

export const deleteCartItem = productSku => ({
  type: TYPES.DELETE_CART_ITEM,
  payload: {
    productSku,
  },
});

export const replaceCartItem = item => ({
  type: TYPES.REPLACE_CART_ITEM,
  payload: {
    item,
  },
});

const mapShippingMethodFields = method => ({
  carrierCode: method.carrier_code,
  methodCode: method.method_code,
  carrierTitle: method.carrier_title,
  methodTitle: method.method_title,
  amount: method.amount,
  baseAmount: method.base_amount,
  available: method.available,
  extensionAttributes: method.extension_attributes,
  errorMessage: method.error_message,
  priceExclTax: method.price_excl_tax,
  priceInclTax: method.price_incl_tax,
});

const mapSlotFields = slot => ({
  id: slot.id,
  round: slot.round,
  timeFrom: slot.time_from,
  timeTo: slot.time_to,
  cost: slot.cost,
  quota: slot.quota,
  available: slot.quota_available,
  enabled: slot.is_available,
  isAllow: slot.is_available,
});

const getDeliverySlotAttributes = rawDeliverySlotAttributes => {
  let days = [];
  const intervals = rawDeliverySlotAttributes;
  forEach(intervals, interval => {
    const intervalsDaysParsed = map(interval.days, day => ({
      date: day.date,
      isAllow: day.is_allow,
      slots: map(
        map(day.slots, el => {
          const o = Object.assign({}, el);
          o.is_allow = day.is_allow;
          return o;
        }),
        mapSlotFields,
      ),
    }));

    days = days.concat(intervalsDaysParsed);
  });

  return days;
};

const getShippingMethod = method => {
  const rawDeliverySlotAttributes = get(
    method,
    'extension_attributes.delivery_slot',
  );
  const hasDeliverySlotAttributes = !isEmpty(rawDeliverySlotAttributes);

  if (!hasDeliverySlotAttributes) {
    return mapShippingMethodFields(method);
  }

  const deliverySlotAttributes = getDeliverySlotAttributes(
    rawDeliverySlotAttributes,
  );
  const extensionAttributes = {
    ...method.extension_attributes,
    deliverySlot: deliverySlotAttributes,
  };

  return {
    ...mapShippingMethodFields(method),
    extensionAttributes,
  };
};

const shippingMethodsLoadedReducer = (state, action) => {
  const shippingMethods = map(action.payload, getShippingMethod);

  return {
    ...state,
    shippingMethods: {
      isLoading: false,
      data: shippingMethods,
    },
  };
};

// Reducer
const initialState = {
  cart: {
    items: [],
  },
  cartTotals: {},
  itemsBundle: [],
  itemsExcludeBundle: [],
  loaded: false,
  loadedTotals: false,
  init: true,
  shippingMethods: {
    isLoading: false,
    data: [],
  },
  errors: {
    showModal: false,
    items: {},
  },
  applyCouponLoading: false,
  deleteCouponLoading: false,
  isDisabled: false,
  notifyMaxQty: '',
  notifyOutOfStock: '',
  item: {},
  showModalNotSelectMethod: false,
  showModalStoreLocator: false,
  loadingProduct: {},
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_CART: {
      return {
        ...state,
        cart: action.payload.cart,
        itemsBundle: action.payload.cart.items_bundle,
        itemsExcludeBundle: action.payload.cart.items_exclude_bundle,
        itemsCount: reduce(
          action.payload.cart.items,
          (memo, item) => memo + item.qty,
          0,
        ),
        loaded: true,
        init: false,
      };
    }

    case TYPES.FETCH_CART_TOTALS_COMPLETED: {
      return {
        ...state,
        loadedTotals: true,
        cartTotals: action.payload.cartTotals,
        itemsCount: reduce(
          action.payload.cartTotals.items,
          (memo, item) => memo + item.qty,
          0,
        ),
      };
    }

    case TYPES.FETCH_CART_START: {
      return {
        ...state,
        loaded: false,
        loadedTotals: false,
      };
    }

    case TYPES.END_LOADING: {
      return {
        ...state,
        loaded: true,
      };
    }

    case TYPES.SHOW_NO_STOCK_MODAL: {
      return {
        ...state,
        noStockModal: {
          show: true,
          item: {
            ...action.payload.item,
            error: {
              text: action.payload.error,
            },
          },
        },
      };
    }

    case TYPES.ERROR_NORMAL_TO_NYB: {
      return {
        ...state,
        errorAddNYB: {
          show: true,
          item: {
            error: {
              text: action.payload.error,
            },
          },
        },
      };
    }

    case TYPES.CLOSE_MODAL_ERROR_NYB: {
      return {
        ...state,
        errorAddNYB: {
          show: false,
        },
      };
    }

    case TYPES.CLOSE_NO_STOCK_MODAL: {
      return {
        ...state,
        noStockModal: {
          show: false,
        },
      };
    }

    case TYPES.FETCH_SHIPPING_METHODS_STARTED: {
      return {
        ...state,
        shippingMethods: {
          ...state.shippingMethods,
          isLoading: true,
        },
      };
    }

    case TYPES.FETCH_SHIPPING_METHODS: {
      return shippingMethodsLoadedReducer(state, action);
    }

    case TYPES.START_CART_PRODUCT_LOADING: {
      return {
        ...state,
        loadingProduct: {
          ...state.loadingProduct,
          [action.payload.sku]: true,
        },
      };
    }
    case TYPES.NOTIFY_LIMIT_QTY: {
      return {
        ...state,
        notifyLimitQty: action.payload,
      };
    }

    case TYPES.NOTIFY_MAX_QTY: {
      return {
        ...state,
        notifyMaxQty: action.payload.sku,
      };
    }

    case TYPES.NOTIFY_OUT_OF_STOCK: {
      return {
        ...state,
        notifyOutOfStock: action.payload.sku,
      };
    }

    case TYPES.RESET_NOTIFY_MAX_QTY: {
      return {
        ...state,
        notifyMaxQty: '',
      };
    }

    case TYPES.RESET_NOTIFY_OUT_OF_STOCK: {
      return {
        ...state,
        notifyOutOfStock: '',
      };
    }

    case TYPES.RESET_NOTIFY_LIMIT_QTY: {
      return {
        ...state,
        notifyLimitQty: '',
      };
    }

    case TYPES.END_CART_PRODUCT_LOADING: {
      return {
        ...state,
        loadingProduct: {
          ...state.loadingProduct,
          [action.payload.sku]: false,
        },
      };
    }

    case TYPES.START_APPLY_COUPON_LOADING: {
      return { ...state, applyCouponLoading: true };
    }

    case TYPES.END_APPLY_COUPON_LOADING: {
      return { ...state, applyCouponLoading: false };
    }

    case TYPES.START_DELETE_COUPON_LOADING: {
      return { ...state, deleteCouponLoading: true };
    }

    case TYPES.END_DELETE_COUPON_LOADING: {
      return { ...state, deleteCouponLoading: false };
    }

    case TYPES.START_SET_PREFERENCE: {
      return { ...state, isDisabled: true };
    }

    case TYPES.END_SET_PREFERENCE: {
      return { ...state, isDisabled: false };
    }

    case TYPES.END_ADD_TO_CART: {
      return { ...state, itemAddToCart: action.payload.item };
    }

    case TYPES.MODAL_NOT_SELECT_METHOD: {
      return { ...state, showModalNotSelectMethod: action.payload.visible };
    }

    case TYPES.NOT_DEFAULT_SHIPPING: {
      return { ...state, showModalStoreLocator: true };
    }

    case TYPES.CLOSE_MODAL_STORE_SELECTOR: {
      return { ...state, showModalStoreLocator: false };
    }

    case TYPES.ADD_CART_ITEM: {
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload.item],
        },
        itemsCount: reduce(
          state.cart.items,
          (memo, item) => memo + item.qty,
          action.payload?.item?.qty || 0,
        ),
        init: false,
      };
    }
    case TYPES.REPLACE_CART_ITEM: {
      const updatedCartItems = state.cart?.items?.map(item => {
        if (item.sku === action.payload.item?.sku) {
          return {
            ...action.payload.item,
            qty: item.qty,
          };
        }
        return item;
      });

      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedCartItems,
        },
        itemsCount: updatedCartItems.reduce((memo, item) => memo + item.qty, 0),
      };
    }
    case TYPES.DELETE_CART_ITEM: {
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            item => item.sku !== action.payload.productSku,
          ),
        },
        itemsCount: reduce(
          state.cart.items,
          (memo, item) => memo + item.qty,
          action.payload?.item?.qty || 0,
        ),
      };
    }
    case TYPES.CHANGE_CART_ITEM_QTY: {
      const newQty = action.payload.qty;
      const updatedCartItems = state.cart?.items?.map(item => {
        if (item.sku === action.payload.productSku) {
          return { ...item, qty: newQty };
        }
        return item;
      });

      const updatedBundles = state.itemsBundle?.map(bundle => {
        const foundItem = bundle?.items?.find(
          item => item?.sku === action.payload.productSku,
        );

        if (foundItem) {
          const currentQty = state.cart?.items?.find(
            item => item?.sku === action.payload.productSku,
          )?.qty;
          const diffQty = newQty - currentQty;
          const bundleItems = [...bundle?.items];

          if (diffQty > 0) {
            for (let i = 0; i < diffQty; ++i) {
              bundleItems.push(foundItem);
            }
            return { ...bundle, items: bundleItems };
          } else if (diffQty < 0) {
            for (let i = 0; i < Math.abs(diffQty); ++i) {
              const foundIndex = bundleItems.findIndex(
                item => item?.sku === action.payload.productSku,
              );
              foundIndex >= 0 && bundleItems.splice(foundIndex, 1);
            }
            return { ...bundle, items: bundleItems };
          }
          // do nothing in case of diff qty equals to 0
        }

        return bundle;
      });

      const updatedItemsExcludeBundle = state.itemsExcludeBundle?.map(item => {
        if (item.sku === action.payload.productSku) {
          return { ...item, qty: action.payload.qty };
        }
        return item;
      });

      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedCartItems,
        },
        itemsBundle: updatedBundles,
        itemsExcludeBundle: updatedItemsExcludeBundle,
        itemsCount: updatedCartItems?.reduce(
          (memo, item) => memo + item.qty,
          0,
        ),
      };
    }

    default:
      return state;
  }
};

export default reducer;
