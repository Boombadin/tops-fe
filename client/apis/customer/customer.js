import axios from 'axios';
import { baseUrl } from '../config';

const get = userToken =>
  new Promise((resolve, reject) => {
    const headers = {
      'user-token': userToken,
    };
    const url = `${baseUrl}/customer`;
    axios(url, { headers: headers })
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const update = customer =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/customer/update`,
      method: 'PUT',
      data: {
        newCustomer: customer,
      },
    };
    return axios(params)
      .then(res => resolve(res))
      .catch(e => {
        reject(e);
      });
  });

const createAddress = address =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/customer/addAddress`,
      method: 'POST',
      data: {
        address,
      },
    };
    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const updateAddress = address =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/customer/updateAddress`,
      method: 'PUT',
      data: {
        address,
      },
    };

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const deleteAddress = addressId =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/customer/deleteAddress`,
      method: 'DELETE',
      data: {
        addressId,
      },
    };

    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

const customerGroup = (customerId, t1cNo) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${baseUrl}/customer/group`,
      method: 'GET',
      data: {
        customer_id: customerId,
        t1c_no: parseInt(t1cNo),
      },
    };

    return axios(params)
      .then(res => resolve(res.data))
      .catch(e => reject(e));
  });

const getShippingInfo = userToken =>
  new Promise((resolve, reject) => {
    const headers = {
      'user-token': userToken,
    };
    const url = `${baseUrl}/customer/shippingInfo`;
    axios(url, { headers: headers })
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        reject(e);
      });
  });

const updateShippingInfo = (shippingInfo, userToken) =>
  new Promise((resolve, reject) => {
    const headers = {
      'user-token': userToken,
    };
    const params = {
      url: `${baseUrl}/customer/updateShippingInfo`,
      method: 'PUT',
      data: {
        shippingInfo,
      },
      headers: headers,
    };
    return axios(params)
      .then(res => resolve(res))
      .catch(e => reject(e));
  });

export default {
  get,
  update,
  createAddress,
  updateAddress,
  deleteAddress,
  customerGroup,
  getShippingInfo,
  updateShippingInfo,
};
