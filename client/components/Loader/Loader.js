import React from 'react';
import PropTypes from 'prop-types';
import './Loader.scss';

const Loader = ({ wrapperClassName = '', className = '' }) => (
  <div className={`loader-root ${wrapperClassName}`}>
    <div className={`loader-loader ${className}`}>
      <svg
        className="loader-circular"
        viewBox="25 25 50 50"
      >
        <circle
          className="loader-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  </div>
);

Loader.propTypes = {
  wrapperClassName: PropTypes.string,
  className: PropTypes.string
};

export default Loader;
