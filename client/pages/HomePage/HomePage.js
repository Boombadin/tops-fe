import React, { PureComponent } from 'react';
import MetaTags from '../../components/MetaTags';
import HomePageContainer from '../../features/homepage/HomePageContainer';
import { fullpathUrl } from '../../utils/url';
import { withTranslate } from '../../magenta-ui/utils/translate';
import Layout from '../../components/Layout';

@withTranslate
class HomePage extends PureComponent {
  render() {
    const { translate, location, match } = this.props;
    return (
      <div id="homepage">
        <MetaTags
          canonicalUrl={fullpathUrl(this.props.location)}
          title={translate('meta_tags.home.title')}
          description={translate('meta_tags.home.description')}
          keywords={translate('meta_tags.home.keywords')}
          ogType="website"
          ogTitle={translate('meta_tags.home.og_title')}
          ogDescription={translate('meta_tags.home.og_description')}
          imageUrl={`${window?.App?.api_url}/assets/images/fb-banner.jpg`}
          twCard="summary_large_image"
        />
        <Layout pageType="home" isShowBackground>
          <HomePageContainer location={location} match={match} />
        </Layout>
      </div>
    );
  }
}

export default HomePage;
