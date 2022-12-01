import React, { Component } from 'react';
import { connect } from 'react-redux';
import { object, array, string } from 'prop-types';
import { includes, filter, unescape } from 'lodash';
import ReactHtmlParser from 'react-html-parser';

import { HeroBanner } from '../../magenta-ui';

class PreloadHeroBanner extends Component {
  static defaultProps = {
    className: '',
  };

  static propTypes = {
    blockName: string.isRequired,
    cmsBlock: array.isRequired,
    storeConfig: object.isRequired,
    className: string,
  };

  filterCMSBlock(identifier) {
    const { cmsBlock, storeConfig } = this.props;
    const data = cmsBlock;
    const baseMediaUrl = storeConfig.base_media_url;
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

  getMarkUpHtml = () => {
    const { blockName, html } = this.props;
    let parseHtml = '';

    if (html) {
      parseHtml = ReactHtmlParser(html);
    } else {
      const contentHeroBanner = this.filterCMSBlock(blockName);
      parseHtml = ReactHtmlParser(contentHeroBanner);
    }

    if (parseHtml && parseHtml.length > 0) {
      return parseHtml;
    }

    return null;
  };

  render() {
    const { blockName, className } = this.props;
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

    const markUpHtml = this.getMarkUpHtml();

    return (
      <div
        id={`hero-banner--${blockName}`}
        className={`tops-hero-banner ${className}`}
      >
        {markUpHtml && <HeroBanner setting={settings}>{markUpHtml}</HeroBanner>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  cmsBlock: state.cmsBlock.items,
  storeConfig: state.storeConfig.current,
  storeConfigDefault: state.storeConfig.default,
  sidebarAnimated: state.layout.sidebarAnimated,
});

export default connect(mapStateToProps)(PreloadHeroBanner);
