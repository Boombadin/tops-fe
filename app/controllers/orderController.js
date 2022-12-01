import OrderService from '../services/orderService';
import { get as prop } from 'lodash';
import MAQB, { fieldConditions as Conditions } from '../../client/utils/maqb';
import CustomerService from '../services/customerService';

const get = async (req, res) => {
  try {
    const storeCode = req.headers['x-store-code'] || '';
    const userToken = req.cookies.user_token;

    if (!userToken) throw new Error('no permission');

    const orderId = req.params.id;

    // PENTEST - fetch customer to check order detail is valid by customer token
    const customer = await CustomerService.get(userToken, storeCode);
    const order = await OrderService.get(storeCode, orderId);

    if (order.customer_id !== customer.id) throw new Error('no permission');

    return res.json({ order });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ order: [] });
  }
};

const getOneByIncrementId = async (req, res) => {
  try {
    const store = req.headers['x-store-code'] || '';
    const incrementId = req.params.increment_id;
    const order = await OrderService.getOneByIncrementId(incrementId, store);

    return res.json({ order });
  } catch (e) {
    return res.json({ orders: [] });
  }
};

const getAll = async (req, res) => {
  try {
    const store = req.headers['x-store-code'] || '';
    const userToken = req.cookies.user_token;
    const { pageNumber } = req.params;
    const pageSize = 10;
    const page = pageNumber || 1;

    if (!userToken) throw new Error('no permission');

    // PENTEST - fetch customer to check order list is valid by customer token
    const customer = await CustomerService.get(userToken, store);

    const queryBuilder = new MAQB();
    const query = queryBuilder
      .field('customer_id', customer.id, Conditions.EQUAL)
      .size(pageSize)
      .page(page)
      .sort('entity_id', 'DESC')
      .build();

    const orders = await OrderService.getAll(store, query);
    return res.json({ orders });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json({ orders: [] });
  }
};

export default {
  get,
  getAll,
  getOneByIncrementId,
};
