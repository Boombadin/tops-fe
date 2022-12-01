import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';

import AdjustProductQtyBox from '@client/features/product/components/AdjustProductQtyBox';

describe('features/product/components/AdjustProductQtyBox', () => {
  let props = {};
  beforeEach(() => {
    props = {
      defaultQty: 1,
      type: 'default',
      stockQty: 100,
      maxSaleQty: 100,
      onChangeProductQtyCompleted: jest.fn(),
      onClickIncreaseQtyBtn: jest.fn(),
      onClickDecreaseQtyBtn: jest.fn(),
    };
  });
  afterEach(cleanup);

  test('it should render default qty label from prop', async () => {
    props.defaultQty = 10;
    const component = render(<AdjustProductQtyBox {...props} />);
    component.getByDisplayValue(props.defaultQty.toString());

    expect(component).toMatchSnapshot();
  });
  test('it should render readonly input', () => {
    const component = render(<AdjustProductQtyBox {...props} />);
    expect(
      component.getByDisplayValue(props.defaultQty.toString()),
    ).toHaveAttribute('readonly');

    expect(component).toMatchSnapshot();
  });
  test('it should display increased value on click increase btn', () => {
    const component = render(<AdjustProductQtyBox {...props} />);
    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    );
    component.getByDisplayValue((props.defaultQty + 1).toString());
  });
  test('it should display decreased value on click decrease btn', () => {
    const component = render(<AdjustProductQtyBox {...props} />);
    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-decrease-btn'),
    );
    component.getByDisplayValue((props.defaultQty - 1).toString());
  });
  test('it should not decrease display value to less than 0', () => {
    props.defaultQty = 0;
    const component = render(<AdjustProductQtyBox {...props} />);
    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-decrease-btn'),
    );
    component.getByDisplayValue(props.defaultQty.toString());
  });
  test('it should not change the display value on click increase btn when currentQty equal to stockQty', () => {
    props.stockQty = 2;
    const component = render(<AdjustProductQtyBox {...props} />);
    expect(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    ).not.toHaveAttribute('disabled');

    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    );
    component.getByDisplayValue((props.defaultQty + 1).toString());

    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    );
    component.getByDisplayValue((props.defaultQty + 1).toString());
  });
  test('it should not change the display value on click increase btn when currentQty equal to maxSaleQty', () => {
    props.maxSaleQty = 2;
    const component = render(<AdjustProductQtyBox {...props} />);
    expect(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    ).not.toHaveAttribute('disabled');

    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    );
    component.getByDisplayValue((props.defaultQty + 1).toString());

    fireEvent.click(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    );
    component.getByDisplayValue((props.defaultQty + 1).toString());
  });
  test('it should match the style when render with mini type', () => {
    props.type = 'mini';
    const component = render(<AdjustProductQtyBox {...props} />);
    expect(component.getByTestId('adjust-product-qty-box')).toHaveStyle({
      height: '20px',
      lineHeight: '20px',
    });
    expect(
      component.getByTestId('adjust-product-qty-box-increase-btn'),
    ).toHaveStyle({
      width: '18.5px',
      height: '20px',
    });
  });
});
