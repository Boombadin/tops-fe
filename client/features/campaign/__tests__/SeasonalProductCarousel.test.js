/* eslint-disable quotes */
import { cleanup, render } from '@testing-library/react'; // import library
import React from 'react';

import mockSeasonalConfig from '@client/features/campaign/__mocks__/seasonalConfig';
import mockSeasonalProducts from '@client/features/campaign/__mocks__/seasonalProducts';
import { SeasonalProductCarousel } from '@client/features/campaign/SeasonalProductCarousel';

jest.mock('@central-tech/core-ui', () => ({
  breakpoint: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('@client/magenta-ui', () => ({
  ProductList: jest.fn(({ className }) => <div className={className} />),
}));

jest.mock('@client/contexts', () => ({
  useFirebaseContext: jest.fn().mockReturnValue({
    firestoreAction: {
      getSeasonalConfig: jest.fn().mockReturnValue(mockSeasonalConfig),
    },
  }),
}));

jest.mock('@client/apis/product', () => ({
  getCatalogServiceBySku: jest.fn().mockReturnValue(mockSeasonalProducts),
}));

let component;

afterEach(cleanup); // will remove param or props each describe (unmount container render)

describe('SeasonalProductCarousel', () => {
  test('it should render the component as expected', async () => {
    component = render(
      <SeasonalProductCarousel
        envConfig={{}}
        lang={{ url: 'en' }}
        isCartLoaded
        storeConfig={{}}
        translate={jest.fn(props => props)}
        onAddToWishlist={jest.fn()}
        onRemoveFromWishlist={jest.fn()}
      />,
    );

    await component.findByTestId('seasonal-product-carousel-container');

    expect(component.getByTestId('seasonal-header-container')).toHaveStyle(`
      background-image: url(${mockSeasonalConfig.style.web.banner.en.banner_image_url});`);

    expect(
      component.getByTestId('seasonal-header-head-title-icon'),
    ).toBeInTheDocument();
    expect(
      component.getByTestId('seasonal-header-head-title-icon'),
    ).toHaveAttribute(
      'src',
      mockSeasonalConfig.style.web.banner.head_title_header_icon_url,
    );

    expect(component.getByTestId('seasonal-header-title').textContent).toBe(
      mockSeasonalConfig.style.web.banner.en.title_header,
    );
    expect(component.getByTestId('seasonal-header-title')).toHaveStyle(`
      color: ${mockSeasonalConfig.style.web.banner.title_header_font_color}`);

    expect(
      component.getByTestId('seasonal-header-tail-title-icon'),
    ).toBeInTheDocument();
    expect(
      component.getByTestId('seasonal-header-tail-title-icon'),
    ).toHaveAttribute(
      'src',
      mockSeasonalConfig.style.web.banner.tail_title_header_icon_url,
    );

    expect(
      component.getByTestId('seasonal-header-text-link').textContent,
    ).toContain(mockSeasonalConfig.style.web.banner.en.text_link);
    expect(component.getByTestId('seasonal-header-text-link')).toHaveAttribute(
      'href',
      mockSeasonalConfig.style.web.banner.text_link_url,
    );
    expect(component.getByTestId('seasonal-header-text-link')).toHaveStyle(`
      color: ${mockSeasonalConfig.style.web.banner.text_link_font_color}`);

    expect(component.getByTestId('seasonal-product-carousel-content-border'))
      .toHaveStyle(`
        border-bottom-color: ${mockSeasonalConfig.style.web.border_color};
        border-left-color: ${mockSeasonalConfig.style.web.border_color};
        border-right-color: ${mockSeasonalConfig.style.web.border_color};
      `);

    expect(
      component.getByTestId('seasonal-product-carousel-remark').textContent,
    ).toBe(mockSeasonalConfig.remark.en.homepage);
    expect(component.getByTestId('seasonal-product-carousel-remark'))
      .toHaveStyle(`
        color: ${mockSeasonalConfig.style.web.homepage_remark_font_color}`);
  });
});
