import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, includes, filter } from 'lodash';
import { NavLink } from 'react-router-dom';
import { BurgerMenu, Image, Icon } from '../../magenta-ui';
import LanguageSwitch from '../LanguageSwitch';
import './RegisHeader.scss';
import { getTranslate } from 'react-localize-redux';
import { getCustomerSelector, langSelector, isAppGrab } from '../../selectors';
import { withTranslate } from '../../utils/translate';
import UpperHeader from '../../components/UpperHeader';
import PanelHeader from '../MainHeader/components/PanelHeader';

class RegisHeader extends PureComponent {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    customer: PropTypes.array,
    cmsBlock: PropTypes.array,
    storeConfig: PropTypes.object,
    onBurgerClick: PropTypes.func,
    isGrabProvider: PropTypes.bool,
  };

  static defaultProps = {
    cmsBlock: [],
    customer: [],
    storeConfig: {},
    onBurgerClick: () => {},
    isGrabProvider: false,
  };

  render() {
    const {
      translate,
      lang,
      storeConfig,
      customer,
      cmsBlock,
      onBurgerClick,
      isGrabProvider,
    } = this.props;

    let filterData;
    if (!isGrabProvider) {
      filterData = filter(cmsBlock, val => {
        return (
          includes(
            val.identifier,
            !isEmpty(customer)
              ? 'promo_banner_homepage_customer'
              : 'promo_banner_homepage_guest',
          ) && val.active === true
        );
      });
    }

    return (
      <div className={`regis-header ${!isEmpty(filterData) && ''}`}>
        <PanelHeader
          baseMediaUrl={storeConfig.base_media_url}
          cmsBlock={cmsBlock}
          isGrabProvider={isGrabProvider}
        />
        <div id="regis-head-bar" className="header-container">
          <div className="header-button">
            <div className="back-button">
              <Icon
                link
                color="grey"
                name="angle left"
                size="large"
                className="back-icon"
              />
              <a
                className="back-home"
                href={`/${lang === 'th_TH' ? 'th' : 'en'}/`}
              >
                <span className="mobile-only">
                  {translate('regis_form.cancel')}
                </span>
                <span className="hide-mobile">
                  {translate('regis_form.back_home')}
                </span>
              </a>
            </div>

            <div className="burger-button">
              <BurgerMenu className="burger-icon" onClick={onBurgerClick} />
            </div>
          </div>
          <div className="header-logo">
            <Image
              className="pc-logo"
              src="/assets/images/tops-logo.svg"
              size="small"
              as="a"
              href={`/${lang === 'th_TH' ? 'th' : 'en'}/`}
              alt="Tops online ท็อปส์ออนไลน์"
            />
          </div>
          <div className="header-content" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
  translate: getTranslate(state.locale),
  cmsBlock: state.cmsBlock.items,
  storeConfig: state.storeConfig.current,
  lang: langSelector(state),
  isGrabProvider: isAppGrab(state),
});

export default connect(mapStateToProps)(RegisHeader);
