import React from 'react';
import { Checkbox } from 'semantic-ui-react';

const ProductFilterItem = ({
  item_count,
  label,
  value,
  code,
  onChange,
  checked,
  disabled,
  icon,
}) => (
  <div className="product-filter-item">
    <Checkbox
      className="product-filter-item--checkbox"
      value={value}
      name={code}
      onChange={onChange}
      checked={checked || false}
      disabled={disabled}
      label={
        <label>
          <div className="label-box">
            {icon && (
              <span className="label-icon">
                <img src={icon} alt={label} />
              </span>
            )}
            <span className="label-text">{label}</span>
            <span className="label-counter">{item_count}</span>
          </div>
        </label>
      }
    />
  </div>
);

export default ProductFilterItem;
