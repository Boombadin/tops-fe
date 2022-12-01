import cx from 'classnames';
import { map } from 'lodash';
import pt from 'prop-types';
import React, { PureComponent } from 'react';

import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

import './TimeslotGrid.scss';

import ArrowLeft from '../Icons/ArrowLeft';
import ArrowRight from '../Icons/ArrowRight';
import SlotCell from './SlotCell';
class TimeslotGrid extends PureComponent {
  static propTypes = {
    noIntervals: pt.bool,
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
        slotsByIntervalId: pt.object, // { id, cost: number, available: bool, enabled: bool }
      }),
    ).isRequired,
    headerClassName: pt.string,
    headerCellClassName: pt.string,
    headerCellFatClassName: pt.string,
    headerCellNormalClassName: pt.string,
    intervalClassName: pt.string,
    intervalNameClassName: pt.string,
    intervalCellClassName: pt.string,
    intervalCellActiveClassName: pt.string,
    intervalCellCheckMarkClassName: pt.string,
    translate: pt.func.isRequired,
    activeIndex: pt.oneOfType([pt.string, pt.number]),
    onIntervalChange: pt.func.isRequired,
  };

  static defaultProps = {
    controlled: false,
    active: false,
    headerClassName: '',
    headerCellClassName: '',
    headerCellFatClassName: '',
    headerCellNormalClassName: '',
    intervalClassName: '',
    intervalNameClassName: '',
    intervalCellClassName: '',
    intervalCellActiveClassName: '',
    intervalCellCheckMarkClassName: '',
    defaultValue: '',
    noIntervals: false,
    activeIndex: '',
  };

  state = {
    active: this.props.defaultValue,
  };

  handleCellClicked = slotId => {
    if (this.props.controlled) {
      return this.props.onChooseTime(slotId);
    }

    this.setState({ active: slotId });
    return this.props.onChooseTime(slotId);
  };
  handleBackClick = () => {
    if (this.props.controlled) {
      const newIdx = this.props.activeIndex - 1;

      return this.props.onIntervalChange(newIdx);
    }
  };
  handleForwardClick = () => {
    if (this.props.controlled) {
      const newIdx = this.props.activeIndex + 1;
      return this.props.onIntervalChange(newIdx);
    }
  };
  render() {
    const { dates, activeIndex } = this.props;
    const active = this.props.controlled
      ? this.props.active
      : this.state.active;
    const idx = this.props.controlled
      ? activeIndex
      : this.state.activeIntervalIndex;
    return (
      <div
        className="timeslot"
        data-testid={generateTestId({
          type: ELEMENT_TYPE.INFO,
          action: ELEMENT_ACTION.VIEW,
          moduleName: 'TimeslotGird',
          uniqueId: 'Container',
        })}
      >
        <div className={this.props.headerClassName || 'timeslot-head'}>
          {!this.props.noIntervals && (
            <div
              className={cx(
                this.props.headerCellClassName || 'timeslot-header__cell',
                'wide',
              )}
            >
              {this.props.translate('timeslot.grid.time')}
            </div>
          )}
          {idx !== 0 ? (
            <div
              className="timeslotswitch__left-arrow"
              onClick={this.handleBackClick}
              data-testid={generateTestId({
                type: ELEMENT_TYPE.BUTTON,
                action: ELEMENT_ACTION.CHANGE,
                moduleName: 'TimeslotGird',
                uniqueId: 'left-arrow',
              })}
            >
              <ArrowLeft width="15" height="15" fill="#199000" />
            </div>
          ) : (
            <div className="timeslotswitch__left-arrow" />
          )}
          {map(dates, date => (
            <div
              key={date.date}
              className={
                this.props.headerCellClassName || 'timeslot-header__cell'
              }
            >
              <div
                className={
                  this.props.headerCellFatClassName ||
                  'timeslot-header__cell-fat'
                }
              >
                {date.weekDay}
              </div>
              <div
                className={
                  this.props.headerCellNormalClassName ||
                  'timeslot-header__cell-normal'
                }
              >
                {date.monthDay}
              </div>
            </div>
          ))}
          {idx !== this.props.intervalsAll.length - 1 ? (
            <div
              className="timeslotswitch__right-arrow"
              onClick={this.handleForwardClick}
              data-testid={generateTestId({
                type: ELEMENT_TYPE.BUTTON,
                action: ELEMENT_ACTION.CHANGE,
                moduleName: 'TimeslotGird',
                uniqueId: 'right-arrow',
              })}
            >
              <ArrowRight width="15" height="15" fill="#199000" />
            </div>
          ) : (
            <div className="timeslotswitch__right-arrow" />
          )}
        </div>
        {map(this.props.intervals, interval => {
          return (
            <div
              key={interval.id}
              className={this.props.intervalClassName || 'timeslot-interval'}
            >
              {!this.props.noIntervals && (
                <div
                  className={cx(
                    this.props.intervalNameClassName ||
                      'timeslot-interval__name',
                    'wide',
                  )}
                >
                  {interval.name}
                </div>
              )}
              {map(this.props.dates, date => {
                return (
                  <SlotCell
                    key={date.date}
                    drawInterval={this.props.noIntervals}
                    intervalName={interval.name}
                    translate={this.props.translate}
                    active={date.slotsByIntervalId[interval.id].id === active}
                    slot={date.slotsByIntervalId[interval.id]}
                    intervalCellClassName={this.props.intervalCellClassName}
                    intervalCellActiveClassName={
                      this.props.intervalCellActiveClassName
                    }
                    intervalCellCheckMarkClassName={
                      this.props.intervalCellCheckMarkClassName
                    }
                    onClick={() =>
                      this.handleCellClicked(
                        date.slotsByIntervalId[interval.id].id,
                      )
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default TimeslotGrid;
