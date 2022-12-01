

import { get } from 'lodash'
import { createDeepEqualSelector } from '../../../utils/selectors'
import { ROUTE_CATEGORY_NYB } from '../../../config/promotions';

// Find State in Redux
export const findNyb = (state) => state.nyb
export const findNormalModalError = (state) => state.nyb.isModalNormal
export const findNybModalError = (state) => state.nyb.isModalNYB
export const findPaymentIsNyb = (state) => get(state, 'checkout.payment.extension_attributes.product_attribute_restriction', '')
export const findEveryProductIsNyb = (state) => get(state, 'cart.cart.items', []).every(item => findIsNyb(item))
export const findDeliverySlot = (state) => get(state, 'cart.shippingMethods.data.0.extensionAttributes.delivery_slot', [])
export const findCategoryNYB = (state) => get(state, 'category.items', []).filter(item => item.url_path === ROUTE_CATEGORY_NYB.slice(1)).length

// Selectors
export const makeGetNyb = () => createDeepEqualSelector(
  findNyb, (nyb) => nyb
)
export const makeGetNormalModalError = () => createDeepEqualSelector(
  findNormalModalError, (visible) => visible
)
export const makeGetNybModalError = () => createDeepEqualSelector(
  findNybModalError, (visible) => visible
)
export const makeGetPaymentIsNyb = () => createDeepEqualSelector(
  findPaymentIsNyb, (productType) => productType === 'is_nyb'
)
export const makeGetCategoryNYB = () => createDeepEqualSelector(
  findCategoryNYB, (isCategoryNyb) => Boolean(isCategoryNyb)
)
export const makeGetNybVoucher = () => createDeepEqualSelector(
  findNyb, (voucher) => ({
    voucherLoading: voucher.voucherLoading,
    voucher: voucher.voucher,
    voucherError: voucher.voucherError,
  })
)
export const makeGetDiscountType = () => createDeepEqualSelector(
  findNyb, (discount) => ({
    discountTypeLoading: discount.discountTypeLoading,
    discountType: discount.discountType,
    discountTypeError: discount.discountTypeError,
  })
)

// Check Is NYB
export const findIsNyb = (product) => {
  const isNyb = get(product, 'is_nyb', false)
  return isNyb === '1' || isNyb === true || isNyb === 1 
}
