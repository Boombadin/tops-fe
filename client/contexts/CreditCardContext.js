import {
  useCreateCardMutation,
  useDeleteCardMutation,
  useSetDefaultCardMutation,
} from '@central-tech/react-hooks';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { usePaymentContext } from '@client/contexts';
import CreditCardModel from '@client/model/CreditCard/CreditCardModel';
import { useCardsQuery } from '@client/operations';

import { creditCardEventType } from '../constants/creditCardEventType';

const CreditCardContext = React.createContext();

const CreditCardProvider = ({ children }) => {
  const refCreditCardFrame = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [isSetDefaultCreditCard, setIsSetDefaultCreditCard] = useState(true);
  const [cardList, setCardList] = useState(null);
  const [currentSelectedCard, setCurrentSelectedCard] = useState(null);
  const [newCard, setNewCard] = useState(null);
  const [isInvalidCard, setIsInvalidCard] = useState(null);
  const [
    currentSelectedCardToDelete,
    setCurrentSelectedCardToDelete,
  ] = useState();
  const [isShowCardList, setIsShowCardList] = useState(true);
  const [
    openCreditCardFormInSavedList,
    setOpenCreditCardFormInSavedList,
  ] = useState(false);
  const [isCreditCardFormActive, setCreditCardFormActive] = useState(false);
  const [configDiscardFormModal, setConfigDiscardFormModal] = useState({
    isOpen: false,
    navigatePath: null,
  });
  const [
    currentSelectedCardPromotion,
    setCurrentSelectedCardPromotion,
  ] = useState('');
  const [isShowCardPromotion, setIsShowCardPromotion] = useState(false);
  const [isCardPromotionLoading, setIsCardPromotionLoading] = useState(false);

  const { paymentAction } = usePaymentContext();

  // Core API
  const refetchQueries = [`cards`];
  const [createCardMutation, createCardResponse] = useCreateCardMutation({
    refetchQueries,
  });
  const [setDefaultCardMutation] = useSetDefaultCardMutation();
  const [deleteCardMutation] = useDeleteCardMutation({
    refetchQueries,
  });
  const cardsResponse = useCardsQuery({
    fetchPolicy: 'no-cache',
    variables: {
      sort: {
        id: 'CREATED_AT',
        direction: 'ASC',
      },
    },
  });
  const { data, loading } = cardsResponse;

  useEffect(() => {
    if (isShowCardList) {
      setCurrentSelectedCard(getDefaultCard());
    } else {
      setCurrentSelectedCard(null);
    }
  }, [isShowCardList]);

  useEffect(() => {
    if (currentSelectedCard) {
      paymentAction.setPaymentServiceFullPaymentSavedCard({
        savedCard: { ...currentSelectedCard },
      });
    } else {
      paymentAction.setPaymentServiceFullPaymentSavedCard({
        savedCard: null,
      });
    }
  }, [currentSelectedCard]);

  useEffect(() => {
    setIsLoading(loading);
    const cards = data?.cards || [];
    if (cards?.length > 0) {
      const formattedCardList = cards.map(
        card => new CreditCardModel({ card }),
      );
      const activeCardList = formattedCardList?.filter(
        card => !card?.isExpired,
      );
      setCardList(activeCardList);
    } else {
      setCardList([]);
      setCurrentSelectedCard(null);
    }
  }, [data, loading, newCard]);

  useEffect(() => {
    // first time call
    if (cardList?.length > 0) {
      const tempDefaultCard = getDefaultCard();
      if (newCard) {
        setCurrentSelectedCard(getLastSavedCard(newCard.id));
        setNewCard(null);
      } else {
        setCurrentSelectedCard(tempDefaultCard);
      }
    }
  }, [cardList]);

  const submitNewCard = async card => {
    try {
      await createCardMutation({
        variables: {
          cardInput: {
            encrypted_card_data: card?.encryptedCardInfo,
            cardholder_name: card?.cardHolderName,
            expiry_month: parseInt(card?.expMonthCardInfo),
            expiry_year: parseInt(card?.expYearCardInfo),
            is_store_card: true,
          },
          setDefault: isSetDefaultCreditCard || cardList?.length === 0,
        },
      });
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    const card = createCardResponse?.data?.createCard;
    if (card) {
      setNewCard(
        new CreditCardModel({
          card,
        }),
      );
      setIsShowCardList(true);
      setIsLoading(false);
    }
    if (createCardResponse?.error?.message) setIsInvalidCard(true);
  }, [createCardResponse]);

  useEffect(() => {
    // reset state
    if (isShowCardList && isInvalidCard) setIsInvalidCard(null);
    if (isShowCardList && isSetDefaultCreditCard)
      setIsSetDefaultCreditCard(true);
  }, [isShowCardList]);

  const handleSubmitNewCard = async card => {
    setIsLoading(true);
    await submitNewCard(card);
  };

  const handleSetDefaultCardIconClick = card => {
    setIsLoading(true);
    setDefaultCardMutation({
      variables: {
        cardId: card.id,
      },
    })
      .then(({ data }) => {
        if (data?.setDefaultCard) {
          cardList?.map(
            cardItem =>
              (cardItem.isDefault = cardItem.id === data?.setDefaultCard?.id),
          );
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteCardIconClick = card => {
    setCurrentSelectedCardToDelete(card);
    setShowDeleteCardModal(true);
  };

  const handleOnConfirmDeleteCard = () => {
    setShowDeleteCardModal(false);
    setIsLoading(true);
    deleteCardMutation({
      variables: {
        cardId: currentSelectedCardToDelete.id,
      },
    })
      .then()
      .finally(() => setIsLoading(false));
  };

  const getDefaultCard = () => cardList?.find(card => card?.isDefault) || null;
  const getLastSavedCard = id =>
    cardList?.find(card => String(card?.id) === String(id));
  const isCardsLoading = loading;
  const isEmptyCards = cardList !== null && cardList?.length === 0;

  const setOpenDiscardNewCreditCardFormModal = ({
    open = true,
    navigatePath = '',
  }) => {
    if (open) {
      setConfigDiscardFormModal(prevState => ({
        ...prevState,
        isOpen: true,
        navigatePath,
      }));
    } else {
      setConfigDiscardFormModal(prevState => ({
        ...prevState,
        isOpen: false,
        navigatePath: '',
      }));
    }
  };

  const value = {
    cardList,
    isLoading,
    isCardsLoading,
    isEmptyCards,
    refCreditCardFrame,
    currentSelectedCard,
    setCurrentSelectedCard,
    defaultCard: getDefaultCard(),
    isShowDeleteCardModal,
    setShowDeleteCardModal,
    handleSetDefaultCardIconClick,
    handleDeleteCardIconClick,
    handleOnConfirmDeleteCard,
    handleSubmitNewCard,
    isSetDefaultCreditCard,
    setIsSetDefaultCreditCard,
    isShowCardList,
    setIsShowCardList,
    currentSelectedCardToDelete,
    isInvalidCard,
    openCreditCardFormInSavedList,
    setOpenCreditCardFormInSavedList,
    isCreditCardFormActive,
    setCreditCardFormActive,
    setOpenDiscardNewCreditCardFormModal,
    configDiscardFormModal,
    setCurrentSelectedCardPromotion,
    currentSelectedCardPromotion,
    isShowCardPromotion,
    setIsShowCardPromotion,
    isCardPromotionLoading,
    setIsCardPromotionLoading,
  };

  return (
    <CreditCardContext.Provider value={value}>
      {children}
    </CreditCardContext.Provider>
  );
};

const useCreditCardContext = () => useContext(CreditCardContext);

export { CreditCardContext, CreditCardProvider, useCreditCardContext };
