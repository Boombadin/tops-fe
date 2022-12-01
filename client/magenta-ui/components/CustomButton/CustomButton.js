import React from 'react';
import PropTypes from 'prop-types';
import { values } from 'lodash';

import {
  COLORS as ButtonColor,
  SIZES as ButtonSize,
} from '../../types';

import { valueOrDefault } from '../../utils/utils';

import './CustomButton.scss';

function composeClassName({ primary, secondary, className, color, size, type = 'default' }) {
  const classNames = ['custom-button']

  if (className) {
    classNames.push(className)
  }

  if (primary) {
    classNames.push('custom-button--primary')
  }

  if (secondary) {
    classNames.push('custom-button--secondary')
  }

  classNames.push(`custom-button--${valueOrDefault(color, ButtonColor, ButtonColor.BLUE)}`)
  classNames.push(`custom-button--${valueOrDefault(size, ButtonSize, ButtonSize.REGULAR)}`)
  classNames.push(`custom-button--${type}`)

  return classNames.join(' ')
}

const CustomButton = ({
  onClick,
  color,
  size,
  type,
  children,
  className,
  primary,
  secondary,
  ...others
}) => (
    <button
      onClick={onClick}
      className={composeClassName({
        primary, secondary, className, color, size, type
      })}
      {...others}
    >
      {
        children
      }
    </button>
  );

CustomButton.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.oneOf(values(ButtonColor)),
  size: PropTypes.oneOf(values(ButtonSize)),
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  primary: PropTypes.bool,
  secondary: PropTypes.bool
};

CustomButton.defaultProps = {
  onClick: () => console.warn('On Click not specified'),
  color: ButtonColor.BLUE,
  size: ButtonSize.REGULAR,
  type: 'default',
  children: 'Click me',
  className: '',
  primary: true,
  secondary: false
};

export default CustomButton;
