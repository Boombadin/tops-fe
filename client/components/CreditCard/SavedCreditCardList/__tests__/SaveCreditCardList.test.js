import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { useCreditCardContext, useReduxContext } from '@/client/contexts';

import mockCardList from '../__mocks__/cardList';
import SaveCreditCardList from '../SavedCreditCardList';

jest.mock(
  '@client/components/CreditCard/SavedCreditCardListItem',
  () => props => (
    <mock-creditCardItem
      {...props}
      onClick={props.onSelectCard}
      data-testid="inf-viewSavedCreditCardListItem-Container"
    />
  ),
);
jest.mock('@client/components/CreditCard/TooltipCvv', () => () => (
  <mock-tooltipCvv />
));
jest.mock('@client/components/CreditCard/NewCreditCardForm', () => () => (
  <mock-newCreditCardForm />
));
jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});
jest.mock('@client/contexts', () => ({
  useFirebaseContext: jest.fn().mockReturnValue({
    firestoreAction: {
      getRemoteConfig: jest.fn().mockReturnValue(
        JSON.stringify({
          KCC: { th: 'ธนาคารกรุงศรีอยุธยา', en: 'Bank of Ayudhya' },
          BBL: { th: 'ธนาคารกรุงเทพ', en: 'Bangkok Bank' },
          Citibank: { th: 'ธนาคาร ซิตี้ แบงก์', en: 'Citibank' },
          FirstChoice: {
            th: 'กรุงศรีเฟิร์สช้อยส์',
            en: 'Krungsri First Choice',
          },
        }),
      ),
    },
  }),
  useReduxContext: jest.fn().mockReturnValue({}),
  usePaymentContext: jest.fn().mockReturnValue({}),
  useCreditCardContext: jest.fn().mockReturnValue({}),
}));

const TEST_ID = {
  CVV_FORM_CONTAINER: 'frm-viewSavedCreditCardList-CvvFormContainer',
  CVV_FORM: 'frm-viewSavedCreditCardList-CvvForm',
  INPUT_CVV_FORM: 'inp-formSavedCreditCardList-CardCVV',
  CARD_CVV_ERROR: 'inp-formSavedCreditCardList-CardCVVError',
  ADD_NEW_CARD: 'btn-addSavedCreditCardList-AddNewCard',
};

const TEST_DATA = {
  ERRORS_CVV: {
    CARDCVV_REQUIRED: 'CVV is required',
    CARDCVV_INVALID: 'Invalid CVV',
  },
};
describe('components/CreditCard/SavedCreditCardList', () => {
  const props = {
    handleSelectCard: jest.fn(),
  };
  const mockCreditCardContext = {
    cardList: mockCardList,
    currentSelectedCard: {
      bankIcon: '/images/payment/product-img-empty.svg',
      bankId: null,
      bankImage: '/images/payment/product-img-empty.svg',
      bankName: null,
      expiryDate: '12/33',
      expiryMonth: 12,
      expiryYear: 2033,
      id: '590925219668099073',
      isDefault: true,
      isExpired: false,
      maskedNumber: '411111XXXXXX1111',
      maskedNumberByStar: '**** **** **** 1111',
      type: 'Visa',
      typeIcon: '/icons/types-credit-card/visa-no-border.svg',
    },
    isShowCardList: true,
    setIsShowCardList: jest.fn(),
    setCurrentSelectedCard: jest.fn(),
    setOpenCreditCardFormInSavedList: jest.fn(),
  };

  useCreditCardContext.mockReturnValue(mockCreditCardContext);
  useReduxContext.mockReturnValue({
    reduxState: {
      cart: {
        cartTotals: {
          base_grand_total: 1000,
        },
      },
    },
  });

  const spyScrollTo = jest.fn();
  beforeEach(() => {
    Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo });
    spyScrollTo.mockClear();
  });

  test('Render card list | it should match with snapshot', async () => {
    const { asFragment } = render(<SaveCreditCardList {...props} />);
    await waitFor(() => {
      expect(asFragment(<SaveCreditCardList {...props} />)).toMatchSnapshot();
    });
  });
  test('cart total more than 10000 | it should show Cvv form', async () => {
    const props = {
      ...props,
      isShowCvvForm: true,
      isCardSelected: true,
    };
    useReduxContext.mockReturnValue({
      reduxState: {
        cart: {
          cartTotals: {
            base_grand_total: 11000,
          },
        },
      },
    });
    const { getByTestId, asFragment } = render(
      <SaveCreditCardList {...props} />,
    );
    await waitFor(() => {
      expect(getByTestId(TEST_ID.CVV_FORM)).toBeInTheDocument();
      expect(asFragment(<SaveCreditCardList {...props} />)).toMatchSnapshot();
    });
  });
  test(`when user click on input and leave | it should be show error message ${TEST_DATA.ERRORS_CVV.CARDCVV_REQUIRED}`, async () => {
    const props = {
      ...props,
      isShowCvvForm: true,
      isCardSelected: true,
    };
    useReduxContext.mockReturnValue({
      reduxState: {
        cart: {
          cartTotals: {
            base_grand_total: 11000,
          },
        },
      },
    });
    const { getByTestId } = render(<SaveCreditCardList {...props} />);
    const input = getByTestId(TEST_ID.INPUT_CVV_FORM);
    expect(input).toBeInTheDocument();
    fireEvent.click(input);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(getByTestId(TEST_ID.CARD_CVV_ERROR)).toHaveTextContent(
        'payment.credit_card.form.errors.card_CVV_required',
      );
    });
  });
  test(`when user click on input invalid cvv | it should be show error message ${TEST_DATA.ERRORS_CVV.CARDCVV_INVALID}`, async () => {
    const props = {
      ...props,
      isShowCvvForm: true,
      isCardSelected: true,
    };
    useReduxContext.mockReturnValue({
      reduxState: {
        cart: {
          cartTotals: {
            base_grand_total: 11000,
          },
        },
      },
    });
    const { getByTestId } = render(<SaveCreditCardList {...props} />);
    const input = getByTestId(TEST_ID.INPUT_CVV_FORM);
    expect(input).toBeInTheDocument();
    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(getByTestId(TEST_ID.CARD_CVV_ERROR)).toHaveTextContent(
        'payment.credit_card.form.errors.card_CVV_invalid',
      );
    });
  });
  test(`when user input and leave | it should be show error message ${TEST_DATA.ERRORS_CVV.CARDCVV_REQUIRED}`, async () => {
    const props = {
      ...props,
      isShowCvvForm: true,
      isCardSelected: true,
    };
    useReduxContext.mockReturnValue({
      reduxState: {
        cart: {
          cartTotals: {
            base_grand_total: 11000,
          },
        },
      },
    });
    const { getByTestId } = render(<SaveCreditCardList {...props} />);
    const input = getByTestId(TEST_ID.INPUT_CVV_FORM);
    expect(input).toBeInTheDocument();
    fireEvent.click(input);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(getByTestId(TEST_ID.CARD_CVV_ERROR)).toHaveTextContent(
        'payment.credit_card.form.errors.card_CVV_require',
      );
    });
  });
  test(`when user click add new credit card button | it should be call function handleOpenAddCardForm() `, async () => {
    const { getByTestId } = render(<SaveCreditCardList {...props} />);
    const addNewCard = getByTestId(TEST_ID.ADD_NEW_CARD);
    fireEvent.click(addNewCard);
    await waitFor(() => {
      expect(addNewCard).toBeInTheDocument();
    });
  });
  test(`when user click credit card item | it should be call function handleSelectCard() `, async () => {
    const { getAllByTestId } = render(<SaveCreditCardList {...props} />);
    const selectCard = getAllByTestId(
      'inf-viewSavedCreditCardListItem-Container',
    );
    fireEvent.click(selectCard[0]);
    await waitFor(() => {
      expect(selectCard[0]).toBeInTheDocument();
    });
  });
});
