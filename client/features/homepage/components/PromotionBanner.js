import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filter, includes, unescape } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import { Grid, HeadTitle, PromoBanner } from '../../../magenta-ui';
import withStoreConfig from '../../../hoc/withStoreConfig';
import withLocales from '../../../hoc/withLocales';

@withStoreConfig
@withLocales
class PromotionBanner extends PureComponent {
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

  transfromBannerContent(content) {
    const banner = [];
    content.map(resp => {
      const { props } = resp;
      if (props.className === 'banner-title') {
        banner.title = props.children[0];
      } else if (props.className === 'banner-topic') {
        banner.topic = props.children[0];
      } else if (props.className === 'banner-description') {
        banner.description = props.children[0];
      }

      if (!props.className && props.children.length > 0) {
        props.children.map(link => {
          if (link.type === 'a') {
            banner.link = link.props.href;
            if (link.props.children[0].type === 'img') {
              banner.image = link.props.children[0].props.src;
            }
          } else if (link.type === 'img') {
            banner.image = link.props.src;
          }
        });
      }
    });
    return banner;
  }

  render() {
    const { bannerLocation } = this.props;
    const contentBannerLeft = this.filterCMSBlock('homepage_banner_left');
    const bannerLeftData = this.transfromBannerContent(
      ReactHtmlParser(contentBannerLeft),
    );

    const contentBannerRight = this.filterCMSBlock('homepage_banner_right');
    const bannerRightData = this.transfromBannerContent(
      ReactHtmlParser(contentBannerRight),
    );

    return (
      <div id="category-product-headline">
        <Grid>
          {contentBannerLeft.length > 0 ? (
            <Grid.Column computer={8} tablet={8} mobile={16}>
              <HeadTitle
                className="head-title"
                topic={bannerLeftData.title}
                button
                position="left"
                url={bannerLeftData.link}
                btnName={this.props.translate('view_all')}
                native
              />
              <PromoBanner
                src={bannerLeftData.image}
                href={bannerLeftData.link}
                metaTitle={bannerLeftData.topic}
                metaDesc={bannerLeftData.description}
                bannerLocation={`${bannerLocation}In Season`}
                position={1}
              />
            </Grid.Column>
          ) : (
            ''
          )}
          {contentBannerRight.length > 0 ? (
            <Grid.Column computer={8} tablet={8} mobile={16}>
              <HeadTitle
                className="head-title"
                topic={bannerRightData.title}
                position="left"
                button
                url={bannerRightData.link}
                btnName={this.props.translate('view_all')}
                native
              />
              <PromoBanner
                src={bannerRightData.image}
                href={bannerRightData.link}
                metaTitle={bannerRightData.topic}
                metaDesc={bannerRightData.description}
                bannerLocation={`${bannerLocation}Best Deals`}
                position={1}
              />
            </Grid.Column>
          ) : (
            ''
          )}
        </Grid>
      </div>
    );
  }
}

PromotionBanner.propTypes = {};

const mapStateToProps = state => ({
  cmsBlock: state.cmsBlock.items,
});

export default connect(mapStateToProps, null)(PromotionBanner);
