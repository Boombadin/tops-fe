import { render } from '@testing-library/react';
import React from 'react';

import SimAndAssoProductCarousel from '@client/features/product/components/SimAndAssoProductCarousel';

jest.mock('react-redux', () => ({
  connect: jest.fn(() => Component => props => <Component {...props} />),
}));

jest.mock('@client/hoc/withStoreConfig', () => {
  return Component => props => (
    <Component storeConfig={jest.fn(key => key)} {...props} />
  );
});
jest.mock('@client/hoc/withCustomer', () => {
  return Component => props => (
    <Component customer={jest.fn(key => key)} {...props} />
  );
});
jest.mock('@client/contexts', () => ({
  useFirebaseContext: jest.fn().mockReturnValue({
    firestoreAction: {
      getRemoteConfig: jest
        .fn()
        .mockReturnValue(
          '{"exp_id":{"search":"apZ6K1EqSlaFSHey68TVAg","recommendation":"Lpx4D3K4SGWXSFW2sFyisg","association":"Asvwv0VyQQyTHjStj-J2MA","similarity":"GSLWUMDMTweRLbWb4ReUiQ"}}',
        ),
    },
  }),
}));
jest.mock('@client/apis/product', () => ({
  getSimilarity: jest.fn().mockReturnValue({
    products: {
      type: 'similarity',
      userGroup: { recommend_product: 'a' },
      name: 'สินค้าที่คล้ายกัน',
      items: [],
    },
  }),
  getAssociation: jest.fn().mockReturnValue({
    products: {
      type: 'association',
      userGroup: { recommend_product: 'a' },
      name: 'สินค้าที่คุณอาจสนใจ',
      items: [],
    },
  }),
}));

describe('features/product/components/SimAndAssoProductCarousel', () => {
  const props = {
    sku: '0000037116026',
  };

  test('it should match the snapshot', () => {
    const component = render(<SimAndAssoProductCarousel {...props} />);

    expect(component).toMatchSnapshot();
  });
});
