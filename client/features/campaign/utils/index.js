import { map, get, find } from 'lodash';

export const getCouponCode = cartTotals => {
  const couponObj = find(get(cartTotals, 'total_segments'), segment => {
    return segment.code === 'amasty_coupon_amount';
  });
  const couponList = get(couponObj, 'value');
  const coupons = [];
  map(couponList, list => {
    const couponJson = JSON.parse(list);
    coupons.push(couponJson);
  });
  return coupons;
};
