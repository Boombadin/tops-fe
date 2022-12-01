import axios from 'axios';
import { get as prop } from 'lodash';
import config from '../config';

const magentoApiUrl = config.magento_api_base_url;
const magentoToken = config.magento_token;
const { headers } = config;

const setDeliverySlot = ({
  token,
  deliverySlot,
  address,
  billing,
  store,
  deliveryMethod,
}) => {
  let pickupStoreParams = {};
  if (prop(deliverySlot, 'pickup_store')) {
    pickupStoreParams = {
      pickup_store: {
        ...prop(deliverySlot, 'pickup_store'),
      },
    };
  }

  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/mine/shipping-information`,
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    data: {
      addressInformation: {
        shipping_address: {
          ...address,
          region: address.region.region,
        },
        billing_address: {
          ...billing,
          region: address.region.region,
        },
        shipping_carrier_code: deliveryMethod.carrierCode,
        shipping_method_code: deliveryMethod.methodCode,
        // is_usage_quota_available: deliverySlot.use_quota_available,
        extension_attributes: {
          ...pickupStoreParams,
          shipping_date: deliverySlot.shipping_date,
          shipping_slot_id: deliverySlot.shipping_slot_id,
          is_usage_quota_available: deliverySlot.use_quota_available,
        },
      },
    },
  };
  return axios(params).then(response => response.data);
};

const validateDeliverySlot = ({ store, cartId }) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/${cartId}/shipping-slot/validate`,
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${magentoToken}`,
    },
  };

  return axios(params).then(response => response.data);
};

const fethStoreLocator = store => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/storelocator?searchCriteria[filter_groups][0][filters][0][field]=is_active&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`,
    method: 'GET',
    header: headers,
  };

  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return null;
    });
};

const fethStorePickUpSlot = (store, cartId, retailerId, shippingMethod) => {
  const curHeaders = Object.assign({}, headers, {
    Authorization: `Bearer ${magentoToken}`,
  });

  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/${cartId}/pickup-slots/${shippingMethod}/store/${retailerId}`,
    method: 'GET',
    headers: curHeaders,
  };
  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return null;
    });
};

const fetchPayment = (token, store) => {
  const curHeaders = Object.assign({}, headers, {
    Authorization: `Bearer ${token}`,
  });

  let url = '';
  if (token) {
    url = `${magentoApiUrl}/${store}/V1/carts/mine/payment-information`;
  } else {
    url = `${magentoApiUrl}/V1/guest-carts/:cartId/payment-information`;
  }

  const params = {
    url: url,
    method: 'GET',
    headers: curHeaders,
  };

  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return null;
    });
};

const createOrder = (
  store,
  token,
  paymentMethod,
  billingAddress,
  remark,
  isRemark,
  substitution,
) =>
  new Promise((resolve, reject) => {
    const curHeaders = Object.assign({}, headers, {
      Authorization: `Bearer ${token}`,
    });
    const params = {
      url: `${magentoApiUrl}/${store}/V1/carts/mine/payment-information`,
      method: 'POST',
      headers: curHeaders,
      data: {
        paymentMethod: {
          ...paymentMethod,
        },
        billingAddress: {
          ...billingAddress,
        },
        remark: remark,
        save_remark: isRemark,
        substitution: substitution,
      },
    };

    axios(params)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });

const deleteStoreCard = (p2c2pId, store) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/customers/me/p2c2p/token/${p2c2pId}`,
      method: 'DELETE',
      headers,
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

const getDeliverySlot = (store, cartId, shippingMethod, subDistrictId) => {
  const curHeaders = Object.assign({}, headers, {
    Authorization: `Bearer ${magentoToken}`,
  });

  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/${cartId}/delivery-slots/${shippingMethod}/area/${subDistrictId}`,
    method: 'GET',
    headers: curHeaders,
  };

  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return e;
    });
};

const deleteDeliverySlot = (store, cartId) => {
  const curHeaders = Object.assign({}, headers, {
    Authorization: `Bearer ${magentoToken}`,
  });

  const params = {
    url: `${magentoApiUrl}/${store}/V1/carts/${cartId}/shipping-slot`,
    method: 'DELETE',
    headers: curHeaders,
  };

  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return null;
    });
};

export default {
  setDeliverySlot,
  fetchPayment,
  createOrder,
  deleteStoreCard,
  validateDeliverySlot,
  fethStoreLocator,
  fethStorePickUpSlot,
  getDeliverySlot,
  deleteDeliverySlot,
};
