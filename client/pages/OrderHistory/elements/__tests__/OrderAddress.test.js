import { render } from '@testing-library/react';
import React from 'react';

import { shippingAddress } from '../../__mocks__/shippingAddress';
import OrderAddress from '../OrderAddress';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

describe('features/orderDetail/components/OrderAddress', () => {
  const props = {
    shipping_assignments: shippingAddress,
  };

  test('it should be match snapshot', () => {
    const { asFragment } = render(<OrderAddress {...props} />);
    expect(asFragment(<OrderAddress {...props} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when region and postcode empty', () => {
    const customProps = {
      ...props,
      shipping_assignments: [
        {
          shipping: {
            ...shippingAddress[0].shipping,
            address: {
              ...shippingAddress[0].shipping.address,
              postcode: null,
              region: null,
            },
          },
        },
      ],
    };

    const { asFragment } = render(<OrderAddress {...customProps} />);
    expect(asFragment(<OrderAddress {...customProps} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when address empty', () => {
    const customProps = {
      ...props,
      shipping_assignments: [
        {
          shipping: {
            ...shippingAddress[0].shipping,
            address: {},
          },
        },
      ],
    };

    const { asFragment } = render(<OrderAddress {...customProps} />);
    expect(asFragment(<OrderAddress {...customProps} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when shipping empty', () => {
    const customProps = {
      ...props,
      shipping_assignments: [
        {
          shipping: {},
        },
      ],
    };

    const { asFragment } = render(<OrderAddress {...customProps} />);
    expect(asFragment(<OrderAddress {...customProps} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when shipping method pickupatstore_tops', () => {
    const customProps = {
      shipping_assignments: [
        {
          shipping: {
            ...shippingAddress[0].shipping,
            method: 'pickupatstore_tops',
          },
        },
      ],
    };

    const { asFragment } = render(<OrderAddress {...customProps} />);
    expect(asFragment(<OrderAddress {...customProps} />)).toMatchSnapshot();
  });
});
