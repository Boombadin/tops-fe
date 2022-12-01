import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import './ListItem.scss';

const ListItem = ({
  className,
  children,
}) => {
  return (
    <li
      className={`mt-list-item ${className}`}
    >
      {
        children
      }
    </li>
  );
};

ListItem.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ListItem.defaultProps = {
  className: '',
  children: 'No child found',
};

export default ListItem;