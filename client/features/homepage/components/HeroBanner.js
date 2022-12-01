import React from 'react';
// import PropTypes from 'prop-types';
import PreloadHeroBannerV2 from '../../../components/PreloadHeroBannerV2';
import withStoreConfig from '../../../hoc/withStoreConfig';
import { get } from 'lodash';
import { withBannerByName } from '../../banner';
import { PagePreloader } from '../../../components/PreloaderComponent';

function HeroBanner({ storeConfig, banner, bannerLocation }) {
  if (banner.isReload) {
    return <PagePreloader />;
  }

  return (
    <div className="login-widget-home">
      <PreloadHeroBannerV2
        id="hero-banner-homepage"
        className="homepage"
        banner={get(banner.data, '0', [])}
        config={storeConfig}
        loading={banner.isFetching}
        bannerLocation={bannerLocation}
      />
    </div>
  );
}

export default withStoreConfig(withBannerByName(HeroBanner, 'Home page Web'));
