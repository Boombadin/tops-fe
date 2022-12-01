import React from 'react';
import PropTypes from 'prop-types';
import './Dropdown.scss';
import { values } from 'lodash';

import {
  DIRECTIONS as DropdownDirection,
} from '../../types';

const Dropdown = ({
  className,
  direction,
  children,
}) => (
    <div
      className={`mt-dropdown ${className}`}
      data-direction={direction}
    >
      {
        children
      }
    </div>
  );

Dropdown.propTypes = {
  className: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(values(DropdownDirection)).isRequired,
  children: PropTypes.node.isRequired,
};

Dropdown.defaultProps = {
  className: '',
  direction: 'down',
  children: 'I need a nested list! Give it to me!',
};

export default Dropdown;