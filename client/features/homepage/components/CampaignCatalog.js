import { get, take } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import PreloadedProductCarousel from '@client/components/PreloadedProductCarousel';
import { withBannerByName } from '@client/features/banner';
import { fetchCampaignCatalog } from '@client/reducers/product';

class CampaignCatalog extends PureComponent {
  componentDidUpdate(prevProps) {
    if (
      get(prevProps.banner, 'data', []).length <
      get(this.props.banner, 'data', []).length
    ) {
      this.props.fetchCampaignCatalog(get(this.props.banner, 'data', []));
    }
  }

  handleClickViewAll = url => {
    window.location.href = url;
  };

  render() {
    const { campaign } = this.props;

    return (
      <React.Fragment>
        {moment() >= moment(get(campaign, 'displayFrom')) &&
          moment() <= moment(get(campaign, 'displayTo')) && (
            <PreloadedProductCarousel
              id="campaign-catalog"
              ownProducts={take(get(campaign, 'products', ''), 30)}
              title={get(campaign, 'name', '')}
              button
              isCustomSlide
              titlePosition="left"
              titleLine={false}
              btnName="homepage.show_all"
              section="Campaign catalog"
              onNavClick={() =>
                this.handleClickViewAll(get(campaign, 'deepLink', ''))
              }
            />
          )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  envConfig: state.storeConfig.envConfig,
  campaign: state.product.campaignCatalog,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchCampaignCatalog: banner => dispatch(fetchCampaignCatalog(banner)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withBannerByName(CampaignCatalog, 'homepage_campaign_catalog'));
