import axios from 'axios';
import Exploder from '../../client/utils/mcaex';
import config from '../config';
import { map, find, get as prop, merge, size, isEmpty } from 'lodash';
import ProductService from './productService';
import MAQB from '../../client/utils/maqb';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const get = async (store, id) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/orders/${id}`,
    method: 'GET',
    headers: {
      ...headers,
      'remove-child-item': 'yes',
    },
  };

  try {
    const orderRes = await axios(params);
    const orderItem = orderRes.data;

    let skus = [];
    if (orderItem) {
      skus = map(prop(orderItem, 'items', {}), item => {
        const itemSku = prop(item, 'sku', '').split('-')[0];
        return itemSku;
      });
    }

    const pageSize = size(skus);

    let productList = [];
    if (pageSize > 0) {
      const { products } = await ProductService.getCatalogServiceBySku(
        skus.toString(),
        store,
        pageSize,
      );
      productList = products;
    }

    const updatedData = {
      ...orderItem,
      items: map(orderItem.items, item => {
        const itemSku = prop(item, 'sku', '').split('-')[0];

        item = {
          ...item,
          sku: itemSku,
        };

        const foundProduct = find(
          productList,
          product => prop(product, 'sku', '') === prop(item, 'sku', ''),
        );

        let explodProduct = {};
        if (!isEmpty(foundProduct)) {
          explodProduct = Exploder.explode(foundProduct, {
            explodeOption: true,
          });
          explodProduct = {
            ...explodProduct,
            original_price: prop(explodProduct, 'price', ''),
          };
        }

        delete item.name;
        let mergeItem = merge(item, explodProduct);

        if (prop(mergeItem, 'type_id', '') === 'bundle') {
          const childrenPerPack = prop(
            item,
            'extension_attributes.bundle_product_options.0.product_links.0.qty',
          );

          mergeItem = {
            ...mergeItem,
            qty_per_pack: prop(item, 'qty_ordered', 0) * childrenPerPack,
          };
        }

        return mergeItem;
      }),
    };

    return updatedData;
  } catch (e) {
    console.error(e);
    return e;
  }
};

const getOneByIncrementId = async (id, store) => {
  const queryBuilder = new MAQB();
  queryBuilder.field('increment_id', id, 'eq');

  const params = {
    url: `${magentoApiUrl}/${store}/V1/orders?${queryBuilder.build()}`,
    method: 'GET',
    headers: {
      ...headers,
      'remove-child-item': 'yes',
    },
  };
  try {
    const orderRes = await axios(params);
    const orderItem = prop(orderRes, 'data.items.0', []);
    const products = await Promise.all(
      map(prop(orderItem, 'items', []), item =>
        ProductService.getOneBySku(item.sku, store),
      ),
    );

    const updatedData = {
      ...orderItem,
      items: map(prop(orderItem, 'items', []), item => {
        const foundProduct = find(
          products,
          product => product.sku === item.sku,
        );
        const explodProduct = Exploder.explode(foundProduct, {
          explodeOption: true,
        });

        return merge(item, explodProduct);
      }),
    };

    return updatedData;
  } catch (e) {
    return e;
  }
};

const getAll = (store, query) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/orders?${query}`,
      method: 'GET',
      headers: {
        ...headers,
        'remove-child-item': 'yes',
      },
    };
    axios(params)
      .then(async response => {
        const orders = response.data;
        const orderList = prop(orders, 'items', []);

        const updateOrder = {
          ...orders,
          items: await Promise.all(
            map(orderList, async order => {
              let skus = [];
              if (order) {
                skus = map(prop(order, 'items', {}), item => {
                  const itemSku = prop(item, 'sku', '').split('-')[0];
                  return itemSku;
                });
              }
              const pageSize = size(skus);

              let productList = [];
              if (pageSize > 0) {
                const {
                  products,
                } = await ProductService.getCatalogServiceBySku(
                  skus.toString(),
                  store,
                  pageSize,
                );
                productList = products;
              }

              const updatedData = {
                ...order,
                items: map(order.items, item => {
                  const itemSku = prop(item, 'sku', '').split('-')[0];

                  item = {
                    ...item,
                    sku: itemSku,
                  };

                  const foundProduct = find(
                    productList,
                    product =>
                      prop(product, 'sku', '') === prop(item, 'sku', ''),
                  );

                  let explodProduct = {};
                  if (!isEmpty(foundProduct)) {
                    explodProduct = Exploder.explode(foundProduct, {
                      explodeOption: true,
                    });
                    explodProduct = {
                      ...explodProduct,
                      original_price: prop(explodProduct, 'price', ''),
                    };
                  }

                  delete item.name;
                  let mergeItem = merge(item, explodProduct);

                  if (prop(mergeItem, 'type_id', '') === 'bundle') {
                    const childrenPerPack = prop(
                      item,
                      'extension_attributes.bundle_product_options.0.product_links.0.qty',
                    );

                    mergeItem = {
                      ...mergeItem,
                      qty_per_pack:
                        prop(item, 'qty_ordered', 0) * childrenPerPack,
                    };
                  }

                  return mergeItem;
                }),
              };

              return updatedData;
            }),
          ),
        };

        resolve(updateOrder);
      })
      .catch(e => {
        reject(e);
      });
  });

export default {
  get,
  getAll,
  getOneByIncrementId,
};
