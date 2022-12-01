import { useBinLookupLazyQuery } from '@central-tech/react-hooks';
import find from 'lodash/find';
import { useEffect, useState } from 'react';

import { useCreditCardContext } from '@client/contexts/CreditCardContext';
import { usePaymentContext } from '@client/contexts/PaymentContext';
import { useReduxContext } from '@client/contexts/ReduxContext';
import { useCreditCardFrame } from '@client/hooks/useCreditCardFrame';

const usePaymentServiceFullPayment = () => {
  const { payment, paymentAction } = usePaymentContext();

  const {
    heightCreditCardFrame,
    binResponse,
    encryptedData,
  } = useCreditCardFrame();
  const { reduxState } = useReduxContext();
  // for saved card
  const { currentSelectedCard, isCardsLoading, isEmptyCards, cardList } =
    useCreditCardContext() || {};

  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [promotions, setPromotions] = useState(null);
  const [isShowSavedCard, setIsShowSavedCard] = useState(false);
  const [isShowNewCard, setIsShowNewCard] = useState(false);

  const lang = find(reduxState?.locale?.languages, lang => lang.active);

  const urlCreditCardFrame = `/${lang?.url}/credit-card-frame`;
  const isPaymentPromotionLocked = payment?.isPaymentPromotionLocked;

  const handlerBinResponse = binLookupResponse => {
    if (binLookupResponse?.loading) setLoadingPromotions(true);
    if (binLookupResponse?.data) {
      const promoCodes = binLookupResponse?.data?.binLookup.promo_codes || [];
      const promoCodesLowerCase = promoCodes.map(v => v.toLowerCase());
      let creditCardPromotionMapping = [];
      promotions?.forEach(card => {
        const promotionCodeLowerCase =
          card?.promotion_code?.toLowerCase() || '';
        const isPromoCodeMatch = promoCodesLowerCase.includes(
          promotionCodeLowerCase,
        );
        creditCardPromotionMapping.push({
          ...card,
          disabled: !isPromoCodeMatch,
        });
      });
      const bankNotDisabled = creditCardPromotionMapping.filter(
        bank => !bank.disabled,
      );
      const bankDisabled = creditCardPromotionMapping.filter(
        bank => bank.disabled,
      );
      creditCardPromotionMapping = [...bankNotDisabled, ...bankDisabled];

      setPromotions(creditCardPromotionMapping);
      const promoCode = payment?.paymentServiceFullPayment?.promotionCode;
      if (promoCode && promoCode !== '0') {
        const bank = creditCardPromotionMapping.find(
          bank => bank?.promotion_id === promoCode,
        );
        if (bank && bank?.disabled && !isPaymentPromotionLocked)
          paymentAction.setPaymentServiceFullPayment({
            promotionCode: '0',
          });
      }
      setLoadingPromotions(false);

      return true;
    }
  };

  const [binLookupLazyResponse] = useBinLookupLazyQuery({
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (
      isPaymentPromotionLocked &&
      (binResponse?.data?.binLookup || binLookupLazyResponse.data?.binLookup)
    )
      handlePromotionLocked();
  }, [promotions]);

  const handlePromotionLocked = () => {
    let result = false;
    if (promotions && promotions.length > 0) {
      if (promotions[0].disabled) result = true;
    }
    paymentAction.setPaymentServiceFullPaymentIsInvalidCard(result);
  };

  useEffect(() => {
    if (currentSelectedCard) {
      handlerBinResponse(binLookupLazyResponse);
    } else {
      handlerBinResponse(binResponse);
    }
  }, [binResponse, binLookupLazyResponse]);

  const handleCreateOrderForFullPayment = async () => {
    paymentAction.setPaymentLoading(true);
    try {
      await paymentAction.createOrder({ encryptedData });
    } catch (e) {
      console.error(e);
      paymentAction.setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (encryptedData) handleCreateOrderForFullPayment().then();
  }, [encryptedData]);

  useEffect(() => {
    if (
      payment?.creditCardPromotions &&
      payment?.creditCardPromotions.length > 0 &&
      promotions === null
    )
      setPromotions(initialCreditCardPromotions({ payment }));
  }, [payment?.creditCardPromotions]);

  useEffect(() => {
    if (currentSelectedCard) {
      paymentAction.setPaymentServiceFullPaymentSavedCard({
        savedCard: currentSelectedCard,
      });
    } else if (
      currentSelectedCard === null &&
      payment?.paymentServiceFullPayment.saveCard !== null
    ) {
      // remove savedCard
      paymentAction.setPaymentServiceFullPaymentSavedCard({
        savedCard: null,
      });
    }
  }, [currentSelectedCard]);

  const handleSaveCard = () => {
    paymentAction.setPaymentServiceFullPaymentSaveCard(
      !payment?.paymentServiceFullPayment.saveCard,
    );
  };

  useEffect(() => {
    if (cardList === null || !isEmptyCards || isCardsLoading) {
      setIsShowSavedCard(true);
      setIsShowNewCard(false);
    } else if (isEmptyCards && !isCardsLoading) {
      setIsShowSavedCard(false);
      setIsShowNewCard(true);
    }
  }, [isCardsLoading, cardList, currentSelectedCard]);

  return {
    isInvalidCard: payment?.paymentServiceFullPayment.isInvalidCard,
    isShowSavedCard,
    isShowNewCard,
    isLoadingSavedCard: isCardsLoading,
    promotions,
    refCreditCardFrame: payment?.refCreditCardFrame,
    loadingPromotions,
    heightCreditCardFrame,
    currentSelectedCard,
    urlCreditCardFrame,
    handleSaveCard,
    paymentServiceFullPayment: payment?.paymentServiceFullPayment,
  };
};

export default usePaymentServiceFullPayment;

const initialCreditCardPromotions = ({ payment }) => {
  const { creditCardPromotions } = payment;

  const tempCreditCardPromotion = [];
  if (creditCardPromotions.length > 0) {
    creditCardPromotions.map(card => {
      tempCreditCardPromotion.push({
        ...card,
        disabled: true,
      });
    });
  }

  return tempCreditCardPromotion;
};
