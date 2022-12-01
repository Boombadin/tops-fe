import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';

import CartActionButton from '@client/features/product/components/CartActionButton';

jest.mock('@client/contexts', () => ({
  useCartContext: jest.fn().mockReturnValue({
    cartAction: {
      addProduct: jest.fn(),
      deleteProduct: jest.fn(),
      addDebouncingProduct: jest.fn(),
      removeDebouncingProduct: jest.fn(),
    },
  }),
  useReduxContext: jest.fn().mockReturnValue({
    reduxAction: {
      dispatch: jest.fn(),
    },
  }),
}));

describe('features/product/components/CartActionButton', () => {
  let props = {};
  beforeEach(() => {
    props = {
      addToCartLabel: 'Add to Cart',
      outOfStockLabel: 'Out of Stock',
      product: {
        qty: 0,
        status: 1,
        visibility: 2,
        extension_attributes: {
          stock_item: { is_in_stock: true, qty: 10 },
        },
      },
    };
  });
  afterEach(cleanup);

  test('it should render AddProductButton incoming if qty <= 0', () => {
    const component = render(<CartActionButton {...props} />);
    component.getByTestId('add-product-button');

    expect(component).toMatchSnapshot();
  });
  test('it should render AdjustProductQtyBox incoming if qty > 0', () => {
    props.product.qty = 1;
    const component = render(<CartActionButton {...props} />);
    component.getByTestId('adjust-product-qty-box');

    expect(component).toMatchSnapshot();
  });
  test('it should render AdjustProductQtyBox instead after click on AddProductButton', async () => {
    const component = render(<CartActionButton {...props} />);
    await component.findByTestId('add-product-button');

    props.product.qty += 1;
    fireEvent.click(component.getByTestId('add-product-button'));
    component.rerender(<CartActionButton {...props} />);
    component.getByTestId('adjust-product-qty-box');
  });
  test('it should render AddProductButton instead when click on decrease qty btn and qty is decreased to 0', async () => {
    props.product.qty = 1;
    const component = render(<CartActionButton {...props} />);
    await component.findByTestId('adjust-product-qty-box');

    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-decrease-btn'),
    );
    const product = { ...product, qty: props.product.qty - 1 };
    component.rerender(<CartActionButton {...props} product={product} />);
    component.getByTestId('add-product-button');
  });
  test('it should render AddProductButton instead if qty in product prop is less than 1', async () => {
    props.product.qty = 10;
    const component = render(<CartActionButton {...props} />);
    await component.findByTestId('adjust-product-qty-box');

    const product = { ...product, qty: 0 };
    component.rerender(<CartActionButton {...props} product={product} />);
    component.getByTestId('add-product-button');
  });
});
