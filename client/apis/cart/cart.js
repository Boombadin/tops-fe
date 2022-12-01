import axios from 'axios';
import Cookie from 'js-cookie';
import { baseUrl } from '../config';

const create = customerId => {
  const params = {
    url: `${baseUrl}/cart`,
    method: 'POST',
    params: {
      customerId,
    },
  };

  return axios(params);
};

const get = (cartId, cartLoad) => {
  const params = {
    url: `${baseUrl}/cart`,
    method: 'GET',
    params: {
      cartId,
      cartLoad,
    },
    headers: {
      'cache-control': 'no-cache, no-store',
      pragma: 'no-cache',
    },
  };

  return axios(params);
};

const getTotals = (cartId, totalsLoad, storeId) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/cart/totals`,
      method: 'GET',
      params: {
        cartId,
        totalsLoad,
        storeId,
      },
      headers: {
        'cache-control': 'no-cache, no-store',
        pragma: 'no-cache',
      },
    };

    return axios(params)
      .then(res => resolve(res.data))
      .catch(e => reject(e));
  });

const deleteCart = () => {
  const params = {
    url: `${baseUrl}/cart/deleteCart`,
    method: 'DELETE',
  };

  return axios(params);
};

const deleteItem = (cartId, itemId) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/cart/deleteItem`,
      method: 'DELETE',
      data: {
        cartId,
        itemId,
      },
    };

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const deleteItemBundle = (cartId, itemId, itemSku, newItemQty) => {
  const params = {
    method: 'DELETE',
    url: `${baseUrl}/cart/deleteItemBundle`,
    data: {
      cartId,
      itemId,
      itemSku,
      newItemQty,
    },
  };

  return axios(params)
    .then(res => res.data)
    .catch(err => err);
};

const deleteAll = cartId => {
  const params = {
    url: `${baseUrl}/cart/deleteAll`,
    method: 'DELETE',
    data: {
      cartId,
    },
  };

  return axios(params);
};

const addItem = (cartId, product) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/cart/addItem`,
      method: 'POST',
      data: {
        cartId,
        product,
      },
    };

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const changeItemQty = (cartId, itemId, itemSku, qty, productOption) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/cart/changeItemQty`,
      method: 'PUT',
      data: {
        cartId,
        itemId,
        itemSku,
        qty,
        productOption,
      },
    };

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const setCustomerPreferences = (cartId, preferences) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/cart/setCustomerPreferences`,
      method: 'PUT',
      data: {
        cartId,
        preferences,
      },
    };

    return axios(params)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => reject(e));
  });

const fetchShippingMethods = (cartId, subDistrictId) => {
  const params = {
    url: `${baseUrl}/cart/shippingMethods`,
    method: 'GET',
    params: {
      cartId,
      subDistrictId,
    },
  };
  return axios(params)
    .then(r => r.data)
    .catch(e => e);
};

const transferCart = ({
  cartId,
  storeCode,
  nextStoreCode,
  customerId,
  diffItems,
}) => {
  const params = {
    url: `${baseUrl}/cart/transfer`,
    method: 'POST',
    data: {
      cartId,
      storeCode,
      nextStoreCode,
      customerId,
      diffItems,
    },
  };

  return axios(params).then(r => r.data);
};

const putCoupon = (coupon, fetchCoupon) =>
  new Promise((resolve, reject) => {
    const headers = {
      'user-token': Cookie.get('user_token'),
    };

    const params = {
      url: `${baseUrl}/cart/putCoupon`,
      method: 'PUT',
      headers: headers,
      data: {
        coupon,
        fetchCoupon,
      },
    };

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const deleteCoupon = (coupon, fetchCoupon) =>
  new Promise((resolve, reject) => {
    const headers = {
      'user-token': Cookie.get('user_token'),
    };

    const params = {
      url: `${baseUrl}/cart/deleteCoupon`,
      method: 'DELETE',
      headers: headers,
      data: {
        coupon,
        fetchCoupon,
      },
    };

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const cartValify = cartId => {
  const params = {
    url: `${baseUrl}/cart/valify`,
    method: 'POST',
    data: {
      cartId,
    },
  };

  return axios(params)
    .then(res => res.data)
    .catch(err => err);
};

const updateDiffCartProduct = ({ diffItems, cartId, storeCode }) => {
  const params = {
    method: 'POST',
    url: `${baseUrl}/cart/updateDiffCartProduct`,
    data: {
      diffItems,
      cartId,
      storeCode,
    },
  };

  return axios(params)
    .then(res => res.data)
    .catch(err => err);
};

export default {
  create,
  get,
  addItem,
  deleteItem,
  deleteItemBundle,
  deleteAll,
  changeItemQty,
  setCustomerPreferences,
  fetchShippingMethods,
  transferCart,
  putCoupon,
  deleteCoupon,
  cartValify,
  deleteCart,
  getTotals,
  updateDiffCartProduct,
};
