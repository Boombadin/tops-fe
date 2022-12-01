import { render, screen } from '@testing-library/react';
import React from 'react';

import SlotCell from '../SlotCell';
describe('components/TimeslotGrid/SlotCell', () => {
  const props = {
    translate: jest.fn(props => props),
    slot: {
      id: '2020-10-31/203',
      timeFrom: '10:00',
      timeTo: '12:00',
      cost: 60,
      quota: 200,
      available: true,
      enabled: true,
      isAllow: true,
    },
    drawInterval: false,
    intervalName: '',
    active: true,
    onClick: jest.fn(props => props),
  };
  test('it should match with snapshot', () => {
    const { getByTestId } = render(<SlotCell {...props} />);
    expect(getByTestId('inf-viewSlotCell-Container')).toMatchSnapshot();
    expect(screen.getByText('60 baht_sign')).toBeInTheDocument();
  });
  test('active slot | it should show text (Selected) ', () => {
    const newProps = {
      ...props,
      intervalCellCheckMarkClassName: 'custom-timeslot-interval-cell',
    };
    render(<SlotCell {...newProps} />);
    expect(screen.getByText('timeslot.grid.slot.selected')).toBeInTheDocument();
  });
  test('slot not enabled or not allow | it should show text (-) ', () => {
    const newProps = {
      ...props,
      slot: {
        id: '2020-10-31/203',
        timeFrom: '10:00',
        timeTo: '12:00',
        cost: 60,
        quota: 200,
        available: true,
        enabled: false,
        isAllow: false,
      },
    };
    render(<SlotCell {...newProps} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });
  test('slot not available | it should show text (Full) ', () => {
    const newProps = {
      ...props,
      slot: {
        id: '2020-10-31/203',
        timeFrom: '10:00',
        timeTo: '12:00',
        cost: 60,
        quota: 200,
        available: false,
        enabled: true,
        isAllow: true,
      },
    };
    render(<SlotCell {...newProps} />);
    expect(screen.getByText('timeslot.grid.slot.full')).toBeInTheDocument();
  });
  test('cost of slot = 0 | it should show text (Free) ', () => {
    const newProps = {
      ...props,
      slot: {
        id: '2020-10-31/203',
        timeFrom: '10:00',
        timeTo: '12:00',
        cost: 0,
        quota: 200,
        available: true,
        enabled: true,
        isAllow: true,
      },
    };
    render(<SlotCell {...newProps} />);
    expect(screen.getByText('timeslot.grid.slot.free')).toBeInTheDocument();
  });
  test('drawInterval is true | it should show text from intervalName (10:00-12:00) ', () => {
    const newProps = {
      ...props,
      drawInterval: true,
      intervalName: '10:00-12:00',
      slot: {
        id: '2020-10-31/203',
        timeFrom: '10:00',
        timeTo: '12:00',
        cost: 60,
        quota: 200,
        available: true,
        enabled: true,
        isAllow: true,
      },
    };
    render(<SlotCell {...newProps} />);
    expect(screen.getByText('10:00-12:00')).toBeInTheDocument();
  });
});
