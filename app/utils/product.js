import { map, find, get as prop, floor } from 'lodash';
import ProductService from '../services/productService';

export const transfromProductBundle = async (productList, store) => {
  const items = await Promise.all(
    map(productList, async item => {
      if (prop(item, 'type_id') === 'bundle') {
        const childrenProduct = prop(
          item,
          'extension_attributes.bundle_product_options.0.product_links.0',
        );

        const { products } = await ProductService.getCatalogServiceBySku(
          prop(childrenProduct, 'sku', ''),
          store,
          1,
        );

        const foundProduct = find(products, product => {
          return prop(product, 'sku', '') === prop(childrenProduct, 'sku', '');
        });

        const childStockItem = prop(
          foundProduct,
          'extension_attributes.stock_item.qty',
          prop(item, 'extension_attributes.stock_item.qty'),
        );
        const pack = prop(childrenProduct, 'qty', 1);
        const stockQty = floor(parseFloat(childStockItem) / parseFloat(pack));

        const updateProduct = {
          ...item,
          children_product: foundProduct,
          extension_attributes: {
            ...item.extension_attributes,
            stock_item: {
              ...item.extension_attributes.stock_item,
              qty: stockQty,
              is_in_stock:
                prop(item, 'extension_attributes.stock_item.is_in_stock') &&
                prop(foundProduct, 'status') === 1 &&
                stockQty > 0,
            },
          },
        };

        return updateProduct;
      }

      return item;
    }),
  );

  return items;
};
