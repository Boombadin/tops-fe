import axios from 'axios';
import Cookie from 'js-cookie';

import { baseUrl } from '../config';

const addDeliverySlot = async ({
  deliverySlot,
  deliveryMethod,
  defaultShipping,
}) => {
  const userToken = Cookie.get('user_token');

  const params = {
    url: `${baseUrl}/checkout/addDeliverySlot`,
    method: 'POST',
    headers: {
      'user-token': userToken,
    },
    data: {
      deliverySlot,
      deliveryMethod,
      defaultShipping,
    },
  };

  return axios(params);
};

const validateDeliverySlot = async cartId => {
  const params = {
    url: `${baseUrl}/checkout/validateDeliverySlot`,
    method: 'GET',
    params: {
      cartId: cartId,
    },
  };

  return axios(params);
};

const getStorLocator = () => {
  return axios({
    url: `${baseUrl}/checkout/storelocator`,
    method: 'GET',
  })
    .then(response => response.data)
    .catch(() => null);
};

const getStorPickUpSlot = (cartId, locatorId, method) => {
  const userToken = Cookie.get('user_token');
  const params = {
    url: `${baseUrl}/checkout/storePickUpSlot`,
    method: 'GET',
    headers: {
      userToken: userToken,
    },
    params: {
      cartId: cartId,
      retailerId: locatorId,
      setMethod: method,
    },
  };
  return axios(params)
    .then(response => response.data)
    .catch(() => null);
};

const getPayment = () => {
  const params = {
    url: `${baseUrl}/checkout/payment?dateFormat=${new Date().getTime()}`,
    method: 'GET',
    headers: {
      'cache-control': 'no-cache, no-store',
      pragma: 'no-cache',
    },
  };

  return axios(params)
    .then(response => response.data)
    .catch(() => null);
};

const createOrder = (
  store,
  userToken,
  method,
  billingAddress,
  shippingAddress,
  remark,
  substitution,
  cardIssuer,
  channel,
  pickupStore,
  customerId,
  isRequestTax,
) => {
  const headers = {
    'user-token': userToken,
  };
  const data = {
    store,
    paymentMethod: {
      method,
      extension_attributes: {
        card_issuer: cardIssuer === 't1' ? 't1' : '',
        channel: channel,
        request_tax_invoice: isRequestTax,
      },
    },
    billingAddress,
    shippingAddress,
    remark,
    substitution,
    pickupStore,
    customerId,
    isRequestTax,
  };
  const params = {
    url: `${baseUrl}/checkout/createOrder`,
    method: 'POST',
    headers,
    data,
  };
  return axios(params)
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const getStoreCard = userToken =>
  new Promise((resolve, reject) => {
    const headers = {
      'user-token': userToken,
    };
    const url = `${baseUrl}/checkout/storeCard`;
    axios(url, { headers: headers })
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const deleteStoreCard = p2c2pId => {
  const params = {
    url: `${baseUrl}/checkout/deleteStoreCard`,
    method: 'DELETE',
    data: {
      p2c2pId,
    },
  };

  return axios(params);
};

const getDeliverySlot = (cartId, shippingMethod, subDistrictId) => {
  const params = {
    url: `${baseUrl}/checkout/deliverySlot`,
    method: 'GET',
    params: {
      cartId,
      shippingMethod,
      subDistrictId,
    },
    headers: {
      'cache-control': 'no-cache, no-store',
      pragma: 'no-cache',
    },
  };

  return axios(params)
    .then(response => response.data)
    .catch(() => null);
};

const deleteDeliverySlot = cartId => {
  const params = {
    url: `${baseUrl}/checkout/deliverySlot`,
    method: 'DELETE',
    data: {
      cartId,
    },
  };

  return axios(params)
    .then(response => response.data)
    .catch(() => null);
};

export default {
  getPayment,
  getStoreCard,
  createOrder,
  addDeliverySlot,
  deleteStoreCard,
  validateDeliverySlot,
  getStorLocator,
  getStorPickUpSlot,
  getDeliverySlot,
  deleteDeliverySlot,
};
