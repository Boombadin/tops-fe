import axios from 'axios';
import { baseUrl } from '../config';

const getAll = () =>
  new Promise((resolve, reject) => {
    axios(`${baseUrl}/categories`)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getCategories = () => axios(`${baseUrl}/categories`);

const getOne = slug => {
  return axios(`${baseUrl}/categories/${slug}`)
    .then(response => response.data)
    .catch(e => {
      return {};
    });
};

const getProducts = id =>
  new Promise((resolve, reject) => {
    axios(`${baseUrl}/categories/${id}/products`)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const getProductSets = search =>
  new Promise((resolve, reject) => {
    axios(`${baseUrl}/categories/productSets?subcategoryId=${search}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

export default {
  getAll,
  getCategories,
  getOne,
  getProducts,
  getProductSets,
};
