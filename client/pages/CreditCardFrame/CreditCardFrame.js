import creditCardType from 'credit-card-type';
import { Form, Formik, useFormikContext } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';

import TooltipCvv from '@client/components/CreditCard/TooltipCvv';
import { TextGuide } from '@client/components/Typography';
import { creditCardEventType } from '@client/constants/creditCardEventType';
import withLocales from '@client/hoc/withLocales';
import {
  transformCardExpiredDate,
  transformCardNumber,
  transformCVV,
} from '@client/utils/creditCard';
import { creditCardTypeImages } from '@client/utils/creditCardTypeImages';
import { scrollToErrorElement } from '@client/utils/form';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';
import {
  validateCreditCardCVV,
  validateCreditCardExpiredDate,
  validateCreditCardMaxLength,
  validateCreditCardNumber,
} from '@client/utils/validations';

const CardInfoWrapper = styled.div`
  max-width: 302px;
  min-height: 72px;

  @media only screen and (max-width: 480px) {
    max-width: 100%;
  }
`;

const CardInputContainer = styled.div`
  min-height: 72px;
`;

const AcceptedCardContainer = styled.div`
  margin: 10px 0 7px;
`;

const AcceptedCard = styled.div`
  margin-top: 8px;
  img {
    margin-right: 5px;
  }
`;

const CardFooter = styled.div`
  display: flex;
  width: 302px;
  min-height: 72px;
`;

const CardInputExpiry = styled.div`
  width: 92px;
`;

const CardInputCVV = styled.div`
  width: 98px;
  margin-left: 15px;

  @media only screen and (max-width: 480px) {
    margin-left: 16px;
  }
`;

const CardInput = styled.input`
  line-height: 30px;
  height: 30px;
  font-size: 14px;
  font-family: Sans-Serif !important;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #ffffff;
  -webkit-appearance: none;
  width: 100%;
  padding: 0px 10px 0 10px;
  margin-bottom: 4.4px;
  border-color: ${({ error }) => error && `#ec1d24`};
  color: #2a2a2a;
  ::placeholder {
    color: #bfbfbf;
    font-size: 12px;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
  [type='number'] {
    -moz-appearance: textfield;
  }
`;

const CreditCardFrame = ({ translate }) => {
  const refCreditCard = useRef();
  let html = 'loading';
  const [cardInfo, setCardInfo] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = window?.App?.my2c2p_encrypt_credit_card_url;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (typeof window !== 'undefined') {
    const validationSchema = {
      cardName: yup
        .string()
        .required(
          translate('payment.credit_card.form.errors.card_name_required'),
        ),
      cardNumber: yup
        .string()
        .required(
          translate('payment.credit_card.form.errors.card_number_required'),
        )
        .typeError(
          translate('payment.credit_card.form.errors.card_number_required'),
        )
        .test(
          'Credit card',
          translate('payment.credit_card.form.errors.card_number_invalid'),
          async value => {
            return value ? validateCreditCardNumber(value, cardInfo) : false;
          },
        ),
      cardExpiredDate: yup
        .string()
        .trim()
        .required(
          translate(
            'payment.credit_card.form.errors.card_expired_date_required',
          ),
        )
        .test(
          'ExpiredDate',
          translate(
            'payment.credit_card.form.errors.card_expired_date_invalid',
          ),
          value => {
            return value ? validateCreditCardExpiredDate(value) : false;
          },
        ),
      cardCVV: yup
        .string()
        .trim()
        .required(
          translate('payment.credit_card.form.errors.card_CVV_required'),
        )
        .test(
          'CVV',
          translate('payment.credit_card.form.errors.card_CVV_invalid'),
          value => {
            return value
              ? validateCreditCardCVV(value, cardInfo[0]?.code?.size || 3)
              : false;
          },
        ),
    };

    const initialValues = {
      cardName: '',
      cardNumber: '',
      cardExpiredDate: '',
      cardCVV: '',
    };

    const propsFormikCreditCard = {
      initialValues: initialValues,
      validationSchema: yup.object(validationSchema),
      onSubmit: (values, { setSubmitting }) => {
        /* istanbul ignore next  */
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      },
    };

    html = (
      <React.Fragment>
        <style
          dangerouslySetInnerHTML={{
            __html: 'body {margin:0} html, body { height: 100% }',
          }}
        />
        <Formik key={'credit-card-frame'} {...propsFormikCreditCard}>
          {props => {
            const {
              touched,
              errors,
              handleChange,
              handleSubmit,
              getFieldProps,
            } = props;

            const creditCardInfo = cardInfo[0];
            const cardTypeImage = creditCardTypeImages(
              creditCardInfo?.type || '',
            );
            const creditCardLength = validateCreditCardMaxLength(
              creditCardInfo?.lengths || [],
            );

            return (
              <Form
                id="2c2p-payment-form"
                onSubmit={handleSubmit}
                data-testid={generateTestId({
                  type: ELEMENT_TYPE.FORM,
                  action: ELEMENT_ACTION.VIEW,
                  moduleName: 'CreditCardFrame',
                })}
              >
                <CardInfoWrapper>
                  <TextGuide type="topic" bold htmlFor="cardTopic">
                    {translate('payment.credit_card.card_title')}
                  </TextGuide>
                  <AcceptedCardContainer>
                    <TextGuide type="body" bold htmlFor="cardAccepted">
                      {translate('payment.credit_card.accepted_card')}
                    </TextGuide>
                    <AcceptedCard>
                      <img src={cardTypeImage?.visa} />
                      <img src={cardTypeImage?.master} />
                      <img src={cardTypeImage?.jcb} />
                      <img src={cardTypeImage?.amex} />
                    </AcceptedCard>
                  </AcceptedCardContainer>
                  <CardInputContainer>
                    <TextGuide type="body" bold htmlFor="cardNumber">
                      {translate('payment.credit_card.form.card_number')}
                    </TextGuide>
                    <CardInput
                      id="cardNumber"
                      name="cardNumber"
                      maxLength={creditCardLength?.maxLengthInput || 19}
                      type="tel"
                      data-testid={generateTestId({
                        type: ELEMENT_TYPE.INPUT,
                        action: ELEMENT_ACTION.FORM,
                        moduleName: 'CreditCardFrame',
                        uniqueId: 'CardNumber',
                      })}
                      placeholder={translate(
                        'payment.credit_card.form.card_number_placeholder',
                      )}
                      {...getFieldProps('cardNumber')}
                      onChange={event => {
                        let cardInfo = '';
                        if (event?.target?.value) {
                          cardInfo = creditCardType(event?.target?.value);
                        }

                        setCardInfo(cardInfo || []);
                        transformCardNumber(event, handleChange);
                      }}
                      error={errors.cardNumber && touched.cardNumber}
                    />

                    {errors.cardNumber && touched.cardNumber && (
                      <TextGuide
                        type="caption-3"
                        color="#ed1d23"
                        data-testid={generateTestId({
                          type: ELEMENT_TYPE.INPUT,
                          action: ELEMENT_ACTION.FORM,
                          moduleName: 'CreditCardFrame',
                          uniqueId: 'CardNumberError',
                        })}
                      >
                        {translate(errors.cardNumber)}
                      </TextGuide>
                    )}
                  </CardInputContainer>

                  <CardInputContainer>
                    <TextGuide type="body" bold htmlFor="cardName">
                      {translate('payment.credit_card.form.card_name')}
                    </TextGuide>
                    <CardInput
                      id="cardName"
                      name="cardName"
                      maxLength="255"
                      type="text"
                      data-testid={generateTestId({
                        type: ELEMENT_TYPE.INPUT,
                        action: ELEMENT_ACTION.FORM,
                        moduleName: 'CreditCardFrame',
                        uniqueId: 'CardName',
                      })}
                      placeholder={translate(
                        'payment.credit_card.form.card_name_placeholder',
                      )}
                      {...getFieldProps('cardName')}
                      error={errors.cardName && touched.cardName}
                    />

                    {errors.cardName && touched.cardName && (
                      <TextGuide
                        type="caption-3"
                        color="#ed1d23"
                        data-testid={generateTestId({
                          type: ELEMENT_TYPE.INPUT,
                          action: ELEMENT_ACTION.FORM,
                          moduleName: 'CreditCardFrame',
                          uniqueId: 'CardNameError',
                        })}
                      >
                        {translate(errors.cardName)}
                      </TextGuide>
                    )}
                  </CardInputContainer>

                  <CardFooter>
                    <CardInputExpiry>
                      <TextGuide type="body" bold htmlFor="cardExpiredDate">
                        {translate(
                          'payment.credit_card.form.card_expired_date',
                        )}
                      </TextGuide>
                      <CardInput
                        id="cardExpiredDate"
                        name="cardExpiredDate"
                        maxLength={5}
                        type="text"
                        autoComplete="off"
                        data-testid={generateTestId({
                          type: ELEMENT_TYPE.INPUT,
                          action: ELEMENT_ACTION.FORM,
                          moduleName: 'CreditCardFrame',
                          uniqueId: 'CardExpiredDate',
                        })}
                        placeholder={translate(
                          'payment.credit_card.form.card_expired_date_placeholder',
                        )}
                        {...getFieldProps('cardExpiredDate')}
                        onChange={event => {
                          transformCardExpiredDate(event, handleChange);
                        }}
                        error={
                          errors.cardExpiredDate && touched.cardExpiredDate
                        }
                      />

                      {errors.cardExpiredDate && touched.cardExpiredDate && (
                        <TextGuide
                          type="caption-3"
                          color="#ed1d23"
                          data-testid={generateTestId({
                            type: ELEMENT_TYPE.INPUT,
                            action: ELEMENT_ACTION.FORM,
                            moduleName: 'CreditCardFrame',
                            uniqueId: 'CardExpiredDateError',
                          })}
                        >
                          {translate(errors.cardExpiredDate)}
                        </TextGuide>
                      )}
                    </CardInputExpiry>

                    <CardInputCVV>
                      <TextGuide type="body" bold htmlFor="cardCVV">
                        {translate('payment.credit_card.form.card_CVV')}{' '}
                      </TextGuide>

                      <CardInput
                        id="cardCVV"
                        name="cardCVV"
                        maxLength={cardInfo[0]?.code?.size || 3}
                        type="tel"
                        data-encrypt="cvv"
                        autoComplete="off"
                        data-testid={generateTestId({
                          type: ELEMENT_TYPE.INPUT,
                          action: ELEMENT_ACTION.FORM,
                          moduleName: 'CreditCardFrame',
                          uniqueId: 'CardCVV',
                        })}
                        {...getFieldProps('cardCVV')}
                        onChange={event => {
                          transformCVV(event, handleChange);
                        }}
                        placeholder={translate(
                          'payment.credit_card.form.card_cvv_placeholder',
                        )}
                        error={errors.cardCVV && touched.cardCVV}
                      />

                      {errors.cardCVV && touched.cardCVV && (
                        <TextGuide
                          type="caption-3"
                          color="#ed1d23"
                          data-testid={generateTestId({
                            type: ELEMENT_TYPE.INPUT,
                            action: ELEMENT_ACTION.FORM,
                            moduleName: 'CreditCardFrame',
                            uniqueId: 'CardCVVError',
                          })}
                        >
                          {translate(errors.cardCVV)}
                        </TextGuide>
                      )}
                    </CardInputCVV>

                    <TooltipCvv />
                  </CardFooter>
                  <HandleCreditCardFrame refCreditCard={refCreditCard}>
                    {({
                      expMonthCardInfo,
                      expYearCardInfo,
                      encryptCardNumber,
                    }) => (
                      <React.Fragment>
                        <CardInput
                          type="hidden"
                          data-encrypt="cardnumber"
                          value={encryptCardNumber}
                          maxLength={creditCardLength?.maxLengthInput || 19}
                          data-testid={generateTestId({
                            type: ELEMENT_TYPE.INPUT,
                            action: ELEMENT_ACTION.FORM,
                            moduleName: 'CreditCardFrame',
                            uniqueId: 'EncryptCardNumber',
                          })}
                        />

                        <CardInput
                          type="hidden"
                          data-encrypt="month"
                          maxLength="2"
                          placeholder="MM"
                          value={expMonthCardInfo}
                          data-testid={generateTestId({
                            type: ELEMENT_TYPE.INPUT,
                            action: ELEMENT_ACTION.FORM,
                            moduleName: 'CreditCardFrame',
                            uniqueId: 'ExpMonthCardInfo',
                          })}
                        />
                        <CardInput
                          type="hidden"
                          data-encrypt="year"
                          maxLength="2"
                          placeholder="YY"
                          value={expYearCardInfo}
                          data-testid={generateTestId({
                            type: ELEMENT_TYPE.INPUT,
                            action: ELEMENT_ACTION.FORM,
                            moduleName: 'CreditCardFrame',
                            uniqueId: 'ExpYearCardInfo',
                          })}
                        />
                      </React.Fragment>
                    )}
                  </HandleCreditCardFrame>
                </CardInfoWrapper>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
  return (
    <div id="credit-card-frame" ref={refCreditCard}>
      {html}
    </div>
  );
};

export default withLocales(CreditCardFrame);

const encryptedCreditCard = () => {
  /* istanbul ignore next  */
  try {
    return new Promise(function(resolve, reject) {
      //Get function My2c2p in Component Tokenization
      window.My2c2p.getEncrypted(
        '2c2p-payment-form',
        (encryptedData, errCode, errDesc) => {
          if (errCode !== 0) {
            console.error(errDesc);
            reject(errDesc);
          }
          resolve(encryptedData);
        },
      );
    });
  } catch (error) {
    console.error(error);
  }
};

const HandleCreditCardFrame = props => {
  const { children, refCreditCard } = props;
  const {
    touched,
    values,
    isSubmitting,
    isValidating,
    errors,
    isValid,
    submitForm,
  } = useFormikContext();

  const [encryptCardNumber, setEncryptCardNumber] = useState('');
  const [expMonthCardInfo, setExpMonthCardInfo] = useState('');
  const [expYearCardInfo, setExpYearCardInfo] = useState('');
  const [frameHeight, setFrameHeight] = useState('');

  const handlerEncryptCardNumber = () => {
    if (encryptCardNumber) {
      const payload = {
        type: creditCardEventType.CC_BIN_LOOKUP,
        value: {
          masked: encryptCardNumber.substring(0, 6),
        },
      };
      postMessage(payload);
    }
  };
  useEffect(() => {
    handlerEncryptCardNumber();
  }, [encryptCardNumber]);

  const postMessage = useCallback(payload => {
    window.parent.postMessage(payload, window.location.origin);
  });

  const handlerSubmitForm = async event => {
    const eventType = event?.data?.type;
    if (eventType === creditCardEventType.CC_SUBMIT_FORM) {
      await submitForm();
      const encryptedData =
        isValid && Object.keys(touched).length > 0
          ? await encryptedCreditCard()
          : null;
      if (encryptedData) {
        const payload = {
          type: creditCardEventType.CC_SUBMIT_FORM_RESPONSE,
          value: {
            encryptedData: {
              ...encryptedData,
              cardHolderName: values.cardName,
            },
          },
        };
        postMessage(payload);
      }
    }
  };

  useEffect(() => {
    const event = 'message';
    window.addEventListener(event, handlerSubmitForm);
    return function cleanup() {
      window.removeEventListener(event, handlerSubmitForm);
    };
  });

  const handlerForm = () => {
    if (
      values?.cardExpiredDate ||
      (touched.cardExpiredDate && errors.cardExpiredDate === undefined)
    ) {
      const tempExpiredDate = values?.cardExpiredDate;
      if (tempExpiredDate.length === 5) {
        const tempExpiredDateArray = tempExpiredDate.split('/');
        setExpMonthCardInfo(tempExpiredDateArray[0]);

        const currentFullYear = new Date().getFullYear();
        setExpYearCardInfo(
          `${String(currentFullYear).substring(0, 2)}${
            tempExpiredDateArray[1]
          }`,
        );
      }
    } else {
      setExpMonthCardInfo('');
      setExpYearCardInfo('');
    }

    if (
      values?.cardNumber ||
      (touched?.cardNumber && errors.cardNumber === undefined)
    ) {
      const cardNumber = values?.cardNumber.replace(/\s/g, '');
      if (cardNumber !== encryptCardNumber) setEncryptCardNumber(cardNumber);
    }

    if (errors || isValid || values) {
      const payloadHandleChange = {
        type: creditCardEventType.CC_HANDLE_CHANGE,
        value: {
          errors,
          values,
          touched,
          isValid,
        },
      };
      postMessage(payloadHandleChange);
    }

    // Scroll to error element
    /* istanbul ignore next  */
    if (isSubmitting && !isValidating) {
      try {
        scrollToErrorElement(errors);
      } catch (e) {
        console.error(e);
      }
    }

    const creditCardFrameHeight = refCreditCard?.current?.getBoundingClientRect()
      ?.height;
    const payload = {
      type: creditCardEventType.CC_HEIGHT_CHANGE,
      value: {
        height: creditCardFrameHeight,
      },
    };
    if (frameHeight !== creditCardFrameHeight) {
      setFrameHeight(creditCardFrameHeight);
      postMessage(payload);
    }
  };

  useEffect(() => {
    handlerForm();
  }, [values, errors, touched, isValid, isSubmitting, isValidating]);

  return (
    <React.Fragment>
      {children({ expMonthCardInfo, expYearCardInfo, encryptCardNumber })}
    </React.Fragment>
  );
};
