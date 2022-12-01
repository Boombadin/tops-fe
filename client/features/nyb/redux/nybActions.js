import axios from 'axios';
import { find, result } from 'lodash';
import Cookie from 'js-cookie';
import {
  CALCULATE_NYB,
  CALCULATE_NYB_CHECKOUT_STEP_1,
  CALCULATE_NYB_CHECKOUT_STEP_2,
  HANDLE_NYB_CHECKOUT_MODAL_ERROR,
  HANDLE_NORMAL_CHECKOUT_MODAL_ERROR,
  FETCH_DISCOUNT_TYPE,
} from './nybActionTypes';
import { baseUrl } from '../../../apis/config';
import { fetchPayment, fetchPaymentRequest } from '../../../reducers/checkout';

export const calculateNybRequest = () => ({ type: CALCULATE_NYB.REQUEST });
export const calculateNybSuccess = data => ({
  type: CALCULATE_NYB.SUCCESS,
  data,
});
export const calculateNybFailure = error => ({
  type: CALCULATE_NYB.FAILURE,
  error,
});
export const calculateNyb = data => (dispatch, getState) => {
  dispatch(calculateNybRequest());
  return axios({
    method: 'POST',
    url: `${baseUrl}/nyb/calculate`,
    data,
  })
    .then(res => dispatch(calculateNybSuccess(res.data.data)))
    .catch(error => dispatch(calculateNybFailure(error)));
};

export const handleCheckoutModalErrorNyb = visible => ({
  type: HANDLE_NYB_CHECKOUT_MODAL_ERROR,
  visible,
});
export const handleCheckoutModalErrorNormal = visible => ({
  type: HANDLE_NORMAL_CHECKOUT_MODAL_ERROR,
  visible,
});

export const calculateNybCheckoutStep1Request = discountType => ({
  type: CALCULATE_NYB_CHECKOUT_STEP_1.REQUEST,
  discountType,
});
export const calculateNybCheckoutStep1Success = data => ({
  type: CALCULATE_NYB_CHECKOUT_STEP_1.SUCCESS,
  data,
});
export const calculateNybCheckoutStep1Failure = error => ({
  type: CALCULATE_NYB_CHECKOUT_STEP_1.FAILURE,
  error,
});
export const calculateNybCheckoutStep1 = discountType => (
  dispatch,
  getState,
) => {
  const userToken = Cookie.get('user_token');
  dispatch(fetchPaymentRequest());
  dispatch(calculateNybCheckoutStep1Request(discountType));
  return axios({
    method: 'GET',
    url: `${baseUrl}/nyb/calculate/step-1/${discountType}`,
  })
    .then(res => {
      dispatch(calculateNybCheckoutStep1Success(res.data.data));
      dispatch(fetchPayment(userToken));
    })
    .catch(error => dispatch(calculateNybCheckoutStep1Failure(error)));
};

export const calculateNybCheckoutStep2Request = issue => ({
  type: CALCULATE_NYB_CHECKOUT_STEP_2.REQUEST,
  issue,
});
export const calculateNybCheckoutStep2Success = data => ({
  type: CALCULATE_NYB_CHECKOUT_STEP_2.SUCCESS,
  data,
});
export const calculateNybCheckoutStep2Failure = error => ({
  type: CALCULATE_NYB_CHECKOUT_STEP_2.FAILURE,
  error,
});
export const calculateNybCheckoutStep2 = issue => (dispatch, getState) => {
  dispatch(calculateNybCheckoutStep2Request(issue));
  return axios({
    method: 'GET',
    url: `${baseUrl}/nyb/calculate/step-2/${issue}`,
  })
    .then(res => dispatch(calculateNybCheckoutStep2Success(res.data.data)))
    .catch(error => dispatch(calculateNybCheckoutStep2Failure(error)));
};

export const fetchDiscountTypeRequest = () => ({
  type: FETCH_DISCOUNT_TYPE.REQUEST,
});
export const fetchDiscountTypeSuccess = data => ({
  type: FETCH_DISCOUNT_TYPE.SUCCESS,
  data,
});
export const fetchDiscountTypeFailure = error => ({
  type: FETCH_DISCOUNT_TYPE.FAILURE,
  error,
});
export const fetchDiscountType = () => (dispatch, getState) => {
  dispatch(fetchDiscountTypeRequest());
  return axios({
    method: 'GET',
    url: `${baseUrl}/nyb/discount-type`,
  })
    .then(res => {
      const { data } = res.data;
      dispatch(fetchDiscountTypeSuccess(data));
      const discountType = result(
        find(data, item => item.selected),
        'type',
        '',
      );
      if (discountType) {
        dispatch(calculateNybCheckoutStep1(discountType));
      }
    })
    .catch(error => dispatch(fetchDiscountTypeFailure(error)));
};
