import { cleanup, render } from '@testing-library/react'; // import library
import React from 'react';

import { mockProduct } from '@client/magenta-ui/components/ProductItem/__mocks__';
import { ProductItem } from '@client/magenta-ui/components/ProductItem/ProductItem';

jest.mock('@client/contexts', () => ({
  useCartContext: jest.fn().mockReturnValue({ cartAction: {} }),
  useReduxContext: jest.fn().mockReturnValue({ reduxAction: {} }),
}));

afterEach(cleanup); // will remove param or props each describe (unmount container render)

describe('ProductItem', () => {
  const { container } = render(
    <ProductItem
      product={mockProduct}
      addToCartLabel="ใส่รถเข็น"
      baseMediaUrl="https://staging23-mdc.tops.co.th/media/"
      className="swiper-slide"
      disableAddToCart={false}
      id={47427}
      img="https://staging23-mdc.tops.co.th/media/catalog/product/8/8/8850123110436.jpg"
      isAddedToWishlist={false}
      loadingCartProduct={false}
      maxQty={24}
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
      stock={28}
      title="ฟาร์มเฮ้าส์ขนมปังโฮลวีต 500กรัม"
      trackingSection="homepage_recommendation"
      trackingUserId="541436"
      type="slider"
      unitLabel="บาท"
      url="/farmhouse-wholewheat-bread-500g-8850123110436"
    />,
  );

  test('it correctly renders the component', () => {
    expect(container.firstChild).toMatchSnapshot();
  });
});
