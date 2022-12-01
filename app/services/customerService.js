import axios from 'axios';
import { get as prop } from 'lodash';
import config from '../config';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const dataTeamApiUrl = config.data_team_api_base_url;
const tokenDataTeam = config.data_team_api_token;

const get = (token, store) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/customers/me`,
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(params)
    .then(r => r.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      return e;
    });
};

const getBilling = token => {
  const params = {
    url: `${magentoApiUrl}/V1/customers/me/billingAddress`,
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(params).then(r => r.data);
};

const getStoreCard = token => {
  const params = {
    url: `${magentoApiUrl}/V1/customers/me/p2c2p/token`,
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(params).then(r => r.data);
};

const update = (customer, store, token) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/customers/me`,
      method: 'PUT',
      data: {
        customer,
      },
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };

    axios(params)
      .then(response => resolve(response.data))
      .catch(e => reject(e));
  });

const createAddress = address =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/V1/customers/addresses`,
      method: 'POST',
      data: {
        address,
      },
      headers,
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const updateAddress = address =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/V1/customers/addresses/${address.id}`,
      method: 'PUT',
      data: {
        address,
      },
      headers,
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const deleteAddress = addressId =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/V1/addresses/${addressId}`,
      method: 'DELETE',
      headers,
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getUserGroupConfig = (customerId, t1cNo) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${dataTeamApiUrl}/getusergroup?user_id=${customerId}&t1_id=${t1cNo}`,
      method: 'GET',
      headers: {
        'x-api-key': tokenDataTeam,
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

const getShippingInfo = token => {
  const params = {
    url: `${magentoApiUrl}/V1/customers/me/shipping-info`,
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };

  return axios(params)
    .then(r => r.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      return e;
    });
};

const updateShippingInfo = (shippingInfo, token) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/V1/customers/me/shipping-info`,
      method: 'PUT',
      data: {
        ...shippingInfo,
      },
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
  getBilling,
  getStoreCard,
  update,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserGroupConfig,
  getShippingInfo,
  updateShippingInfo,
};
