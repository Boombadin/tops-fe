import { map, get as prop } from 'lodash';
import Exploder from '../../client/utils/mcaex';
import CustomerService from '../services/customerService';
import WishlistService from '../services/wishlistService';
import ProductService from '../services/productService';

const get = async (req, res) => {
  const userToken = req.cookies['user_token'];
  const storeCode = req.headers['x-store-code'];

  try {
    const customer = await CustomerService.get(userToken, storeCode);
    const wishlist = await WishlistService.get({
      storeCode,
      customerId: customer.id,
      userToken,
    });

    return res.json(wishlist);
  } catch (e) {
    return res.json({ wishlist: [] });
  }
};

const getProducts = async (req, res) => {
  try {
    const userToken = req.cookies['user_token'];
    const storeCode = req.headers['x-store-code'];
    const customer = await CustomerService.get(userToken, storeCode);
    const wishlist = await WishlistService.get({
      storeCode,
      customerId: customer.id,
      userToken,
    });
    const productIds = prop(wishlist, 'items', []).map(item => item.product_id);
    const response = await ProductService.getByIds({
      storeCode,
      ids: productIds,
      ...req.query,
    });

    return res.json({
      products: {
        ...response,
        items: map(response.items, p => Exploder.explode(p)),
      },
    });
  } catch (e) {
    return res.json({
      products: {
        items: [],
      },
    });
  }
};

const addItem = async (req, res) => {
  const userToken = req.cookies['user_token'];
  const storeCode = req.headers['x-store-code'];
  const { storeId, item } = req.body;
  try {
    const customer = await CustomerService.get(userToken, storeCode);
    const wishlist = await WishlistService.addItem({
      item,
      customerId: customer.id,
      storeId,
      storeCode,
      userToken,
    });
    return res.json(wishlist);
  } catch (e) {
    return res.json({ err: e });
  }
};

const removeItem = async (req, res) => {
  const userToken = req.cookies['user_token'];
  const storeCode = req.headers['x-store-code'];
  const { itemProductId } = req.params;

  try {
    const customer = await CustomerService.get(userToken, storeCode);
    const wishlist = await WishlistService.removeItem({
      storeCode,
      customerId: customer.id,
      userToken,
      productId: itemProductId,
    });
    return res.json(wishlist);
  } catch (e) {
    return res.json({ message: e });
  }
};

export default {
  get,
  addItem,
  removeItem,
  getProducts,
};
