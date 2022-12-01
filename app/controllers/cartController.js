import assign from 'lodash/assign';
import filter from 'lodash/filter';
import find from 'lodash/find';
import prop from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import size from 'lodash/size';

import CartService from '@app/services/cartService';
import CheckoutService from '@app/services/checkoutService';
import CustomerService from '@app/services/customerService';
import ProductService from '@app/services/productService';
import { log } from '@app/utils/logger';
import { get as getRedis, set as setRedis } from '@app/utils/redis';
import { isDateBetween } from '@app/utils/time';
import Exploder from '@client/utils/mcaex';

const get = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];
  const { cartId, cartLoad } = req.query;

  try {
    if (isEmpty(userToken)) {
      return res.json({ cart: [] });
    }

    let cartKey = '';

    if (cartLoad === 'false' && !isEmpty(cartId)) {
      cartKey = `api__cart__${cartId}`;
    }

    let cart;
    if (typeof req.redis !== 'undefined') {
      cart = await getRedis(cartKey).catch(async () => {
        const response = await CartService.getV2(userToken, store);

        cartKey = `api__cart__${response.id}`;
        setRedis(cartKey, response, 300);
        return response;
      });
    } else {
      cart = await CartService.getV2(userToken, store);
    }

    res.set('Cache-Control', 'no-cache');
    return res.json({ cart });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ cart: [] });
  }
};

const getTotals = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];
  const { cartId, totalsLoad, storeId } = req.query;

  try {
    if (isEmpty(userToken)) {
      return res.json({ cartTotals: {} });
    }

    let totalsKey = '';
    if (totalsLoad === 'false' && !isEmpty(cartId)) {
      totalsKey = `api__totals__${cartId}`;
    }

    let cartTotals;
    if (typeof req.redis !== 'undefined') {
      cartTotals = await getRedis(totalsKey).catch(async () => {
        const totals = await CartService.getTotal(userToken, store);
        totalsKey = `api__totals__${cartId}`;

        setRedis(totalsKey, totals, 300);
        return totals;
      });
    } else {
      cartTotals = await CartService.getTotal(userToken, store, storeId);
    }

    return res.json({ cartTotals });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    return res.json({ cartTotals: {} });
  }
};

const createCart = async (req, res) => {
  const store = req.headers['x-store-code'];

  try {
    const { customerId } = req.query;
    const cartId = await CartService.createCart(customerId, store);

    log('cart', 'createCart', req, cartId);

    return res.json({ cartId });
  } catch (e) {
    log('cart', 'createCart', req, e.message, false);
    return res.json({ cartId: null });
  }
};

const addItem = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];
  const { cartId, product } = req.body;

  try {
    if (isEmpty(userToken)) {
      return res.json({ message: 'no user token' });
    }

    const item = await CartService.addItem(cartId, userToken, product, store);

    log('cart', 'addItem', req, item);

    return res.json({ item });
  } catch (e) {
    console.error(prop(e, 'response.data', ''));
    log('cart', 'addItem', req, e.response.data, false);
    return res.json({ status: e.response.status, error: e.response.data });
  }
};

const deleteCart = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];

  try {
    const cart = await CartService.deleteCart(store, userToken);

    log('cart', 'deleteCart', req, cart);

    return res.json({ cart });
  } catch (e) {
    log('cart', 'deleteCart', req, e.message, false);
    return res.json({ status: e.response.status, error: e.response.data });
  }
};

const deleteItem = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];

  const { cartId, itemId } = req.body;

  try {
    const cart = await CartService.deleteItem(cartId, itemId, store, userToken);

    log('cart', 'deleteItem', req, cart);

    return res.json({ cart });
  } catch (e) {
    log('cart', 'deleteItem', req, e.message, false);
    return res.json({ status: e.response.status, error: e.response.data });
  }
};

const deleteItemBundle = async (req, res) => {
  const storeCode = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];

  const { cartId, itemId, itemSku, newItemQty } = req.body;

  try {
    const { products } = await ProductService.getCatalogServiceBySku(
      itemSku,
      storeCode,
    );
    const productBySku = find(products, item => {
      return prop(item, 'sku', '') === itemSku;
    });

    const checkOOS = prop(
      productBySku,
      'extension_attributes.stock_item.is_in_stock',
      false,
    );

    const currentStock = prop(
      productBySku,
      'extension_attributes.stock_item.qty',
      1,
    );

    let response;
    if (checkOOS === false || newItemQty === 0) {
      response = await CartService.deleteItem(
        cartId,
        itemId,
        storeCode,
        userToken,
      );
    } else {
      let qty = newItemQty;
      if (currentStock < newItemQty) {
        qty = currentStock;
      }

      response = await CartService.changeItemQty(
        cartId,
        itemId,
        itemSku,
        qty,
        storeCode,
        userToken,
      );
    }

    return res.json({ response });
  } catch (e) {
    log('cart', 'deleteItemBundle', req, e.message, false);
    return res.json({ status: e.response.status, error: e.response.data });
  }
};

const deleteAll = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];
  const { cartId } = req.body;

  try {
    const cart = await CartService.get(cartId, store);
    const { items } = cart;

    for (const item of items) {
      await CartService.deleteItem(cart.id, item.item_id, store, userToken);
    }

    return res.json({ response: 'done' });
  } catch (e) {
    log('cart', 'deleteAll', req, e.message, false);
    return res.json(e.response.data);
  }
};

const changeItemQty = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];
  const { cartId, itemId, itemSku, qty, productOption } = req.body;

  try {
    const item = await CartService.changeItemQty(
      cartId,
      itemId,
      itemSku,
      qty,
      store,
      userToken,
      productOption,
    );

    return res.json({ item });
  } catch (e) {
    if (prop(e, 'response.status', '') === 400) {
      if (
        prop(e, 'response.data.message', '') !== 'product_group_limit_alert' &&
        prop(e, 'response.data.message', '') !== 'product_group_limit'
      ) {
        const { products } = await ProductService.getCatalogServiceBySku(
          itemSku,
          store,
        );
        const productBySku = find(products, item => {
          return prop(item, 'sku', '') === itemSku;
        });
        const checkOOS = prop(
          productBySku,
          'extension_attributes.stock_item.is_in_stock',
          false,
        );
        const currentStock = prop(
          productBySku,
          'extension_attributes.stock_item.qty',
          1,
        );

        let response;
        if (checkOOS === false || qty === 0) {
          response = await CartService.deleteItem(
            cartId,
            itemId,
            store,
            userToken,
          );
        } else {
          let newItemQty = qty;
          if (currentStock < newItemQty) {
            newItemQty = currentStock;

            response = await CartService.changeItemQty(
              cartId,
              itemId,
              itemSku,
              newItemQty,
              store,
              userToken,
              productOption,
            );
          }
        }

        if (!isEmpty(response)) {
          return res.json({ item: response });
        }
      }
    }

    return res.json({ status: e.response.status, error: e.response.data });
  }
};

const setCustomerPreferences = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.cookies['user_token'];

  const { cartId, preferences } = req.body;

  try {
    const response = await CartService.setCustomerPreferences(
      cartId,
      preferences,
      store,
      userToken,
    );

    log('cart', 'setCustomerPreferences', req, response);

    return res.json({ success: true });
  } catch (e) {
    if (e.response) {
      log('cart', 'setCustomerPreferences', req, e.response.data, false);
      return res.json(e.response.data);
    } else if (e.message) {
      log('cart', 'setCustomerPreferences', req, e.message, false);
      return res.json({ error: e.message });
    }
  }
};

const getShippingMethods = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const userToken = req.cookies.user_token;
    const customer = await CustomerService.get(userToken, store);

    if (prop(customer, 'response.status') === 401) {
      res.clearCookie('user_token');
      return res.json({ response: { status: 401 } });
    }

    const { cartId, subDistrictId } = req.query;

    const address = find(customer.addresses, {
      default_shipping: prop(customer, 'default_shipping'),
    });

    const shippingMethods = await CartService.getShippingMethods({
      address,
      userToken,
      store,
    });

    // mapping slots
    if (shippingMethods && cartId && subDistrictId) {
      Promise.all(
        await map(shippingMethods, async method => {
          if (
            !prop(method, 'extension_attributes.store_pickup_enabled', false)
          ) {
            const shippingMethod = `${prop(method, 'carrier_code')}_${prop(
              method,
              'method_code',
            )}`;
            const slots = await CheckoutService.getDeliverySlot(
              store,
              cartId,
              shippingMethod,
              subDistrictId,
            );
            const deliverySlot = {
              delivery_slot: [
                {
                  days: slots,
                },
              ],
            };
            return assign(method, {
              extension_attributes: Object.assign(
                {},
                prop(method, 'extension_attributes'),
                deliverySlot,
              ),
            });
          }
          return assign(method);
        }),
      )
        .then(response => {
          res.json(response);
        })
        .catch(() => {
          res.json(null);
        });
    } else {
      res.json(shippingMethods);
    }
  } catch (e) {
    res.json(null);
  }
};

const transferMulti = async (req, res) => {
  try {
    const { storeCode, nextStoreCode, customerId } = req.body;
    const userToken = req.cookies.user_token;
    const cartResponse = await CartService.getV2(
      userToken,
      storeCode,
      customerId,
    );
    const cartItems = cartResponse.items.map(item => {
      return {
        sku: item.sku,
        qty: item.qty,
      };
    });
    const replaceMulti = await CartService.replaceMulti(
      userToken,
      cartItems,
      nextStoreCode,
    );
    return res.json({ message: 'done', replaceMulti: replaceMulti });
  } catch (e) {
    return res.json({ error: e });
  }
};

const updateDiffCartProduct = async (req, res) => {
  try {
    const { diffItems, cartId, storeCode } = req.body;
    const userToken = req.cookies.user_token;

    for (const item of diffItems) {
      const findTypeErrorNotAvailable = find(prop(item, 'error', []), val => {
        return (
          val?.text === 'out_of_stock' ||
          val?.text === 'not_available' ||
          val?.text === 'product_disabled'
        );
      });

      if (!isEmpty(findTypeErrorNotAvailable)) {
        await CartService.deleteItem(
          cartId,
          item.item_id,
          storeCode,
          userToken,
        );
      }

      const findTypeErrorNotEnoughQuant = find(prop(item, 'error', []), val => {
        return val?.text === 'not_enough_quant' || val?.text === 'max_qty';
      });

      if (!isEmpty(findTypeErrorNotEnoughQuant)) {
        const qty = findTypeErrorNotEnoughQuant?.missingQuantity || 1;
        await CartService.changeItemQty(
          cartId,
          item.item_id,
          item.sku,
          qty,
          storeCode,
          userToken,
        );
      }
    }

    return res.json({ message: 'done' });
  } catch (error) {
    return res.json({
      code: prop(error, 'response.status', ''),
      message: 'error',
      error: prop(error, 'response.data', ''),
    });
  }
};

const transfer = async (req, res) => {
  try {
    const { storeCode, nextStoreCode, diffItems } = req.body;
    const userToken = req.cookies.user_token;
    const customer = await CustomerService.get(userToken, storeCode);
    const cartResponse = await CartService.getV2(
      userToken,
      storeCode,
      customer.id,
    );
    const cartItems = cartResponse.items;
    const cartNextStore = await CartService.getV2(
      userToken,
      nextStoreCode,
      customer.id,
    );
    const cartTotalResponse = await CartService.getTotal(userToken, storeCode);
    const couponCodes = cartTotalResponse?.coupon_code || '';
    const newCartId = cartNextStore.id;
    const { items } = cartNextStore;
    if (storeCode !== nextStoreCode) {
      await CartService.deleteCart(storeCode, userToken);
    }
    if (!isEmpty(items)) {
      for (const item of items) {
        await CartService.deleteItem(
          newCartId,
          item.item_id,
          nextStoreCode,
          userToken,
        );
      }
    }

    if (!isEmpty(cartItems)) {
      let response;

      try {
        let skus = [];
        if (cartItems) {
          skus = map(cartItems, item => {
            const itemSku = item?.sku?.split('-')?.[0];
            return itemSku;
          });
        }
        const pageSize = size(skus);

        response = await ProductService.getCatalogServiceBySku(
          skus.toString(),
          nextStoreCode,
          pageSize,
        );
      } catch (e) {
        response = [];
      }

      for (const item of cartItems) {
        let itemQty = item.qty;
        const curProduct = find(response?.products || [], product => {
          if (item?.type_id === 'bundle') {
            return (
              product?.sku === item.sku &&
              product?.status === 1 &&
              (product?.visibility === 2 || product?.visibility === 4) &&
              product?.children_product?.status === 1
            );
          }

          return (
            product?.sku === item.sku &&
            product?.status === 1 &&
            (product?.visibility === 2 || product?.visibility === 4)
          );
        });
        const diffItem = find(diffItems, val => val?.sku === curProduct?.sku);
        const errorOutOfStock = find(diffItem?.error, { text: 'out_of_stock' });

        if (!errorOutOfStock) {
          const availableQty =
            curProduct?.extension_attributes?.stock_item?.qty;
          if (availableQty < itemQty) {
            itemQty = availableQty;
          }

          let productData = {
            sku: curProduct?.sku || '',
            qty: itemQty,
          };
          const errorNotEnoughQuantity = find(diffItem?.error, {
            text: 'not_enough_quant',
          });
          const errorMaxQty = find(diffItem?.error, { text: 'max_qty' });

          if (errorNotEnoughQuantity || errorMaxQty) {
            const qtyMissing =
              errorNotEnoughQuantity?.missingQuantity ||
              errorMaxQty?.missingQuantity ||
              1;
            productData = {
              ...productData,
              qty: qtyMissing,
            };
          }
          if (curProduct?.type_id === 'bundle') {
            const bundleOptions =
              curProduct?.extension_attributes?.bundle_product_options?.[0];

            const quantity = productData?.qty || 0;
            const pack = bundleOptions?.product_links?.[0]?.qty;
            const qtyPerPack = quantity * pack;
            itemQty = qtyPerPack + quantity;

            productData = {
              ...productData,
              product_option: {
                extension_attributes: {
                  bundle_options: [
                    {
                      option_id: bundleOptions?.option_id || '',
                      option_qty: pack,
                      option_selections: [
                        parseInt(bundleOptions?.product_links?.[0]?.id || ''),
                      ],
                    },
                  ],
                },
              },
            };
          }

          if (curProduct && itemQty > 0) {
            await CartService.addItem(
              newCartId,
              userToken,
              productData,
              nextStoreCode,
            );
          }
        }
      }

      // add coupons
      if (storeCode === nextStoreCode && !isEmpty(couponCodes)) {
        await CartService.deleteCoupon(userToken, nextStoreCode);
        await CartService.putCoupon(userToken, nextStoreCode, couponCodes);
      }
    }

    return res.json(newCartId);
  } catch (err) {
    return res.json({
      error: err?.response?.data || 'cart transfer fail',
    });
  }
};

const putCoupon = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.headers['user-token'];
  const { coupon, fetchCoupon } = req.body;

  let checkUseCoupon = false;
  if (fetchCoupon.length > 0) {
    checkUseCoupon = find(fetchCoupon, value => {
      return value.toUpperCase() === coupon.toUpperCase();
    });
  }

  let coupons = '';
  if (!checkUseCoupon) {
    if (fetchCoupon.length > 0) {
      fetchCoupon.map(val => {
        coupons += `${val}%2C`;
      });
      coupons += coupon;
    } else {
      coupons = coupon;
    }
  } else {
    return res.json({ message: 'This coupon is used.' });
  }

  try {
    const response = await CartService.putCoupon(userToken, store, coupons);
    const payment = await CheckoutService.fetchPayment(userToken, store);
    const paymentCoupon = payment.totals.coupon_code.split(',');

    let usedCoupons = false;
    if (paymentCoupon.length > 0) {
      usedCoupons = find(paymentCoupon, value => {
        return (
          value.toString().toUpperCase() === coupon.toString().toUpperCase()
        );
      });
    }

    if (usedCoupons) {
      return res.json({ coupon: response });
    }
    return res.json({ message: 'can not apply it.' });
  } catch (e) {
    return res.json({
      message:
        prop(e, 'response.data.parameters.coupon_message_error', '') ||
        prop(e, 'response.data.message', 'can not apply it.'),
    });
  }
};

const deleteCoupon = async (req, res) => {
  const store = req.headers['x-store-code'];
  const userToken = req.headers['user-token'];
  const { coupon, fetchCoupon } = req.body;

  let listCoupon = [];
  let coupons = '';

  if (fetchCoupon.length > 0) {
    listCoupon = filter(fetchCoupon, value => {
      return value.toString().toUpperCase() !== coupon.toString().toUpperCase();
    });

    if (listCoupon.length > 0) {
      listCoupon.map((val, key) => {
        coupons += (key !== 0 ? '%2C' : '') + val;
      });
    }
  }

  try {
    let response = {};
    if (coupons !== '') {
      response = await CartService.putCoupon(userToken, store, coupons);
    } else {
      response = await CartService.deleteCoupon(userToken, store);
    }
    return res.json({ coupon: response });
  } catch (e) {
    return res.json({ message: e.response.data.message });
  }
};

const valify = async (req, res) => {
  const { cartId } = req.body;
  const storeCode = req.headers['x-store-code'];

  const cart = await CartService.get(cartId, storeCode);
  const cartItems = cart.items;
  const isCartEmpty = isEmpty(cartItems);

  const CART_DIFF = [];

  if (!isCartEmpty) {
    let products;
    try {
      products = await Promise.all(
        map(cartItems, item => ProductService.getOneBySku(item.sku, storeCode)),
      );
    } catch (e) {
      products = [];
    }

    for (const item of cartItems) {
      const errorMessage = [];
      let product = find(products, p => p.sku === item.sku);

      if (!product) {
        errorMessage.push('not_available');
        CART_DIFF.push({
          cartItem: item,
          currentItem: item,
          error: errorMessage,
        });
        return;
      }

      product = Exploder.explode(product);
      const availableQty = prop(product, 'extension_attributes.stock_item.qty');

      if (availableQty < item.qty) {
        errorMessage.push('insufficient_stock');
      }

      // CHECK CURRENT ITEM PRICE IN STORE
      let availablePrice;
      const isSpecialPriceEnable = isDateBetween(
        prop(product, 'extension_attributes.promotion.end_date'),
      );
      const specialPrice = product.special_price;

      if (isSpecialPriceEnable && specialPrice) {
        availablePrice = parseFloat(product.special_price);
      } else {
        availablePrice = parseFloat(product.price);
      }

      // CHECK CART ITEM PRICE
      let availablePriceCurrent;
      const isSpecialPriceEnableCurrent = isDateBetween(
        prop(item, 'extension_attributes.promotion.end_date'),
      );
      const specialPriceCurent = item.special_price;

      if (isSpecialPriceEnableCurrent && specialPriceCurent) {
        availablePriceCurrent = parseFloat(item.special_price);
      } else {
        availablePriceCurrent = parseFloat(item.price);
      }

      if (availablePrice === availablePriceCurrent) {
        errorMessage.push('price_changed');
      }

      if (!isEmpty(errorMessage)) {
        CART_DIFF.push({
          cartItem: item,
          currentItem: product,
          error: errorMessage,
        });
      }
    }
  }

  res.json(CART_DIFF);
};

export default {
  get,
  addItem,
  deleteItem,
  deleteItemBundle,
  deleteAll,
  changeItemQty,
  createCart,
  setCustomerPreferences,
  getShippingMethods,
  transfer,
  putCoupon,
  deleteCoupon,
  valify,
  deleteCart,
  getTotals,
  transferMulti,
  updateDiffCartProduct,
};
