import {
  uniqBy,
  get,
  filter,
  size,
  head,
  find,
  isEmpty,
  concat,
  map,
} from 'lodash';
import Cookies from 'js-cookie';
import orderApi from '../apis/order';
import CartApi from '../apis/cart';
import CustomerApi from '../apis/customer';
import checkoutApi from '../apis/checkout';
import { fetchCart } from './cart';
import { ProductReorderWithPriceInclTax } from '../features/gtm/models/Product';
import { hitTimeStamp } from '../constants/hitTimeStamp';

export const TYPES = {
  FETCH_ORDER: 'FETCH_ORDER',
  FETCH_ORDERS: 'FETCH_ORDERS',
  FETCH_ORDER_COMPLETED: 'FETCH_ORDER_COMPLETED',
  FETCH_ORDER_FAILED: 'FFETCH_ORDER_FAILED',
  FETCH_ORDER_START: 'FETCH_ORDER_START',
};

export const fetchOrder = id => {
  return async (dispatch, getState) => {
    const currentStoreCode = getState().storeConfig.current.code;
    dispatch(fetchOrderStart());
    try {
      const { order } = await orderApi.getOne(currentStoreCode, id);
      const response = await checkoutApi.getStorLocator();
      const storeId = get(order, 'extension_attributes.pickup_store.store_id');
      const store = filter(get(response, 'stores', []), stores => {
        return stores.id == storeId;
      });
      dispatch(fetchOrderCompleted(order, store));
      return order;
    } catch (e) {
      dispatch(fetchOrderFailed(e));
    }
  };
};

export const fetchOrderByIncrementId = id => {
  return async (dispatch, getState) => {
    dispatch(fetchOrderStart());
    try {
      const { order } = await orderApi.getOneByIncrementId(id);
      const response = await checkoutApi.getStorLocator();
      const storeId = get(order, 'extension_attributes.pickup_store.store_id');
      const store = filter(get(response, 'stores', []), stores => {
        return stores.id == storeId;
      });
      dispatch(fetchOrderCompleted(order, store));
      return order;
    } catch (e) {
      dispatch(fetchOrderFailed(e));
    }
  };
};

export const fetchOrders = (customerId, pageNumber) => {
  return async (dispatch, getState) => {
    const currentStoreCode = getState().storeConfig.current.code;
    dispatch(fetchOrderStart());
    try {
      const { orders } = await orderApi.getAll(
        currentStoreCode,
        customerId,
        pageNumber,
      );
      dispatch(fetchOrdersCompleted(orders));
    } catch (e) {
      dispatch(fetchOrderFailed(e));
    }
  };
};

export const reorderToCart = (products, diffItems) => {
  return async (dispatch, getState) => {
    const userToken = Cookies.get('user_token');
    const state = getState();
    const storeCode = state.storeConfig.current.code;
    const cartItems = get(state, 'cart.cart.items', []);
    const { cart: cartStore, storeConfig } = state;

    const customerShippingInfo = await CustomerApi.getShippingInfo(userToken);

    if (
      get(customerShippingInfo, 'current_store', '') !== '' &&
      storeCode.replace(/_en|_th/gi, '') !==
        get(customerShippingInfo, 'current_store', '')
    ) {
      return window.location.reload();
    }

    const { cart } = cartStore;

    if (!cart.id) {
      return;
    }

    const cartItemQtyUp = [];
    const cartItemQtyDown = [];
    const cartItemNotFound = [];
    for (let i = 0; i < size(products); ++i) {
      const item = products[i];
      const checkItemSameInCart = find(
        cartItems,
        cartItem => cartItem?.sku === item?.sku,
      );
      if (!isEmpty(checkItemSameInCart)) {
        if (checkItemSameInCart?.qty < item?.qty) {
          cartItemQtyUp.push(item);
        } else if (checkItemSameInCart?.qty > item?.qty) {
          cartItemQtyDown.push(item);
        }
      } else {
        cartItemNotFound.push(item);
      }
    }

    const productsAdd = concat(
      cartItemQtyDown,
      cartItemQtyUp,
      cartItemNotFound,
    );
    
    for (let i = 0; i < size(productsAdd); ++i) {
      const item = productsAdd[i];
      const findError = find(diffItems, val => val?.sku === item?.sku);
      let itemAdd = { sku: get(item, 'sku', ''), qty: get(item, 'qty', 1) };
      const priceChanged = find(
        findError?.error,
        error => error?.text === 'price_changed',
      );
      const findCartItem = find(
        cartItems,
        cartItem => cartItem.sku === item.sku,
      );

      let response = {};
      if (isEmpty(findCartItem)) {
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

        response = await CartApi.addItem(cart.id, itemAdd);
      } else {
        response = await CartApi.changeItemQty(
          cart.id,
          get(findCartItem, 'item_id', ''),
          get(item, 'sku', ''),
          get(item, 'qty', 1),
        );
      }
      if (!isEmpty(get(response, 'data.error', {}))) {
        if (get(response, 'data.status') === 404) {
          if (
            get(response, 'data.error.message', '') ===
              'No such entity with %fieldName = %fieldValue' ||
            get(response, 'data.error.message', '') ===
              'Current customer does not have an active cart.'
          ) {
            await dispatch(fetchCart(true, true));
            return dispatch(reorderToCart(products, diffItems));
          }
        }

        const error = get(findError, 'error', []);
        const errorData = {
          text: get(response, 'data.error.message', {}),
          parameters: get(response, 'data.error.parameters', {}),
        };

        error.push(errorData);

        let updateError = {};
        if (!isEmpty(findError)) {
          updateError = {
            ...findError,
            error,
          };
        } else {
          updateError = {
            ...item,
            image: item
              ? `${storeConfig?.current?.base_media_url}/catalog/product${item.image}`
              : item.imageUrl,
            error,
          };
        }
        diffItems = uniqBy([...diffItems, updateError], 'sku');
      }

      // GTM
      if (findCartItem?.qty > item?.qty) {
        const product = ProductReorderWithPriceInclTax(item)
        product.quantity = findCartItem?.qty - item?.qty
        product.price = priceChanged ? findError?.price : item?.price
        dataLayer.push({
          event: 'eec.RemoveFromCart',
          ecommerce: {
            currencyCode: 'THB',
            remove: {
              products: [product],
            },
          }
        });
      } 
      else {
        const product = ProductReorderWithPriceInclTax(item)
        product.quantity =  findCartItem?.qty ? item?.qty - findCartItem?.qty : item?.qty
        product.price = priceChanged ? findError?.price : item?.price
        dataLayer.push({
          event: 'eec.AddToCart',
          ecommerce: {
            currencyCode: 'THB',
            add: {
              products: [product],
            },
          }
        });
      }
    }

    await dispatch(fetchCart(true, true));

    if (!isEmpty(diffItems)) {
      return { diffItems };
    }
    return { diffItems: [] };
  };
};

export const fetchOrderStart = () => ({
  type: TYPES.FETCH_ORDER_START,
});

export const fetchOrderCompleted = (order, store) => ({
  type: TYPES.FETCH_ORDER_COMPLETED,
  payload: {
    order,
    store,
  },
});

export const fetchOrdersCompleted = orders => ({
  type: TYPES.FETCH_ORDERS,
  payload: { orders },
});

export const fetchOrderFailed = error => ({
  type: TYPES.FETCH_ORDER_FAILED,
  payload: {
    error,
  },
});

const initialState = {
  items: [],
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_ORDER_COMPLETED: {
      const { order, store } = action.payload;
      return {
        ...state,
        ...{
          item: [order],
          store: store,
          loading: false,
        },
      };
    }

    case TYPES.FETCH_ORDERS: {
      const { orders } = action.payload;
      const newOrders = uniqBy([...state.items, ...orders.items], 'entity_id');
      return {
        ...state,
        items: newOrders,
        loading: false,
        sorting: orders.sorting || [],
        search_criteria: orders.search_criteria || {},
        total_count: orders.total_count,
      };
    }

    case TYPES.FETCH_ORDER_FAILED: {
      return state;
    }

    case TYPES.FETCH_ORDER_START: {
      return {
        ...state,
        loading: true,
      };
    }

    default:
      return state;
  }
};
export default reducer;
