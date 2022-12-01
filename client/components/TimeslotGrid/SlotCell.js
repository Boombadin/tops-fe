import cx from 'classnames';
import { isEmpty, noop } from 'lodash';
import pt from 'prop-types';
import React from 'react';

import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';
export const TIME_UNAVAILABLE = 'Full';

function getClassName(props) {
  // console.log('enabled1', !props.slot.available);

  return cx(props.intervalCellClassName || 'timeslot-interval-cell', {
    disabled:
      !props.slot.enabled || !props.slot.available || !props.slot.isAllow,
    active: props.active,
    drawInterval: props.drawInterval,
  });
}

function getOnClickHandler(props) {
  return !props.slot.enabled || !props.slot.available || !props.slot.isAllow
    ? noop
    : props.onClick;
}

function getCostValue(props) {
  if (!props.slot.enabled || !props.slot.isAllow) {
    return '-';
  } else if (!props.slot.available) {
    return props.translate('timeslot.grid.slot.full');
  } else if (props.drawInterval) {
    return props.intervalName;
  } else if (props.slot.cost === 0) {
    return props.translate('timeslot.grid.slot.free');
  }
  return `${props.slot.cost} ${props.translate('baht_sign')}`;
}

/* eslint-disable jsx-a11y/click-events-have-key-events,
jsx-a11y/no-noninteractive-element-interactions,
react/no-unused-prop-types */
const SlotCell = props => (
  <div
    data-testid={generateTestId({
      type: ELEMENT_TYPE.INFO,
      action: ELEMENT_ACTION.VIEW,
      moduleName: 'SlotCell',
      uniqueId: 'Container',
    })}
    className={getClassName(props)}
    role="cell"
    onClick={getOnClickHandler(props)}
  >
    {props.active && (
      <div
        className={
          props.intervalCellActiveClassName || 'timeslot-interval-cell__active'
        }
      >
        {isEmpty(props.intervalCellCheckMarkClassName) ? (
          <div className={'timeslot-interval-cell__check-mark'}>✔</div>
        ) : (
          <div className={props.intervalCellCheckMarkClassName}>
            {props.translate('timeslot.grid.slot.selected')}
          </div>
        )}
      </div>
    )}
    {getCostValue(props)}
  </div>
);

SlotCell.propTypes = {
  intervalName: pt.oneOfType([pt.string, pt.object]),
  drawInterval: pt.bool.isRequired,
  active: pt.bool,
  slot: pt.shape({
    id: pt.oneOfType([pt.number, pt.string]),
    cost: pt.number,
    available: pt.bool,
    enabled: pt.bool,
  }).isRequired,
  onClick: pt.func.isRequired,
  translate: pt.func.isRequired,
  intervalCellClassName: pt.string,
  intervalCellActiveClassName: pt.string,
  intervalCellCheckMarkClassName: pt.string,
};

SlotCell.defaultProps = {
  active: false,
  intervalName: '',
  intervalCellClassName: '',
  intervalCellActiveClassName: '',
  intervalCellCheckMarkClassName: '',
};

export default SlotCell;
