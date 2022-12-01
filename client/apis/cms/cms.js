import axios from 'axios';
import { baseUrl } from '../config';

const search = query => new Promise((resolve, reject) => {
  axios(`${baseUrl}/cms/search/${query}`)
    .then((response) => {
      resolve(response.data);
    })
    .catch((e) => {
      reject(e);
    });
});

const getByUrlKey = (urlKey, storeId) =>
  axios(`${baseUrl}/cms/search/?field=identifier,${urlKey},eq&field=store_id,${storeId},eq`)
    .then(r => r.data)

export default {
  search,
  getByUrlKey
};
