import React from 'react';
import PropTypes from 'prop-types';
import SpSubCateItem from './SpSubCateItem';
import './SpSubCate.scss';

const SpSubCate = ({ className, subCateItem, basePath }) => (
  <div className={`sp-sub-category ${className}`}>
    {subCateItem.map(item => (
      <SpSubCateItem
        key={item.url_path}
        title={item.name}
        basePath={basePath}
        link={item.url_path}
      />
    ))}
  </div>
);

SpSubCate.propTypes = {
  className: PropTypes.string.isRequired,
  subCateItem: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
    }),
  ).isRequired,
  basePath: PropTypes.string,
};

SpSubCate.defaultProps = {
  basePath: '/',
};

export default SpSubCate;
