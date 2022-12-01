import axios from 'axios';
import { find, get as prop, isEmpty, map, merge, pick, size } from 'lodash';

import config from '@app/config';
import pickWithDefaultValues from '@app/utils/pickWithDefaultValues';
import Exploder from '@client/utils/mcaex';

import customerService from './customerService';
import ProductService from './productService';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const createCart = (store, userToken) =>
  new Promise(async (resolve, reject) => {
    const customer = await customerService.get(userToken, store);
    const customerShippingInfo = await customerService.getShippingInfo(
      userToken,
    );
    const shippingAddress = prop(customer, 'addresses', []);
    const currentShippingInfo = find(shippingAddress, addredss => {
      return (
        prop(customerShippingInfo, 'location_id', '') == prop(addredss, 'id')
      );
    });

    let isStoreNotMatch = false;
    if (prop(customerShippingInfo, 'current_store', '')) {
      if (prop(customerShippingInfo, 'shipping_method', '') !== 'pickup') {
        if (
          size(shippingAddress) > 0 &&
          !isEmpty(currentShippingInfo) &&
          store.replace(/_en|_th/gi, '') !==
            prop(customerShippingInfo, 'current_store', '')
        ) {
          isStoreNotMatch = true;
        }
      } else if (
        store.replace(/_en|_th/gi, '') !==
        prop(customerShippingInfo, 'current_store', '')
      ) {
        isStoreNotMatch = true;
      }
    }

    if (isStoreNotMatch) {
      resolve({ isStoreNotMatch: true });
    } else {
      const params = {
        url: `${magentoApiUrl}/${store}/V1/customers/${prop(
          customer,
          'id',
          '',
        )}/carts`,
        method: 'POST',
        headers,
      };
      axios(params)
        .then(response => resolve(response.data))
        .catch(e => {
          console.log({ e });
          reject(e);
        });
    }
  });

const get = async (cartId, store) => {
  const cartParam = {
    url: `${magentoApiUrl}/${store}/V1/carts/${cartId}`,
    method: 'GET',
    headers,
  };

  try {
    // const [cartRes, cartTotalRes] = await Promise.all([axios(cartParam), axios(cartTotalParam)])
    const cartRes = await axios(cartParam);
    const cartItem = cartRes.data;
    // const cartTotal = cartTotalRes.data
    const products = await Promise.all(
      map(cartItem.items, item => ProductService.getOneBySku(item.sku, store)),
    );

    // Map product to cart items
    const updatedData = {
      ...cartItem,
      items: map(cartItem.items, item => {
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
    return null;
  }
};

const getV2 = async (userToken, store) => {
  const cartParam = {
    url: `${magentoApiUrl}/${store}/V1/carts/mine`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  let cartRes;

  try {
    cartRes = await axios(cartParam);
  } catch (e) {
    const resCreateCart = await createCart(store, userToken);
    if (prop(resCreateCart, 'isStoreNotMatch')) {
      return resCreateCart;
    }

    cartRes = await axios(cartParam);
  }

  const cartItem = prop(cartRes, 'data', {});

  let skus = [];
  if (prop(cartItem, 'items', {})) {
    skus = map(prop(cartItem, 'items', {}), item => {
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

  // Map product to cart items
  const updatedData = {
    ...cartItem,
    items: map(prop(cartItem, 'items', {}), item => {
      const itemSku = prop(item, 'sku', '').split('-')[0];

      item = {
        ...item,
        sku: itemSku,
      };

      const foundProduct = find(productList, product => {
        return prop(product, 'sku', '') === prop(item, 'sku', '');
      });
      let explodProduct = {};
      if (!isEmpty(foundProduct)) {
        explodProduct = Exploder.explode(foundProduct, {
          explodeOption: true,
        });
        explodProduct = {
          ...explodProduct,
          original_price: prop(explodProduct, 'price', ''),
          special_price: prop(foundProduct, 'special_price', ''),
          special_from_date: prop(foundProduct, 'special_from_date', ''),
          special_to_date: prop(foundProduct, 'special_to_date', ''),
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
          qty_per_pack: prop(item, 'qty', 0) * childrenPerPack,
        };
      }

      return mergeItem;
    }),
  };

  return updatedData;
};

const getTotal = async (userToken, store, storeId) => {
  const cartTotalParam = {
    url: `${magentoApiUrl}/${store}/V1/carts/mine/totals`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  let cartTotalRes;
  try {
    cartTotalRes = await axios(cartTotalParam);
  } catch (e) {
    const resCreateCart = await createCart(store, userToken);
    if (prop(resCreateCart, 'isStoreNotMatch')) {
      return { resCreateCart };
    }

    cartTotalRes = await axios(cartTotalParam);
  }

  try {
    const cartTotalItem = prop(cartTotalRes, 'data', {});

    const saleRulesId = [];
    if (cartTotalItem?.items?.length > 0) {
      for (const item of cartTotalItem?.items) {
        if (item?.extension_attributes?.sales_rules?.length > 0) {
          for (const rule of item?.extension_attributes?.sales_rules) {
            if (rule?.rule_id) {
              saleRulesId.push(rule?.rule_id);
            }
          }
        }
      }
    }

    const saleRules = await getSaleRules(saleRulesId.toString());

    const updateCartTotalItems = {
      ...cartTotalItem,
      items: await Promise.all(
        map(cartTotalItem.items, async item => {
          const productSaleRules = prop(
            item,
            'extension_attributes.sales_rules',
            [],
          );

          const transfromSaleRules = [];

          map(productSaleRules, async rule => {
            const findSalesRules = find(saleRules?.items || [], saleRule => {
              return saleRule?.rule_id === rule?.rule_id;
            });

            if (!isEmpty(findSalesRules)) {
              const findStoreLables = find(
                findSalesRules?.store_labels || [],
                label => {
                  return label?.store_id == storeId;
                },
              );

              const formatSalesRules = {
                id: findSalesRules?.rule_id || '',
                name: findSalesRules?.name || '',
                description: findSalesRules?.description?.toLowerCase() || '',
                qty_step: findSalesRules?.discount_step || '',
                action_discount_type: findSalesRules?.simple_action || '',
                discount_amount: findSalesRules?.discount_amount || '',
                store_label: findStoreLables?.store_label || '',
                type_name:
                  findSalesRules?.extension_attributes?.type_name || '',
                label_en: findSalesRules?.extension_attributes?.label_en || '',
                label_th: findSalesRules?.extension_attributes?.label_th || '',
                coupon_type: findSalesRules?.coupon_type || '',
              };

              transfromSaleRules.push(formatSalesRules);
            }
          });

          if (size(transfromSaleRules) > 0) {
            item.extension_attributes.sales_rules = transfromSaleRules;
          }

          delete item.name;

          return item;
        }),
      ),
    };

    return updateCartTotalItems;
  } catch (e) {
    console.error(prop(e, 'message', ''));
    throw e;
  }
};

const getSaleRule = ruleId => {
  const params = {
    url: `${magentoApiUrl}/V1/salesRules/${ruleId}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return e;
    });
};

const getSaleRules = ruleIds => {
  const params = {
    url: `${magentoApiUrl}/V1/salesRules/search?searchCriteria[pageSize]=90&searchCriteria[currentPage]=1&searchCriteria[filter_groups][0][filters][0][field]=rule_id&searchCriteria[filter_groups][0][filters][0][value]=${ruleIds}&searchCriteria[filter_groups][0][filters][0][condition_type]=in&searchCriteria[sortOrders][0][field]=rule_id&searchCriteria[sortOrders][0][direction]=DESC`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return e;
    });
};

const addItem = (cartId, userToken, product, store) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/mine/items`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    data: {
      cartItem: {
        quote_id: cartId,
        ...product,
      },
    },
  };

  return axios(params)
    .then(response => response.data)
    .catch(async e => {
      throw e;
    });
};

const deleteCart = (store, userToken) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/carts/mine`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        console.error(prop(e, 'message', ''));
        reject(e);
      });
  });

const deleteItem = (cartId, itemId, store, userToken) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/carts/mine/items/${itemId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        console.error(prop(e, 'message', ''));
        reject(e);
      });
  });

const changeItemQty = (
  cartId,
  itemId,
  itemSku,
  qty,
  store,
  userToken,
  productOption,
) => {
  let cartItem = {
    qty,
    quote_id: cartId,
    item_id: itemId,
    sku: itemSku,
  };

  if (size(prop(productOption, 'product_option', {})) > 0) {
    cartItem = {
      qty,
      quote_id: cartId,
      item_id: itemId,
      sku: itemSku,
      product_option: prop(productOption, 'product_option', {}),
    };
  }

  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/mine/items/${itemId}`,
    method: 'PUT',
    data: {
      cartItem,
    },
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  return axios(params)
    .then(response => response.data)
    .catch(async e => {
      console.error(prop(e, 'response.data', ''));
      throw e;
    });
};

const setCustomerPreferences = async (
  cartId,
  preferences,
  store,
  userToken,
) => {
  try {
    const cartParams = {
      url: `${magentoApiUrl}/${store}/V1/carts/${cartId}`,
      method: 'GET',
      headers,
    };
    const itemId = Object.keys(preferences)[0];
    const cart = (await axios(cartParams)).data;
    const cartItem = find(cart.items, res => {
      return res.item_id.toString() === itemId;
    });
    const itemParams = {
      url: `${magentoApiUrl}/${store}/V1/carts/mine/items/${itemId}`,
      method: 'PUT',
      data: {
        cartItem: {
          ...pick(cartItem, ['sku', 'qty', 'quote_id']),
          extension_attributes: {
            selected_preference: preferences[itemId] || '',
          },
        },
      },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    await axios(itemParams);

    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

const getShippingMethods = ({ address, userToken, store }) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/mine/estimate-shipping-methods`,
    method: 'POST',
    data: {
      address: pickWithDefaultValues(address, {
        city: '',
        company: '',
        country_id: 'TH',
        custom_attributes: [],
        customer_address_id: 0,
        customer_id: 0,
        email: '',
        fax: '',
        firstname: '',
        lastname: '',
        middlename: '',
        postcode: '',
        prefix: '',
        same_as_billing: -1,
        save_in_address_book: -1,
        street: [''],
        suffix: '',
        telephone: '',
        vat_id: '',
      }),
    },
    headers: {
      ...headers,
      Authorization: `Bearer ${userToken}`,
    },
  };

  return axios(params).then(r => r.data);
};

const transfer = ({ cartId, storeCode, userToken, nextStoreCode }) => {
  const params = {
    url: `${magentoApiUrl}/${storeCode}/V1/carts/${cartId}/transfer`,
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${config.magento_token || userToken}`,
    },
    data: {
      storeCode: nextStoreCode,
    },
  };

  return axios(params).then(r => r.data);
};

const replaceMulti = (userToken, products, store) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/mine/replaceMulti`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    data: {
      cartItems: products,
    },
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return e;
    });
};

const putCoupon = (token, store, coupons) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/carts/mine/coupons/${coupons}`,
      method: 'PUT',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const deleteCoupon = (token, store) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/carts/mine/coupons`,
      method: 'DELETE',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

export default {
  get,
  getV2,
  getTotal,
  addItem,
  deleteItem,
  changeItemQty,
  createCart,
  setCustomerPreferences,
  getShippingMethods,
  transfer,
  putCoupon,
  deleteCoupon,
  deleteCart,
  replaceMulti,
  getSaleRule,
  getSaleRules,
};
