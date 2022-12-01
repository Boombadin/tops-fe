import { render } from '@testing-library/react';
import React from 'react';

import { mockItem, mockProductBundle } from '../__mocks__/productBundle';
import { mockStoreConfig } from '../__mocks__/storeConfig';
import CartPromotions from '../CartPromotions';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});
jest.mock('@client/contexts', () => ({
  useCartContext: jest.fn().mockReturnValue({
    cartAction: {
      deleteProductBundle: jest.fn(),
    },
  }),
}));

describe('features/cart/components/CartPromotion', () => {
  const initialState = {
    items: mockItem,
    itemIds: [
      {
        item_id: 11577888,
        item_sku: '8850187400030',
      },
      {
        item_id: 11577888,
        item_sku: '8850187400030',
      },
    ],
    discountAmount: '20.00',
    promoQtyStep: 2,
    actionDiscountType: 'groupn_fixdisc',
    isMiniCart: false,
    bundle: mockProductBundle,
    storeConfig: mockStoreConfig,
    deleteBundleItem: () => {},
    handlerViewProduct: () => {},
    openPromoBundleModal: () => {},
  };

  test(`it cart promotion desktop should match with snapshot`, () => {
    const { asFragment } = render(<CartPromotions {...initialState} />);
    expect(asFragment(<CartPromotions {...initialState} />)).toMatchSnapshot();
  });

  test(`it cart promotion mobile should match with snapshot`, () => {
    const initialState = {
      ...initialState,
      isMiniCart: true,
    };
    const { asFragment } = render(<CartPromotions {...initialState} />);
    expect(asFragment(<CartPromotions {...initialState} />)).toMatchSnapshot();
  });

  test(`it cart promotion when cunsumerUnit not empty should match with snapshot`, () => {
    const initialState = {
      ...initialState,
      item: {
        ...initialState?.item,
        weight_item_ind: '1',
        selling_unit: {
          ...initialState?.item?.selling_unit,
          consumerUnit: 'kg',
        },
      },
    };
    const { asFragment } = render(<CartPromotions {...initialState} />);
    expect(asFragment(<CartPromotions {...initialState} />)).toMatchSnapshot();
  });

  test(`it cart promotion when store TH should match with snapshot`, () => {
    const initialState = {
      ...initialState,
      lang: {
        code: 'th_TH',
      },
    };
    const { asFragment } = render(<CartPromotions {...initialState} />);
    expect(asFragment(<CartPromotions {...initialState} />)).toMatchSnapshot();
  });
});
