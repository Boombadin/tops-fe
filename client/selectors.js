import { filter, find, get, isEmpty, keyBy } from 'lodash';

import { getCookie } from './utils/cookie';

export * from './reducers/wishlist/selectors';

// LANG

export const langSelector = state => {
  return find(state?.locale?.languages, lang => lang.active === true)?.code;
};

// STORE CONFIG

export const getCurrentStoreConfigSelector = state =>
  state?.storeConfig?.current;

// CUSTOMER

export const getCustomerSelector = state => state?.customer?.items;

export const getShippingAddressesSelector = state =>
  filter(
    get(state, 'customer.items.addresses'),
    address =>
      !address?.customer_address_type ||
      address?.customer_address_type === 'shipping',
  );

export const getBillingAddressesSelector = state =>
  filter(
    state?.customer?.items?.addresses,
    address => address?.customer_address_type === 'billing',
  );

export const isCustomerLoggedSelector = state =>
  !!get(getCustomerSelector(state), 'id', false) &&
  !isEmpty(getCookie('user_token'));

export const isCustomerLoggedInSelector = state =>
  !!get(getCustomerSelector(state), 'id', false);

export const getDefaultShippingAddressSelector = state => {
  const customer = getCustomerSelector(state);

  if (!customer) return null;

  const addresses = find(customer?.addresses, { default_shipping: true });

  return get(addresses, 'subdistrict_id', '');
};

export const getOneCardMembershipIdFromCustomer = customer => {
  const attribute = find(get(customer, 'custom_attributes', {}), {
    attribute_code: 't1c_card',
  });

  return attribute?.value || '';
};

export const getThe1MobileFromCustomer = customer => {
  const attribute = find(get(customer, 'custom_attributes', {}), {
    attribute_code: 't1c_phone',
  });

  return attribute?.value || '';
};

export const getPhoneNumberFromCustomer = customer => {
  const attribute = find(get(customer, 'custom_attributes', {}), {
    attribute_code: 'mobile_phone',
  });

  return attribute?.value || '';
};

export const getBrandSuggestions = state =>
  filter(
    get(state, 'search.suggestions'),
    suggestion => suggestion?.type === 'brand',
  );

export const getDefaultSuggestions = state =>
  filter(
    get(state, 'search.suggestions'),
    suggestion => suggestion?.type === 'product' || suggestion?.type === 'term',
  );

export const getCategorySuggestions = state =>
  filter(
    get(state, 'search.suggestions'),
    suggestion => suggestion?.type === 'category',
  );

export const getBaseMediaUrl = state =>
  get(state, 'storeConfig.current.base_media_url');

export const getCartItems = state => get(state, 'cart.cart.items');

export const getCartItemsBySKU = state => {
  const cartItems = getCartItems(state);

  return keyBy(cartItems, 'sku');
};

export const isCartLoadedSelector = state => get(state, 'cart.loaded', false);

export const getStoreSelector = state => get(state, 'storeConfig.current');

export const isAppGrab = state =>
  get(state, 'storeConfig.provider', '') === 'GrabFresh';
