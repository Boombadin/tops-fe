import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { GTM_CLASSES } from '@client/constants/googleTagManager';

import './Counter.scss';

const Counter = ({
  qty,
  className,
  signClassName,
  qtyClassName,
  onChange,
  gtm,
  isMiniCart,
}) => (
  <div
    className={`counter-root ${className}`}
    onClick={event => {
      event.preventDefault();
      event.stopPropagation();
    }}
  >
    <div
      {...gtm}
      className={`sign ${signClassName} ${
        isMiniCart
          ? GTM_CLASSES.TRACK_REMOVE_FROM_MINI_CART
          : GTM_CLASSES.TRACK_REMOVE_FROM_CART
      }`}
      onClick={() => onChange(qty - 1)}
    >
      -
    </div>
    <div className={`qty ${qtyClassName}`}>{qty}</div>
    <div
      {...gtm}
      className={`sign ${signClassName} ${
        isMiniCart
          ? GTM_CLASSES.TRACK_ADD_TO_CART_FROM_MINI_CART
          : GTM_CLASSES.TRACK_ADD_TO_CART
      }`}
      onClick={() => onChange(qty + 1)}
    >
      +
    </div>
  </div>
);

Counter.propTypes = {
  className: PropTypes.string,
  signClassName: PropTypes.string,
  qtyClassName: PropTypes.string,
  qty: PropTypes.number,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  gtm: PropTypes.object,
  isMiniCart: PropTypes.bool,
};

Counter.defaultProps = {
  className: '',
  signClassName: '',
  qtyClassName: '',
  qty: 1,
  onChange: noop,
  onClick: event => event.stopPropagation(),
  gtm: {},
  isMiniCart: false,
};

export default Counter;
