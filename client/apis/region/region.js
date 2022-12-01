import axios from 'axios';
import { baseUrl } from '../config';

const getProvince = (store, delivery) => {
  const headers = {
    'x-store-code': store,
  };

  const params = {
    delivery,
  };

  return axios({
    url: `${baseUrl}/region/province`,
    params: params,
    headers: headers,
  })
    .then(response => {
      return response.data;
    })
    .catch(e => {
      throw e;
    });
};

const getDistrict = (store, regionId, delivery) => {
  const headers = {
    'x-store-code': store,
  };

  const params = {
    region_id: regionId,
    delivery,
  };

  return axios({
    url: `${baseUrl}/region/district`,
    params: params,
    headers: headers,
  })
    .then(response => {
      return response.data;
    })
    .catch(e => {
      throw e;
    });
};

const getSubDistrict = (store, regionId, districtId, delivery) => {
  const headers = {
    'x-store-code': store,
  };

  const params = {
    region_id: regionId,
    district_id: districtId,
    delivery,
  };

  return axios(`${baseUrl}/region/subdistrict`, {
    params: params,
    headers: headers,
  })
    .then(response => {
      return response.data;
    })
    .catch(e => {
      throw e;
    });
};

const getRegionByPostcode = (store, postcode, delivery) => {
  const headers = {
    'x-store-code': store,
  };

  const params = {
    postcode: postcode,
    delivery,
  };

  return axios(`${baseUrl}/region/postcode`, {
    params: params,
    headers: headers,
  })
    .then(response => {
      return response.data;
    })
    .catch(e => {
      throw e;
    });
};

export default {
  getProvince,
  getDistrict,
  getSubDistrict,
  getRegionByPostcode,
};
