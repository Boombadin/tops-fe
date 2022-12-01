import { cleanup, render } from '@testing-library/react';
import React from 'react';

import AddProductButton from '@client/features/product/components/AddProductButton';

describe('features/product/components/AddProductButton', () => {
  let props = {};
  beforeEach(() => {
    props = {
      addToCartLabel: 'Add to Cart',
      onClickAddProductBtn: jest.fn(),
      outOfStockLabel: 'Out of Stock',
      type: 'default',
      product: {
        extension_attributes: {
          stock_item: { is_in_stock: true, qty: 10 },
        },
      },
    };
  });
  afterEach(cleanup);

  test('it should match the snapshot', () => {
    const component = render(<AddProductButton {...props} />);

    expect(component).toMatchSnapshot();
  });
  test('it should contain Add to cart text', () => {
    const component = render(<AddProductButton {...props} />);

    expect(component.getByTestId('add-product-button').textContent).toBe(
      props.addToCartLabel,
    );
  });
  test('it should contain enabled button if product available', () => {
    const component = render(<AddProductButton {...props} />);
    expect(component.getByTestId('add-product-button')).not.toHaveAttribute(
      'disabled',
    );
  });
  test('it should contain disabled button if product out of stock', () => {
    props.product.extension_attributes.stock_item.is_in_stock = false;
    const component = render(<AddProductButton {...props} />);
    expect(component.getByTestId('add-product-button')).toHaveAttribute(
      'disabled',
    );
    expect(component.getByTestId('add-product-button').textContent).toBe(
      props.outOfStockLabel,
    );
  });
  test('it should contain out of stock label if is_in_stock falg is false', () => {
    props.product.extension_attributes.stock_item.is_in_stock = false;

    const component = render(<AddProductButton {...props} />);
    expect(component.getByTestId('add-product-button').textContent).toBe(
      props.outOfStockLabel,
    );
  });
  test('it should contain out of stock label if stockQty <= 0', () => {
    props.product.extension_attributes.stock_item.qty = 0;

    const component = render(<AddProductButton {...props} />);
    expect(component.getByTestId('add-product-button').textContent).toBe(
      props.outOfStockLabel,
    );
  });
});
