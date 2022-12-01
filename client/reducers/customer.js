import {
  map,
  reduce,
  find,
  assign,
  isEmpty,
  cloneDeep,
  get as prop,
  replace,
  remove,
  omit,
} from 'lodash';
import Exploder from '../utils/mcaex';
import Cookie from 'js-cookie';
import { createCustomAttributes } from '../utils/api';
import CustomerApi from '../apis/customer';
import { fetchCart } from './cart';
import { onBoardingCartClose } from './layout';

const magentoRequiredFields = [
  'telephone',
  'house_no',
  'street',
  // 'city',
  'firstname',
  'lastname',
  'company',
];

const addressCustomAttributes = [
  'district_id',
  'district',
  'subdistrict_id',
  'subdistrict',
  'house_no',
  'road',
  'address_name',
  'building_type',
  'soi',
  'moo',
  'village_name',
  'remark',
  'customer_address_type',
  'vat_id',
  'address',
  'current_store',
  'shipping_method',
  'location_id',
  // 'street',
  // 'city',
];

export const TYPES = {
  FETCH_CUSTOMER: 'FETCH_CUSTOMER',
  FETCH_CUSTOMER_COMPLETED: 'FETCH_CUSTOMER_COMPLETED',
  FETCH_CUSTOMER_FAILED: 'FETCH_CUSTOMER_FAILED',
  SHOW_DELIVERY_TOOL_BAR: 'SHOW_DELIVERY_TOOL_BAR',
  SHOW_DELIVERY_TOOL_BAR_MODAL: 'SHOW_DELIVERY_TOOL_BAR_MODAL',
  CLOSE_DELIVERY_TOOL_BAR: 'CLOSE_DELIVERY_TOOL_BAR',
  FETCH_CURRENT_SHIPPING_COMPLETED: 'FETCH_CURRENT_SHIPPING_COMPLETED',
  FETCH_SHIPPING_INFO_COMPLETED: 'FETCH_SHIPPING_INFO_COMPLETED',
  CLEAR_CURRENT_SHIPPING_ADDRESS: 'CLEAR_CURRENT_SHIPPING_ADDRESS',
};

export const setAddressDefault = (
  address,
  type = 'shipping',
  shippingMethod = 'delivery',
  storeCode,
) => {
  return async (dispatch, getState) => {
    const customer = getState().customer.items;
    const userToken = Cookie.get('user_token');
    const response = {};

    if (
      !isEmpty(storeCode) &&
      (type === 'shipping' ||
        prop(customer, 'customer_address_type') === 'shipping')
    ) {
      const { current } = getState().storeConfig;
      const shippingInfo = {
        customerInfo: {
          current_store: replace(
            storeCode || prop(current, 'code'),
            /_en|_th/gi,
            '',
          ),
          shipping_method: shippingMethod,
          location_id: prop(address, 'id'),
        },
      };
      await CustomerApi.updateShippingInfo(shippingInfo, userToken);
    }

    if (type === 'billing') {
      Cookie.set(`default_billing`, prop(address, 'id'));
    }

    await fetchCart(true, false);
    return response;
  };
};

export const setShippingAddressDefault = (addressId, type = 'shipping') => {
  return async (dispatch, getState) => {
    const customer = getState().customer.items;
    const addresses = find(customer.addresses, address => {
      if (parseInt(address.id, 0) === parseInt(addressId, 0)) {
        return createCustomAttributes(address, addressCustomAttributes);
      }
    });

    Cookie.set(`default_${type}`, JSON.stringify(addresses));
  };
};
export const fetchCurrentShippingAddress = currentShipping => {
  return dispatch => {
    dispatch(fetchCurrentShippingAddressCompleted(currentShipping));
  };
};

export const loadCustomer = () => {
  return async dispatch => {
    const userToken = Cookie.get('user_token');

    const { customer } = await CustomerApi.get(userToken);

    dispatch(fetchCustomerCompleted(customer));
  };
};

export const addAddress = (address, type = 'shipping') => {
  return async (dispatch, getState) => {
    const store = getState();
    const customerOriginal = store.customer.items_original;

    magentoRequiredFields.forEach(field => {
      if (!address[field]) {
        address[field] = 'N/A';

        if (field === 'street') {
          address[field] = ['N/A'];
        }
      }
    });
    address.city = prop(address, 'region', 'N/A');
    address.custom_attributes = createCustomAttributes(
      address,
      addressCustomAttributes,
    );

    const response = await CustomerApi.createAddress(
      assign(address, { customer_id: prop(customerOriginal, 'id', '') }),
    );

    if (isEmpty(response.data.address)) {
      return;
    }

    if (type === 'billing') {
      dataLayer.push({ event: 'add_payment_info' });
    }

    await dispatch(loadCustomer());
    return prop(response, 'data.address');
  };
};

export const editAddress = address => {
  return async (dispatch, getState) => {
    magentoRequiredFields.forEach(field => {
      if (!address[field]) {
        address[field] = 'N/A';
      }
    });
    if (prop(address, 'customer_address_type') === 'billing') {
      if (isEmpty(address['company'])) {
        address['company'] = 'N/A';
      }
      if (isEmpty(address['firstname'])) {
        address['firstname'] = 'N/A';
      }
      if (isEmpty(address['lastname'])) {
        address['lastname'] = 'N/A';
      }
    }
    address.city = prop(address, 'region', 'N/A');
    address.custom_attributes = createCustomAttributes(
      address,
      addressCustomAttributes,
    );
    const updateResponse = await CustomerApi.updateAddress(address);
    const updateAddress = prop(updateResponse, 'data.address');

    if (updateAddress) {
      await dispatch(loadCustomer());
    }

    return updateAddress;
  };
};

export const deleteAddress = addressId => {
  return async dispatch => {
    const updateResponse = await CustomerApi.deleteAddress(addressId);

    if (updateResponse) {
      await dispatch(loadCustomer());
    }

    return updateResponse;
  };
};

export const editProfile = updateCustomer => {
  return async (dispatch, getState) => {
    const customer = getState().customer.items_original;
    const newCustomer = {
      ...customer,
      custom_attributes: [...customer.custom_attributes],
    };

    if (prop(updateCustomer, 'firstname', '')) {
      newCustomer.firstname = updateCustomer.firstname;
    }

    if (prop(updateCustomer, 'lastname', '')) {
      newCustomer.lastname = updateCustomer.lastname;
    }

    if (!isEmpty(prop(updateCustomer, 'mobile_phone', ''))) {
      remove(newCustomer.custom_attributes, {
        attribute_code: 'mobile_phone',
      });
      newCustomer.custom_attributes.push({
        attribute_code: 'mobile_phone',
        value: updateCustomer.mobile_phone,
        name: 'mobile_phone',
      });
    }

    // t1c_card
    remove(newCustomer.custom_attributes, {
      attribute_code: 't1c_card',
    });
    newCustomer.custom_attributes.push({
      attribute_code: 't1c_card',
      value: prop(updateCustomer, 't1c_card', ''),
      name: 't1c_card',
    });

    // t1c_phone
    remove(newCustomer.custom_attributes, {
      attribute_code: 't1c_phone',
    });
    newCustomer.custom_attributes.push({
      attribute_code: 't1c_phone',
      value: prop(updateCustomer, 't1c_phone', ''),
      name: 't1c_phone',
    });

    const updateResponse = await CustomerApi.update(
      omit(newCustomer, ['addresses']),
    );
    const updatedCustomer = prop(updateResponse, 'data.customer');

    dispatch(fetchCustomerCompleted(newCustomer));

    if (updatedCustomer) {
      await dispatch(loadCustomer());
    }
    return updateResponse;
  };
};

export const setSubscribed = email => {
  return async (dispatch, getState) => {
    const customer = getState().customer.items;

    const newCustomer = {
      ...customer,
      extension_attributes: {
        ...customer.extension_attributes,
        is_subscribed: true,
      },
    };

    dispatch(fetchCustomerCompleted(newCustomer));

    const updateResponse = await CustomerApi.update(
      omit(newCustomer, ['addresses']),
    );
    return updateResponse;
  };
};

export const fetchCustomer = () => ({
  type: TYPES.FETCH_CUSTOMER,
  payload: {},
});

export const fetchCustomerCompleted = customer => {
  const updatedCustomer = cloneDeep(customer);

  if (updatedCustomer.addresses) {
    updatedCustomer.addresses = map(customer.addresses, address => {
      if (address.custom_attributes) {
        address = Exploder.explode(address);
      }

      return reduce(
        address,
        (memo, val, key) => ({
          ...memo,
          [key]: typeof val === 'number' ? String(val) : val,
        }),
        {},
      );
    });
  }

  return {
    type: TYPES.FETCH_CUSTOMER_COMPLETED,
    payload: {
      customer: updatedCustomer,
      original: customer,
    },
  };
};

export const fetchProductFailed = error => ({
  type: TYPES.FETCH_CUSTOMER_FAILED,
  payload: {
    error,
  },
});

export const showDeliveryToolBar = () => {
  return async (dispatch, getState) => {
    dispatch(onBoardingCartClose());
    dispatch(showDeliveryToolBarModal());
  };
};

export const showDeliveryToolBarModal = () => ({
  type: TYPES.SHOW_DELIVERY_TOOL_BAR_MODAL,
});

export const closeDeliveryToolBar = () => ({
  type: TYPES.CLOSE_DELIVERY_TOOL_BAR,
});

export const fetchCurrentShippingAddressCompleted = currentShipping => ({
  type: TYPES.FETCH_CURRENT_SHIPPING_COMPLETED,
  payload: {
    currentShipping,
  },
});

export const clearCurrentShippingAddress = () => ({
  type: TYPES.CLEAR_CURRENT_SHIPPING_ADDRESS,
});

export const fetchShippingInfoCompleted = shippingInfo => ({
  type: TYPES.FETCH_SHIPPING_INFO_COMPLETED,
  payload: {
    shippingInfo,
  },
});

const customerReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.FETCH_CUSTOMER_COMPLETED: {
      const { customer, original } = action.payload;
      return {
        ...state,
        ...{
          items: customer,
          items_original: original,
        },
      };
    }

    case TYPES.SHOW_DELIVERY_TOOL_BAR_MODAL: {
      return { ...state, showModalDeliveryToolBar: true };
    }

    case TYPES.CLOSE_DELIVERY_TOOL_BAR: {
      return { ...state, showModalDeliveryToolBar: false };
    }

    case TYPES.FETCH_CUSTOMER_FAILED: {
      return state;
    }

    case TYPES.FETCH_CURRENT_SHIPPING_COMPLETED: {
      const { currentShipping } = action.payload;
      return { ...state, currentShipping };
    }

    case TYPES.FETCH_SHIPPING_INFO_COMPLETED: {
      const { shippingInfo } = action.payload;
      return { ...state, shippingInfo };
    }

    case TYPES.CLEAR_CURRENT_SHIPPING_ADDRESS: {
      return { ...state, clearShipping: true };
    }

    default:
      return state;
  }
};

export default customerReducer;
