import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import CartDesktopPromotion from '../CartDesktopPromotion';

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

const TEST_ID = {
  DELETE_ITEM: 'btn-removeCartDesktopPromotion-onDeleteItem',
  OPEN_MODAL_ITEMS_PROMOTION:
    'btn-viewCartDesktopPromotion-openPromoBundleModal',
  CLICK_TITLE_VIEW_PRODUCT_DETAIL:
    'btn-viewCartDesktopPromotion-onViewProduct-11577330',
  CLICK_IMAGE_VIEW_PRODUCT_DETAIL:
    'img-viewCartDesktopPromotion-onViewProduct-11577330',
};

describe('features/cart/components/CartDesktopPromotion', () => {
  const propsGroupFixDisc = {
    productItem: {
      pid: 11577188,
      name: 'Royal Umbrella Gold Jasmine Rice 5kg.',
      image: '/8/8/8850187400030_e5-12-2018.jpg',
      qty: 2,
      consumerUnit: 'pcs',
    },
    itemIds: [
      { item_id: 11577188, item_sku: '8850187400030' },
      { item_id: 11577188, item_sku: '8850187400030' },
    ],
    discountAmount: '20.00',
    promoCode: 'Online Promo test uat Product each',
    promoType: 'cpn9',
    actionDiscountType: 'groupn_fixdisc',
    promotionLabel: 'Online promotion 20 THB off for every 2 items',
    baseMediaUrl: 'https://uat-mdc.tops.co.th/media/',
    onDeleteItem: () => {},
    onViewProduct: () => {},
  };

  const propsGroupn = {
    productItem: {
      pid: 11577710,
      name: 'Hite Zero Non Alcohol Malt Can 355ml.',
      image: '/8/8/8801119221117_30-09-2019.jpg',
      qty: 2,
      consumerUnit: 'can',
    },
    itemIds: [
      { item_id: 11577710, item_sku: '8801119221117' },
      { item_id: 11577710, item_sku: '8801119221117' },
    ],
    discountAmount: '10.00',
    promoCode: '6500000022',
    promoType: 'b1gv',
    actionDiscountType: 'groupn',
    promotionLabel: '',
    baseMediaUrl: 'https://uat-mdc.tops.co.th/media/',
    onDeleteItem: () => {},
    onViewProduct: () => {},
  };

  const propsCartFixed = {
    productItem: {
      pid: 11577311,
      name: 'My Choice Japanese Premium Melon 1.2-1.5 kg./pieces',
      image: '/0/2/0218219000005_mo.jpg',
      qty: 1,
      consumerUnit: 'kg',
    },
    itemIds: [
      { item_id: 11577311, item_sku: '0218219000005' },
      { item_id: 11577311, item_sku: '0218219000005' },
      { item_id: 11577311, item_sku: '0218219000005' },
      { item_id: 11577311, item_sku: '0218219000005' },
      { item_id: 11577311, item_sku: '0218219000005' },
      { item_id: 11577311, item_sku: '0218219000005' },
      { item_id: 11577311, item_sku: '0218219000005' },
      { item_id: 11577311, item_sku: '0218219000005' },
    ],
    discountAmount: '100.00',
    promoCode: '20000000000',
    promoType: 'cpn2',
    actionDiscountType: 'cart_fixed',
    promotionLabel: 'Online promotion 1000 got 100',
    baseMediaUrl: 'https://uat-mdc.tops.co.th/media/',
    onDeleteItem: () => {},
    onViewProduct: () => {},
  };

  const propsCentralEachnPercentDiscount = {
    actionDiscountType: 'central_eachn_percent_discount',
    baseMediaUrl: 'https://uat-mdc.tops.co.th/media/',
    discountAmount: '60.00',
    itemIds: [
      { item_id: 11577330, item_sku: '8801073211216' },
      { item_id: 11577330, item_sku: '8801073211216' },
    ],
    productItem: {
      pid: 11577330,
      name: 'Samyang Extreme Hot Chicken Big Bowl 105g.',
      image: '/8/8/8801073211216_x2.jpg',
      qty: 1,
      consumerUnit: 'pcs',
    },
    promoCode: '1700003416',
    promoType: 'bogo',
    promotionLabel: '',
    onDeleteItem: () => {},
    onViewProduct: () => {},
    openPromoBundleModal: () => {},
  };

  test(`it action type groupn_fixdisc should match with snapshot`, () => {
    const { asFragment } = render(
      <CartDesktopPromotion {...propsGroupFixDisc} />,
    );
    expect(
      asFragment(<CartDesktopPromotion {...propsGroupFixDisc} />),
    ).toMatchSnapshot();
  });

  test(`it action type groupn should match with snapshot`, () => {
    const { asFragment } = render(<CartDesktopPromotion {...propsGroupn} />);
    expect(
      asFragment(<CartDesktopPromotion {...propsGroupn} />),
    ).toMatchSnapshot();
  });

  test(`it action type groupn_fixdisc should match when promotion data empty`, () => {
    const propsGroupFixDisc = {
      ...propsGroupFixDisc,
      productItem: {},
      itemIds: [],
      discountAmount: 0,
      promoCode: '',
      promoType: '',
      actionDiscountType: 'cart_fixed',
      promotionLabel: '',
      baseMediaUrl: '',
    };
    const { asFragment } = render(
      <CartDesktopPromotion {...propsGroupFixDisc} />,
    );
    expect(
      asFragment(<CartDesktopPromotion {...propsGroupFixDisc} />),
    ).toMatchSnapshot();
  });

  test(`it action type groupn_fixdisc should match when promotion data empty`, () => {
    const propsGroupFixDisc = {
      ...propsGroupFixDisc,
      productItem: {},
      itemIds: [],
      discountAmount: 0,
      promoCode: '',
      promoType: '',
      actionDiscountType: 'cart_fixed',
      promotionLabel: '',
      baseMediaUrl: '',
    };
    const { asFragment } = render(
      <CartDesktopPromotion {...propsGroupFixDisc} />,
    );
    expect(
      asFragment(<CartDesktopPromotion {...propsGroupFixDisc} />),
    ).toMatchSnapshot();
  });

  test(`it action type central_eachn_percent_discount should match when promotion data empty`, () => {
    const propsCentralEachnPercentDiscount = {
      ...propsCentralEachnPercentDiscount,
      actionDiscountType: 'central_eachn_percent_discount',
      baseMediaUrl: '',
      discountAmount: 0,
      itemIds: [],
      productItem: {},
      promoCode: '',
      promoType: '',
      promotionLabel: '',
    };
    const { asFragment } = render(
      <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
    );
    expect(
      asFragment(
        <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
      ),
    ).toMatchSnapshot();
  });

  test(`it action type cart_fixed with should match snapshot`, () => {
    const { asFragment } = render(<CartDesktopPromotion {...propsCartFixed} />);
    expect(
      asFragment(<CartDesktopPromotion {...propsCartFixed} />),
    ).toMatchSnapshot();
  });

  test(`it action type central_eachn_percent_discount should match with snapshot`, () => {
    const { asFragment } = render(
      <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
    );
    expect(
      asFragment(
        <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
      ),
    ).toMatchSnapshot();
  });

  test('delete item bundle groupn_fixdisc | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <CartDesktopPromotion {...propsGroupFixDisc} />,
    );
    const cartDeleteItem = getByTestId(TEST_ID.DELETE_ITEM);
    expect(cartDeleteItem).toBeInTheDocument();
    fireEvent.click(cartDeleteItem);
    expect(asFragment()).toMatchSnapshot();
  });

  test('delete item bundle central_eachn_percent_discount | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
    );
    const cartDeleteItem = getByTestId(TEST_ID.DELETE_ITEM);
    expect(cartDeleteItem).toBeInTheDocument();
    fireEvent.click(cartDeleteItem);
    expect(asFragment()).toMatchSnapshot();
  });

  test('open modal item promotion bundle central_eachn_percent_discount | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
    );
    const openModalItemsPromotion = getByTestId(
      TEST_ID.OPEN_MODAL_ITEMS_PROMOTION,
    );
    expect(openModalItemsPromotion).toBeInTheDocument();
    fireEvent.click(openModalItemsPromotion);
    expect(asFragment()).toMatchSnapshot();
  });

  test('click title to view product detail when promotion bundle buy 2 pay 1 | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
    );
    const viewProductDetail = getByTestId(
      TEST_ID.CLICK_TITLE_VIEW_PRODUCT_DETAIL,
    );
    expect(viewProductDetail).toBeInTheDocument();
    fireEvent.click(viewProductDetail);
    expect(asFragment()).toMatchSnapshot();
  });

  test('click image to view product detail when promotion bundle buy 2 pay 1 | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <CartDesktopPromotion {...propsCentralEachnPercentDiscount} />,
    );
    const viewProductDetail = getByTestId(
      TEST_ID.CLICK_IMAGE_VIEW_PRODUCT_DETAIL,
    );
    expect(viewProductDetail).toBeInTheDocument();
    fireEvent.click(viewProductDetail);
    expect(asFragment()).toMatchSnapshot();
  });
});
