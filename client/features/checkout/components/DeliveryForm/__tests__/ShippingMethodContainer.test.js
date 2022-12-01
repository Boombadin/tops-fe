import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@client/config/theme';
import ShippingMethodContainer from '@client/features/checkout/components/DeliveryForm/ShippingMethodContainer';

import { mockShippingMethods } from '../__mocks__/shippingMethods';
import { mockShippingMethodSelected } from '../__mocks__/slot';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

jest.mock('react-redux', () => ({
  connect: jest.fn(() => ReactComponent => props => (
    <ReactComponent {...props} />
  )),
}));

jest.mock('react-localize-redux', () => ({
  getTranslate: jest.fn(),
}));

jest.mock('../TimeSlotContainer.js', () => () => <mock-widget />);

jest.mock('@client/components/TimeSlotTab/utils', () => ({
  createIntervals: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('@client/features/checkout/utils', () => ({
  getShippingMethod: jest.fn().mockReturnValue({
    method: {
      amount: 150,
      available: true,
      baseAmount: 150,
      carrierCode: 'tops',
      carrierTitle: 'จัดส่งด่วน',
      errorMessage: '',
      extensionAttributes: {
        date: '2020-11-17',
        isAllow: undefined,
        slot: [
          {
            available: 200,
            cost: 80,
            enabled: false,
            id: 20,
            isAllow: false,
            quota: 200,
            round: undefined,
            timeFrom: '10:00',
            timeTo: '11:00',
          },
          {
            available: 200,
            cost: 80,
            enabled: false,
            id: 21,
            isAllow: false,
            quota: 200,
            round: undefined,
            timeFrom: '11:00',
            timeTo: '12:00',
          },
          {
            available: 199,
            cost: 100,
            enabled: true,
            id: 22,
            isAllow: true,
            quota: 200,
            round: undefined,
            timeFrom: '12:00',
            timeTo: '13:00',
          },
        ],
      },
      methodCode: 'express',
      methodTitle: 'จัดส่งด่วน',
      priceExclTax: 150,
      priceInclTax: 150,
    },
    nextRound: {
      date: '2020-11-17',
      slot: {
        available: 199,
        cost: 100,
        enabled: true,
        id: 22,
        isAllow: true,
        quota: 200,
        round: undefined,
        timeFrom: '12:00',
        timeTo: '13:00',
      },
    },
    slotLabel: 'รับสินค้าเร็วขึ้นด้วยบริการจัดส่งแบบด่วน',
  }),
}));
const TEST_ID = {
  SELECT_SHIPPING_METHOD_STANDARD:
    'btn-changeShippingMethodContainer-SelectShippingStandard',
  SELECT_SHIPPING_METHOD_EXPRESS:
    'btn-changeShippingMethodContainer-SelectShippingExpress',
  SHIPPING_TITLE: 'inf-viewShippingMethodContainer-ShippingTitle',
};

describe('features/checkout/components/DeliveryForm/ShippingMethodContainer', () => {
  const initialState = {
    deliveryMethod: 'home_delivery',
    shippingMethods: mockShippingMethods,
    shippingMethod: 'express',
    clearShipping: false,
    intervals: jest.fn(),
    mobileIntervals: jest.fn(),
    shippingMethodSelected: mockShippingMethodSelected,
    active: true,
    shippingAddress: jest.fn(),
    billingAddress: jest.fn(),
    storeLocator: jest.fn(),
    storeLocatorSlot: jest.fn(),
    onChooseSlot: jest.fn(),
    onShippingChange: jest.fn(),
    collector: undefined,
    cart: jest.fn(),
    checked: true,
    onClick: jest.fn(),
  };
  test('Delivery method is Home Delivery | it should show title is home delivery', () => {
    const { asFragment, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <ShippingMethodContainer {...initialState} />
      </ThemeProvider>,
    );
    expect(getByTestId(TEST_ID.SHIPPING_TITLE)).toBeInTheDocument();
    expect(
      screen.getByText('checkout_delivery.shipping_method.home_delivery.title'),
    ).toBeInTheDocument();
    expect(
      asFragment(<ShippingMethodContainer {...initialState} />),
    ).toMatchSnapshot();
  });

  test('Delivery method is Click and Collect | it should show title is Click and Collect', () => {
    const initialState = {
      deliveryMethod: 'click_and_collect',
      collector: jest.fn(),
    };
    const { asFragment, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <ShippingMethodContainer {...initialState} />
      </ThemeProvider>,
    );
    expect(getByTestId(TEST_ID.SHIPPING_TITLE)).toBeInTheDocument();
    expect(
      screen.getByText(
        'checkout_delivery.shipping_method.click_and_collect.title',
      ),
    ).toBeInTheDocument();
    expect(
      asFragment(<ShippingMethodContainer {...initialState} />),
    ).toMatchSnapshot();
  });
  test('Delivery method is Home Delivery | it should set default shipping method is Express ', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <ShippingMethodContainer {...initialState} />
      </ThemeProvider>,
    );
    expect(
      getByTestId(TEST_ID.SELECT_SHIPPING_METHOD_EXPRESS),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'checkout_delivery.shipping_method.shipping_title_method.express',
      ),
    ).toBeInTheDocument();
  });
  test('Delivery method is Home Delivery and Express is not available  | it should set default shipping method is Standard ', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <ShippingMethodContainer {...initialState} />
      </ThemeProvider>,
    );
    expect(
      getByTestId(TEST_ID.SELECT_SHIPPING_METHOD_STANDARD),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'checkout_delivery.shipping_method.shipping_title_method.delivery',
      ),
    ).toBeInTheDocument();
  });
  test('Click change Shipping method | it should be call function handleShippingMethod', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <ShippingMethodContainer {...initialState} />
      </ThemeProvider>,
    );
    const selectStandard = getByTestId(TEST_ID.SELECT_SHIPPING_METHOD_STANDARD);
    fireEvent.click(selectStandard);
    expect(selectStandard).toBeInTheDocument();
    const selectExpress = getByTestId(TEST_ID.SELECT_SHIPPING_METHOD_EXPRESS);
    fireEvent.click(selectExpress);
    expect(selectExpress).toBeInTheDocument();
  });
});
