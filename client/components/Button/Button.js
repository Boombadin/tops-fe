import React from 'react';
import { string, bool, oneOf, func, number, oneOfType, element, node } from 'prop-types';
import styled from 'styled-components';
import posed from 'react-pose';
import { Loader } from '../../magenta-ui';

// Constants
export const BTN_COLOR = '#333';

const ButtonAnimate = posed.button({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
  },
  hover: {
    scale: 1.1,
    boxShadow: '0px 5px 10px rgba(0,0,0,0.2)',
  },
  press: {
    scale: 1.05,
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  },
});

const buttonSize = props => {
  switch (props.size) {
    case 'small':
      return '0.2em 0.4em';
    case 'medium':
      return '0.4em 0.8em';
    case 'large':
      return '0.5em 1em';
    default:
      return '0.4em 0.8em';
  }
};

export const BTN = styled(ButtonAnimate)`
  cursor: pointer;
  width: ${props => (props.width ? `${props.width}px` : 'auto')};
  height: ${props => (props.height ? `${props.height}px` : 'auto')};
  background: ${props => (!props.outline ? props.color : 'white')};
  color: ${props => (!props.outline ? props.textColor : props.color)};
  font-size: ${props => (props.size === 'small' ? '0.8em' : '1em')};
  ${props => (props.isActions ? 'margin: 0' : 'margin: 0.5em')};
  padding: ${props => props.padding || buttonSize};
  border: 2px solid ${props => props.color};
  border-radius: 8px;
  ${props =>
    !props.outline && !props.isActions ? 'border-bottom: 3px solid rgba(0, 0, 0, 0.2);' : ''}
`;

export const BtnNoAnimation = styled.button`
  cursor: ${props => (props.disabled || props.loading ? 'not-allowed' : 'pointer')};
  width: ${props => (props.width ? `${props.width}px` : 'auto')};
  height: ${props => (props.height ? `${props.height}px` : 'auto')};
  background: ${props => (!props.outline ? props.color : 'white')};
  color: ${props => (!props.outline ? props.textColor : props.color)};
  font-size: ${props => (props.size === 'small' ? '0.8em' : '1em')};
  ${props => (props.isActions ? 'margin: 0' : 'margin: 0.5em')};
  padding: ${props => props.padding || buttonSize};
  border: 2px solid ${props => props.color};
  border-radius: 8px;
  ${props =>
    !props.outline && !props.isActions ? 'border-bottom: 3px solid rgba(0, 0, 0, 0.2);' : ''}
  ${props =>
    !props.outline && (props.disabled || props.loading)
      ? 'border-bottom: 3px solid rgba(0, 0, 0, 0.2);'
      : ''}
  opacity: ${props => (props.disabled ? '0.5' : '1')};
`;

const Button = props => {
  const {
    title,
    outline,
    children,
    color,
    isActions,
    size,
    disabled,
    onClick,
    loading,
    ...rest
  } = props;

  return !isActions && !disabled && !loading ? (
    <BTN {...rest} size={size} color={color} outline={outline} isActions={isActions}>
      {title || children}
    </BTN>
  ) : (
    <BtnNoAnimation
      {...rest}
      size={size}
      color={color}
      outline={outline}
      isActions={isActions}
      disabled={disabled}
      onClick={disabled ? () => null : onClick}
    >
      {loading ? (
        <Loader active inline="centered" size="small" color="white" />
      ) : (
        title || children
      )}
    </BtnNoAnimation>
  );
};

Button.propTypes = {
  title: string,
  outline: bool,
  children: oneOfType([string, func, element, node]),
  color: string,
  textColor: string,
  padding: string,
  size: oneOf(['small', 'medium', 'large']),
  isActions: bool,
  disabled: bool,
  loading: bool,
  onClick: func,
  width: number,
  height: number,
};

Button.defaultProps = {
  title: '',
  outline: false,
  children: '',
  color: BTN_COLOR,
  textColor: 'white',
  size: 'medium',
  padding: '',
  isActions: false,
  disabled: false,
  loading: false,
  onClick: () => null,
  width: 0,
  height: 0,
};

export default Button;
