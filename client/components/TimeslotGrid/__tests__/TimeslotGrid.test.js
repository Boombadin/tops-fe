import { render } from '@testing-library/react';
import React from 'react';

import { slot, slotMore7 } from '../__mocks__/mockSlot';
import TimeslotGrid from '../TimeslotGrid';

const TEST_ID = {
  TIME_SLOT_CONTAINER: 'inf-viewTimeslotGird-Container',
  ARROW_RIGHT: 'btn-changeTimeslotGird-right-arrow',
  ARROW_LEFT: 'btn-changeTimeslotGird-left-arrow',
};

describe('components/TimeslotGrid/TimeslotGrid', () => {
  const props = {
    translate: jest.fn(props => props),
    intervalsAll: {},
    onChooseTime: jest.fn(),
    onIntervalChange: jest.fn(),
    controlled: true,
    active: '',
    dates: [],
    intervals: [],
  };
  test('it should match with snapshot', () => {
    const { getByTestId } = render(<TimeslotGrid {...props} />);
    expect(getByTestId(TEST_ID.TIME_SLOT_CONTAINER)).toMatchSnapshot();
  });

  test('slot more than 7 days | it should show arrow', () => {
    const newProps = {
      ...props,
      intervalsAll: slotMore7,
    };
    const { getByTestId } = render(<TimeslotGrid {...newProps} />);
    expect(getByTestId(TEST_ID.ARROW_LEFT)).toHaveClass(
      'timeslotswitch__left-arrow',
    );
    expect(getByTestId(TEST_ID.ARROW_RIGHT)).toHaveClass(
      'timeslotswitch__right-arrow',
    );
  });
});
