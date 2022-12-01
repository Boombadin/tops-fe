import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import { useCartContext, useReduxContext } from '@client/contexts';
import AddProductButton from '@client/features/product/components/AddProductButton';
import AdjustProductQtyBox from '@client/features/product/components/AdjustProductQtyBox';
import { usePrevious } from '@client/hooks';
import {
  notifyMaxQty,
  notifyOutOfStock,
  resetNotifyMaxQty,
  resetNotifyOutOfStock,
} from '@client/reducers/cart';

function CartActionButton({
  addToCartLabel,
  beforeAddProductCallback,
  gtm,
  outOfStockLabel,
  product,
  type,
}) {
  const [currentQty, setCurrentQty] = useState(product.qty);
  const previousQty = usePrevious(currentQty);
  const {
    cartAction: {
      addProduct,
      changeProductQty,
      deleteProduct,
      addDebouncingProduct,
      removeDebouncingProduct,
    },
  } = useCartContext();
  const { reduxAction } = useReduxContext();

  const stockQty = product?.extension_attributes?.stock_item?.qty;
  const maxSaleQty = product?.extension_attributes?.stock_item?.max_sale_qty;

  const onClickAddProductBtn = useCallback(() => {
    setCurrentQty(prevQty => prevQty + 1);
    addProduct(product, {
      beforeAction: beforeAddProductCallback,
    });
  }, [addProduct]);

  const onClickIncreaseQtyBtn = useCallback(() => {
    addDebouncingProduct({ productSku: product.sku });
    setCurrentQty(prevQty => prevQty + 1);
  }, [addDebouncingProduct]);

  const onClickDecreaseQtyBtn = useCallback(() => {
    addDebouncingProduct({ productSku: product.sku });
    setCurrentQty(prevQty => prevQty - 1);
  }, [addDebouncingProduct]);

  const onClickIncreaseQtyDisabledBtn = useCallback(async () => {
    if (currentQty >= stockQty) {
      await reduxAction.dispatch(resetNotifyOutOfStock());
      reduxAction.dispatch(notifyOutOfStock(product.sku));
    } else if (currentQty >= maxSaleQty) {
      await reduxAction.dispatch(resetNotifyMaxQty());
      reduxAction.dispatch(notifyMaxQty(product.sku));
    }
  }, [currentQty, maxSaleQty, stockQty, reduxAction]);

  const onChangeProductQtyCompleted = useCallback(
    newQty => {
      removeDebouncingProduct({ productSku: product.sku });
      changeProductQty({ productSku: product.sku, qty: newQty });
    },
    [changeProductQty, removeDebouncingProduct],
  );

  useEffect(() => {
    if (currentQty === 0 && previousQty > 0) {
      removeDebouncingProduct({ productSku: product.sku });
      deleteProduct({ productSku: product.sku });
    }
  }, [currentQty, previousQty]);

  useEffect(() => {
    setCurrentQty(product.qty);
  }, [product]);

  if (product.qty > 0) {
    return (
      <AdjustProductQtyBox
        defaultQty={product.qty}
        stockQty={stockQty}
        maxSaleQty={maxSaleQty}
        onClickIncreaseQtyBtn={onClickIncreaseQtyBtn}
        onClickDecreaseQtyBtn={onClickDecreaseQtyBtn}
        onClickIncreaseQtyDisabledBtn={onClickIncreaseQtyDisabledBtn}
        onChangeProductQtyCompleted={onChangeProductQtyCompleted}
        gtm={gtm}
        type={type}
      />
    );
  }

  return (
    <AddProductButton
      addToCartLabel={addToCartLabel}
      onClickAddProductBtn={onClickAddProductBtn}
      outOfStockLabel={outOfStockLabel}
      product={product}
      gtm={gtm}
      type={type}
    />
  );
}

AddProductButton.propTypes = {
  beforeAddProductCallback: PropTypes.func,
  gtm: PropTypes.object,
  product: PropTypes.object,
  type: PropTypes.oneOf(['default', 'mini']),
  addToCartLabel: PropTypes.string.isRequired,
  outOfStockLabel: PropTypes.string.isRequired,
};

AddProductButton.defaultProps = {
  beforeAddProductCallback: () => {},
  gtm: {},
  product: {},
  type: 'default',
};

export default React.memo(CartActionButton);
