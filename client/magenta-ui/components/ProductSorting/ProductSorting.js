import React, { Fragment } from 'react';
import { Dropdown } from 'semantic-ui-react';
import propTypes from 'prop-types';
import { map, noop } from 'lodash';
import './ProductSorting.scss';

const ProductSorting = ({ sorting, onSortByChange, className, value, sortingLabel, loading, open, onClick, mini }) => {
  const sortingMapping = sortingObj => {
    const sortNewObject = [];

    if (!sortingObj || sortingObj.length <= 0) return null;

    map(sortingObj, item => {
      if (item.code !== 'position' && item.code !== 'ranking') {
        const newData = {
          value: `${item.code},asc`,
          text: sortingLabel[item.code]['asc'],
          code: item.code,
          direction: 'asc'
        };

        sortNewObject.push(newData);
      }

      const newData2 = {
        value: `${item.code},desc`,
        text: sortingLabel[item.code]['desc'],
        code: item.code,
        direction: 'desc'
      };

      sortNewObject.push(newData2);
    });

    return sortNewObject;
  };

  if (mini) {
    const options = sortingMapping(sorting);

    return (
      <div className="sorting">
        <div className="sorting-icon" />
        <div className="sorting-label" onClick={onClick}>
          Sorting
        </div>
        {open && (
          <div className="sorting-dropdown">
            {map(options, item => (
              <div className="sorting-dropdown-item" onClick={e => onSortByChange(e, item)}>
                {item.text}
              </div>
            ))}
          </div>
        )}
      </div>

      //   <div className={`sort-wrapper ${className}`}>
      //   <div className="sort-containers">
      //     <span className="sort-label">{sortingLabel.label}</span>
      //     <span className="sort-list">
      //       <Dropdown
      //         options={sortingMapping(sorting)}
      //         onChange={onSortByChange}
      //         onClick={onClick}
      //         value={value}
      //         disabled={loading}
      //         open={open}
      //       />
      //     </span>
      //   </div>
      // </div>
    );
  }

  return (
    <div className={`sort-wrapper ${className}`}>
      <div className="sort-containers">
        <span className="sort-label">{sortingLabel.label}</span>
        <span className="sort-list">
          <Dropdown
            options={sortingMapping(sorting)}
            onChange={onSortByChange}
            onClick={onClick}
            value={value}
            disabled={loading}
            open={open}
          />
        </span>
      </div>
    </div>
  );
};

ProductSorting.propTypes = {
  sorting: propTypes.array.isRequired,
  onSortByChange: propTypes.func,
  className: propTypes.string,
  value: propTypes.any.isRequired,
  sortingLabel: propTypes.object.isRequired,
  loading: propTypes.bool,
  open: propTypes.bool,
  mini: propTypes.bool
};

ProductSorting.defaultProps = {
  className: '',
  onSortByChange: noop,
  loading: false,
  open: undefined,
  mini: false
};

export default ProductSorting;
