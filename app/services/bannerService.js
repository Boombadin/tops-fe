import axios from 'axios';
import config from '../config';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const fetch = (store, query) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/banners?${query}`,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
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
  fetch,
};
