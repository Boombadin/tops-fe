import axios from 'axios';
import config from '../config';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const get = (query, store) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/category/flat?${query}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      return null;
    });
};

const fetchOneByUrlkey = (query, store) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/category/flat?${query}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return null;
    });
};

const fetchOne = (store, id) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/categories/${id}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return null;
    });
};

const fetchProducts = (store, id) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/categories/${id}/products`,
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

export default {
  get,
  fetchOne,
  fetchProducts,
  fetchOneByUrlkey,
};
