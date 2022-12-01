import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '../ListItem';
import './List.scss';

const List = ({
  className,
  children
}) => (
    <ul className={className}>
      {
        children
      }
    </ul>
  );

List.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

List.defaultProps = {
  className: '',
  children: 'I am list with no list',
};

export default List;