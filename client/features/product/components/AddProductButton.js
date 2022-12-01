import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: block;
  width: ${({ type }) => (type == 'mini' ? '80px' : '100%')};
  height: ${({ type }) => (type == 'mini' ? '20px' : '45px')};
  padding: 0;
  border: 1px solid;
  border-color: ${({ disabled }) => (disabled ? '#cfcfcf' : '#dedede')};
  border-radius: 5px;

  box-sizing: content-box;
  font-size: ${({ type }) => (type == 'mini' ? '12px' : '13px')};
  color: #291a14;
  line-height: ${({ type }) => (type == 'mini' ? '20px' : '45px')};
  transition: filter 100ms linear;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: #ffffff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  opacity: ${({ disabled }) => disabled && 0.45};

  &:hover {
    filter: ${({ disabled }) => !disabled && 'brightness(90%)'};
  }
`;

function AddProductButton({
  addToCartLabel,
  gtm,
  onClickAddProductBtn,
  outOfStockLabel,
  product,
  type,
}) {
  const isOutOfStock =
    !product?.extension_attributes?.stock_item?.is_in_stock ||
    product?.extension_attributes?.stock_item?.qty <= 0;

  const label = isOutOfStock ? outOfStockLabel : addToCartLabel;

  return (
    <Button
      {...gtm}
      data-testid="add-product-button"
      disabled={isOutOfStock}
      onClick={onClickAddProductBtn}
      type={type}
    >
      {label}
    </Button>
  );
}

AddProductButton.propTypes = {
  gtm: PropTypes.object,
  addToCartLabel: PropTypes.string.isRequired,
  onClickAddProductBtn: PropTypes.func.isRequired,
  outOfStockLabel: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['default', 'mini']).isRequired,
};

AddProductButton.defaultProps = {
  gtm: {},
};

export default React.memo(AddProductButton);
