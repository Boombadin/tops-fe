import { Formik, useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';

import NewCreditCardForm from '@client/components/CreditCard/NewCreditCardForm';
import SavedCreditCardListItem from '@client/components/CreditCard/SavedCreditCardListItem';
import TooltipCvv from '@client/components/CreditCard/TooltipCvv';
import { TextGuide } from '@client/components/Typography';
import {
  useCreditCardContext,
  useFirebaseContext,
  usePaymentContext,
  useReduxContext,
} from '@client/contexts';
import withLocales from '@client/hoc/withLocales';
import { transformCVV } from '@client/utils/creditCard';
import { scrollToErrorElement } from '@client/utils/form';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';
import {
  validateCreditCardCVV,
  validateCreditCardCVV4Digits,
} from '@client/utils/validations';

const CardWithCvvFormWrap = styled.div`
  width: 100%;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;
const CardWithCvvFormInside = styled.div`
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
`;
const CardCvvWrap = styled.div`
  padding: 0 0 10px 95px;
`;
const CardCvvInside = styled.div`
  display: flex;
`;
const CardInputCVV = styled.div`
  width: 98px;
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
const AddNewCardWrap = styled.div`
  width: 100%;
  cursor: pointer;
`;
const AddNewCardInside = styled.div`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0 15px;
  font-size: 13px;
  position: relative;
  background-color: white;
`;
const AddNewCardIcon = styled.div`
  margin: 0 17px 0 30px;
  width: 28px;
  height: 21px;
  border: 1px solid #b4b8c1;
  border-radius: 2px;
  color: #b4b8c1;
  text-align: center;
`;
const SavedCreditCardList = ({ translate, lang }) => {
  const [bankName, setBankName] = useState({});

  const { payment } = usePaymentContext();
  const {
    cardList,
    currentSelectedCard,
    isShowCardList,
    setIsShowCardList,
    setCurrentSelectedCard,
    openCreditCardFormInSavedList,
    setOpenCreditCardFormInSavedList,
  } = useCreditCardContext();
  const { reduxState } = useReduxContext();
  const { firestoreAction } = useFirebaseContext();

  const handleSelectCard = card => {
    setCurrentSelectedCard(card);
  };

  const handleOpenAddCardForm = () => {
    setOpenCreditCardFormInSavedList(true);
    setIsShowCardList(false);
  };

  useEffect(() => {
    if (window.M2c2p === undefined) {
      const script = document.createElement('script');
      script.src = window?.App?.my2c2p_encrypt_credit_card_url;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const remoteConfigBankName = await firestoreAction.getRemoteConfig(
        'bank_name_mapping',
      );
      if (!isEmpty(remoteConfigBankName)) {
        setBankName(JSON.parse(remoteConfigBankName));
      }
    })();
  }, []);

  const validationSchema = {
    cardCVV: yup
      .string()
      .trim()
      .required(translate('payment.credit_card.form.errors.card_CVV_required'))
      .test(
        'CVV',
        translate('payment.credit_card.form.errors.card_CVV_invalid'),
        value => {
          if (currentSelectedCard?.type?.toUpperCase() === 'AMEX') {
            return value ? validateCreditCardCVV4Digits(value) : false;
          }
          return value ? validateCreditCardCVV(value) : false;
        },
      ),
  };

  const initialValues = {
    cardCVV: '',
    encryptedCardInfo: '',
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
  return (
    <div>
      {isShowCardList && (
        <CardWithCvvFormWrap>
          {cardList
            ?.sort(a => (a?.isDefault ? -1 : 0))
            ?.map(card => {
              const isCardSelected = currentSelectedCard?.id === card?.id;
              const isShowCvvForm =
                reduxState?.cart?.cartTotals?.base_grand_total > 10000 &&
                isCardSelected;
              const cardBankName =
                card?.bankName in bankName
                  ? bankName?.[card?.bankName]?.[lang?.url]
                  : card?.bankName;
              return (
                <CardWithCvvFormInside key={card.id}>
                  <SavedCreditCardListItem
                    isCanBeSelect
                    isCanBeDelete={false}
                    card={card}
                    bankName={cardBankName}
                    selectedCard={currentSelectedCard}
                    onSelectCard={handleSelectCard}
                  />
                  {isShowCvvForm && (
                    <div
                      data-testid={generateTestId({
                        type: ELEMENT_TYPE.FORM,
                        action: ELEMENT_ACTION.VIEW,
                        moduleName: 'SavedCreditCardList',
                        uniqueId: 'CvvFormContainer',
                      })}
                    >
                      <Formik
                        key={'form-cvv'}
                        {...propsFormikCreditCard}
                        innerRef={payment?.refCvvForm}
                      >
                        {props => {
                          const {
                            touched,
                            errors,
                            handleChange,
                            handleSubmit,
                            getFieldProps,
                          } = props;
                          return (
                            <form
                              id="2c2p-payment-form-cvv"
                              onSubmit={handleSubmit}
                              data-testid={generateTestId({
                                type: ELEMENT_TYPE.FORM,
                                action: ELEMENT_ACTION.VIEW,
                                moduleName: 'SavedCreditCardList',
                                uniqueId: 'CvvForm',
                              })}
                            >
                              <CardCvvWrap>
                                <CardCvvInside>
                                  <CardInputCVV>
                                    <CardInput
                                      id="cardCVV"
                                      name="cardCVV"
                                      maxLength={
                                        card?.type?.toUpperCase() === 'AMEX'
                                          ? 4
                                          : 3
                                      }
                                      type="tel"
                                      data-encrypt="cvv"
                                      autoComplete="off"
                                      data-testid={generateTestId({
                                        type: ELEMENT_TYPE.INPUT,
                                        action: ELEMENT_ACTION.FORM,
                                        moduleName: 'SavedCreditCardList',
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
                                  </CardInputCVV>
                                  <TooltipCvv />
                                </CardCvvInside>
                                {errors.cardCVV && touched.cardCVV && (
                                  <TextGuide
                                    type="caption-3"
                                    color="danger"
                                    data-testid={generateTestId({
                                      type: ELEMENT_TYPE.INPUT,
                                      action: ELEMENT_ACTION.FORM,
                                      moduleName: 'SavedCreditCardList',
                                      uniqueId: 'CardCVVError',
                                    })}
                                  >
                                    {translate(errors.cardCVV)}
                                  </TextGuide>
                                )}
                              </CardCvvWrap>

                              <HandleFormCvv />
                            </form>
                          );
                        }}
                      </Formik>
                    </div>
                  )}
                </CardWithCvvFormInside>
              );
            })}
          <AddNewCardWrap
            onClick={() => handleOpenAddCardForm()}
            data-testid={generateTestId({
              type: ELEMENT_TYPE.BUTTON,
              action: ELEMENT_ACTION.ADD,
              moduleName: 'SavedCreditCardList',
              uniqueId: 'AddNewCard',
            })}
          >
            <AddNewCardInside>
              <AddNewCardIcon>+</AddNewCardIcon>
              <TextGuide type="body" color={'#171722'}>
                {translate('payment.credit_card.add-new-card')}
              </TextGuide>
            </AddNewCardInside>
          </AddNewCardWrap>
        </CardWithCvvFormWrap>
      )}
      {openCreditCardFormInSavedList && (
        <NewCreditCardForm isShowCancelButton />
      )}
    </div>
  );
};

const HandleFormCvv = () => {
  const { currentSelectedCard } = useCreditCardContext();
  const { payment, paymentAction } = usePaymentContext();
  const {
    errors,
    isValid,
    values,
    resetForm,
    isSubmitting,
  } = useFormikContext();
  useEffect(() => {
    if (errors) scrollToErrorElement(errors);
    if (
      ((currentSelectedCard?.type?.toUpperCase() === 'AMEX' &&
        values?.cardCVV?.length === 4) ||
        (currentSelectedCard?.type?.toUpperCase() !== 'AMEX' &&
          values?.cardCVV?.length === 3)) &&
      isValid
    ) {
      window.My2c2p.getEncrypted(
        '2c2p-payment-form-cvv',
        (encryptedData, errCode, errDesc) => {
          if (errCode !== 0) {
            console.error(errDesc);
          }
          paymentAction.setPaymentServiceFullPaymentSavedCard({
            ...payment?.paymentServiceFullPayment,
            savedCard: {
              ...payment?.paymentServiceFullPayment.savedCard,
              encryptedCardInfo: encryptedData?.encryptedCardInfo || null,
            },
          });
        },
      );
    }
  }, [errors, values, isSubmitting]);

  useEffect(() => {
    resetForm();
  }, [currentSelectedCard]);

  return null;
};

export default withLocales(SavedCreditCardList);
