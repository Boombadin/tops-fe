import React, { PureComponent } from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { get, find, isEmpty } from 'lodash';
import ArrowRight from '../Icons/ArrowRight';
import ArrowLeft from '../Icons/ArrowLeft';
import { unsetCookie } from '../../utils/cookie';
import { isTablet } from '../../utils/deviceDetect';
import './ProfileMenu.scss';
import withCustomer from '../../hoc/withCustomer';
import {
  getOneCardMembershipIdFromCustomer,
  getThe1MobileFromCustomer,
} from '../../selectors';
import { Icon, TextEllipsis } from '@central-tech/core-ui';
import { TextGuide } from '../Typography';
/* eslint-disable jsx-a11y/click-events-have-key-events,
jsx-a11y/no-static-element-interactions */
@withCustomer
class ProfileMenu extends PureComponent {
  static propTypes = {
    translate: pt.func.isRequired,
    noGradient: pt.bool,
    onPersonalInfoClick: pt.func.isRequired,
  };

  static defaultProps = {
    noGradient: false,
  };

  handleSignOutClick = () => {
    unsetCookie('user_token');
    unsetCookie('shipping_address_cookie');
    unsetCookie('customer_default_shipping');
    unsetCookie('default_shipping');
    unsetCookie('recipient_info');
    window.location.assign(window.location.origin);
  };

  handleInvoiceInfoClick = () => {
    this.props.onInvoiceInfoClick();

    if (isTablet()) {
      this.props.history.push('/billing');
    }
  };
  handleClickBackHome = () => {
    this.props.history.push('/');
  };
  render() {
    const { translate, customer } = this.props;
    const t1Card = getOneCardMembershipIdFromCustomer(customer);
    const t1Mobile = getThe1MobileFromCustomer(customer);
    const isT1c = !isEmpty(t1Card) || !isEmpty(t1Mobile);
    return (
      <div className="profile-menu">
        {!this.props.noGradient && <div className="profile-menu__gradient" />}
        <div
          className="profile-menu__personal-info"
          onClick={this.props.onPersonalInfoClick}
        >
          <div className="profile-menu__arrow">
            <div onClick={this.handleClickBackHome}>
              {/* <ArrowLeft width="15" fill="#808080" stroke="#808080" /> */}
              <Icon
                src="/assets/icons/round-arrow-back.svg"
                style={{ marginRight: 16 }}
                height={16}
              />
            </div>
          </div>
          <div className="profile-menu__link">
            <TextGuide type="topic" bold>
              <TextEllipsis height={26} line={1}>
                {`${get(customer, 'firstname', '')} ${get(
                  customer,
                  'lastname',
                  '',
                )}`}
              </TextEllipsis>
            </TextGuide>
            <TextGuide type="caption-2" color="#666666">
              {isT1c &&
                `${translate('profile.menu.t1c_member')} ${
                  !isEmpty(t1Card) ? t1Card : t1Mobile
                }`}
            </TextGuide>
          </div>
        </div>
        <NavLink className="profile-menu__link" to="/personal-info">
          <div className="profile-menu__order-history">
            {translate('profile.menu.personal_info')}
            {/* <div className="profile-menu__arrow">
              <ArrowRight width="10" fill="#808080" stroke="#808080" />
            </div> */}
          </div>
        </NavLink>
        <NavLink className="profile-menu__link" to="/order-history">
          <div className="profile-menu__order-history">
            {translate('profile.menu.order_history')}
            {/* <div className="profile-menu__arrow">
              <ArrowRight width="10" fill="#808080" stroke="#808080" />
            </div> */}
          </div>
        </NavLink>

        {/* <div className="profile-menu__personal-info" onClick={this.props.onPersonalInfoClick}>
          <div className="profile-menu__link">{translate('profile.menu.personal_info')}</div>
          <div className="profile-menu__arrow">
            <ArrowRight width="10" fill="#808080" stroke="#808080" />
          </div>
        </div> */}
        {/* <div
          className="profile-menu__invoice-info"
          onClick={this.handleInvoiceInfoClick}
        >
          <div className="profile-menu__link">
            {translate('profile.menu.billing_address')}
          </div>
          <div className="profile-menu__arrow">
            <ArrowRight width="10" fill="#808080" stroke="#808080" />
          </div>
        </div> */}
        {/* {isT1c && (
          <div className="profile-menu__reward">
            <div className="profile-menu__t1c-icon">
              <img alt="T1C Logo" src="/assets/icons/t1c-logo.png" />
              {!isEmpty(t1Card) ? 'T1 No.: ' : 'T1 Phone: '}
            </div>
            <div className="profile-menu__t1c-text">
              <span className="profile-menu__t1c-text-light">
                {!isEmpty(t1Card) ? t1Card : t1Mobile}
              </span>
            </div>
          </div>
        )} */}

        <div
          className="profile-menu__sign-out"
          onClick={this.handleSignOutClick}
        >
          <div className="profile-menu__sign-out-text">
            {translate('profile.menu.sign_out')}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default withRouter(connect(mapStateToProps)(ProfileMenu));
