import { render } from '@testing-library/react';
import React from 'react';

import OrderLimitQtyModal from '../OrderLimitQtyModal';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

describe('features/order/OrderLimitQtyModal', () => {
  const props = {
    visible: true,
    message: `Can't reorder due to cart item limit exceeded. Please select some item(s) and try again.`,
    onModalClose: () => {},
  };

  test.skip('it should be match snapshot', () => {
    // TODO make it match with the snapshot
    const { asFragment } = render(<OrderLimitQtyModal {...props} />);
    expect(asFragment(<OrderLimitQtyModal {...props} />)).toMatchSnapshot();
  });
});
