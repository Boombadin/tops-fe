import axios from 'axios';
import { get as prop } from 'lodash';
import config from '../config';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const search = (store, query) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/cmsPage/search?${query}`,
      method: 'GET',
      headers,
    };

    axios(params)
      .then(response => {
        const products = response.data.items;
        resolve(products);
      })
      .catch(e => {
        console.error(prop(e, 'message', ''));
        reject(e);
      });
  });

export default {
  search,
};
