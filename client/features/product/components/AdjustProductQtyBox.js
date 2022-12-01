import { IncrementInputBox } from '@central-tech/core-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const IncrementInputBoxStyled = styled(IncrementInputBox)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  box-sizing: content-box;
  height: ${({ type }) => (type == 'mini' ? '20px' : '43px')};
  background-color: #fff;
  border: 3px solid #f60403;
  border-radius: 6px;
  color: #fff;
  line-height: ${({ type }) => (type == 'mini' ? '20px' : '43px')};

  input {
    color: #f60403;
    font-size: ${({ type }) => (type == 'mini' ? '12px' : '15px')};
    font-weight: 700;
    border: none;

    width: ${({ type }) => type == 'mini' && '100%'};
    height: ${({ type }) => type == 'mini' && 'inherit'};
  }
`;

const ButtonStyled = styled.button`
  width: ${({ type }) => (type == 'mini' ? '18.5px' : '35px')};
  height: ${({ type }) => (type == 'mini' ? '20px' : '43px')};

  font-size: 16px;
  background-color: #f60403;
  border: none;
  color: #fff;
  cursor: pointer;
  text-align: center;
`;

function AdjustProductQtyBox({
  defaultQty,
  stockQty,
  maxSaleQty,
  gtm,
  onClickIncreaseQtyBtn,
  onClickDecreaseQtyBtn,
  onClickIncreaseQtyDisabledBtn,
  onChangeProductQtyCompleted,
  type,
}) {
  return (
    <IncrementInputBoxStyled
      data-testid="adjust-product-qty-box"
      defaultValue={defaultQty}
      editable={false}
      minValue={0}
      maxValue={stockQty < maxSaleQty ? stockQty : maxSaleQty}
      onUpdateCompleted={onChangeProductQtyCompleted}
      type={type}
      renderButton={direction =>
        direction === 'inc' ? (
          <ButtonStyled
            data-testid="adjust-product-qty-box-increase-btn"
            onClick={onClickIncreaseQtyBtn}
            type={type}
            {...gtm}
          >
            +
          </ButtonStyled>
        ) : (
          <ButtonStyled
            data-testid="adjust-product-qty-box-decrease-btn"
            onClick={onClickDecreaseQtyBtn}
            type={type}
            {...gtm}
          >
            -
          </ButtonStyled>
        )
      }
      renderButtonDisabled={direction =>
        direction === 'inc' ? (
          <ButtonStyled
            data-testid="adjust-product-qty-box-increase-btn"
            type={type}
            onClick={onClickIncreaseQtyDisabledBtn}
            {...gtm}
          >
            +
          </ButtonStyled>
        ) : (
          <ButtonStyled
            data-testid="adjust-product-qty-box-decrease-btn"
            disabled
            type={type}
            {...gtm}
          >
            -
          </ButtonStyled>
        )
      }
    />
  );
}

AdjustProductQtyBox.propTypes = {
  defaultQty: PropTypes.number,
  stockQty: PropTypes.number,
  maxSaleQty: PropTypes.number,
  gtm: PropTypes.object,
  onClickIncreaseQtyBtn: PropTypes.func.isRequired,
  onClickDecreaseQtyBtn: PropTypes.func.isRequired,
  onChangeProductQtyCompleted: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['default', 'mini']).isRequired,
};

AdjustProductQtyBox.defaultProps = {
  defaultQty: 1,
  stockQty: null,
  maxSaleQty: null,
  gtm: {},
  type: 'default',
};

export default React.memo(AdjustProductQtyBox);
