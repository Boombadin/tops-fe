import {
  get,
  find,
  first,
  isEmpty,
  map,
  filter,
  forEach,
  chunk,
  size,
  sumBy,
} from 'lodash';
import Cookie from 'js-cookie';
import { includeProduct } from '../../../../client/utils/cart';

const translation = {
  th_TH: {
    soi: 'ซอย',
    moo: 'หมู่',
  },
  en_US: {
    soi: 'Soi',
    moo: 'Moo',
  },
};

function calculateCouponDiscountAmaty(cartTotals) {
  const isNyb =
    get(cartTotals, 'extension_attributes.product_attribute_restriction') ===
    'is_nyb';
  const isNybActive =
    get(
      cartTotals,
      'extension_attributes.product_attribute_restriction_active',
    ) === '1';

  if (isNyb && isNybActive) {
    const coupon = get(cartTotals, 'discount_amount');
    return Math.abs(coupon);
  }
  const couponObj = find(get(cartTotals, 'total_segments'), segment => {
    return segment.code === 'amasty_coupon_amount';
  });

  if (!couponObj) {
    return 0;
  }

  const couponList = couponObj.value;
  let summaryCoupon = 0;

  if (!isEmpty(couponList) && couponList.length > 0) {
    map(couponList, list => {
      const couponJson = JSON.parse(list);
      const thisDiscount = couponJson.coupon_amount.replace(
        /-฿|-\u0e3f|,/g,
        '',
      );
      summaryCoupon += parseFloat(thisDiscount);
    });
  }

  return summaryCoupon;
}

export const value = (obj, key) => {
  return get(
    find(obj, x => x.attribute_code === key),
    'value',
    '',
  );
};

export const getBillingAddress = (cart, lang) => {
  const billingAddress = get(cart, 'billing_address', '');
  const customAttr = get(billingAddress, 'custom_attributes', {});
  const billing = {
    region: get(billingAddress, 'region', ''),
    road: value(customAttr, 'road'),
    district: value(customAttr, 'district'),
    subdistrict: value(customAttr, 'subdistrict'),
    house_no: value(customAttr, 'house_no'),
    soi: value(customAttr, 'soi'),
    moo: value(customAttr, 'moo'),
    village: value(customAttr, 'village_name'),
    postcode: get(billingAddress, 'postcode', ''),
    firstname: get(billingAddress, 'firstname', ''),
    lastname: get(billingAddress, 'lastname', ''),
    contact_number: get(billingAddress, 'telephone', ''),
  };

  return {
    billing: billing,
    group_address: `${billing.house_no} ${billing.soi &&
      `${translation[lang].soi} ${billing.soi}`} ${billing.moo &&
      `${translation[lang].moo} ${billing.moo}`} ${billing.village} ${
      billing.road
    } ${billing.subdistrict} ${billing.district} ${billing.region} ${
      billing.postcode
    }`,
  };
};

export const getCheckoutSummary = (cart, cartTotals) => {
  const amatyCouponDiscount = calculateCouponDiscountAmaty(cartTotals);
  const otherDiscount = Math.abs(get(cartTotals, 'discount_amount', 0));

  const discount = otherDiscount - amatyCouponDiscount;

  const t1cEarn = Math.floor(
    get(cart, 'extension_attributes.estimate_t1c_point', 0),
  );
  const shipping = get(cart, 'extension_attributes', '');
  const customer = get(cart, 'customer', '');
  const t1Phone = find(get(customer, 'custom_attributes', {}), {
    attribute_code: 't1c_phone',
  });
  const t1Card = find(get(customer, 'custom_attributes', {}), {
    attribute_code: 't1c_card',
  });
  const summary = {
    total: get(cartTotals, 'subtotal_incl_tax', 0) - discount,
    shipping_fee: get(cartTotals, 'shipping_incl_tax', 0),
    order_total:
      get(cartTotals, 'grand_total', 0) + get(cartTotals, 'tax_amount', 0),
    coupon: amatyCouponDiscount,
    t1c_earn: t1cEarn,
    shipping_slot_id: get(shipping, 'shipping_slot_id', ''),
    shipping_date: get(shipping, 'shipping_date', ''),
    shipping_slot_time: get(shipping, 'shipping_slot_time', ''),
    delivery_method: get(
      cart,
      'extension_attributes.shipping_assignments.0.shipping.method',
      '',
    ),
    t1c_phone: !isEmpty(t1Phone) ? t1Phone.value : '',
    t1c_card: !isEmpty(t1Card) ? t1Card.value : '',
    receiver_name: get(shipping, 'pickup_store.receiver_name', ''),
    receiver_phone: get(shipping, 'pickup_store.receiver_phone', ''),
  };
  return summary;
};

export const getNextRoundDelivery = (shippingMethods, methodCode) => {
  let slotActive = null;
  const dates = get(
    find(shippingMethods, x => x.methodCode === methodCode),
    'extensionAttributes.deliverySlot',
    [],
  );

  forEach(dates, date => {
    const available = filter(
      get(date, 'slots'),
      x => x.available > 0 && x.enabled === true && x.isAllow === true,
    );
    if (available.length > 0) {
      slotActive = {
        date: get(date, 'date'),
        slot: first(available),
      };
      return false;
    }
  });

  return slotActive;
};

export const getShippingMethod = (shippingMethods, methodCode) => {
  const method = find(shippingMethods, x => x.methodCode === methodCode);
  const slotLabel = find(
    method?.extensionAttributes?.shipping_description,
    shippingDes => shippingDes?.key === 'slot_label',
  );

  return {
    method,
    slotLabel: slotLabel?.value || '',
    nextRound: getNextRoundDelivery(shippingMethods, methodCode),
  };
};

export const getDefaultStoreLocator = (stores, customer) => {
  const attrs = get(customer, 'custom_attributes');

  if (
    isEmpty(value(attrs, 'shipping_method')) ||
    value(attrs, 'shipping_method') !== 'pickup'
  ) {
    return null;
  }

  const sotre = find(stores, x => {
    return x.id === Number(value(attrs, 'location_id'));
  });
  return sotre;
};

export const getDefaultBillingAddress = customer => {
  const addresses = get(customer, 'addresses');
  let billingAddress = null;

  if (!isEmpty(Cookie.get('default_billing'))) {
    billingAddress = find(
      addresses,
      addr => get(addr, 'id') == Cookie.get('default_billing'),
    );
  }

  if (isEmpty(billingAddress)) {
    billingAddress = find(
      addresses,
      addr => get(addr, 'id') == get(customer, 'default_billing'),
    );
  }

  return billingAddress;
};

export const sumCartRowBundleItems = itemsBundle => {
  let sumCountRowItems = 0;
  map(itemsBundle, bundle => {
    const promoItems = get(bundle, 'items', {});
    const promoQtyStep = get(bundle, 'qty_step', 0);
    const actionDiscountType = get(bundle, 'action_discount_type', '');
    const DISCOUNT_KEY = 'central_eachn_percent_discount';

    const itemChunks = chunk(promoItems, promoQtyStep);

    map(itemChunks, chunk => {
      let groubItem;
      let freeItem;
      if (actionDiscountType === DISCOUNT_KEY) {
        if (size(chunk) > 0) {
          groubItem = includeProduct(chunk.slice(0, promoQtyStep - 1));
          freeItem = chunk.slice(promoQtyStep - 1);

          sumCountRowItems =
            sumCountRowItems + size(groubItem) + size(freeItem);
        }
      } else {
        chunk = includeProduct(chunk);

        sumCountRowItems = sumCountRowItems + size(chunk);
      }
    });
  });

  return sumCountRowItems;
};

export const sumItemsInCart = cartItems => {
  const sumQty = sumBy(cartItems, item => {
    if (item.type_id === 'bundle') {
      return item.qty_per_pack + item.qty;
    }
    return item.qty;
  });
  return sumQty;
};
