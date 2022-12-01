import { useEffect, useState } from 'react';

import { creditCardEventType } from '@client/constants/creditCardEventType';
import { useReduxContext } from '@client/contexts';
// import { useCartContext } from '@client/contexts/CartContext';
import { typesPaymentMethods } from '@client/contexts/payment/types';
import { usePaymentContext } from '@client/contexts/PaymentContext';
import { getCookie } from '@client/utils/cookie';

const usePaymentOnsite = () => {
  const { reduxState } = useReduxContext();
  const { isClientSide, cart } = reduxState;
  const { payment, paymentAction } = usePaymentContext();

  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState('');
  const [showModalTermsConditions, setModalShowTermsConditions] = useState(
    false,
  );
  const [showModalT1c, setModalShowT1c] = useState(false);
  const [showModalStockQty, setShowModalStockQty] = useState(false);
  const [showCartSummary, setShowCartSummary] = useState(false);
  const [disableButtonPayNow, setDisableButtonPayNow] = useState(true);

  // TODO: recheck when will be use.
  useEffect(() => {
    if (errorMessage) {
      if (errorMessage === 'Points service not available, please try again') {
        showModalT1c(true);
      } else {
        showModalStockQty(true);
      }
    }
  }, [errorMessage]);

  useEffect(() => {
    // remove Credit card on top promotionCode as first time
    if (
      !payment?.isPaymentPromotionLocked &&
      cart?.cartSummaryModel &&
      cart?.cartSummaryModel?.creditOnTop &&
      payment?.paymentServiceFullPayment?.promotionCode === ''
    ) {
      paymentAction.setPaymentServiceFullPayment({ promotionCode: '0' });
    }
  }, [cart?.cartSummaryModel]);

  const handleShowCartSummary = value => setShowCartSummary(value);

  const isCartEmpty =
    cart && cart.items !== undefined && cart.items.length <= 0;
  if (isClientSide && isCartEmpty) window.location.href = '/cart';

  const isFullRedeemT1c = payment?.isFullRedeemT1c;
  const showT1c = !isCartEmpty && !payment?.isPaymentPromotionLocked;
  const showLoading = payment?.paymentLoading;

  const handleSetPaymentCode = code => {
    paymentAction.setPaymentCode(code);
  };

  const handleSetT1CInfo = t1cInfo => {
    paymentAction.setT1cInfo(t1cInfo);
  };

  const handleSetRemark = remark => {
    paymentAction.setRemark(remark);
  };

  const handleSetSubstitution = substitution => {
    paymentAction.setSubstitution(substitution);
  };

  const handleSetIsRequestTax = isRequestTax => {
    paymentAction.setIsRequestTax(isRequestTax);
  };

  const handleCreateOrder = async () => {
    if (
      payment?.paymentCode === typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT
    ) {
      if (
        payment?.paymentServiceFullPayment?.savedCard &&
        reduxState?.cart?.cartTotals?.base_grand_total > 10000
      ) {
        await payment?.refCvvForm?.current?.submitForm();
        if (payment?.refCvvForm?.current?.isValid) {
          paymentAction.setPaymentLoading(true);
          try {
            await paymentAction.createOrder({
              encryptedData: { ...payment?.paymentServiceFullPayment },
            });
          } catch (e) {
            paymentAction.setPaymentLoading(false);
            throw e;
          }
        } else {
          throw payment?.refCvvForm?.current?.errors;
        }
      } else if (payment?.paymentServiceFullPayment?.savedCard) {
        paymentAction.setPaymentLoading(true);
        try {
          await paymentAction.createOrder({
            encryptedData: { ...payment?.paymentServiceFullPayment },
          });
        } catch (e) {
          paymentAction.setPaymentLoading(false);
          throw e;
        }
      } else {
        payment?.refCreditCardFrame?.current?.contentWindow.postMessage(
          { type: creditCardEventType.CC_SUBMIT_FORM },
          window.location.origin,
        );
      }
    } else if (
      payment?.paymentCode === typesPaymentMethods.CREDITCARDONDELIVERY
    ) {
      paymentAction.setPaymentLoading(true);
      try {
        await paymentAction.createOrder();
      } catch (e) {
        paymentAction.setPaymentLoading(false);
        throw e;
      }
    }
  };

  useEffect(() => {
    if (isFullRedeemT1c) {
      setDisableButtonPayNow(false);
      if (payment?.paymentCode !== typesPaymentMethods.FREE) {
        paymentAction.setPaymentCode(typesPaymentMethods.FREE);
      }
    } else if (payment?.paymentCode !== '') {
      setDisableButtonPayNow(false);
      if (
        payment?.paymentCode ===
          typesPaymentMethods.PAYMENT_SERVICE_INSTALLMENT &&
        !payment?.paymentServiceInstallment?.bankId
      ) {
        setDisableButtonPayNow(true);
      }
      // const isHaveSelectedPaymentCode = payment?.paymentMethods.find(
      //   option => option.code === payment?.paymentCode,
      // );
      // if (!isHaveSelectedPaymentCode) {
      //   paymentAction.setPaymentCode('');
      // }
    } else {
      setDisableButtonPayNow(true);
    }

    if (getCookie('debug') === 'topsfrontend') {
      console.info({
        payment,
        paymentCode: payment?.paymentCode,
        paymentServiceFullPayment: payment?.paymentServiceFullPayment,
      });
    }
  }, [payment?.paymentMethods, payment?.paymentCode]);

  return {
    payment,
    paymentCode: payment?.paymentCode,
    showLoading,
    cart,
    isCartEmpty,
    showModalTermsConditions,
    setModalShowTermsConditions,
    showModalT1c,
    setModalShowT1c,
    showModalStockQty,
    setShowModalStockQty,
    errorMessage,
    showCartSummary,
    handleShowCartSummary,
    isFullRedeemT1c,
    showT1c,
    handleCreateOrder,
    disableButtonPayNow,
    handleSetPaymentCode,
    handleSetT1CInfo,
    handleSetRemark,
    handleSetSubstitution,
    handleSetIsRequestTax,
  };
};

export default usePaymentOnsite;
