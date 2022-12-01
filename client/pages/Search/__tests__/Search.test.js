import { cleanup, render } from '@testing-library/react';
import React from 'react';

import Search from '../Search';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, ...props }) => <div {...props}>{children}</div>,
}));
jest.mock('react-redux', () => ({
  connect: jest.fn(() => ReactComponent => props => (
    <ReactComponent {...props} />
  )),
}));
jest.mock('@client/components/LangSwitch/LangSwitch', () => props => (
  <div {...props} />
));
jest.mock(
  '@client/components/MainHeader/components/PanelHeader',
  () => props => <div {...props} />,
);
jest.mock(
  '@client/magenta-ui/components/ProductItem/ProductItem',
  () => props => <div {...props} />,
);
jest.mock('@client/features/seach/SearchBox', () => props => (
  <div {...props} />
));
jest.mock('@client/features/cart/CartBundleItems', () => props => (
  <div {...props} />
));
jest.mock('@client/features/cart/CartItems', () => props => <div {...props} />);
jest.mock('@client/features/onboarding/OnBoardingCart', () => props => (
  <div {...props} />
));
jest.mock('@client/features/minicart/MiniCartContainer', () => props => (
  <div {...props} />
));
jest.mock('@client/features/onboarding/OnBoardingDelivery', () => props => (
  <div {...props} />
));
jest.mock(
  '@client/components/MainHeader/components/HeaderLogin',
  () => props => <div {...props} />,
);
jest.mock('@client/components/MobileSearchBar/MobileSearchBar', () => props => (
  <div {...props} />
));
jest.mock('@client/components/AccountTab/billing/BillingTab', () => props => (
  <div {...props} />
));
jest.mock(
  '@client/components/MainHeader/components/DeliveryToolBar',
  () => props => <div {...props} />,
);
jest.mock('@client/components/ProfileMenu/ProfileMenu', () => props => (
  <div {...props} />
));
jest.mock('@client/components/Sidebar/SpSidebar', () => props => (
  <div {...props} />
));
jest.mock('@client/components/Sidebar/Sidebar', () => props => (
  <div {...props} />
));
jest.mock('@client/components/Layout/Layout', () => props => (
  <div {...props} />
));
jest.mock('@client/components/Tabbar/Tabbar', () => props => (
  <div {...props} />
));
jest.mock('@client/components/Breadcrumbs', () => props => <div {...props} />);

jest.mock('@client/components/PreloadedProductGrid', () => props => (
  <div {...props} />
));

jest.mock('@client/hoc/withCategories', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

jest.mock('@client/hoc/withFirebaseContext', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

// jest.mock('@client/contexts', () => ({
//   useWishlistContext: jest.fn().mockReturnValue({}),
//   useFirebaseContext: jest.fn().mockReturnValue({
//     firestoreAction: {
//       getRemoteConfig: jest.fn().mockReturnValue(
//         JSON.stringify({
//           exp_id: {
//             search: 'apZ6K1EqSlaFSHey68TVAg',
//             recommendation: 'Lpx4D3K4SGWXSFW2sFyisg',
//             association: 'qNFXR_p3S4eWCzY1CZp1Tg',
//             similarity: 'mhGrGkN0S-2cyibj74yjDg',
//           },
//         }),
//       ),
//     },
//   }),
// }));

describe('client/pages/Search', () => {
  let props;
  beforeEach(() => {
    props = {
      location: {
        hash: '',
        key: '9szqcq',
        pathname: '/search/coke',
        search: '',
        state: undefined,
      },
      productsByQuery: {
        coke: {
          filters: [],
          items: [],
          search_criteria: {},
          sorting: [],
          total_count: 31,
        },
      },
      categories: [],
      fetchCategory: jest.fn(),
      onAddToWishlist: jest.fn(),
      firestoreAction: {
        getRemoteConfig: jest.fn().mockReturnValue(
          JSON.stringify({
            exp_id: {
              search: 'apZ6K1EqSlaFSHey68TVAg',
              recommendation: 'Lpx4D3K4SGWXSFW2sFyisg',
              association: 'qNFXR_p3S4eWCzY1CZp1Tg',
              similarity: 'mhGrGkN0S-2cyibj74yjDg',
            },
          }),
        ),
      },
    };
  });
  afterEach(cleanup);

  test('render search result', () => {
    const { asFragment } = render(<Search {...props} />);
    expect(asFragment(<Search {...props} />)).toMatchSnapshot();
  });
});
