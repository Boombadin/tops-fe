import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const SpSubCateItem = ({ title, link, basePath, history }) => (
  <div className="sub-cate-link">
    <a onClick={() => history.push(`${basePath}${link}`)}>
      <h2>{title}</h2>
    </a>
  </div>
);
SpSubCateItem.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
export default withRouter(SpSubCateItem);
