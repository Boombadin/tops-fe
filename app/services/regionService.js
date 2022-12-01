import axios from 'axios';
import config from '../config';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const fetchProvince = (store, delivery = true) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1${
      delivery ? '/delivery' : ''
    }/region/province`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const fetchDistrict = (store, regionId, delivery = true) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1${
      delivery ? '/delivery' : ''
    }/region/province/${regionId}/district`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const fetchSubDistrict = (store, regionId, districtId, delivery = true) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1${
      delivery ? '/delivery' : ''
    }/region/province/${regionId}/district/${districtId}/subdistrict`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

const fetchRegionByPostcode = (store, postcode, delivery) => {
  const params = {
    url: `${magentoApiUrl}/${store}/V1/region/postcode/${postcode}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      throw e;
    });
};

export default {
  fetchProvince,
  fetchDistrict,
  fetchSubDistrict,
  fetchRegionByPostcode,
};
