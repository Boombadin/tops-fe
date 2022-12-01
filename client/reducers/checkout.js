import Cookie from 'js-cookie';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { get as prop, find, omit, isEmpty, filter } from 'lodash';
import { submit } from 'redux-form';
import CheckoutApi from '../apis/checkout';
import { getCustomerSelector } from '../selectors';
import { fetchCart, fetchCartProducts, fetchShippingMethods } from './cart';
import { editProfile } from './customer';
import { countDiffItems } from '../utils/diffItemCheck';

export const TYPES = {
  FETCH_PAYMENT: 'FETCH_PAYMENT',
  FETCH_PAYMENT_REQUEST: 'FETCH_PAYMENT_REQUEST',
  FETCH_PAYMENT_COMPLETED: 'FETCH_PAYMENT_COMPLETED',
  FETCH_PAYMENT_FAILED: 'FETCH_PAYMENT_FAILED',
  FETCH_STORECARD: 'FETCH_STORECARD',
  FETCH_STORECARD_COMPLETED: 'FETCH_STORECARD_COMPLETED',
  FETCH_STORECARD_FAILED: 'FETCH_STORECARD_FAILED',
  SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
  CREATE_ORDER_START: 'CREATE_ORDER_START',
  CREATE_ORDER_STOP: 'CREATE_ORDER_STOP',
  SET_SHIPPING_COMPLETE: 'SET_SHIPPING_COMPLETE',
  VALIDATE_SLOT_COMPLETED: 'VALIDATE_SLOT_COMPLETED',
  SHOW_DIFF_STOCK_MODAL: 'SHOW_DIFF_STOCK_MODAL',
  CLOSE_DIFF_STOCK_MODAL: 'CLOSE_DIFF_STOCK_MODAL',
  FETCH_STORELOCATOR_SLOT: 'FETCH_STORELOCATOR_SLOT',
  FETCH_SLOT_COMPLETED: 'FETCH_SLOT_COMPLETED',
  VALIDATE_CHECKOUT: 'VALIDATE_CHECKOUT',
  IS_SET_DELIVETY_SLOT: 'IS_SET_DELIVETY_SLOT',
};

export const addDeliverySlotInfo = (
  deliverySlotComposedId,
  shippingMethod,
  collector,
  storeLocator,
) => {
  return async (dispatch, getState) => {
    dispatch(showLoading());

    const state = getState();
    let deliveryMethod = [];

    if (!isEmpty(shippingMethod)) {
      deliveryMethod = find(state.cart.shippingMethods.data, {
        methodCode: shippingMethod,
      });
    } else {
      deliveryMethod = find(state.cart.shippingMethods.data, {
        carrierCode: 'standard',
      });
    }

    let collectorParams = {};

    if (shippingMethod === 'tops') {
      // const storeLocator = find(prop(state.checkout, 'storeLocator.items', []), {
      //   id: prop(collector, 'store_id', ''),
      // });
      const storeAddress = prop(
        storeLocator,
        'extension_attributes.address',
        {},
      );
      const customer = prop(state.customer, 'items', {});
      const customerName = prop(collector, 'receiver_name');
      let receiverName = [];
      if (!isEmpty(customerName)) {
        receiverName = customerName.replace(/ /, '#').split('#');
      }

      const mobile = find(prop(customer, 'custom_attributes', {}), {
        attribute_code: 'mobile_phone',
      });

      collectorParams = {
        pickup_store: {
          store_id: prop(collector, 'store_id', ''),
          receiver_name: prop(collector, 'receiver_name', ''),
          receiver_phone: prop(collector, 'receiver_phone', ''),
          store_address: {
            firstname: prop(customer, 'firstname', ''),
            lastname: prop(customer, 'lastname', ''),
            telephone: prop(
              mobile,
              'value',
              prop(collector, 'receiver_phone', ''),
            ),
            address_name: prop(storeLocator, 'name', ''),
            ...storeAddress,
          },
        },
      };
    }
    const [shipping_date, shipping_slot_id] = deliverySlotComposedId.split('/');
    const useQuotaAvailable = prop(
      deliveryMethod,
      'extensionAttributes.delivery_slot.0.is_usage_quota_available',
      true,
    );
    const response = await CheckoutApi.addDeliverySlot({
      deliverySlot: {
        shipping_date,
        shipping_slot_id,
        use_quota_available: useQuotaAvailable,
        ...collectorParams,
      },
      deliveryMethod: omit(deliveryMethod, ['extensionAttributes']),
      defaultShipping: prop(state.customer, 'currentShipping', {}),
    });
    dispatch(hideLoading());
    dispatch(setShippingComplete(response.data));
    dispatch(isSetDeliverySlot());
    await dispatch(fetchCart(true, true));

    return response;
  };
};

export const validateDeliverySlot = () => {
  return async (dispatch, getState) => {
    try {
      const { cart } = prop(getState(), 'cart');
      const response = await CheckoutApi.validateDeliverySlot(prop(cart, 'id'));
      if (response.message) {
        dispatch(validateDeliverySlotCompleted(false));
      } else {
        dispatch(validateDeliverySlotCompleted(response.data));
      }
      return response;
    } catch (e) {
      dispatch(validateDeliverySlotCompleted(e));
      return e;
    }
  };
};

export const fetchStoreLocator = shippingMethod => {
  return async (dispatch, getState) => {
    // dispatch(fetchStoreLocatorStart());
    try {
      const response = await CheckoutApi.getStorLocator(shippingMethod);
      // dispatch(fetchStoreLocatorCompleted(response));
      return response;
    } catch (e) {
      // dispatch(fetchStoreLocatorCompleted([]));
      return e;
    }
  };
};

export const getStorPickUpSlot = (cartId, locatorId, method) => {
  return async (dispatch, getState) => {
    try {
      const response = await CheckoutApi.getStorPickUpSlot(
        cartId,
        locatorId,
        method,
      );
      dispatch(fetchStoreLocatorSlot(prop(response, 'tranformSlot', [])));
      return response;
    } catch (e) {
      return e;
    }
  };
};

export const fetchPayment = userToken => {
  return async (dispatch, getState) => {
    dispatch(fetchPaymentRequest());
    try {
      const { payment } = await CheckoutApi.getPayment(userToken);
      dispatch(fetchPaymentCompleted(payment));
      return payment;
    } catch (e) {
      dispatch(fetchPaymentFailed(e));
    }
  };
};

export const fetchStoreLocatorSlot = storeLocatorSlot => ({
  type: TYPES.FETCH_STORELOCATOR_SLOT,
  payload: {
    storeLocatorSlot,
  },
});

export const fetchPaymentRequest = () => ({
  type: TYPES.FETCH_PAYMENT_REQUEST,
});

export const fetchPaymentCompleted = payment => ({
  type: TYPES.FETCH_PAYMENT_COMPLETED,
  payload: {
    payment,
  },
});

export const fetchPaymentFailed = error => ({
  type: TYPES.FETCH_PAYMENT_FAILED,
  payload: {
    error,
  },
});

export const setShippingComplete = shipping => ({
  type: TYPES.SET_SHIPPING_COMPLETE,
  payload: {
    shipping,
  },
});

export const fetchStoreCard = userToken => {
  return async (dispatch, getState) => {
    const { storeCard } = await CheckoutApi.getStoreCard(userToken);
    try {
      dispatch(fetchStoreCardCompleted(storeCard));

      return storeCard;
    } catch (e) {
      dispatch(fetchStoreCardFailed(e));
    }
  };
};

export const fetchStoreCardCompleted = storeCard => ({
  type: TYPES.FETCH_STORECARD_COMPLETED,
  payload: {
    storeCard,
  },
});

export const validateDeliverySlotCompleted = data => ({
  type: TYPES.VALIDATE_SLOT_COMPLETED,
  payload: {
    data,
  },
});

export const fetchStoreCardFailed = error => ({
  type: TYPES.FETCH_STORECARD_FAILED,
  payload: {
    error,
  },
});

export const setPaymentMethod = paymentMethod => ({
  type: TYPES.SET_PAYMENT_METHOD,
  payload: { paymentMethod },
});

export const createOrderStart = () => ({
  type: TYPES.CREATE_ORDER_START,
});

export const createOrderStop = () => ({
  type: TYPES.CREATE_ORDER_STOP,
});

export const createOrder = (
  userToken,
  paymentMethod,
  isRequestTax = false,
  remarkForm = '',
  substitution = '',
  t1c_number = '',
  t1c_name = '',
) => {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(createOrderStart());
    const isError = false;
    const activeLanguageCode = find(state.locale.languages, lang => lang.active)
      .code;
    const {
      shipping_date,
      shipping_slot_id,
    } = state?.cart?.cart?.extension_attributes;

    if (isEmpty(shipping_date) || isEmpty(shipping_slot_id)) {
      if (activeLanguageCode === 'en_US') {
        alert('Transaction cannot be processed. Please check and try again.');
        window.location.href = '/checkout';
      } else {
        alert(
          'ขออภัยค่ะไม่สามารถทำรายการได้ กรุณาตรวจสอบและทำรายการใหม่อีกครั้ง',
        );
        window.location.href = '/checkout';
      }
    }

    if (paymentMethod === 'fullpayment') {
      dispatch(submit('creditCardForm'));
      const is2C2PError = prop(
        getState(),
        'form.creditCardForm.syncErrors',
        false,
      );
      if (!is2C2PError && !isError) {
        document.getElementById('submit-form').click();
      } else {
        dispatch(createOrderStop());
      }
    } else if (!isError && paymentMethod !== 'fullpayment') {
      const { storeConfig } = state;
      const currentStoreConfig = storeConfig.current;
      const currentStoreCode = currentStoreConfig.code;
      const customer = getCustomerSelector(state);

      let billingAddress = [];

      if (isRequestTax) {
        if (!isEmpty(Cookie.get('default_billing'))) {
          billingAddress = find(
            customer?.addresses,
            x => x?.id === Cookie.get('default_billing'),
          );
        } else {
          billingAddress = find(
            customer?.addresses,
            x => (x?.default_billing || false) === true,
          );
        }
      }

      let shippingAddress = [];
      if (customer?.addresses) {
        shippingAddress =
          state.cart.cart.extension_attributes.shipping_assignments[0].shipping
            .address;
      }

      let pickupStore = {};
      if (state?.cart?.cart?.extension_attributes?.pickup_store || {}) {
        pickupStore =
          state?.cart?.cart?.extension_attributes?.pickup_store || {};
      }

      const channel = !isEmpty(Cookie.get('provider'))
        ? Cookie.get('provider')
        : '';
      try {
        const cardIssuer = state?.nyb?.voucherForm?.issue;
        let t1cInfo = {
          t1c_card: '',
          t1c_phone: '',
        };
        if (t1c_name === 't1c_card') {
          t1cInfo = {
            t1c_card: t1c_number,
          };
        } else if (t1c_name === 't1c_phone') {
          t1cInfo = {
            t1c_phone: t1c_number,
          };
        }
        if (!isEmpty(t1cInfo?.t1c_card) || !isEmpty(t1cInfo?.t1c_phone)) {
          dispatch(editProfile(t1cInfo));
        }
        const response = await CheckoutApi.createOrder(
          currentStoreCode,
          userToken,
          paymentMethod,
          billingAddress,
          shippingAddress,
          remarkForm,
          substitution,
          cardIssuer,
          channel,
          pickupStore,
          prop(customer, 'id', ''),
          isRequestTax,
        );

        Cookie.remove('default_billing');

        if (
          prop(response, 'message', '') ===
          'Found OOS or some products are not enough qty'
        ) {
          return (window.location.href = '/checkout');
        }
        if (response) {
          dispatch(createOrderStop());
          return (window.location.href = prop(
            response,
            'url',
            '/checkout/error',
          ));
        }

        dispatch(createOrderStop());
        return response;
      } catch (e) {
        const activeLanguageCode = find(
          state.locale.languages,
          lang => lang.active,
        ).code;
        if (activeLanguageCode === 'en_US') {
          alert('Transaction cannot be processed. Please check and try again.');
        } else {
          alert(
            'ขออภัยค่ะไม่สามารถทำรายการได้ กรุณาตรวจสอบและทำรายการใหม่อีกครั้ง',
          );
        }

        dispatch(createOrderStop());
        return e;
      }
    } else {
      dispatch(createOrderStop());
    }
  };
};

export const getDeliverySlot = (cartId, shippingMethod, subDistrictId) => {
  return async (dispatch, getState) => {
    try {
      const { slots } = await CheckoutApi.getDeliverySlot(
        cartId,
        shippingMethod,
        subDistrictId,
      );
      dispatch({
        type: TYPES.FETCH_SLOT_COMPLETED,
        payload: { slots },
      });
      return slots;
    } catch (e) {
      return e;
    }
  };
};

export const deleteDeliverySlot = cartId => {
  return async (dispatch, getState) => {
    try {
      const response = await CheckoutApi.deleteDeliverySlot(cartId);
      dispatch(fetchCart(true, true));
      dispatch(fetchShippingMethods(cartId));
      return response;
    } catch (e) {
      return e;
    }
  };
};

export const deleteStoreCard = p2c2pId => {
  return async (dispatch, getState) => {
    await CheckoutApi.deleteStoreCard(p2c2pId);

    const userToken = Cookie.get('user_token');
    dispatch(fetchStoreCard(userToken));
  };
};

export const showDiffStockModal = diffItems => ({
  type: TYPES.SHOW_DIFF_STOCK_MODAL,
  payload: {
    diffItems,
    show: true,
  },
});

export const closeDiffStockModal = () => ({
  type: TYPES.CLOSE_DIFF_STOCK_MODAL,
});

export const setValidCheckout = isValid => {
  return async (dispatch, getState) => {
    dispatch({
      type: TYPES.VALIDATE_CHECKOUT,
      payload: { isValid },
    });
  };
};

export const isSetDeliverySlot = () => ({
  type: TYPES.IS_SET_DELIVETY_SLOT,
  payload: {
    isDeliverySlot: true,
  },
});

const initialState = {
  items: [],
  payment: {},
  storeCard: [],
  loading: false,
  checkoutLoading: false,
  paymentMethod: '',
  shippingInfo: {},
  diffStockModal: {
    diffItems: [],
    show: false,
  },
  storeLocatorSlotLoading: true,
  slots: [],
  isValid: false,
  isDeliverySlot: false,
};

const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_PAYMENT_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case TYPES.FETCH_PAYMENT_COMPLETED: {
      const { payment } = action.payload;
      return {
        ...state,
        ...{
          payment: payment,
          loading: false,
        },
      };
    }

    case TYPES.SET_PAYMENT_METHOD: {
      const { paymentMethod } = action.payload;
      return { ...state, ...{ paymentMethod: paymentMethod } };
    }

    case TYPES.FETCH_PAYMENT_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }

    case TYPES.FETCH_STORECARD_COMPLETED: {
      const { storeCard } = action.payload;
      return {
        ...state,
        ...{
          storeCard: storeCard,
          loading: false,
        },
      };
    }

    case TYPES.FETCH_STORECARD_FAILED: {
      return state;
    }

    case TYPES.CREATE_ORDER_START: {
      return { ...state, checkoutLoading: true };
    }

    case TYPES.CREATE_ORDER_STOP: {
      return { ...state, checkoutLoading: false };
    }

    case TYPES.SET_SHIPPING_COMPLETE: {
      const { shipping } = action.payload;
      return { ...state, shippingInfo: shipping };
    }

    case TYPES.VALIDATE_SLOT_COMPLETED: {
      const result = action.payload;
      return { ...state, isValid: result };
    }

    case TYPES.SHOW_DIFF_STOCK_MODAL: {
      const { diffItems, show } = action.payload;
      return { ...state, diffStockModal: { diffItems: diffItems, show: show } };
    }

    case TYPES.CLOSE_DIFF_STOCK_MODAL: {
      return { ...state, diffStockModal: { diffItems: {}, show: false } };
    }

    case TYPES.FETCH_STORELOCATOR_SLOT: {
      const { storeLocatorSlot } = action.payload;
      return { ...state, storeLocatorSlotLoading: false, storeLocatorSlot };
    }

    case TYPES.FETCH_SLOT_COMPLETED: {
      const { slots } = action.payload;
      return { ...state, slots };
    }

    case TYPES.VALIDATE_CHECKOUT: {
      const { isValid } = action.payload;
      return { ...state, isValid };
    }

    case TYPES.IS_SET_DELIVETY_SLOT: {
      const { isDeliverySlot } = action.payload;
      return { ...state, isDeliverySlot };
    }

    default:
      return state;
  }
};

export default checkoutReducer;
