import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import CreditCardPromotionList from '@/client/components/CreditCardPromotion/CreditCardPromotionList';
import { ButtonRadio } from '@client/components/ButtonRadio';
import NewCreditCardForm from '@client/components/CreditCard/NewCreditCardForm';
import SavedCreditCardList from '@client/components/CreditCard/SavedCreditCardList';
import { useCreditCardContext } from '@client/contexts/CreditCardContext';
import { typesPaymentMethods } from '@client/contexts/payment/types';

const ButtonRadioWrap = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 700;
  line-height: 15px;
  letter-spacing: -0.4px;
  cursor: pointer;

  ${props =>
    props.active &&
    `
    border: solid 1px #80bd00;
    background-color: rgba(128, 189, 0, 0.1);
  `}
`;
const PaymentMethod = ({ paymentMethod, onConfirmPayment }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const {
    cardList,
    setOpenCreditCardFormInSavedList,
    setIsShowCardList,
  } = useCreditCardContext();

  const handlePaymentMethod = useCallback(
    method => {
      setSelectedMethod(method?.code || '');
      onConfirmPayment(method?.code || '');
      setOpenCreditCardFormInSavedList(false);
      setIsShowCardList(true);
    },
    [setSelectedMethod, setOpenCreditCardFormInSavedList, setIsShowCardList],
  );

  useEffect(() => {
    if (cardList?.length > 0) {
      const paymentService = find(
        paymentMethod,
        method =>
          method?.code === typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT,
      );

      if (!isEmpty(paymentService)) {
        handlePaymentMethod({
          code: typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT,
        });
      }
    }
  }, [cardList, paymentMethod, handlePaymentMethod]);

  return map(paymentMethod, (method, idx) => {
    const active = selectedMethod === method.code;
    return (
      <Fragment key={method.code}>
        <ButtonRadioWrap
          id={`payment-method-${idx}`}
          active={active}
          onClick={() => handlePaymentMethod(method)}
        >
          <ButtonRadio
            name={'payment_method'}
            label={method.title}
            checked={active}
          />
        </ButtonRadioWrap>
        {
          <React.Fragment>
            {method.code === typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT &&
              active &&
              (cardList?.length > 0 ? (
                <SavedCreditCardList />
              ) : (
                <NewCreditCardForm />
              ))}
            {method.code === typesPaymentMethods.CREDITCARDONDELIVERY &&
              active && <CreditCardPromotionList />}
          </React.Fragment>
        }
      </Fragment>
    );
  });
};

export default PaymentMethod;
