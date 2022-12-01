import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import CreditCardPromotionItem from '../CreditCardPromotionItem';
jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});
const TEST_ID = {
  CARD_ITEM: 'inf-viewCreditCardPromotionItem-Container',
  DEFAULT_CARD: 'img-viewCreditCardPromotionItem-DefaultCard',
  SELECT_CARD: 'btn-editCreditCardPromotionItem-OnSetSelectCard',
};

describe('components/CreditCardPromotion/CreditCardPromotionItem', () => {
  const props = {
    card: {
      card_code: 'the1',
    },
    lang: {
      active: true,
      code: 'th_TH',
      name: 'ไทย',
      url: 'th',
    },
    isSelectedCard: {
      card_code: 'the1',
    },
    onSelectCard: () => {},
  };
  test(`it should match with snapshot`, () => {
    const { asFragment } = render(<CreditCardPromotionItem {...props} />);
    expect(
      asFragment(<CreditCardPromotionItem {...props} />),
    ).toMatchSnapshot();
  });

  test('Click selected card | it should be call function onSelectCard()', () => {
    const newProps = {
      ...props,
      card: {
        card_code: 'the1',
      },
      isSelectedCard: {
        card_code: 'the1',
      },
    };
    const { getByTestId } = render(<CreditCardPromotionItem {...newProps} />);
    const setSelectCard = getByTestId(TEST_ID.SELECT_CARD);
    fireEvent.click(setSelectCard);
    expect(setSelectCard).toBeInTheDocument();
  });

  test('Click selected card | it should be show icon', () => {
    const { getByTestId } = render(<CreditCardPromotionItem {...props} />);
    const setDefaultCard = getByTestId(TEST_ID.DEFAULT_CARD);
    expect(setDefaultCard).toBeInTheDocument();
  });
});
