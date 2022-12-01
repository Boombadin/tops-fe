import { find, first, get, isEmpty, map, noop, split } from 'lodash';
import pt from 'prop-types';
import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-width: 270px;
`;

const Title = styled.div`
  width: 100%;
  height: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const TimeSlotHeader = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  overflow: auto;
  margin: 10px 0 20px 0;
`;

const TimeSlotHeaderCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80px;
  min-width: 80px;
  height: 50px;
  border-radius: 5px;
  border: solid 1px #cccccc;
  background-color: #fafafa;
  margin-right: 10px;
  font-weight: bold;
  font-size: 13px;

  ${props =>
    props.active &&
    `
        border: solid 1px #80bd00;
        background-color: rgba(128, 189, 0, 0.1);
        color: #199000;
    `}
`;

const TimeSlot = styled.div`
  width: 100%;
  height: auto;
  margin: 10px 0;
`;

const TimeSlotCell = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex: 1;
`;

const IntervalName = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 200px;
  border-radius: 4px;
  background-color: #2a2a2a;
  margin: 0 10px 10px 0;
  color: #ffffff;
`;

const IntervalCell = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #fafafa;
  margin: 0 0 10px 0;
  font-size: 13px;

  ${props =>
    props.active &&
    `
        border: solid 1px #80bd00;
        background-color: rgba(128, 189, 0, 0.1);
        color: #199000;
    `}

  ${props =>
    props.full &&
    `
        cursor: default;
        border: 1px #EEE solid;
        background-color: #FDFDFD;
        color: #9B9B9B;
    `}
`;

const Span = styled.span`
  ${props =>
    props.paddingLeft &&
    `
        padding-left: ${props.paddingLeft}
    `}
  ${props =>
    props.paddingRight &&
    `
        padding-right: ${props.paddingRight}
    `}
`;

class TimeSlotMobile extends PureComponent {
  static propTypes = {
    controlled: pt.bool,
    defaultValue: pt.oneOfType([pt.string, pt.number]),
    active: pt.oneOfType([pt.string, pt.number]),
    onChooseTime: pt.func.isRequired,
    intervals: pt.arrayOf(
      pt.shape({
        id: pt.oneOfType([pt.string, pt.number]),
        name: pt.oneOfType([pt.node, pt.string, pt.number]),
      }),
    ).isRequired,
    dates: pt.arrayOf(
      pt.shape({
        weekDay: pt.string,
        monthDay: pt.string,
        date: pt.oneOfType([pt.string, pt.any]),
        slotsByIntervalId: pt.object,
      }),
    ).isRequired,
    translate: pt.func.isRequired,
  };

  static defaultProps = {
    controlled: false,
    active: false,
    defaultValue: '',
    noIntervals: false,
  };

  state = {
    activeHeader: null,
    slotDateSelected: null,
    slotTimeSelected: null,
  };

  componentDidMount() {
    const date = first(this.props.dates);
    this.setState({
      activeHeader: date,
      slotDateSelected: date,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dates !== this.props.dates) {
      if (this.props.active) {
        const active = first(split(this.props.active, '/'));
        const date = find(this.props.dates, x => x.date === active);
        this.setState({
          activeHeader: date,
          slotDateSelected: date,
        });
      } else {
        const date = first(this.props.dates);
        this.setState({
          activeHeader: date,
          slotDateSelected: date,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState.slotTimeSelected === this.state.slotTimeSelected)
      return false;

    if (nextState.slotDateSelected === this.state.slotDateSelected)
      return false;

    if (nextState.activeHeader === this.state.activeHeader) return false;

    if (nextProps.dates === this.props.dates) return false;
  }

  getCostValue = slot => {
    if (!slot.enabled || !slot.isAllow) {
      return '-';
    } else if (!slot.available) {
      return this.props.translate('timeslot.grid.slot.full');
    } else if (slot.cost === 0) {
      return this.props.translate('timeslot.grid.slot.free');
    }

    return `${slot.cost} ${this.props.translate('baht_sign')}`;
  };

  handleChooseSlotDate = date => {
    this.setState({
      slotDateSelected: date,
      activeHeader: date,
    });
  };

  handleChooseSlotTime = slot => {
    if (!slot.enabled || !slot.available || !slot.isAllow) return noop;

    this.setState({
      slotTimeSelected: slot,
    });

    this.props.onChooseTime(get(slot, 'id'));
  };
  render() {
    // console.log('dates', this.props.dates);

    return (
      <Container>
        <Title>
          {this.props.translate(
            'checkout_delivery.shipping_method.shipping_mobile_time_slot.delivery_services',
          )}
        </Title>
        <TimeSlotHeader>
          {map(this.props.dates, date => {
            return (
              <TimeSlotHeaderCell
                active={date === this.state.activeHeader}
                onClick={() => this.handleChooseSlotDate(date)}
              >
                <Span>{date.weekDay}</Span>
                <Span>{date.monthDay}</Span>
              </TimeSlotHeaderCell>
            );
          })}
        </TimeSlotHeader>

        <Title>
          {this.props.translate(
            'checkout_delivery.shipping_method.shipping_mobile_time_slot.delivery_time_slot',
          )}
        </Title>
        {!isEmpty(this.state.slotDateSelected) && (
          <TimeSlot>
            {map(this.state.slotDateSelected.slotsByIntervalId, slot => (
              <TimeSlotCell onClick={() => this.handleChooseSlotTime(slot)}>
                <IntervalName>{`${slot.timeFrom}-${slot.timeTo}`}</IntervalName>
                <IntervalCell
                  active={slot.id === this.props.active}
                  full={!slot.enabled || !slot.available}
                >
                  {this.getCostValue(slot)}
                  {slot.id === this.props.active && (
                    <Span paddingLeft="5px">
                      {this.props.translate('timeslot.grid.slot.selected')}
                    </Span>
                  )}
                </IntervalCell>
              </TimeSlotCell>
            ))}
          </TimeSlot>
        )}
      </Container>
    );
  }
}

export default TimeSlotMobile;
