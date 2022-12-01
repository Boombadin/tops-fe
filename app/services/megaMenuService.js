import axios from 'axios';
import config from '../config';
import MAQB from '../../client/utils/maqb';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const get = (storeId = '') => {
  const queryBuilder = new MAQB();
  const query = queryBuilder
    .field('store_id', storeId, 'in')
    .field('status', 1, 'eq')
    .sort('sort_order', 'ASC')
    .build();

  const params = {
    url: `${magentoApiUrl}/V1/mega-menu/search/?${query}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      return null;
    });
};

export default {
  get,
};
