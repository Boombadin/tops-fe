import { useUpdatePaymentInformationMutation } from '@central-tech/react-hooks';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { useReduxContext } from '@client/contexts';
import paymentActions from '@client/contexts/payment/actions';
import PaymentModel from '@client/contexts/payment/model';
import reducer from '@client/contexts/payment/reducer';
import {
  typesPaymentMethods,
  typeUpdatePayment,
} from '@client/contexts/payment/types';
import {
  usePaymentMethodsQuery,
  useSetPaymentInformationMutation,
} from '@client/operations';

const mutationSetting = {
  awaitRefetchQueries: true,
};

export const PaymentContext = React.createContext();

export function usePaymentContext() {
  return useContext(PaymentContext);
}

const initialState = {
  paymentCode: '',
  paymentLoading: false,
  paymentServiceFullPayment: {
    promotionCode: '',
    saveCard: true,
    savedCard: null,
    isInvalidCard: false,
  },
};

function PaymentProvider({ children }) {
  const [payment, setPayment] = useState(new PaymentModel({ payment: {} }));

  const { reduxState, reduxAction } = useReduxContext();
  const cart = useMemo(() => reduxState.cart?.cart, [reduxState.cart?.cart]);
  const currentStoreCode = useMemo(
    () => reduxState.storeConfig?.current?.code,
    [reduxState.storeConfig],
  );

  const refCreditCardFrame = useRef(null);
  const refCvvForm = useRef(null);

  const others = useMemo(
    () => ({
      refCreditCardFrame,
      refCvvForm,
    }),
    [refCreditCardFrame, refCvvForm],
  );

  const [state, dispatch] = useReducer(reducer, initialState);
  const paymentMethodResponse = usePaymentMethodsQuery({
    variables: {
      isGuest: false,
    },
    headers: {
      Authorization: `Bearer ${Cookie.get('user_token')}`,
      store: currentStoreCode,
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });

  /*** setPaymentInformation for create order ***/
  const [
    setPaymentInformationMutation,
    setPaymentInformationResponse,
  ] = useSetPaymentInformationMutation();
  const setPaymentInformation = useCallback(
    ({ variables }) => {
      return setPaymentInformationMutation({
        ...mutationSetting,
        variables: {
          isGuest: false,
          ...variables,
        },
        headers: {
          Authorization: `Bearer ${Cookie.get('user_token')}`,
          store: currentStoreCode,
        },
      });
    },
    [setPaymentInformationMutation, currentStoreCode],
  );

  /***  set payment code and promotion code ***/
  const [
    updatePaymentInformationMutation,
    updatePaymentInformationResponse,
  ] = useUpdatePaymentInformationMutation();

  const updatePaymentInformation = useCallback(
    async ({ type, promotionCode, paymentCode }) => {
      const refetchQueries = ['paymentMethods', 'cart'];

      const input = {
        payment_method: {
          method: paymentCode,
          extension_attributes: {},
        },
        email: cart?.customer?.email,
      };

      switch (type) {
        case typeUpdatePayment.SET_PAYMENT_METHOD:
          const listPaymentService = [
            typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT,
          ];
          if (listPaymentService.includes(paymentCode)) {
            input.payment_service_methods = paymentCode;
          }
          break;
        case typeUpdatePayment.SET_PROMOTION_CODE:
          input.payment_method.extension_attributes = {
            promotion_id: String(promotionCode),
          };

          break;
        default:
          console.error('updatePaymentInformation: No type');
      }

      return updatePaymentInformationMutation({
        ...mutationSetting,
        variables: {
          isGuest: false,
          input,
        },
        headers: {
          Authorization: `Bearer ${Cookie.get('user_token')}`,
          store: currentStoreCode,
        },
        refetchQueries,
      });
    },
    [cart?.customer?.email, updatePaymentInformationMutation, currentStoreCode],
  );

  const paymentAction = paymentActions(
    { payment, cart, state },
    dispatch,
    { reduxState, reduxAction },
    {
      setPaymentInformation,
      updatePaymentInformation,
      others,
    },
  );

  useEffect(() => {
    if (paymentMethodResponse?.data?.paymentInformations) {
      setPayment(
        new PaymentModel({
          payment: paymentMethodResponse?.data?.paymentInformations,
        }),
      );
    }
  }, [paymentMethodResponse?.data?.paymentInformations]);

  useEffect(() => {
    if (
      paymentMethodResponse?.loading ||
      updatePaymentInformationResponse?.loading ||
      setPaymentInformationResponse?.loading
    ) {
      paymentAction.setPaymentLoading(true);
    } else {
      paymentAction.setPaymentLoading(false);
    }
  }, [
    paymentMethodResponse?.loading,
    updatePaymentInformationResponse?.loading,
    setPaymentInformationResponse?.loading,
  ]);

  const paymentStore = useMemo(
    () => ({
      payment: { ...state, ...payment, ...others, typesPaymentMethods },
      paymentAction,
    }),
    [state, payment, others, paymentAction],
  );

  return (
    <PaymentContext.Provider value={paymentStore}>
      {children}
    </PaymentContext.Provider>
  );
}

PaymentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PaymentProvider;
