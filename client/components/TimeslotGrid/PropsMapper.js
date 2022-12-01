import { keyBy, map, reduce, sortBy, uniqBy } from 'lodash';
import moment from 'moment';
import pt from 'prop-types';
import React, { Fragment } from 'react';

import './TimeslotGrid.scss';

import { format } from '../../utils/time';
import Grid from './TimeslotGrid';

// Constants
const isFirefox = typeof InstallTrigger !== 'undefined';

function formatIntervalTime(timeStr) {
  const [hours, minutes, ...rest] = timeStr.split(/:/g);

  return `${hours}:${minutes}`;
}

function mapProps(props) {
  const allIntervals = reduce(
    props.days,
    (acc, date) => acc.concat(date.slots),
    [],
  );
  const uniqIntervals = uniqBy(allIntervals, 'timeFrom');
  const sortedIntervals = sortBy(uniqIntervals, 'timeFrom');
  const intervals = map(sortedIntervals, interval => ({
    id: `${interval.timeFrom}-${interval.timeTo}`,
    name: (
      <Fragment>
        {formatIntervalTime(interval.timeFrom)}
        <br />-<br />
        {formatIntervalTime(interval.timeTo)}
      </Fragment>
    ),
  }));

  return {
    noIntervals: props.noIntervals,
    lang: props.lang,
    translate: props.translate,
    defaultValue: props.defaultValue,
    controlled: props.controlled,
    active: props.active,
    onChooseTime: props.onChooseTime,
    intervals: intervals,
    dates: map(props.days, day => ({
      weekDay:
        moment().format('YYYY-MM-DD') === day.date
          ? props.translate('timeslot.grid.today')
          : format(
              day.date,
              props.lang === 'en_US' ? 'ddd.' : 'dddd',
              props.lang,
            ),
      monthDay: format(day.date, 'MMM D', props.lang),
      date: day.date,
      slotsByIntervalId: keyBy(
        map(day.slots, slot => ({
          ...slot,
          available: slot.available > 0,
          id: `${day.date}/${slot.id}`,
        })),
        slot => `${slot.timeFrom}-${slot.timeTo}`,
      ),
    })),
    headerClassName: props.headerClassName,
    headerCellClassName: props.headerCellClassName,
    headerCellFatClassName: props.headerCellFatClassName,
    headerCellNormalClassName: props.headerCellNormalClassName,
    intervalClassName: props.intervalClassName,
    intervalNameClassName: props.intervalNameClassName,
    intervalCellClassName: props.intervalCellClassName,
    intervalCellActiveClassName: props.intervalCellActiveClassName,
    intervalCellCheckMarkClassName: props.intervalCellCheckMarkClassName,
    activeIndex: props.activeIndex,
    intervalsAll: props.intervalsAll,
    onIntervalChange: props.onIntervalChange,
  };
}

const TimeslotGrid = props => {
  const newProps = mapProps(props);
  return (
    <div className={isFirefox ? 'timeslot-footer__margin' : ''}>
      <Grid {...newProps} />
    </div>
  );
};

TimeslotGrid.propTypes = {
  days: pt.arrayOf(
    pt.shape({
      date: pt.oneOfType([pt.string, pt.any]), // "May 10, 2018"
      slots: pt.arrayOf(
        pt.shape({
          id: pt.oneOfType([pt.number, pt.string]),
          timeFrom: pt.string,
          timeTo: pt.string,
          cost: pt.number,
          quota: pt.number,
          available: pt.number,
          enabled: pt.bool,
        }),
      ),
    }),
  ).isRequired,
  controlled: pt.bool,
  active: pt.oneOfType([pt.string, pt.number]),
  onChooseTime: pt.func.isRequired,
  headerClassName: pt.string,
  headerCellClassName: pt.string,
  headerCellFatClassName: pt.string,
  headerCellNormalClassName: pt.string,
  intervalClassName: pt.string,
  intervalNameClassName: pt.string,
  intervalCellClassName: pt.string,
  intervalCellActiveClassName: pt.string,
  intervalCellCheckMarkClassName: pt.string,
  defaultValue: pt.oneOfType([pt.string, pt.number]),
  translate: pt.func.isRequired,
  lang: pt.string.isRequired,
  activeIndex: pt.oneOfType([pt.string, pt.number]),
  onIntervalChange: pt.func,
};

TimeslotGrid.defaultProps = {
  controlled: false,
  active: null,
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
  activeIndex: '',
  onIntervalChange: '',
};

export default TimeslotGrid;
