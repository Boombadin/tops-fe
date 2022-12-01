import { find, get as prop, isEmpty, filter, map, sortBy } from 'lodash';
import Exploder from '../../client/utils/mcaex';
import CheckoutService from '../services/checkoutService';
import CustomerService from '../services/customerService';
import OrderService from '../services/orderService';
import { log } from '../utils/logger';
import config from '../config';
import ConsentService from '../services/consentService';

const mappingAddressModel = address => {
  const explodeAddress = Exploder.explode(address);
  const formatedAddress = {
    ...address,
    custom_attributes: [
      {
        attribute_code: 'customer_address_type',
        value: prop(explodeAddress, 'customer_address_type', ''),
        name: 'customer_address_type',
      },
      {
        attribute_code: 'house_no',
        value: prop(explodeAddress, 'house_no', ''),
        name: 'house_no',
      },
      {
        attribute_code: 'address_name',
        value: prop(explodeAddress, 'address_name', ''),
        name: 'address_name',
      },
      {
        attribute_code: 'moo',
        value: prop(explodeAddress, 'moo', ''),
        name: 'moo',
      },
      {
        attribute_code: 'village_name',
        value: prop(explodeAddress, 'village_name', ''),
        name: 'village_name',
      },
      {
        attribute_code: 'soi',
        value: prop(explodeAddress, 'soi', ''),
        name: 'soi',
      },
      {
        attribute_code: 'road',
        value: prop(explodeAddress, 'road', ''),
        name: 'road',
      },
      {
        attribute_code: 'building_type',
        value: prop(explodeAddress, 'building_type', ''),
        name: 'building_type',
      },
      {
        attribute_code: 'district',
        value: prop(explodeAddress, 'district', ''),
        name: 'district',
      },
      {
        attribute_code: 'district_id',
        value: prop(explodeAddress, 'district_id', ''),
        name: 'district_id',
      },
      {
        attribute_code: 'subdistrict',
        value: prop(explodeAddress, 'subdistrict', ''),
        name: 'subdistrict',
      },
      {
        attribute_code: 'subdistrict_id',
        value: prop(explodeAddress, 'subdistrict_id', ''),
        name: 'subdistrict_id',
      },
      {
        attribute_code: 'remark',
        value: prop(explodeAddress, 'remark', ''),
        name: 'remark',
      },
    ],
  };

  return formatedAddress;
};

const addDeliverySlotInfo = async (req, res) => {
  try {
    const userToken = req.headers['user-token'];
    const store = req.headers['x-store-code'];
    const { deliverySlot, deliveryMethod, defaultShipping } = req.body;
    const [customer, billing] = await Promise.all([
      CustomerService.get(userToken, store),
      CustomerService.getBilling(userToken),
    ]);
    let address = {};
    if (prop(deliveryMethod, 'methodCode', '') !== 'tops') {
      address = defaultShipping;
    } else {
      address = prop(deliverySlot, 'pickup_store.store_address', {});

      if (prop(deliverySlot, 'pickup_store.store_address', {})) {
        delete deliverySlot.pickup_store.store_address;
      }
    }

    address = mappingAddressModel(address);

    delete address.id; // id is not required when set shipping address

    const response = await CheckoutService.setDeliverySlot({
      deliverySlot,
      token: userToken,
      address,
      billing,
      store,
      deliveryMethod,
    });

    log('checkout', 'addDeliverySlotInfo', req, response);
    return res.json(response);
  } catch (e) {
    console.log('error', prop(e, 'response.data', ''));
    if (e.response) {
      log('checkout', 'addDeliverySlotInfo', req, e.response.data, false);
      return res.json(e.response.data);
    } else if (e.message) {
      log('checkout', 'addDeliverySlotInfo', req, e.message, false);
      return res.json({ error: e.message });
    }
  }
};

const validateDeliverySlot = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const { cartId } = req.query;
    const response = await CheckoutService.validateDeliverySlot({
      store,
      cartId,
    });
    log('checkout', 'validateDeliverySlot', req, response);
    return res.json(response);
  } catch (e) {
    if (e.response) {
      log('checkout', 'validateDeliverySlot', req, e.response.data, false);
      return res.json({ message: e.response.data });
    }

    log('checkout', 'validateDeliverySlot', req, e.message, false);
    return res.json({ message: e.message });
  }
};

const getStorLocator = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const splitStoreCode = store.split('_');
    const language = splitStoreCode[splitStoreCode.length - 1];

    let storeCode = store;
    if (language === 'th') {
      storeCode = storeCode.replace('_th', '_en');
    } else if (language === 'en') {
      storeCode = storeCode.replace('_en', '_th');
    }

    const [storeCurrentLanguageRes, storeAfterLanguageRes] = await Promise.all([
      CheckoutService.fethStoreLocator(store),
      CheckoutService.fethStoreLocator(storeCode),
    ]);

    return res.json({
      stores: storeCurrentLanguageRes?.items || [],
      afterLangStore: storeAfterLanguageRes?.items || [],
    });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return { stores: [], error: e.message };
  }
};

const getStorPickUpSlot = async (req, res) => {
  try {
    const userToken = req.cookies['user_token'];
    const store = req.headers['x-store-code'];
    const { cartId, retailerId, setMethod } = req.query;
    let method;
    setMethod === 'tops' ? (method = 'pickupatstore_tops') : '';

    const locatorSlot = await CheckoutService.fethStorePickUpSlot(
      store,
      cartId,
      retailerId,
      method,
    );

    const tranformSlot = [];
    if (locatorSlot && locatorSlot.length > 0) {
      map(locatorSlot, date => {
        tranformSlot.push({
          date: date.date,
          isAllow: true,
          slots: map(date.slots, item => {
            return {
              id: item.id,
              timeFrom: item.time_from,
              timeTo: item.time_to,
              quota: item.quota_available,
              enabled: item.is_available,
              round: item.round,
              available: item.quota_available,
              cost: 0,
              isAllow: true,
            };
          }),
        });
      });
    }

    return res.json({ tranformSlot });
  } catch (e) {
    console.error(prop(e, 'message', ''));
    return res.json(null);
  }
};

const getAllPayment = async (req, res) => {
  try {
    const userToken = req.cookies['user_token'];
    const store = req.headers['x-store-code'];
    const payment = await CheckoutService.fetchPayment(userToken, store);

    res.set('Cache-Control', 'no-cache');
    return res.json({ payment });
  } catch (e) {
    return res.json({ payment: {} });
  }
};

const getStoreCard = async (req, res) => {
  try {
    const userToken = req.headers['user-token'];
    const storeCard = await CustomerService.getStoreCard(userToken);
    return res.json({ storeCard });
  } catch (e) {
    return res.json({ storeCard: {} });
  }
};

const transfromBillingAddress = (
  billingAddress,
  pickupStore,
  addressType = 'billing',
) => {
  const billingData = {
    city: prop(billingAddress, 'district', 'N/A'),
    vat_id: prop(billingAddress, 'vat_id', null),
    firstname: prop(billingAddress, 'firstname', 'N/A'),
    lastname: prop(billingAddress, 'lastname', 'N/A'),
    company: prop(billingAddress, 'company', null),
    postcode: prop(billingAddress, 'postcode', 'N/A'),
    street: prop(billingAddress, 'street', ['N/A']),
    country_id: 'TH',
    region_id: prop(billingAddress, 'region_id', null),
    region_code: prop(billingAddress, 'region_code', null),
    // region: billingAddress.region || shippingAddress.region,
    telephone: prop(
      billingAddress,
      'telephone',
      prop(pickupStore, 'receiver_phone', ''),
    ),
    custom_attributes:
      addressType === 'billing'
        ? [
            {
              attribute_code: 'customer_address_type',
              value: 'billing',
              name: 'customer_address_type',
            },
            {
              attribute_code: 'house_no',
              value: prop(billingAddress, 'house_no', 'N/A'),
              name: 'house_no',
            },
            {
              attribute_code: 'moo',
              value: prop(billingAddress, 'moo', ''),
              name: 'moo',
            },
            {
              attribute_code: 'village_name',
              value: prop(billingAddress, 'village_name', ''),
              name: 'village_name',
            },
            {
              attribute_code: 'soi',
              value: prop(billingAddress, 'soi', ''),
              name: 'soi',
            },
            {
              attribute_code: 'road',
              value: prop(billingAddress, 'road', ''),
              name: 'road',
            },
            {
              attribute_code: 'district',
              value: prop(billingAddress, 'district', 'N/A'),
              name: 'district',
            },
            {
              attribute_code: 'district_id',
              value: prop(billingAddress, 'district_id', 'N/A'),
              name: 'district_id',
            },
            {
              attribute_code: 'subdistrict',
              value: prop(billingAddress, 'subdistrict', 'N/A'),
              name: 'subdistrict',
            },
            {
              attribute_code: 'subdistrict_id',
              value: prop(billingAddress, 'subdistrict_id', 'N/A'),
              name: 'subdistrict_id',
            },
            {
              attribute_code: 'remark',
              value: '-',
              name: 'remark',
            },
          ]
        : prop(billingAddress, 'custom_attributes', {}),
  };

  return billingData;
};

const transfromPaymentMethod = paymentMethod => {
  const paymentData = {
    method: paymentMethod || null,
    po_number: null,
    additional_data: null,
  };

  return paymentData;
};

const checkUserConsentInfo = async (email, customerId) => {
  const userConsent = await ConsentService.getUserConsent({
    email,
    ref_id: customerId,
  });
  let response;
  if (userConsent) {
    const consentMarketingStatus = userConsent?.data?.consent_marketing_status;
    const consentPrivacyVersion =
      userConsent?.data?.content?.consent_privacy_version;
    if (consentMarketingStatus === null) {
      response = ConsentService.updateUserConsent({
        email,
        ref_id: customerId,
        consent_privacy_version: consentPrivacyVersion,
        consent_privacy_status: true,
        consent_marketing_status: false,
      });
    }
  }
  return response;
};
const createOrder = async (req, res) => {
  try {
    const userToken = req.headers['user-token'];
    const storeCode = req.headers['x-store-code'];
    const {
      paymentMethod,
      billingAddress,
      shippingAddress,
      remark,
      isRemark,
      substitution,
      pickupStore,
      isRequestTax,
    } = req.body;

    if (!userToken) throw new Error('no permission');
    const customer = await CustomerService.get(userToken, storeCode);
    checkUserConsentInfo(customer?.email, customer?.id);
    let billingData = null;

    if (isRequestTax || isRequestTax == 'true') {
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

    const response = await CheckoutService.createOrder(
      storeCode,
      userToken,
      paymentMethod,
      billingData,
      remark,
      isRemark,
      substitution,
    );
    let urlRedirect = '';
    if (response) {
      if (paymentMethod.method === 'fullpaymentredirect') {
        urlRedirect = prop(response, 'request.res.responseUrl');
      } else {
        const order = await OrderService.get(storeCode, response.data);
        urlRedirect = `/checkout/completed/${prop(order, 'increment_id', '')}`;
      }
    }

    return res.json({ url: urlRedirect });
  } catch (e) {
    console.error(prop(e, 'response.data', ''));
    if (e.response) {
      if (
        prop(e, 'response.data.code', 400) &&
        prop(e, 'response.data.code', 400) === 412
      ) {
        return res.json({ checkout: '', redirect: 1 });
      } else if (prop(e, 'response.data.status', 400)) {
        return res.json({
          checkout: '',
          message: prop(e, 'response.data.message', ''),
          itemOOS: prop(e, 'response.data.parameters.available_products', []),
        });
      }
      log('checkout', 'createOrder', req, e.response.data, false);
    } else if (e.message) {
      log('checkout', 'createOrder', req, e.message, false);
    }

    return res.json({ checkout: '' });
  }
};

const createOrderPay2c2p = async (req, res) => {
  try {
    const userToken = req.cookies.user_token;
    const {
      card_cvv,
      cardnumber,
      cardid,
      store_card,
      card_name,
      payment_method,
      need_fulltax,
      tax_type,
      tax_name,
      tax_lastname,
      tax_company,
      tax_tel,
      tax_idcard,
      tax_address,
      tax_street,
      tax_sub_district_id,
      tax_sub_district,
      tax_district_id,
      tax_district,
      tax_province,
      tax_province_id,
      tax_province_code,
      tax_postcode,
      tax_moo,
      tax_soi,
      tax_village_name,
      tax_save_billing_address,
      remark_order,
      is_remark_order,
      encryptedCardInfo,
      maskedCardInfo,
      expMonthCardInfo,
      expYearCardInfo,
      store_config,
      substitution,
    } = req.body;

    let paymentData = {};
    if (
      (cardnumber === '' || cardnumber === undefined) &&
      (cardid === '' || cardid === undefined)
    ) {
      paymentData = {
        method: payment_method,
        additional_data: {
          cc_secure_verify: card_cvv,
          cc_number_enc: maskedCardInfo,
          cc_exp_year: expYearCardInfo,
          cc_exp_month: expMonthCardInfo,
        },
        extension_attributes: {
          encrypted_card_info: encryptedCardInfo,
          customer_name: card_name,
          store_card: store_card,
        },
      };
    } else {
      paymentData = {
        method: payment_method,
        additional_data: {
          cc_number_enc: cardnumber,
        },
        extension_attributes: {
          store_card_id: cardid,
        },
      };
    }

    const billingData = {
      city: tax_district || 'N/A',
      vat_id: tax_idcard || 'N/A',
      firstname: tax_name || 'N/A',
      lastname: tax_lastname || 'N/A',
      company: tax_company || '',
      postcode: tax_postcode || 'N/A',
      street: [tax_address || 'N/A'],
      country_id: 'TH',
      region_id: tax_province_id || 'N/A',
      region_code: tax_province_code || 'N/A',
      region: tax_province || 'N/A',
      telephone: tax_tel || 'N/A',
      custom_attributes: [
        {
          attribute_code: 'customer_address_type',
          value: 'billing',
          name: 'customer_address_type',
        },
        {
          attribute_code: 'house_no',
          value: tax_address || 'N/A',
          name: 'house_no',
        },
        {
          attribute_code: 'moo',
          value: tax_moo || '',
          name: 'moo',
        },
        {
          attribute_code: 'village_name',
          value: tax_village_name || null,
          name: 'village_name',
        },
        {
          attribute_code: 'soi',
          value: tax_soi || '',
          name: 'soi',
        },
        {
          attribute_code: 'road',
          value: tax_street || '',
          name: 'road',
        },
        {
          attribute_code: 'district',
          value: tax_district || 'N/A',
          name: 'district',
        },
        {
          attribute_code: 'district_id',
          value: tax_district_id || 'N/A',
          name: 'district_id',
        },
        {
          attribute_code: 'subdistrict',
          value: tax_sub_district || 'N/A',
          name: 'subdistrict',
        },
        {
          attribute_code: 'subdistrict_id',
          value: tax_sub_district_id || 'N/A',
          name: 'subdistrict_id',
        },
        {
          attribute_code: 'remark',
          value: '-',
          name: 'remark',
        },
      ],
      saveInAddressBook: tax_save_billing_address === 'true' ? 1 : 0,
    };
    const resp = await CheckoutService.createOrder(
      store_config,
      userToken,
      paymentData,
      billingData,
      remark_order,
      is_remark_order,
      substitution,
    );
    res.cookie('orderId', resp, { maxAge: 900000 });

    log('checkout', 'createOrderPay2c2p', req, resp);

    if (resp) {
      const order = await OrderService.get(store_config, resp);
      const additionalInfo = order.payment.additional_information[0];

      if (additionalInfo) {
        const url = JSON.parse(additionalInfo).url;
        const payload = JSON.parse(additionalInfo).payload;

        res.render('pages/loading_2c2p_3ds', {
          url: url,
          payload: payload,
        });
      }
    }
  } catch (e) {
    log('checkout', 'createOrderPay2c2p', req, e.message, false);
    return res.redirect(301, '/checkout/error');
  }
};

const deleteStoreCard = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { p2c2pId } = req.body;

  try {
    const response = await CheckoutService.deleteStoreCard(p2c2pId, store);

    log('checkout', 'deleteStoreCard', req, response);
    return res.json({ response });
  } catch (e) {
    log('checkout', 'deleteStoreCard', req, e.message, false);
    return res.json({ response: false });
  }
};

const getDeliverySlot = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { cartId, shippingMethod, subDistrictId } = req.query;

  try {
    const response = await CheckoutService.getDeliverySlot(
      store,
      cartId,
      shippingMethod,
      subDistrictId,
    );
    log('checkout', 'getDeliverySlot', req, response);
    return res.json({ slots: response });
  } catch (e) {
    log('checkout', 'getDeliverySlot', req, e.message, false);
    return res.json({ response: false, message: e?.response?.data || '' });
  }
};

const deleteDeliverySlot = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const { cartId } = req.body;
    const response = await CheckoutService.deleteDeliverySlot(store, cartId);

    log('checkout', 'deleteDeliverySlot', req, response);

    return res.json(response);
  } catch (e) {
    if (e.response) {
      log('checkout', 'deleteDeliverySlot', req, e.response.data, false);
      return res.json(e.response.data);
    } else if (e.message) {
      log('checkout', 'deleteDeliverySlot', req, e.message, false);
      return res.json({ error: e.message });
    }
  }
};

export default {
  getAllPayment,
  getStoreCard,
  createOrder,
  createOrderPay2c2p,
  addDeliverySlotInfo,
  deleteStoreCard,
  validateDeliverySlot,
  getStorLocator,
  getStorPickUpSlot,
  getDeliverySlot,
  deleteDeliverySlot,
};
