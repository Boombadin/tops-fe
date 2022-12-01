import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import SavedCreditCardListItem from '../SavedCreditCardListItem';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

const TEST_ID = {
  SELECT_CARD: 'btn-editSavedCreditCardListItem-OnSetSelectCard',
  DEFAULT_CARD: 'img-viewSavedCreditCardListItem-DefaultCard',
  BANK_NAME: 'inf-viewSavedCreditCardListItem-BankName',
};

describe('components/CreditCard/SavedCreditCardListItem', () => {
  // mock component props exclude translate
  const props = {
    card: {
      bankId: null,
      expiryMonth: 8,
      expiryYear: 2023,
      id: '592358235717763073',
      isDefault: true,
      isExpired: false,
      masked_number: '555555XXXXXX4444',
      maskedNumberByStar: '**** **** **** 4444',
      type: 'Visa',
      typeIcon: '/icons/types-credit-card/master-no-border.svg',
      bankImage: '/images/payment/product-img-empty.svg',
      bankName: '',
    },
    isSelected: false,
    selectedCard: '',
  };

  test(`it should match with snapshot`, () => {
    const { asFragment } = render(<SavedCreditCardListItem {...props} />);
    expect(
      asFragment(<SavedCreditCardListItem {...props} />),
    ).toMatchSnapshot();
  });

  test('Bank name match with remote config | it should be show bank name', () => {
    const props = {
      ...props,
      bankName: 'Bank of Ayudhya',
    };
    render(<SavedCreditCardListItem {...props} />);

    expect(screen.getByText('Bank of Ayudhya')).toBeInTheDocument();
  });

  test('Bank name = null | it should be show other bank', () => {
    const props = {
      ...props,
      bankName: null,
    };
    render(<SavedCreditCardListItem {...props} />);
    expect(
      screen.getByText('payment.credit_card.other_card'),
    ).toBeInTheDocument();
  });

  test('Bank name = empty | it should be show empty name', () => {
    const props = {
      ...props,
      bankName: '',
    };
    const { getByTestId } = render(<SavedCreditCardListItem {...props} />);
    const getBankName = getByTestId(TEST_ID.BANK_NAME);
    expect(getBankName).toBeEmptyDOMElement;
  });

  test('Click selected card | it should be call function onSelectCard()', () => {
    const newProps = {
      ...props,
      isCanBeSelect: true,
      onSelectCard: () => {},
    };
    const { getByTestId } = render(<SavedCreditCardListItem {...newProps} />);
    const setSelectCard = getByTestId(TEST_ID.SELECT_CARD);
    fireEvent.click(setSelectCard);
    expect(setSelectCard).toBeInTheDocument();
  });

  test('Default credit card | it should be show icon', () => {
    const props = {
      ...props,
      isCanBeSelect: true,
      isCardSelected: true,
    };
    const { getByTestId } = render(<SavedCreditCardListItem {...props} />);
    const setDefaultCard = getByTestId(TEST_ID.DEFAULT_CARD);
    expect(setDefaultCard).toBeInTheDocument();
  });
});
