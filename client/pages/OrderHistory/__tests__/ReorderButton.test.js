import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import ReorderButton from '../ReorderButton';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

const TEST_ID = {
  BUTTON_REORDER: 'btn-addReorder-reorder-621636',
};

describe('features/orderDetail/components/ReorderButton', () => {
  const props = {
    orderId: '621636',
    reorder: () => {},
  };

  test('it should be match snapshot', () => {
    const { asFragment } = render(<ReorderButton {...props} />);
    expect(asFragment(<ReorderButton {...props} />)).toMatchSnapshot();
  });

  test('click reorder process | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(<ReorderButton {...props} />);
    const buttonViewOrderReorder = getByTestId(TEST_ID.BUTTON_REORDER);
    expect(buttonViewOrderReorder).toBeInTheDocument();
    fireEvent.click(buttonViewOrderReorder);
    expect(asFragment()).toMatchSnapshot();
  });
});
