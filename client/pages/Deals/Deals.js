import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';
import { includes, filter, get, unescape } from 'lodash';
import ReactHtmlParser from 'react-html-parser';

import {
  Grid,
  HeroBanner,
  PromoBanner,
  Breadcrumb,
  Menu,
} from '../../magenta-ui';

import { fetchCmsBlock } from '../../reducers/cmsBlock';
import Layout from '../../components/Layout';
import MetaTags from '../../components/MetaTags';
import Tabbar from '../../components/Tabbar';
import PreloadHeroBannerV2 from '../../components/PreloadHeroBannerV2';
import { fullpathUrl } from '../../utils/url';
import { withBannerByName } from '../../features/banner';
import { getImageNameFromSrc } from '../../utils/gtmDataAttr';

class Deals extends PureComponent {
  static defaultProps = {
    cmsBlock: [],
  };

  static propTypes = {
    storeConfig: PropTypes.object.isRequired,
    cmsBlock: PropTypes.array,
    translate: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.addGtmClass();
  }

  componentDidUpdate() {
    this.addGtmClass();
  }

  filterCMSBlock(identifier) {
    const data = this.props.cmsBlock;
    const baseMediaUrl = this.props.storeConfig.base_media_url;
    let content = '';

    if (data.length > 0) {
      const filterData = filter(data, val => {
        return includes(val.identifier, identifier) && val.active === true;
      });

      filterData.map(resp => {
        content = unescape(resp.content)
          .replace(/{{media url="/g, baseMediaUrl)
          .replace(/"}}/g, '');
      });
    }

    return content;
  }

  transfromSpecialBannerContent(content) {
    const result = [];
    content.map(resp => {
      resp.props.children.map((children, key) => {
        const data = {};

        if (children.props.href) {
          data.href = children.props.href;
          data.image = children.props.children[0].props.src;
          result.push(data);
        }
      });
    });

    return result;
  }

  renderBanner() {
    try {
      const contentHeroBanner = this.filterCMSBlock('deals_hero_banner');

      if (!contentHeroBanner) {
        return null;
      }

      const heroBannerData = ReactHtmlParser(contentHeroBanner);
      const settings = {
        autoplay: true,
        infinite: true,
        speed: 500,
        arrows: false,
        dots: true,
        autoplaySpeed: 4000,
        shouldSwiperUpdate: true,
        slidesPerView: 'auto',
        loop: true,
      };

      return (
        <div className="tops-hero-banner">
          {heroBannerData && (
            <HeroBanner className="deals_hero_banner" setting={settings}>
              {heroBannerData}
            </HeroBanner>
          )}
        </div>
      );
    } catch (e) {
      return null;
    }
  }

  addGtmClass = async () => {
    const element = await ReactDOM.findDOMNode(this.cmsContainer);
    // const { bannerLocation } = this.props;
    const bannerLocationFooter =
      this.props.location.pathname.split('/').pop() || '-';
    if (element) {
      const images = element.querySelectorAll('img');
      const aLink = element.querySelectorAll('a');
      for (let i = 0; i < images.length; i++) {
        const imageName =
          getImageNameFromSrc(images[i].getAttribute('src')) || '';
        const bannerLocation = `CMS|${bannerLocationFooter}|` + `Deal Page`;
        const bannerId = `${bannerLocation}`;
        const bannerName = `${bannerLocation}|${imageName}|${aLink[i]}`;
        images[i].setAttribute('databanner-id', bannerId);
        images[i].setAttribute('databanner-name', bannerName);
        images[i].setAttribute('databanner-position', i + 1);
      }
    }
  };

  renderSpecialBanner1() {
    // const component = '';
    const contentSpecialBanner1 = this.filterCMSBlock('deals_special_banner');
    if (contentSpecialBanner1.length > 0) {
      return (
        <div
          ref={node => (this.cmsContainer = node)}
          className="special-banner"
          dangerouslySetInnerHTML={{ __html: contentSpecialBanner1 }}
        />
      );
    }
    // const specialBannerData1 = this.transfromSpecialBannerContent(ReactHtmlParser(contentSpecialBanner1))
    //
    // if (contentSpecialBanner1.length > 0) {
    //   component = (
    //     <Grid id="special-banner--upper">
    //       {specialBannerData1.map((resp, key) => {
    //         return (
    //           <Grid.Column key={key} computer={8} tablet={8} mobile={16}>
    //             <PromoBanner src={resp.image} href={resp.href} />
    //           </Grid.Column>
    //         )
    //       })}
    //     </Grid>
    //   )
    // }
    //
    // return component
  }

  render() {
    const {
      translate,
      fetchProducts,
      banner,
      storeConfig,
      bannerLoading,
    } = this.props;

    return (
      <div id="deals-page">
        <Layout
          title={translate('tabbar.deal')}
          customItems={() => (
            <Menu.Item
              key="my-list"
              className="sidebar-item active"
              name={this.props.translate('tabbar.deal')}
              active
            >
              <a className="sidebar-link" href="javascript: void(0)">
                {this.props.translate('tabbar.deal')}
              </a>
              <span className="sidebar-icon">
                <i className="nav-icon" />
              </span>
            </Menu.Item>
          )}
        >
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.deal.title')}
            keywords={translate('meta_tags.deal.keywords')}
            description={translate('meta_tags.deal.description')}
          />

          <Tabbar disableHome />

          <div className="breadcrumb-background">
            <Breadcrumb>
              <Breadcrumb.Section>
                <NavLink to="/">{translate('homepage_text')}</NavLink>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                {translate('tabbar.deal')}
              </Breadcrumb.Section>
            </Breadcrumb>
          </div>

          <PreloadHeroBannerV2
            id="hero-banner-homepage"
            className="homepage"
            banner={get(banner.data, '0', {})}
            config={storeConfig}
            loading={banner.isFetching}
          />

          {this.renderSpecialBanner1()}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  storeConfig: state.storeConfig.current,
  cmsBlock: state.cmsBlock.items,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  fetchCmsBlock: search => dispatch(fetchCmsBlock(search)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withBannerByName(Deals, 'Deals'));
