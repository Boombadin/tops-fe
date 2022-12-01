import concat from 'lodash/concat';
import filter from 'lodash/filter';
import find from 'lodash/find';
import floor from 'lodash/floor';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import size from 'lodash/size';

import { isDateBetween } from './time';

function getDiff(item, product, cartItems = []) {
  const qty = get(product, 'extension_attributes.stock_item.qty');
  const errors = [];
  if (!product) {
    errors.push({
      text: 'not_available',
    });
  } else if (
    product?.status != 1 ||
    (product?.visibility != 2 && product?.visibility != 4)
  ) {
    errors.push({
      text: 'product_disabled',
    });
  } else if (
    qty === 0 ||
    get(product, 'extension_attributes.stock_item.is_in_stock') === false
  ) {
    errors.push({
      text: 'out_of_stock',
    });
  } else if (qty < item.qty) {
    errors.push({
      text: 'not_enough_quant',
      missingQuantity: qty,
    });
  } else if (
    item.qty > get(product, 'extension_attributes.stock_item.max_sale_qty')
  ) {
    const availableQty = Math.abs(
      getStockQtyUsed(product, cartItems) -
        get(product, 'extension_attributes.stock_item.max_sale_qty', 1),
    );
    errors.push({
      text: 'not_enough_quant',
      missingQuantity: availableQty,
    });
  }

  if (product) {
    let isSpecialPriceAllow = false;
    if (get(product, 'extension_attributes.promotion')) {
      isSpecialPriceAllow = isDateBetween(
        get(product, 'extension_attributes.promotion.end_date'),
      );
    } else if (get(product, 'special_to_date')) {
      isSpecialPriceAllow = isDateBetween(get(product, 'special_to_date'));
    }
    const specialPrice = get(product, 'special_price');

    if (isSpecialPriceAllow && specialPrice) {
      product.price = parseFloat(get(product, 'special_price'));
    }

    if (
      get(item, 'base_price_incl_tax', 0) !== get(product, 'price', 0) &&
      get(item, 'base_price_incl_tax', 0) > 0 &&
      get(product, 'price', 0) > 0
    ) {
      errors.push({
        text: 'price_changed',
      });
    }
  }

  if (size(errors) > 0) {
    return errors;
  }

  return false;
}

function getDiffProductBundle(items, newProducts, storeConfig) {
  const checkDiffItemsGroubBundle = [];
  let qtyStock = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    const product = find(newProducts, { sku: item.sku });

    const findDataCurrent = find(qtyStock, val => {
      let sku = get(product, 'sku', '');
      if (get(product, 'type_id', '') === 'bundle') {
        sku = get(product, 'children_product.sku', '');
      }
      return get(val, 'sku', '') === sku;
    });

    let stock = get(product, 'extension_attributes.stock_item.qty', 0);
    if (get(product, 'type_id', '') === 'bundle') {
      stock = get(
        product,
        'children_product.extension_attributes.stock_item.qty',
        0,
      );
    }
    const currentStock = get(findDataCurrent, 'currentStock', stock);
    let useQty = get(item, 'qty', 0);
    const errors = [];
    let error = {};

    let updateQtyStock = {};
    // product bundle
    if (product?.type_id === 'bundle') {
      if (
        product?.status != 1 ||
        (product?.visibility != 2 && product?.visibility != 4)
      ) {
        error = {
          text: 'product_disabled',
        };
      } else if (product?.children_product?.status != 1) {
        error = {
          text: 'product_disabled',
        };
      } else if (currentStock > 0) {
        const pack = get(
          item,
          'extension_attributes.bundle_product_options.0.product_links.0.qty',
          0,
        );
        let qtyPerPack = get(item, 'qty_per_pack', 0);

        if (currentStock < qtyPerPack) {
          useQty = floor(currentStock / pack);
          qtyPerPack = useQty * pack;

          error = {
            text: 'not_enough_quant',
            missingQuantity: useQty,
            qtyInPack: qtyPerPack,
          };
        }
        if (
          useQty > get(product, 'extension_attributes.stock_item.max_sale_qty')
        ) {
          useQty = get(product, 'extension_attributes.stock_item.max_sale_qty');
          qtyPerPack = useQty * pack;

          error = {
            text: 'max_qty',
            missingQuantity: useQty,
            maxQuantity: get(
              product,
              'extension_attributes.stock_item.max_sale_qty',
            ),
            qtyInPack: qtyPerPack,
          };
        }

        if (
          useQty === 0 ||
          get(product, 'extension_attributes.stock_item.is_in_stock') === false
        ) {
          error = {
            text: 'out_of_stock',
          };
        }

        // UPDATE CURRENT STOCK
        if (currentStock - qtyPerPack >= 0) {
          updateQtyStock = {
            sku: get(product, 'children_product.sku', ''),
            currentStock: currentStock - qtyPerPack,
          };
        } else {
          error = {
            text: 'out_of_stock',
          };
        }
      } else {
        error = {
          text: 'out_of_stock',
        };
      }
    } else if (currentStock > 0) {
      let calculateStock = currentStock - get(item, 'qty', 0);

      if (
        useQty > get(product, 'extension_attributes.stock_item.max_sale_qty')
      ) {
        useQty = get(product, 'extension_attributes.stock_item.max_sale_qty');
        calculateStock = get(
          product,
          'extension_attributes.stock_item.max_sale_qty',
        );
        error = {
          text: 'max_qty',
          missingQuantity: useQty,
          maxQuantity: get(
            product,
            'extension_attributes.stock_item.max_sale_qty',
          ),
        };
      }
      if (calculateStock < 0) {
        error = {
          text: 'not_enough_quant',
          missingQuantity: currentStock,
        };
      }

      updateQtyStock = {
        sku: get(product, 'sku', ''),
        currentStock: calculateStock > 0 ? calculateStock : 0,
      };
    } else {
      error = {
        text: 'out_of_stock',
      };
    }

    if (size(findDataCurrent) === 0) {
      qtyStock.push(updateQtyStock);
    } else {
      qtyStock = map(qtyStock, val => {
        if (get(val, 'sku', '') === get(updateQtyStock, 'sku', '')) {
          return {
            ...val,
            ...updateQtyStock,
          };
        }

        return val;
      });
    }

    if (!isEmpty(error)) {
      errors.push(error);
    }
    if (product) {
      let isSpecialPriceAllow = false;
      if (get(product, 'extension_attributes.promotion')) {
        isSpecialPriceAllow = isDateBetween(
          get(product, 'extension_attributes.promotion.end_date'),
        );
      } else if (get(product, 'special_to_date')) {
        isSpecialPriceAllow = isDateBetween(get(product, 'special_to_date'));
      }
      const specialPrice = get(product, 'special_price');

      if (isSpecialPriceAllow && specialPrice) {
        product.price = parseFloat(get(product, 'special_price'));
      }
      if (
        get(item, 'base_price_incl_tax', 0) !== get(product, 'price', 0) &&
        get(item, 'base_price_incl_tax', 0) > 0 &&
        get(product, 'price', 0) > 0
      ) {
        errors.push({
          text: 'price_changed',
        });
      }
    }

    let newProductObj;
    if (!product) {
      newProductObj = item;
    } else {
      newProductObj = {
        ...product,
        item_id: item.item_id,
      };
    }

    if (size(errors) > 0) {
      checkDiffItemsGroubBundle.push({
        ...newProductObj,
        image: product
          ? `${storeConfig.base_media_url}/catalog/product${product.image}`
          : item.imageUrl,
        old_price: get(item, 'base_price_incl_tax', 0),
        error: errors,
      });
    }
  }

  return checkDiffItemsGroubBundle;
}

export function countDiffItems(items, newProducts, storeConfig, cartItems) {
  const checkDiffItemsGroubBundle = getDiffProductBundle(
    items,
    newProducts,
    storeConfig,
  );

  const changedItems = filter(items, item => {
    const product = find(newProducts, { sku: item.sku });
    return getDiff(item, product, cartItems);
  });

  let diffItems = map(changedItems, item => {
    let newProductObj;
    const product = find(newProducts, { sku: item.sku });

    if (!product) {
      newProductObj = item;
    } else {
      newProductObj = {
        ...product,
        item_id: item.item_id,
      };
    }

    return {
      ...newProductObj,
      image: product
        ? `${storeConfig.base_media_url}/catalog/product${product.image}`
        : item.imageUrl,
      old_price: get(item, 'base_price_incl_tax', 0),
      error: getDiff(item, product, cartItems),
    };
  });

  if (size(checkDiffItemsGroubBundle) > 0) {
    const changedDiffItems = [];
    map(diffItems, item => {
      const checkSkuInDiffItem = find(checkDiffItemsGroubBundle, diffItem => {
        return diffItem.sku === item.sku;
      });

      if (size(checkSkuInDiffItem) <= 0) {
        changedDiffItems.push(item);
      }
    });

    diffItems = concat(checkDiffItemsGroubBundle, changedDiffItems);
  }

  return diffItems;
}

export const getStockQtyUsed = (product, cartItems = []) => {
  const item = find(
    get(cartItems, 'items', []),
    item => get(item, 'sku') === get(product, 'sku'),
  );
  if (!item) return 0;

  return get(item, 'qty', 0);
};
