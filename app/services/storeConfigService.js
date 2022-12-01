import axios from 'axios';
import config from '../config';
import customerService from './customerService';
import { get as prop, filter, startsWith } from 'lodash';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const get = subDistrictId => {
  const params = {
    url: `${magentoApiUrl}/V1/store/storeConfigs/subDistrict/${subDistrictId}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      throw e;
    });
};

const getDefaultConfig = userToken => {
  return new Promise(async (resolve, reject) => {
    const shippingInfo = userToken
      ? await customerService.getShippingInfo(userToken)
      : null;
    const storeCode = prop(shippingInfo, 'current_store');

    if (storeCode) {
      const allConfig = await getAllConfig();
      const currentConfig = filter(allConfig, config =>
        startsWith(config.code, storeCode),
      );
      resolve(currentConfig);
    } else {
      const params = {
        url: `${magentoApiUrl}/V2/store/storeConfigs/default`,
        method: 'GET',
        headers,
      };
      axios(params)
        .then(response => resolve(response.data))
        .catch(e => {
          console.error(prop(e, 'message', ''));
          throw e;
        });
    }
  });
};

const getBySellerCode = storeCode => {
  const params = {
    url: `${magentoApiUrl}/V1/store/storeConfigs?storeCodes[]=${storeCode}`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      throw e;
    });
};

const getAllConfig = () => {
  const params = {
    url: `${magentoApiUrl}/V1/store/storeConfigs`,
    method: 'GET',
    headers,
  };

  return axios(params)
    .then(response => response.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      throw e;
    });
};

export default {
  get,
  getDefaultConfig,
  getBySellerCode,
  getAllConfig,
};
