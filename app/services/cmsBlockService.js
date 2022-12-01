import axios from 'axios';
import config from '../config';

const baseUrl = config.magento_api_base_url;
const { headers } = config;

const get = (store, filters) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/${store}/V1/cmsBlock/search?${filters}`,
      method: 'GET',
      headers,
    };

    axios(params)
      .then(response => resolve(response.data.items))
      .catch(e => reject(e));
  });

export default {
  get,
};
