import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import TrackOrderButton from '../TrackOrderButton';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

const TEST_ID = {
  BUTTON_TRACKORDER: 'btn-viewTrackOrderButton-handleTrackClick-621636',
};

describe('features/orderDetail/components/TrackOrderButton', () => {
  const props = {
    orderId: '621636',
    handleTrackClick: () => {},
  };

  test('it should be match snapshot', () => {
    const { asFragment } = render(<TrackOrderButton {...props} />);
    expect(asFragment(<TrackOrderButton {...props} />)).toMatchSnapshot();
  });

  test('click open tracking process from grap | it should be match snapshot', () => {
    const { getByTestId, asFragment } = render(<TrackOrderButton {...props} />);
    const buttonViewOrderTracking = getByTestId(TEST_ID.BUTTON_TRACKORDER);
    expect(buttonViewOrderTracking).toBeInTheDocument();
    fireEvent.click(buttonViewOrderTracking);
    expect(asFragment()).toMatchSnapshot();
  });
});
