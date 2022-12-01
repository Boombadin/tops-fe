import { render } from '@testing-library/react';
import React from 'react';

import mockCreditCardPromotionConfig from '../__mocks__/mockCreditCardPromotionConfig';
import CreditCardPromotionList from '../CreditCardPromotionList';
jest.mock('@client/contexts', () => ({
  useFirebaseContext: jest.fn().mockReturnValue({
    firestoreAction: {
      getFireStoreConfig: jest
        .fn()
        .mockReturnValue(mockCreditCardPromotionConfig),
    },
  }),
  useReduxContext: jest.fn().mockReturnValue({
    reduxState: {
      cart: {
        cart: {
          items: [
            {
              is_seasonal: 'Is Seasonal',
            },
          ],
        },
      },
    },
  }),

  usePaymentContext: jest.fn().mockReturnValue({}),
  useCreditCardContext: jest.fn().mockReturnValue({}),
}));
const TEST_ID = {
  CARD_LIST: 'inf-viewCreditCardPromotionList',
};

describe('components/CreditCardPromotion/CreditCardPromotionList', () => {
  const props = {
    isShowPromotion: true,
  };
  test.skip(`it should match with snapshot`, () => {
    const { asFragment } = render(<CreditCardPromotionList {...props} />);
    expect(
      asFragment(<CreditCardPromotionList {...props} />),
    ).toMatchSnapshot();
  });

  // test('it should match with ID', () => {
  //   const { getByTestId } = render(<CreditCardPromotionList {...props} />);
  //   const cardList = getByTestId(TEST_ID.CARD_LIST);
  //   expect(cardList).toBeInTheDocument();
  // });
});
