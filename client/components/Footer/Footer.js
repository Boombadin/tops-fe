import { filter, includes, unescape } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHtmlParser from 'react-html-parser';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import './Footer.scss';

import { Image } from '../../magenta-ui';
import { isAppGrab } from '../../selectors';
import { getImageNameFromSrc } from '../../utils/gtmDataAttr';
import MediaIcon from '../MediaIcon';
import Subscribe from '../Subscribe';
import FooterItem from './FooterItem';

class Footer extends Component {
  static defaultProps = {
    cmsBlock: [],
    isGrabProvider: false,
  };

  componentDidMount() {
    this.addGtmClass();
  }

  componentDidUpdate() {
    this.addGtmClass();
  }

  static propTypes = {
    storeConfig: PropTypes.object.isRequired,
    cmsBlock: PropTypes.array,
    translate: PropTypes.func.isRequired,
    isGrabProvider: PropTypes.bool,
  };

  filterCMSBlock(identifier) {
    const data = this.props.cmsBlock;
    const baseMediaUrl = this.props.storeConfig.base_media_url;
    let content = '';

    if (data.length > 0) {
      const filterData = filter(data, val => {
        return includes(val.identifier, identifier);
      });

      filterData.map(resp => {
        content = unescape(resp.content)
          .replace(/{{media url="/g, baseMediaUrl)
          .replace(/"}}/g, '');
      });
    }

    return content;
  }

  renderContent(key, column, target) {
    let component = '';
    const content = this.filterCMSBlock(key);
    const parserHtml = ReactHtmlParser(content);
    if (parserHtml.length > 0) {
      component = (
        <div>
          {parserHtml.map((resp, idx) => {
            const children = resp.props.children[0];
            return resp.props.className === 'footer-title' ? (
              <p key={idx} className="title">
                {children}
              </p>
            ) : (
              <FooterItem
                key={idx}
                type={children.type === 'a' ? 'link' : 'text'}
                column={column === 2 ? 'two' : ''}
                text={
                  children.type === 'a' ? children.props.children[0] : children
                }
                url={children.type === 'a' ? children.props.href : ''}
                target={target}
              />
            );
          })}
          {column && <div className="clear"></div>}
        </div>
      );
    }

    return component;
  }

  addGtmClass = async () => {
    const element = await ReactDOM.findDOMNode(this.cmsContainer);
    const { bannerLocation } = this.props;
    if (element) {
      const images = element.querySelectorAll('img');
      const aLink = element.querySelectorAll('a');
      for (let i = 0; i < images.length; i++) {
        const imageName =
          getImageNameFromSrc(images[i].getAttribute('src')) || '';
        const bannerId = bannerLocation;
        const bannerName = `${bannerLocation}|${imageName}|${aLink[i]}`;
        images[i].setAttribute('databanner-id', bannerId);
        images[i].setAttribute('databanner-name', bannerName);
        images[i].setAttribute('databanner-position', i + 1);
      }
    }
  };

  renderAds() {
    let component = '';
    const content = this.filterCMSBlock('footer_ads');
    const parserHtml = ReactHtmlParser(content);

    if (parserHtml.length > 0) {
      component = (
        <div ref={node => (this.cmsContainer = node)}>{parserHtml}</div>
      );
    }

    return component;
  }

  renderPartner() {
    let component = '';
    const content = this.filterCMSBlock('footer_partner_logo');
    const regex = /(<p[^>]*>)|(<\/p[^>]*>)/gi;
    const parserHtml = ReactHtmlParser(content.replace(regex, ''));

    if (parserHtml.length > 0) {
      component = parserHtml;
    }

    return component;
  }

  render() {
    const { isGrabProvider } = this.props;

    return (
      <div className="footer-cover">
        <div className="footer-wraper">
          <div className="footer-section">
            {!isGrabProvider && (
              <div className="footer-banner">{this.renderAds()}</div>
            )}
          </div>
          <div className="footer-section line">
            <div className="box-left hidden">
              {this.renderContent('footer_delivery_fee')}
            </div>
            <div className="box-right">
              <p className="title">
                {this.props.translate('footer.need_help')}
              </p>
              <div className="media-link">
                <div className="text-center">
                  <img
                    className="media-icon left"
                    src="/assets/icons/big-mail-icon.svg"
                    alt=""
                  />
                  <div className="contact_info">
                    <a className="contact_info_link" href="/contact">
                      {this.props.translate('footer.leave_message')}
                    </a>
                    <div>
                      {this.props.translate('footer.or_email')}{' '}
                      <a href="mailto:Topsonlinecs@tops.co.th">
                        {this.props.translate('footer.leave_email')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <MediaIcon
                position="left"
                mediaLink="tel:+6622950930"
                mediaIcon="/assets/icons/phone-icon.svg"
                mediaTitle="02-295-0930 (09:00 - 21:00)"
              />
            </div>
          </div>
          <div className="footer-section line-bottom">
            <div className="box-left">
              {this.renderContent('footer_about_us', 2)}
              <div className="footer-other-bu">
                {this.renderContent('footer-other-bu', 2, '_blank')}
              </div>
            </div>
            <div className="box-center">
              {this.renderContent('footer_menu_recommend')}
            </div>
            <div className="box-media">
              <p className="title">
                {this.props.translate('footer.follow_us')}
              </p>
              <div className="box-media__icons">
                <MediaIcon
                  mediaLink="https://line.me/R/ti/p/@topsthailand#~"
                  mediaIcon="/assets/icons/social-line.svg"
                  mediaTitle="@topsthailand"
                />
                <MediaIcon
                  mediaLink="https://www.facebook.com/TopsThailand"
                  mediaIcon="/assets/icons/social-fb.svg"
                  mediaTitle="topsthailand"
                />
                <MediaIcon
                  mediaLink="https://www.instagram.com/topsthailand"
                  mediaIcon="/assets/icons/social-ig.svg"
                  mediaTitle="topsthailand"
                />
                <MediaIcon
                  mediaLink="https://www.youtube.com/channel/UCJEGhyrKh31nxOJxgMohdsQ"
                  mediaIcon="/assets/icons/social-yt.svg"
                  mediaTitle="topsthailand"
                />
              </div>
              <Subscribe />
            </div>
          </div>
          <div className="footer-section__bottom">
            <div className="partners-logo">{this.renderPartner()}</div>
            <p className="footer-copyright">
              {this.props.translate('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  storeConfig: state.storeConfig.current,
  cmsBlock: state.cmsBlock.items,
  translate: getTranslate(state.locale),
  isGrabProvider: isAppGrab(state),
});

export default connect(mapStateToProps)(Footer);
