import React from 'react';
import PropTypes from 'prop-types';

const Container = ({
  className,
  classNameUpperHeader,
  children,
  active,
  classNameSearchBar,
}) => (
  <div className={`main-layout ${className} ${classNameUpperHeader}`}>
    <div className={`app-wrapper ${classNameSearchBar}`}>
      <div className={`main-content ${active ? 'active' : ''}`}>{children}</div>
    </div>
  </div>
);

Container.propTypes = {
  className: PropTypes.string,
  classNameUpperHeader: PropTypes.string,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool.isRequired,
  classNameSearchBar: PropTypes.string,
};

Container.defaultProps = {
  className: '',
  classNameUpperHeader: '',
  classNameSearchBar: '',
};

export default Container;
