import React from 'react';
import PropTypes from 'prop-types';

const RibbonItem = ({ title, className }) => {
  return (
    <div className={`ribbon-item ${className}`}>
      <span>{title}</span>
    </div>
  );
};

RibbonItem.propTypes = {
  className: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
RibbonItem.defaultProps = {
  className: '',
  title: '',
};
export default RibbonItem;
