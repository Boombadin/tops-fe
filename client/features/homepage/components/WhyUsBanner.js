import React from 'react';
import { Grid, WhyUsBanner, TYPES } from '../../../magenta-ui';
import withLocales from '../../../hoc/withLocales';

const WhyUsBannerGroup = ({ translate }) => {
  return (
    <Grid id="why-ask-banner" columns={3}>
      <Grid.Column key="/assets/icons/why-us-banner/clock-icon.svg">
        <WhyUsBanner
          className="why-banner"
          src="/assets/icons/why-us-banner/clock-icon.svg"
          href="#"
          metaTitle={translate('homepage.about_banner.title.send_same_day')}
          metaDesc={translate('homepage.about_banner.description.send_same_day')}
          type={TYPES.BANNERTYPES.PLAIN}
        />
      </Grid.Column>
      <Grid.Column key="/assets/icons/why-us-banner/the1st-member-card-icon.svg">
        <WhyUsBanner
          className="why-banner"
          src="/assets/icons/why-us-banner/The1.svg"
          href="#"
          metaTitle={translate('homepage.about_banner.title.get_1st_member_card_points')}
          metaDesc={translate('homepage.about_banner.description.get_1st_member_card_points')}
          type={TYPES.BANNERTYPES.PLAIN}
        />
      </Grid.Column>
      <Grid.Column key="/assets/icons/why-us-banner/like-icon.svg">
        <WhyUsBanner
          className="why-banner"
          src="/assets/icons/why-us-banner/like-icon.svg"
          href="#"
          metaTitle={translate('homepage.about_banner.title.freshness_guarantee')}
          metaDesc={translate('homepage.about_banner.description.freshness_guarantee')}
          type={TYPES.BANNERTYPES.PLAIN}
        />
      </Grid.Column>
    </Grid>
  );
};

export default withLocales(WhyUsBannerGroup);
