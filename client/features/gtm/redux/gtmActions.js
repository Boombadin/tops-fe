import { get } from 'lodash'
import { GTM_FETCH_CHECKOUT } from './gtmActionTypes'
import CartApis from '../../../apis/cart'

export const gtmFetchCheckoutRequest = () => ({ type: GTM_FETCH_CHECKOUT.REQUEST })
export const gtmFetchCheckoutSuccess = (data) => ({ type: GTM_FETCH_CHECKOUT.SUCCESS, data })
export const gtmFetchCheckoutFailure = (error) => ({ type: GTM_FETCH_CHECKOUT.FAILURE, error })
export const gtmFetchCheckout = (cartId) => (dispatch, getState) => {
  const store = getState()
  const customerId = get(store, 'customer.items.id')
  dispatch(gtmFetchCheckoutRequest())
  // return CartApis.get(cartId, customerId)
  //   .then(res => dispatch(gtmFetchCheckoutSuccess(get(res.data, 'cart.items', []))))
  //   .catch(error => dispatch(gtmFetchCheckoutFailure(error)))
}
