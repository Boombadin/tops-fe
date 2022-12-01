import Cookie from 'js-cookie';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import {
  types,
  typesPaymentMethods,
  typeUpdatePayment,
} from '@client/contexts/payment/types';
import { editProfile } from '@client/reducers/customer';
import { getCustomerSelector } from '@client/selectors';
import { SentryCaptureException } from '@client/sentryClient';

const actions = (
  { payment, cart, state },
  dispatch,
  { reduxState, reduxAction },
  { updatePaymentInformation, setPaymentInformation, others },
) => ({
  setPaymentLoading: payload => {
    return dispatch({ type: types.SET_PAYMENT_LOADING, payload });
  },
  setPaymentCode: payload => {
    return dispatch({ type: types.SET_PAYMENT_CODE, payload });
  },

  setPaymentServiceFullPayment: payload => {
    const promotionCode = payload?.promotionCode;
    if (promotionCode !== '' && !payment?.isPaymentPromotionLocked) {
      try {
        updatePaymentInformation({
          type: typeUpdatePayment.SET_PROMOTION_CODE,
          promotionCode,
          paymentCode:
            state?.paymentCode ||
            typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT,
        });
      } catch (e) {
        console.error(e);
      }
    }
    return dispatch({
      type: types.SET_PAYMENT_SERVICE_FULL_PAYMENT,
      payload,
    });
  },

  setPaymentServiceFullPaymentSavedCard: payload => {
    return dispatch({
      type: types.SET_PAYMENT_SERVICE_FULL_PAYMENT_SAVED_CARD,
      payload,
    });
  },

  setPaymentServiceFullPaymentSaveCard: payload => {
    return dispatch({
      type: types.SET_PAYMENT_SERVICE_FULL_PAYMENT_SAVE_CARD,
      payload,
    });
  },

  setPaymentServiceFullPaymentIsInvalidCard: payload => {
    return dispatch({
      type: types.SET_PAYMENT_SERVICE_FULL_PAYMENT_IS_INVALID_CARD,
      payload,
    });
  },

  setCardPromotion: payload => {
    return dispatch({
      type: types.SET_PAYMENT_CARD_PROMOTION,
      payload,
    });
  },

  setT1cInfo: payload => {
    return dispatch({
      type: types.SET_PAYMENT_T1C_INFO,
      payload,
    });
  },

  setRemark: payload => {
    return dispatch({
      type: types.SET_PATMENT_REMARK,
      payload,
    });
  },

  setSubstitution: payload => {
    return dispatch({
      type: types.SET_PAYMENT_SUBSTITUTION,
      payload,
    });
  },

  setIsRequestTax: payload => {
    return dispatch({
      type: types.SET_PAYMENT_IS_REQUEST_TAX,
      payload,
    });
  },

  createOrder: async (params = {}) => {
    const { encryptedData = null } = params;
    const { paymentCode } = state;

    let variables = null;
    const logSentry = {
      actionName: 'createOrder',
      logsData: {
        from: 'src/contexts/payment/actions.js',
        paymentCode,
        url: `/checkout/payment`,
      },
    };

    try {
      variables = await generateVariables({
        cart,
        state,
        others,
        payment,
        encryptedData,
        reduxState,
      });

      if (variables) {
        if (state?.t1cInfo?.t1c_phone || state?.t1cInfo?.t1c_card) {
          reduxAction?.dispatch(editProfile(state?.t1cInfo));
        }

        /*** post graphql to create order ***/
        const paymentResponse = setPaymentInformation({
          variables,
        });
        paymentResponse
          .then(response => {
            Cookie.remove('default_billing');

            const { setPaymentInformation } = response.data;
            if (
              paymentCode === typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT
            ) {
              const requestForm = setPaymentInformation?.request_form;
              if (requestForm) {
                autoSubmitForm(requestForm);
                return true;
              }
            } else if (setPaymentInformation?.order) {
              const redirectArray = setPaymentInformation?.redirect_url.split(
                '/',
              );
              const increment_id = redirectArray[1];
              window.location.href = `/checkout/completed/${increment_id}`;
            }
          })
          .catch(error => {
            if (
              error?.graphQLErrors[0].response?.status === 404 &&
              error?.graphQLErrors[0].response?.body === 'Given card not exists'
            ) {
              window.location.href = `/checkout/error`;
            } else {
              window.location.href = `/checkout/error`;
            }

            SentryCaptureException({
              error,
              ...logSentry,
            });
          });
      }
    } catch (error) {
      SentryCaptureException({
        error,
        ...logSentry,
      });
    }
  },
});

const getEncryptedCreditCard = encryptedCreditCardData => {
  const {
    encryptedCardInfo,
    expMonthCardInfo,
    expYearCardInfo,
    cardHolderName,
  } = encryptedCreditCardData;

  return {
    encrypted_card_data: encryptedCardInfo,
    is_store_card: false,
    cardholder_name: cardHolderName,
    expiry_month: parseInt(expMonthCardInfo),
    expiry_year: parseInt(expYearCardInfo),
  };
};

const explodedCustomAttributes = customAttributes => {
  const explodedSegment = {};
  customAttributes.map(attr => {
    const key = attr.attribute_code;
    const { value } = attr;
    return (explodedSegment[key] = value);
  });
  return explodedSegment;
};

const transfromBillingAddress = (
  billingAddress,
  pickupStore,
  addressType = 'billing',
) => {
  const billingData = {
    city: billingAddress?.district || 'N/A',
    vat_id: billingAddress?.vat_id || null,
    firstname: billingAddress?.firstname || 'N/A',
    lastname: billingAddress?.lastname || 'N/A',
    company: billingAddress?.company || null,
    postcode: billingAddress?.postcode || 'N/A',
    street: billingAddress?.street || ['N/A'],
    country_id: 'TH',
    region_id:
      String(billingAddress?.region_id || billingAddress?.region?.region_id) ||
      null,
    region_code:
      billingAddress?.region_code ||
      billingAddress?.region?.region_code ||
      null,
    telephone: billingAddress?.telephone || pickupStore?.receiver_phone || '',
    custom_attributes:
      addressType === 'billing'
        ? {
            customer_address_type: 'billing',
            house_no: billingAddress?.house_no || 'N/A',
            moo: billingAddress?.moo || '',
            village_name: billingAddress?.village_name || '',
            soi: billingAddress?.soi || '',
            road: billingAddress?.road || '',
            district: billingAddress?.district || 'N/A',
            district_id: billingAddress?.district_id || 'N/A',
            subdistrict: billingAddress?.subdistrict || 'N/A',
            subdistrict_id: billingAddress?.subdistrict_id || 'N/A',
            remark: '-',
          }
        : explodedCustomAttributes(billingAddress?.custom_attributes || {}),
  };

  return billingData;
};

const autoSubmitForm = ({ url, payload }) => {
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', url);
  form.style.display = 'none';
  Object.keys(payload).map(name => {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('type', 'hidden');
    input.value = payload[name];
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
};

const getAcceptConsent = () => {
  return ['PRIVACY'];
};

const generateVariables = async ({
  state,
  cart,
  payment,
  others,
  encryptedData,
  reduxState,
}) => {
  const {
    paymentCode,
    paymentServiceFullPayment,
    remark = '',
    substitution = '',
    isRequestTax,
    cardCode,
  } = state;
  const { bankTransferForm, refInstallmentForm } = others;
  const shippingAddress = cart.extension_attributes?.shipping_assignments?.find(
    element => !!element?.shipping,
  ).shipping?.address;
  const customer = getCustomerSelector(reduxState);

  const customer_email = shippingAddress?.email;
  const customer_name = `${shippingAddress?.firstname ||
    'n/a'} ${shippingAddress?.lastname || 'n/a'}`;
  const t1cEarnNo = cart.extension_attributes?.estimate_t1c_point || null;

  let pickupStore = {};
  if (cart?.extension_attributes?.pickup_store || {}) {
    pickupStore = cart?.extension_attributes?.pickup_store || {};
  }

  let billingData = null;
  if (isRequestTax) {
    let billingAddress = [];
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

    billingData = transfromBillingAddress(
      billingAddress,
      pickupStore,
      'billing',
    );
  } else {
    billingData = transfromBillingAddress(
      shippingAddress,
      pickupStore,
      'shipping',
    );
  }

  const variables = {
    input: {
      payment_method: {
        method: paymentCode,
        extension_attributes: {
          t1c_earn_card_number: t1cEarnNo?.toString(),
          request_tax_invoice: isRequestTax,
        },
      },
      payment_service_methods: null,
      billing_address: billingData,
      accept_consents: getAcceptConsent(),
      email: customer_email,
      remark,
      substitution,
    },
  };

  switch (paymentCode) {
    case typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT:
      const { isPaymentPromotionLocked } = payment;
      variables.input = {
        ...variables.input,
        card: getEncryptedCreditCard(encryptedData),
        payment_service_methods: paymentCode,
      };

      if (encryptedData?.savedCard?.id) {
        const { encryptedCardInfo } = encryptedData.savedCard;
        variables.input = {
          ...variables.input,
          card: null,
          saved_card: {
            card_id: encryptedData.savedCard.id,
            encrypted_card_data: encryptedCardInfo,
          },
        };
      } else if (paymentServiceFullPayment?.saveCard) {
        variables.input.card.is_store_card =
          paymentServiceFullPayment?.saveCard;
      }

      if (
        isPaymentPromotionLocked ||
        paymentServiceFullPayment?.promotionCode
      ) {
        variables.input.payment_method.extension_attributes = {
          ...variables.input.payment_method.extension_attributes,
          promotion_id: paymentServiceFullPayment.promotionCode,
        };
      }
      break;

    case typesPaymentMethods.CREDITCARDONDELIVERY:
      cardCode &&
        (variables.input.payment_method.extension_attributes = {
          ...variables.input.payment_method.extension_attributes,
          card_code: cardCode,
        });
      break;

    case typesPaymentMethods.CASHONDELIVERY:
      break;

    case typesPaymentMethods.PAYATSTORE:
      break;

    case typesPaymentMethods.FREE:
      break;

    default:
      break;
  }

  return Object.assign({}, variables);
};

export default actions;
