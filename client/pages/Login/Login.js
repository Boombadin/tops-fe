import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import { isEmpty, filter, includes, find, get } from 'lodash';
import RegisHeader from '../../components/RegisHeader';
import Footer from '../../components/Footer';
import TopsLogin from '../../components/TopsLogin';
import { login, socialLogin } from '../../reducers/auth';
import { isLoggedIn } from '../../utils/cookie';
import { getCustomerSelector, isAppGrab } from '../../selectors';
import { fullpathUrl } from '../../utils/url';
import MetaTags from '../../components/MetaTags';
import Sidebar from '../../components/Sidebar';
import { closeLoginSidebar } from '../../reducers/layout';
import { fetchCategory } from '../../reducers/category';
import './Login.scss';
import { StickyContainer } from 'react-sticky';
import { Text, breakpoint, Col, Row, Button, HideDesktop } from '@central-tech/core-ui';

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  color: red;
  margin: 30px 0 0 0;

  ${breakpoint('xs', 'md')`
    margin: 10px 0 0 0;
  `}
`;

class Login extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    activeCategory: PropTypes.string,
    customer: PropTypes.array,
    customItems: PropTypes.node,
    cmsBlock: PropTypes.array,
    categoriesLoading: PropTypes.bool,
    categories: PropTypes.array.isRequired,
    isGrabProvider: PropTypes.bool,
  };

  static defaultProps = {
    activeCategory: '',
    customer: [],
    customItems: null,
    cmsBlock: [],
    categoriesLoading: false,
    isGrabProvider: false,
  };

  state = {
    visible: false,
    isTokenExpired: false
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token_expired')) {
      this.setState({
        isTokenExpired: true
      });
    }
  
    const ref = window.location.search.split('ref=')[1] || '/';
    if (isLoggedIn() && !isEmpty(this.props.customer)) {
      if (!isEmpty(ref)) {
        window.location.href = encodeURI(ref);
      } else {
        window.location.replace('/');
      }
    }

    if (isEmpty(this.props.categories) && !this.props.categoriesLoading) {
      this.props.fetchCategory();
    }
  }

  handleOnsubmit = () => {
    const ref = window.location.search.split('ref=')[1] || '/';
    this.props.login(ref);
  };

  handleSocialLogin = response => {
    const ref = window.location.search.split('ref=')[1] || '/';
    const accessToken = response.tokenDetail.accessToken;
    const provider = 'facebook';
    const data = {
      token: accessToken,
      provider: provider,
    };
    if (accessToken) {
      this.props.socialLogin(ref, data);
    }
  };

  handleCloseSidebar = () => {
    this.setState({ visible: false });
    this.props.closeLoginSidebar();
  };

  leftToggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible } = this.state;
    const {
      translate,
      customer,
      cmsBlock,
      customItems,
      activeCategory,
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
      <StickyContainer>
        <div className="login-content">
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.login.title')}
            keywords={translate('meta_tags.login.keywords')}
            description={translate('meta_tags.login.description')}
          />
          <RegisHeader onBurgerClick={this.leftToggleVisibility} />

          <div className="side-bar-content">
            <Sidebar
              activeCategory={activeCategory}
              visible={visible}
              handleCloseSidebar={this.handleCloseSidebar}
              customItems={customItems}
            />
          </div>

          <div className={`login-wrap ${!isEmpty(filterData) && 'login-upper-header-banner'}`}>
            {this.state.isTokenExpired && (
              <ErrorMessage>
                <p>{translate('login.error.401')}</p>
              </ErrorMessage>
            )}
            <TopsLogin onSubmit={this.handleOnsubmit} onSocialLogin={this.handleSocialLogin} />
            <p className="text-price-promo-change">
              {translate('login.tops_login.price_promotion_change')}
            </p>
          </div>
          <Footer />
        </div>
      </StickyContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale),
  customer: getCustomerSelector(state),
  category: find(
    state.category.items,
    categ => categ.id.toString() === ownProps.activeCategory,
  ),
  cmsBlock: state.cmsBlock.items,
  storeConfig: state.storeConfig.current,
  categories: state.category.items,
  categoriesLoading: state.category.loading,
  isGrabProvider: isAppGrab(state),
});

const mapDispatchToProps = dispatch => ({
  login: ref => dispatch(login(ref)),
  socialLogin: (ref, data) => dispatch(socialLogin(ref, data)),
  closeLoginSidebar: () => dispatch(closeLoginSidebar()),
  fetchCategory: () => dispatch(fetchCategory()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
