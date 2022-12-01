import React from 'react';
import PropTypes from 'prop-types';
import { values } from 'lodash';

import {
  COLORS as ButtonColor,
  SIZES as ButtonSize,
} from '../../types';

import { valueOrDefault } from '../../utils/utils';

import './Button.scss';

const Button = ({
  onClick,
  color,
  size,
  type,
  children,
  className,
  ...others
}) => (
  <button
    onClick={onClick}
    className={`button ${className} 
      button--${valueOrDefault(color, ButtonColor, ButtonColor.BLUE)} 
      button--${valueOrDefault(size, ButtonSize, ButtonSize.REGULAR)}`}
    {...others}
  >
    {
      children
    }
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  color: PropTypes.oneOf(values(ButtonColor)).isRequired,
  size: PropTypes.oneOf(values(ButtonSize)).isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

Button.defaultProps = {
  onClick: () => console.warn('On click not specified'),
  color: ButtonColor.BLUE,
  size: ButtonSize.REGULAR,
  type: 'button',
  children: 'Click me',
  className: '',
};

export default Button;
