import axios from 'axios';
import { baseUrl } from '../config';

const getOne = (store, id) =>
  new Promise((resolve, reject) => {
    const headers = {
      'x-store-code': store,
    };
    axios(`${baseUrl}/order/${id}`, { headers: headers })
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getAll = (store, customerId, pageNumber) =>
  new Promise((resolve, reject) => {
    const headers = {
      'x-store-code': store,
    };

    axios(`${baseUrl}/orders/${customerId}/${pageNumber}`, { headers })
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getOneByIncrementId = slug =>
  new Promise((resolve, reject) => {
    // const headers = {
    //   'x-store-code': store,
    // };
    axios(`${baseUrl}/order/incrementId/${slug}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });
export default {
  getOne,
  getAll,
  getOneByIncrementId,
};
