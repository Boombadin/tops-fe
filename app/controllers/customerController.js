import { get as prop } from 'lodash';
import CustomerService from '../services/customerService';
import { log } from '../utils/logger';

const getData = async (req, res) => {
  try {
    const userToken = req.headers['user-token'];
    const storeCode = req.headers['x-store-code'];

    if (!userToken || userToken === 'undefined') {
      throw new Error('no user token');
    }

    const customer = await CustomerService.get(userToken, storeCode);
    return res.json({ customer });
  } catch (e) {
    // console.error(e)
    return res.json({ customer: [] });
  }
};

const update = async (req, res) => {
  try {
    const { newCustomer } = req.body;
    const userToken = req.cookies.user_token;
    const storeCode = req.headers['x-store-code'];

    if (!userToken) throw new Error('no permission');

    const customer = await CustomerService.get(userToken, storeCode);

    delete newCustomer.email;

    const newData = {
      ...customer,
      ...newCustomer,
      custom_attributes: [
        ...customer.custom_attributes,
        ...newCustomer.custom_attributes,
      ],
    };

    const response = await CustomerService.update(
      newData,
      storeCode,
      userToken,
    );

    log('customer', 'update', req, response);

    return res.json({ customer: response });
  } catch (e) {
    if (e.response) {
      log('customer', 'update', req, e.response.data, false);
    } else if (e.message) {
      log('customer', 'update', req, e.message, false);
    }

    return res.json({ customer: [] });
  }
};

const createAddress = async (req, res) => {
  try {
    const { address } = req.body;
    // PENTEST - Valify customer permission before create address.
    const userToken = req.cookies.user_token;
    if (!userToken) {
      throw new Error('no permission');
    }
    const storeCode = req.headers['x-store-code'];
    const customer = await CustomerService.get(userToken, storeCode);
    address.customer_id = customer.id;

    const response = await CustomerService.createAddress(address);

    log('customer', 'create address', req, response);

    return res.json({ address: response });
  } catch (e) {
    const errorMessage = e.response
      ? prop(e, 'response.data.message')
      : e.message;
    log('customer', 'create address', req, errorMessage, false);
    return res.json({ address: [], message: errorMessage });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;

    // PENTEST - Valify customer permission before update address.
    const userToken = req.cookies.user_token;
    if (!userToken) {
      throw new Error('no permission');
    }

    const storeCode = req.headers['x-store-code'];
    const customer = await CustomerService.get(userToken, storeCode);
    address.customer_id = customer.id;

    const isAddressAvailableForCustomer =
      customer &&
      customer.addresses &&
      customer.addresses.find(
        customerAddress => +customerAddress.id === +address.id,
      );
    if (!isAddressAvailableForCustomer) {
      throw new Error(
        'no permission, this address is not belong to this account',
      );
    }

    const response = await CustomerService.updateAddress(address);

    log('customer', 'update address', req, response);

    return res.json({ address: response });
  } catch (e) {
    const errorMessage = e.response
      ? prop(e, 'response.data.message')
      : e.message;
    log('customer', 'update address', req, errorMessage, false);
    return res.json({ address: [], message: errorMessage });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    // PENTEST - Valify customer permission before delete address.
    const userToken = req.cookies.user_token;
    if (!userToken) {
      throw new Error('no permission');
    }

    const storeCode = req.headers['x-store-code'];
    const customer = await CustomerService.get(userToken, storeCode);
    const isAddressAvailableForCustomer =
      customer &&
      customer.addresses &&
      customer.addresses.find(
        customerAddress => +customerAddress.id === +addressId,
      );
    if (!isAddressAvailableForCustomer) {
      throw new Error(
        'no permission, this address is not belong to this account',
      );
    }

    const response = await CustomerService.deleteAddress(addressId);
    log('customer', 'delete address', req, response);

    return res.json({ address: response });
  } catch (e) {
    const errorMessage = e.response
      ? prop(e, 'response.data.message')
      : e.message;
    log('customer', 'delete address', req, errorMessage, false);
    return res.json({ address: [], message: errorMessage });
  }
};

const fetchCustomerGroup = async (req, res) => {
  try {
    const customerId = req.body.customer_id;
    const t1cNo = req.body.t1c_no;
    const customer = await CustomerService.getUserGroupConfig(
      customerId,
      t1cNo,
    );

    return res.json({
      recommend_product: prop(customer, 'recommend_product', ''),
    });
  } catch (e) {
    return res.json({
      recommend_product: '',
      status: 'error',
      message: `can't get customer group configs.`,
    });
  }
};

const getShippingInfo = async (req, res) => {
  try {
    const userToken = req.headers['user-token'];

    if (!userToken || userToken === 'undefined') {
      throw new Error('no user token');
    }

    const customer = await CustomerService.getShippingInfo(userToken);
    return res.json({ ...customer });
  } catch (e) {
    // console.error(e)
    return res.json({ customer: [] });
  }
};

const updateShippingInfo = async (req, res) => {
  try {
    const userToken = req.headers['user-token'];
    const { shippingInfo } = req.body;
    const response = await CustomerService.updateShippingInfo(
      shippingInfo,
      userToken,
    );
    log('customer', 'update shipping info', req, response);

    return res.json({ shippingInfo: response });
  } catch (e) {
    if (e.response) {
      log('customer', 'update shippingInfo', req, e.response.data, false);
    } else if (e.message) {
      log('customer', 'update shippingInfo', req, e.message, false);
    }

    return res.json({ shippingInfo: [] });
  }
};
export default {
  getData,
  update,
  createAddress,
  updateAddress,
  deleteAddress,
  fetchCustomerGroup,
  getShippingInfo,
  updateShippingInfo,
};
