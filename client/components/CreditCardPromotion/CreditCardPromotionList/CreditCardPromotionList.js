import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  useCreditCardContext,
  useFirebaseContext,
  usePaymentContext,
  useReduxContext,
} from '@client/contexts';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

import CreditCardPromotionItem from '../CreditCardPromotionItem';
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const CreditCardPromotionWrap = styled.div`
  width: 100%;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;
const CreditCardPromotionInside = styled.div`
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
`;

const CreditCardPromotionList = () => {
  const { firestoreAction } = useFirebaseContext();
  const { reduxState } = useReduxContext();
  const { paymentAction } = usePaymentContext();

  const {
    currentSelectedCardPromotion,
    setCurrentSelectedCardPromotion,
    setIsShowCardPromotion,
    setIsCardPromotionLoading,
  } = useCreditCardContext();
  const fireStoreConfig = { collection: 'payment_methods', doc: 'config' };
  const [creditCardPromotion, setCreditCardPromotion] = useState({});

  const currentDateTime = dayjs();
  const startPromotion = dayjs.unix(
    creditCardPromotion?.ccod_period_start_date?.seconds,
  );
  const endPromotion = dayjs.unix(
    creditCardPromotion?.ccod_period_end_date?.seconds,
  );
  const isShowPromotion =
    dayjs(currentDateTime).isSameOrAfter(startPromotion) &&
    dayjs(currentDateTime).isSameOrBefore(endPromotion);
  const isSeasonal = reduxState?.cart?.cart?.items.some(
    item => item?.is_seasonal === 'Is Seasonal',
  );
  useEffect(() => {
    (async () => {
      setIsCardPromotionLoading(true);
      const creditCardPromotionResponse = await firestoreAction.getFireStoreConfig(
        fireStoreConfig,
      );
      setIsCardPromotionLoading(false);
      setCreditCardPromotion(creditCardPromotionResponse);
    })();
  }, [firestoreAction.getFireStoreConfig]);

  useEffect(() => {
    setIsShowCardPromotion(isShowPromotion);
  }, [isShowPromotion]);

  const handleSelectedCardPromotion = cardCode => {
    setCurrentSelectedCardPromotion(cardCode);
    paymentAction?.setCardPromotion(cardCode);
  };
  return (
    isShowPromotion &&
    isSeasonal && (
      <CreditCardPromotionWrap
        data-testid={generateTestId({
          type: ELEMENT_TYPE.INFO,
          action: ELEMENT_ACTION.VIEW,
          moduleName: 'CreditCardPromotionList',
          uniqueId: 'Container',
        })}
      >
        {creditCardPromotion?.ccod
          ?.sort((a, b) => a?.card_position - b?.card_position)
          ?.map(card => {
            return (
              <CreditCardPromotionInside>
                <CreditCardPromotionItem
                  card={card}
                  onSelectCard={handleSelectedCardPromotion}
                  isSelectedCard={currentSelectedCardPromotion}
                />
              </CreditCardPromotionInside>
            );
          })}
      </CreditCardPromotionWrap>
    )
  );
};
export default CreditCardPromotionList;
