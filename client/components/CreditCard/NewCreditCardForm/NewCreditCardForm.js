import { breakpoint } from '@central-tech/core-ui';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import { useCreditCardContext } from '@client/contexts';
import withLocales from '@client/hoc/withLocales';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
  generateTestId,
} from '@client/utils/generateElementId';

import usePaymentServiceFullPayment from './hooks/usePaymentServiceFullPayment';

const PaymentMethodWarpper = styled.div`
  border-radius: 5px;
  border: solid 1px #f3f3f3;
  background-color: #fbfbfb;
  padding: 15px 20px 20px;
  margin-bottom: 10px;

  ${breakpoint('xs', 'md')`
    border: none;
    background-color: #ffffff;
    padding: 0;
  `}
`;

const PaymentMethodContent = styled.div``;
const IframeCreditCard = styled.iframe`
  border: none;
  overflow: hidden;
`;
const CheckBoxWrapper = styled.label`
  display: block;
  position: relative;
  padding-left: 25px;
  margin: 0 10px 0 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  &:hover input ~ .checkbox-checkmark {
    background-color: #eee;
  }

  input:checked ~ .checkbox-checkmark {
    background-color: #80bd00;
  }

  input:checked ~ .checkbox-checkmark:after {
    display: block;
  }
`;
const CheckBoxCheckMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  border-radius: 2px;
  box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #cccccc;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);

  &:after {
    content: '';
    position: absolute;
    display: none;
  }

  &:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;
const FormCheckbox = styled.form`
  margin-top: 10px;
`;
const NewCreditCardFromBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const CancelButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #2a2a2a;
  width: 87px;
  height: 28px;
  border-radius: 4px;
  border: solid 1px #dedede;
  background: #fff;
  cursor: pointer;
`;
const NewCreditCardForm = ({ translate, isShowCancelButton = false }) => {
  const {
    refCreditCardFrame,
    heightCreditCardFrame,
    urlCreditCardFrame,
    isInvalidCard,
    paymentServiceFullPayment,
    handleSaveCard,
  } = usePaymentServiceFullPayment();
  const {
    setOpenDiscardNewCreditCardFormModal,
    setCreditCardFormActive,
  } = useCreditCardContext();

  const handleCancelBtnClick = () => {
    setOpenDiscardNewCreditCardFormModal({ open: true });
  };

  useEffect(() => {
    setCreditCardFormActive(true);

    return () => {
      setCreditCardFormActive(false);
    };
  }, []);

  return (
    <PaymentMethodWarpper
      data-testid={generateElementId(
        ELEMENT_TYPE.INFO,
        ELEMENT_ACTION.VIEW,
        'NewCreditCardForm',
        '',
        'container',
      )}
    >
      <PaymentMethodContent>
        <IframeCreditCard
          data-testid="credit-card-frame"
          src={urlCreditCardFrame}
          scrolling="no"
          width="100%"
          height={heightCreditCardFrame}
          sandbox={'allow-same-origin allow-scripts'}
          ref={refCreditCardFrame}
        ></IframeCreditCard>
        <NewCreditCardFromBottom>
          <FormCheckbox>
            <CheckBoxWrapper className="checkbox-container">
              <TextGuide type="body" bold htmlFor={'setDefaultCard'}>
                {translate('payment.credit_card.form.default_card')}{' '}
              </TextGuide>
              <input
                id="saveCard"
                name="saveCard"
                type="checkbox"
                checked={paymentServiceFullPayment.saveCard}
                onChange={() => handleSaveCard()}
                data-testid={generateTestId({
                  type: ELEMENT_TYPE.INPUT,
                  action: ELEMENT_ACTION.FORM,
                  moduleName: 'NewCreditCardForm',
                  uniqueId: 'saveCard',
                })}
              />
              <CheckBoxCheckMark className="checkbox-checkmark"></CheckBoxCheckMark>
            </CheckBoxWrapper>
          </FormCheckbox>
          {isInvalidCard && <p>{translate('error_invalid_card')}</p>}
          {isShowCancelButton && (
            <CancelButton onClick={handleCancelBtnClick}>
              <TextGuide type="body" htmlFor={'Cancel'}>
                {translate('payment.credit_card.form.cancel_button')}{' '}
              </TextGuide>
            </CancelButton>
          )}
        </NewCreditCardFromBottom>
      </PaymentMethodContent>
    </PaymentMethodWarpper>
  );
};

export default withLocales(NewCreditCardForm);
