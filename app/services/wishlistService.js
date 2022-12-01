import axios from 'axios';
import { map, pick, isEmpty, get as prop } from 'lodash';
import config from '../config';

const magentoApiUrl = config.magento_api_base_url;
const { headers } = config;

const get = async ({ storeCode, customerId }) => {
  const byCustomerIdParams = {
    url: `${magentoApiUrl}/${storeCode}/V1/wishlists?searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][value]=${customerId}`,
    headers,
  };

  const { data } = await axios(byCustomerIdParams);
  const wishlist = data.items[0];

  if (!wishlist) {
    return null;
  }

  const getByIdParams = {
    url: `${magentoApiUrl}/${storeCode}/V1/wishlist/${wishlist.wishlist_id}`,
    headers,
  };

  return axios(getByIdParams)
    .then(r => r.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      throw e;
    });
};

const addItem = async ({ item, customerId, storeId, storeCode, userToken }) => {
  const itemPayload = {
    product_id: item.productId,
    store_id: storeId,
    description: item.description || '',
    qty: item.quantity || 1,
  };

  try {
    const wishlist = await get({ storeCode, customerId, userToken });

    if (isEmpty(wishlist)) {
      return createWishlist(storeCode, customerId, itemPayload);
    }

    const addItemParams = {
      url: `${magentoApiUrl}/${storeCode}/V1/wishlist/${wishlist.wishlist_id}`,
      method: 'POST',
      headers,
      data: {
        wishlistData: {
          customer_id: customerId,
          items: [
            ...map(wishlist.items, itm =>
              pick(itm, ['product_id', 'store_id', 'description', 'qty']),
            ),
            itemPayload,
          ],
        },
      },
    };

    return axios(addItemParams)
      .then(r => r.data)
      .catch(e => {
        console.error(prop(e, 'message', ''));
        throw e;
      });
  } catch (e) {
    return null;
  }
};

const createWishlist = (storeCode, customerId, itemPayload) => {
  const createWishlistParams = {
    url: `${magentoApiUrl}/${storeCode}/V1/wishlist`,
    method: 'PUT',
    headers,
    data: {
      wishlistData: {
        name: 'default',
        customer_id: customerId,
        items: [itemPayload],
      },
    },
  };

  return axios(createWishlistParams)
    .then(r => r.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      throw e;
    });
};

const removeItem = async ({ storeCode, customerId, userToken, productId }) => {
  const wishlist = await get({ storeCode, customerId, userToken });
  const itemId = wishlist.items.find(
    item => Number(item.product_id) === Number(productId),
  ).wishlist_item_id;

  const removeItemParams = {
    url: `${magentoApiUrl}/${storeCode}/V1/wishlist-item/${itemId}`,
    method: 'DELETE',
    headers,
  };

  return axios(removeItemParams)
    .then(r => r.data)
    .catch(e => {
      console.error(prop(e, 'message', ''));
      throw e;
    });
};

export default {
  get,
  addItem,
  createWishlist,
  removeItem,
};
