import Cookies from 'js-cookie';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import { simpleAction } from '@client/features/cart/utils/simpleAction';

import { promoTypeBundle } from './promoBundle';

export const errorTypes = {
  insufficient_stock: 'insufficient_stock',
  out_of_stock: 'out_of_stock',
  product_group_limit: 'product_group_limit',
  product_group_limit_alert: 'product_group_limit_alert',
  product_invalid_value: 'product_invalid_value',
  limit_qty_200: 'limit_qty_200',
};

export const getErrorType = (message = '') => {
  if (message.startsWith(`We don't have as many`)) {
    return errorTypes.insufficient_stock;
  } else if (
    message === 'Product that you are trying to add is not available.'
  ) {
    return errorTypes.out_of_stock;
  } else if (message === 'This product is out of stock.') {
    return errorTypes.out_of_stock;
  } else if (message === 'product_group_limit') {
    return errorTypes.product_group_limit;
  } else if (message === 'product_group_limit_alert') {
    return errorTypes.product_group_limit_alert;
  } else if (message === 'Cart item limit exceeded') {
    return errorTypes.limit_qty_200;
  }

  return message;
};

export const hasSeasonalItem = (cart, seasonalConfig) => {
  let isFound = false;

  map(get(cart, 'items'), item => {
    const config = find(seasonalConfig, function(object) {
      return object.code === item.seasonal;
    });
    if (!isEmpty(config) && config.delivery_lock) {
      isFound = true;
    }
  });

  return isFound;
};

export const formatCartBundle = cart => {
  const bundleList = [];
  const itemExcludeBundle = [];

  try {
    map(cart.items, item => {
      const itemPromo = get(item, 'extension_attributes.sales_rules');

      if (!itemPromo) {
        itemExcludeBundle.push(item);
        return;
      }

      const listOfBundleType = itemPromo.map(promo => promo.description);

      const selectedBundle = filter(
        promoTypeBundle,
        promoType => listOfBundleType.indexOf(promoType) !== -1,
      );

      const bundleType = selectedBundle[0];
      const selectBundleRule = find(itemPromo, promo => {
        if (
          promo?.type_name === 'Online promotion' &&
          promo?.coupon_type === 'NO_COUPON'
        ) {
          return (
            promo?.action_discount_type === simpleAction?.cart_fixed ||
            promo?.action_discount_type === simpleAction?.groupn_fixdisc
          );
        }
        return promo.description === bundleType;
      });

      if (isEmpty(selectBundleRule)) {
        itemExcludeBundle.push(item);
        return;
      }

      const alreadyHasInBundleList = find(
        bundleList,
        bundle => bundle.name === selectBundleRule.name,
      );

      if (!alreadyHasInBundleList) {
        bundleList.push({
          ...selectBundleRule,
          items: [],
        });
      }

      const currentBundleList = find(
        bundleList,
        bundle => bundle?.name === selectBundleRule?.name,
      );
      const itemQty = item.qty;

      for (let i = 0; i < itemQty; i++) {
        const qtyStep = currentBundleList?.qty_step;
        let discountAmount = 0;
        const qtyLogic = Math.floor(itemQty / qtyStep);

        if (itemQty > qtyStep) {
          if (i % qtyStep === 0 && qtyLogic !== 0 && i !== itemQty - 1) {
            discountAmount = item.discount_amount / qtyLogic;
          } else discountAmount = 0;
        } else if (i === 0) {
          discountAmount = item.discount_amount;
        }

        currentBundleList?.items.push({
          ...item,
          discount_amount: discountAmount,
          qty: 1,
        });
      }
    });
  } catch (e) {
    return null;
  }

  return {
    ...cart,
    items_bundle: bundleList,
    items_exclude_bundle: itemExcludeBundle,
  };
};

export const calculateQty = (oldQty, newQty, qtyInCart, type) => {
  let qty = newQty;
  if (type === 'product_bundle') {
    const settleQty = newQty - oldQty;
    qty = qtyInCart + settleQty;
  }

  return qty;
};

export const calculateLimitQty = (limitMaxQty, qtyInCart, qty, type) => {
  let limit = limitMaxQty;
  if (type === 'product_bundle') {
    const settleLimit = qtyInCart - qty;
    limit = limitMaxQty - settleLimit;
  }

  return limit;
};

export const includeProduct = items => {
  const product = [];
  items.map(item => {
    const currentItem = Object.assign({}, item);
    const checkSkuInChunk = find(product, leftChunk => {
      return leftChunk.sku === currentItem.sku;
    });

    if (checkSkuInChunk) {
      checkSkuInChunk.qty += 1;
    } else {
      product.push(currentItem);
    }
  });

  return product;
};

// TODO remove this func after remove its all dependencies
export const setItemsAuto = product => {
  Cookies.set(
    'product_add_to_cart',
    JSON.stringify({
      action: 'add_product',
      product: get(product, 'sku'),
    }),
    { secure: false },
  );
};

export const addProductSkusToCookies = productSkus => {
  if (!productSkus) {
    return;
  }

  const oldProductSkus = JSON.parse(
    Cookies.get('products_to_add_to_cart') || '[]',
  );
  const inHalfDay = 0.5;

  Cookies.set(
    'products_to_add_to_cart',
    JSON.stringify([...oldProductSkus, ...productSkus]),
    { secure: false, expires: inHalfDay },
  );
};
