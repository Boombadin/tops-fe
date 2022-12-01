import axios from 'axios';
import { baseUrl } from '../config';

const get = storeId => {
  const url = `${baseUrl}/mega-menu/search`;
  const params = {
    store_id: storeId,
  };

  return axios
    .get(url, { params: params })
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

export default {
  get,
};
