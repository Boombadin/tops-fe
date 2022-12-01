import React from 'react';
import pt from 'prop-types';
import './ModalActions.scss';

export const ModalActions = ({ children, withShadow }) => (
  <div className={`modal-actions${withShadow ? ' shadow' : ''}`}>{children}</div>
);

ModalActions.propTypes = {
  withShadow: pt.bool,
  children: pt.oneOfType([pt.node, pt.arrayOf(pt.node), pt.string, pt.number])
};

ModalActions.defaultProps = {
  withShadow: true,
  children: null
};
