import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { shippingAddress } from '../__mocks__/shippingAddress';
import MobileOrdersTable from '../MobileOrdersTable';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

const TEST_ID = {
  BUTTON_TRACK: 'btn-viewTrackOrderButton-handleTrackClick-621636',
};

describe('features/orderDetail/components/MobileOrdersTable', () => {
  const props = {
    orders: [
      {
        entity_id: 621636,
        increment_id: 'FC432200605044',
        created_at: '2020-06-05 03:30:32',
        extension_attributes: {
          order_status: 'คำสั่งซื้อสมบูรณ์',
          shipping_assignments: shippingAddress,
          tracking_info: [
            {
              order_id: '621636',
              track_link: 'https://www.google.co.th/',
              track_number: 'NOT AVAILABLE',
            },
          ],
        },
        base_grand_total: 1692,
      },
    ],
    onLoadmore: () => {},
    disabled: false,
    handleOpenTrackClick: jest.fn(),
    hasMoreItems: true,
    loadMore: true,
    loading: false,
  };

  test('it should be match snapshot', () => {
    const { asFragment } = render(<MobileOrdersTable {...props} />);
    expect(asFragment(<MobileOrdersTable {...props} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when order empty', () => {
    const customProps = {
      ...props,
      orders: null,
    };
    const { asFragment } = render(<MobileOrdersTable {...customProps} />);
    expect(asFragment(<MobileOrdersTable {...props} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when order status null or empty', () => {
    const customProps = {
      ...props,
      orders: [
        {
          ...props?.orders[0],
          extension_attributes: {
            ...props?.orders[0].extension_attributes,
            order_status: null,
          },
        },
      ],
    };
    const { asFragment } = render(<MobileOrdersTable {...customProps} />);
    expect(asFragment(<MobileOrdersTable {...props} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when loadMore false', () => {
    const customProps = {
      ...props,
      loadMore: false,
    };
    const { asFragment } = render(<MobileOrdersTable {...customProps} />);
    expect(asFragment(<MobileOrdersTable {...props} />)).toMatchSnapshot();
  });

  test('it should be match snapshot when loading', () => {
    const customProps = {
      ...props,
      loading: true,
    };
    const { asFragment } = render(<MobileOrdersTable {...customProps} />);
    expect(
      asFragment(<MobileOrdersTable {...customProps} />),
    ).toMatchSnapshot();
  });

  test('hidden button tracking when track_link null | it should be match snapshot', () => {
    const customProps = {
      ...props,
      orders: [
        {
          ...props?.orders[0],
          extension_attributes: {
            ...props?.orders[0].extension_attributes,
            tracking_info: [
              {
                ...props?.orders[0].extension_attributes?.tracking_info[0],
                track_link: null,
              },
            ],
          },
        },
      ],
    };

    const { asFragment } = render(<MobileOrdersTable {...customProps} />);
    expect(
      asFragment(<MobileOrdersTable {...customProps} />),
    ).toMatchSnapshot();
  });

  test('click open tracking from web grap | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <MobileOrdersTable {...props} />,
    );
    const buttonViewOrderTrack = getByTestId(TEST_ID.BUTTON_TRACK);
    expect(buttonViewOrderTrack).toBeInTheDocument();
    fireEvent.click(buttonViewOrderTrack);
    expect(asFragment()).toMatchSnapshot();
  });
});
