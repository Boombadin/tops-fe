import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { NavLink } from 'react-router-dom';
import { includes, filter, unescape } from 'lodash';
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
import { fullpathUrl } from '../../utils/url';

import './Privilege.scss';
import { getImageNameFromSrc } from '../../utils/gtmDataAttr';

class Privilege extends Component {
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
      const contentHeroBanner = this.filterCMSBlock('privilege_hero_banner');

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
        const bannerLocation =
          `CMS|${bannerLocationFooter}|` + `Privilege Page`;
        const bannerId = `${bannerLocation}`;
        const bannerName = `${bannerLocation}|${imageName}|${aLink[i]}`;
        images[i].setAttribute('databanner-id', bannerId);
        images[i].setAttribute('databanner-name', bannerName);
        images[i].setAttribute('databanner-position', i + 1);
      }
    }
  };

  renderContent() {
    const contentSpecialBanner1 = this.filterCMSBlock(
      'privilege_special_banner',
    );
    if (contentSpecialBanner1.length > 0) {
      return (
        <div
          ref={node => (this.cmsContainer = node)}
          className="special-banner"
          dangerouslySetInnerHTML={{ __html: contentSpecialBanner1 }}
        />
      );
    }
    // const content = ReactHtmlParser(contentSpecialBanner1)

    // return content
  }

  render() {
    const { translate, fetchProducts } = this.props;

    return (
      <div id="deals-page">
        <Layout
          title={translate('tabbar.special_offer')}
          customItems={() => (
            <Menu.Item
              key="my-list"
              className="sidebar-item active"
              name={this.props.translate('tabbar.special_offer')}
              active
            >
              <a className="sidebar-link" href="javascript: void(0)">
                {this.props.translate('tabbar.special_offer')}
              </a>
              <span className="sidebar-icon">
                <i className="nav-icon" />
              </span>
            </Menu.Item>
          )}
        >
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.privilege.title')}
            keywords={translate('meta_tags.privilege.keywords')}
            description={translate('meta_tags.privilege.description')}
          />

          <Tabbar disableHome />

          <div className="breadcrumb-background">
            <Breadcrumb>
              <Breadcrumb.Section>
                <NavLink to="/">{translate('homepage_text')}</NavLink>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section>
                {translate('tabbar.special_offer')}
              </Breadcrumb.Section>
            </Breadcrumb>
          </div>

          {this.renderBanner()}

          <div className="privilege-container">{this.renderContent()}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Privilege);
