import axios from 'axios';
import { baseUrl } from '../config';

const get = (subDistrictId, userToken) => {
  const url = `${baseUrl}/store/config`;
  const params = {
    sub_district_id: subDistrictId,
    user_token: userToken,
  };

  return axios
    .get(url, { params: params })
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const getBySellerCode = sellerCode => {
  const url = `${baseUrl}/store/config/seller`;
  const params = {
    sellerCode,
  };

  return axios
    .get(url, { params: params })
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const getDefaultConfig = userToken => {
  const url = `${baseUrl}/store/config/default`;
  const params = {
    user_token: userToken,
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
  getDefaultConfig,
  getBySellerCode,
};
