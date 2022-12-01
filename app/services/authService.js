import axios from 'axios';
import config from '../config';
import { get as prop } from 'lodash';
import { isUndefined } from 'util';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const getToken = token =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/V1/tops/integration/customer/token`,
      method: 'POST',
      headers,
      data: {
        tempToken: token,
      },
    };

    axios(params)
      .then(response => {
        const resp = response.data;
        resolve(resp);
      })
      .catch(e => {
        reject(e);
      });
  });

const register = async (store, customer, subscribe) => {
  try {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/customers`,
      method: 'POST',
      data: personalToMagentoCustomer(customer, subscribe),
      headers,
    };
    return axios(params)
      .then(response => response.data)
      .catch(e => {
        throw e.response.data;
      });
  } catch (e) {
    // return res.status(500).json(e); // res is undefined anyway
    throw new Error(e);
  }
};

const login = async (store, username, password) => {
  try {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/integration/customer/token`,
      method: 'POST',
      data: {
        username: username,
        password: password,
      },
    };

    return axios(params)
      .then(response => response.data)
      .catch(e => {
        throw e.response.data;
      });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const isEmailAvailable = async (store, email) => {
  try {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/customers/isEmailAvailable`,
      method: 'POST',
      data: { customerEmail: email },
    };

    return axios(params)
      .then(response => response.data)
      .catch(e => {
        throw e.response.data;
      });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const personalToMagentoCustomer = (personalModel, subscribe) => {
  const address_custom_attributes = [];
  const customer_custom_attributes = [];

  // address custom attributes
  address_custom_attributes.push({
    attribute_code: 'customer_address_type',
    value: 'shipping',
    name: 'customer_address_type',
  });

  if (!isUndefined(personalModel.house_no)) {
    address_custom_attributes.push({
      attribute_code: 'house_no',
      value: personalModel.house_no,
      name: 'house_no',
    });
  }
  if (!isUndefined(personalModel.village)) {
    address_custom_attributes.push({
      attribute_code: 'village_name',
      value: personalModel.village,
      name: 'village_name',
    });
  }
  if (!isUndefined(personalModel.moo)) {
    address_custom_attributes.push({
      attribute_code: 'moo',
      value: personalModel.moo,
      name: 'moo',
    });
  }
  if (!isUndefined(personalModel.soi)) {
    address_custom_attributes.push({
      attribute_code: 'soi',
      value: personalModel.soi,
      name: 'soi',
    });
  }
  if (!isUndefined(personalModel.road)) {
    address_custom_attributes.push({
      attribute_code: 'road',
      value: personalModel.road,
      name: 'road',
    });
  }
  if (!isUndefined(personalModel.district_id)) {
    address_custom_attributes.push({
      attribute_code: 'district_id',
      value: personalModel.district_id,
      name: 'district_id',
    });
  }
  if (!isUndefined(personalModel.sub_district_id)) {
    address_custom_attributes.push({
      attribute_code: 'subdistrict_id',
      value: personalModel.sub_district_id,
      name: 'subdistrict_id',
    });
  }
  if (!isUndefined(personalModel.building_type)) {
    address_custom_attributes.push({
      attribute_code: 'building_type',
      value: personalModel.building_type,
      name: 'building_type',
    });
  }
  if (!isUndefined(personalModel.remark)) {
    address_custom_attributes.push({
      attribute_code: 'remark',
      value: personalModel.remark,
      name: 'remark',
    });
  }

  // customer custom attributes
  if (!isUndefined(personalModel.mobile)) {
    customer_custom_attributes.push({
      attribute_code: 'mobile_phone',
      name: 'mobile_phone',
      value: personalModel.mobile,
    });
  }
  if (!isUndefined(personalModel.t1c_card)) {
    customer_custom_attributes.push({
      attribute_code: 't1c_card',
      value: personalModel.t1c_card,
      name: 't1c_card',
    });
  }
  if (!isUndefined(personalModel.t1c_phone)) {
    customer_custom_attributes.push({
      attribute_code: 't1c_phone',
      value: personalModel.t1c_phone,
      name: 't1c_phone',
    });
  }

  let dateOfBirthday;

  if (
    !isUndefined(personalModel.year) &&
    !isUndefined(personalModel.month) &&
    !isUndefined(personalModel.date)
  ) {
    dateOfBirthday = `${personalModel.year}-${personalModel.month}-${personalModel.date}`;
  }

  return {
    customer: {
      group_id: 1,
      email: personalModel.email,
      firstname: '',
      lastname: '',
      extension_attributes: {
        is_subscribed: false,
      },
      custom_attributes: customer_custom_attributes,
      addresses: [],
    },
    password: personalModel.password,
  };
};

const forgotPassword = (store, email) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V1/customers/password`,
      headers,
      method: 'PUT',
      data: {
        email: email,
        template: 'email_reset',
        websiteId: 0,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        // console.error(e);
        reject(e);
      });
  });

const resetPassword = (store, token, email, password) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/${store}/V2/customers/resetPassword`,
      headers,
      method: 'POST',
      data: {
        email: email,
        resetToken: token,
        newPassword: password,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        console.error(prop(e, 'message', ''));
        reject(e);
      });
  });

const socialLogin = (token, provider) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${magentoApiUrl}/V2/integration/customer/social_token`,
      headers,
      method: 'POST',
      data: {
        token: token,
        provider: provider,
      },
    };

    axios(params)
      .then(response => {
        resolve(response.data);
      })
      .catch(e => {
        console.error(prop(e, 'message', ''));
        reject(e);
      });
  });

export default {
  isEmailAvailable,
  register,
  login,
  forgotPassword,
  resetPassword,
  getToken,
  socialLogin,
};
