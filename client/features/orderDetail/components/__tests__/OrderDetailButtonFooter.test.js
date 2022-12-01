import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import OrderDetailButtonFooter from '../OrderDetailButtonFooter';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

const TEST_ID = {
  BUTTON_TRACKORDER: 'btn-viewOrderDetailButtonFooter-handleTrackClick-809219',
  BUTTON_REORDER: 'btn-addOrderDetailButtonFooter-handleReorderClick-809219',
  LOADING: 'view-loading-reorder-809219',
};

describe('features/orderDetail/components/OrderDetailButtonFooter', () => {
  const props = {
    orderId: '809219',
    loadingReorder: false,
    orderTracking: true,
    handleTrackClick: () => {},
    handleReorderClick: () => {},
  };

  test('it should be match snapshot', () => {
    const { asFragment } = render(<OrderDetailButtonFooter {...props} />);
    expect(
      asFragment(<OrderDetailButtonFooter {...props} />),
    ).toMatchSnapshot();
  });

  test('it not show button tracking when tracking_info from api return array empty | it should be match snapshot', () => {
    const customProps = {
      orderId: '809219',
      loadingReorder: false,
      orderTracking: false,
      handleTrackClick: () => {},
      handleReorderClick: () => {},
    };

    const { asFragment } = render(<OrderDetailButtonFooter {...customProps} />);
    expect(
      asFragment(<OrderDetailButtonFooter {...customProps} />),
    ).toMatchSnapshot();
  });

  test('click open tracking process from grap | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <OrderDetailButtonFooter {...props} />,
    );
    const buttonViewOrderTracking = getByTestId(TEST_ID.BUTTON_TRACKORDER);
    expect(buttonViewOrderTracking).toBeInTheDocument();
    fireEvent.click(buttonViewOrderTracking);
    expect(asFragment()).toMatchSnapshot();
  });

  test('click reorder | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(
      <OrderDetailButtonFooter {...props} />,
    );
    const buttonReorder = getByTestId(TEST_ID.BUTTON_REORDER);
    expect(buttonReorder).toBeInTheDocument();
    fireEvent.click(buttonReorder);
    expect(asFragment()).toMatchSnapshot();
  });

  test('click reorder when loading true | it should be match snapshot', () => {
    const propsUpdateLoading = {
      ...props,
      loadingReorder: true,
    };
    const { getByTestId, asFragment } = render(
      <OrderDetailButtonFooter {...propsUpdateLoading} />,
    );
    const loading = getByTestId(TEST_ID.LOADING);
    expect(loading).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
