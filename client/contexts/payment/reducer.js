import { types } from './types';
export const reducer = (state, action) => {
  switch (action.type) {
    case types.SET_PAYMENT:
      return {
        ...state,
        payment: {
          ...action.payload,
        },
      };

    case types.SET_PAYMENT_CODE:
      return {
        ...state,
        paymentCode: action.payload,
      };
    case types.SET_PAYMENT_SERVICE_FULL_PAYMENT:
      return {
        ...state,
        paymentServiceFullPayment: {
          ...state.paymentServiceFullPayment,
          ...action.payload,
        },
      };

    case types.SET_PAYMENT_SERVICE_FULL_PAYMENT_SAVE_CARD:
      return {
        ...state,
        paymentServiceFullPayment: {
          ...state.paymentServiceFullPayment,
          saveCard: action.payload,
        },
      };

    case types.SET_PAYMENT_SERVICE_FULL_PAYMENT_SAVED_CARD:
      return {
        ...state,
        paymentServiceFullPayment: {
          ...state.paymentServiceFullPayment,
          ...action.payload,
        },
      };

    case types.SET_PAYMENT_SERVICE_FULL_PAYMENT_IS_INVALID_CARD:
      return {
        ...state,
        paymentServiceFullPayment: {
          ...state.paymentServiceFullPayment,
          isInvalidCard: action.payload,
        },
      };

    case types.SET_PAYMENT_LOADING:
      return {
        ...state,
        paymentLoading: action.payload,
      };

    case types.SET_PAYMENT_CARD_PROMOTION:
      return {
        ...state,
        cardCode: action.payload,
      };

    case types.SET_PAYMENT_T1C_INFO:
      return {
        ...state,
        t1cInfo: action.payload,
      };

    case types.SET_PATMENT_REMARK:
      return {
        ...state,
        remark: action.payload,
      };

    case types.SET_PAYMENT_SUBSTITUTION:
      return {
        ...state,
        substitution: action.payload,
      };

    case types.SET_PAYMENT_IS_REQUEST_TAX:
      return {
        ...state,
        isRequestTax: action.payload,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default reducer;
