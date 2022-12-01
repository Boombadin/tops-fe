import { cleanup, render } from '@testing-library/react';
import React from 'react';

import { mockProduct } from '@client/magenta-ui/components/ProductItem/__mocks__';
import { ProductItem as RowsProductItem } from '@client/magenta-ui/components/ProductItem/RowsProductItem';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('@client/contexts', () => ({
  useCartContext: jest.fn().mockReturnValue({ cartAction: {} }),
  useReduxContext: jest.fn().mockReturnValue({ reduxAction: {} }),
}));

afterEach(cleanup); // will remove param or props each describe (unmount container render)

describe('RowsProductItem', () => {
  const { container } = render(
    <RowsProductItem
      product={mockProduct}
      addToCartLabel="ใส่รถเข็น"
      baseMediaUrl="https://staging23-mdc.tops.co.th/media/"
      className="swiper-slide"
      disableAddToCart={false}
      id={47427}
      img="https://staging23-mdc.tops.co.th/media/catalog/product/8/8/8850123110436.jpg"
      isAddedToWishlist={false}
      onChangeQty={() => {}}
      orderItem={29}
      outOfStockLabel="ขออภัยสินค้าหมด"
      price={40}
      priceLabel="ชิ้น"
      qty={0}
      reduxState={{}}
      reduxDispatch={() => {}}
      saveLabel="ลด"
      section="Recommended for you"
      sku="8850123110436"
      specialPrice={40}
      title="ฟาร์มเฮ้าส์ขนมปังโฮลวีต 500กรัม"
      unitLabel="บาท"
      url="/farmhouse-wholewheat-bread-500g-8850123110436"
    />,
  );

  test('it correctly renders the component', () => {
    expect(container.firstChild).toMatchSnapshot();
  });
});
