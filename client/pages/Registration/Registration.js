import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { isEmpty, filter, includes, find } from 'lodash';
import PropTypes from 'prop-types';
import RegisForm from '../../components/RegisForm';
import RegisHeader from '../../components/RegisHeader';
import Footer from '../../components/Footer';
import { register } from '../../reducers/registration';
import { socialLogin } from '../../reducers/auth';
import { isLoggedIn } from '../../utils/cookie';
import { getCustomerSelector, isAppGrab } from '../../selectors';
import './Registration.scss';
import MetaTags from '../../components/MetaTags';
import { fullpathUrl } from '../../utils/url';
import Sidebar from '../../components/Sidebar';
import { closeLoginSidebar } from '../../reducers/layout';
import { fetchCategory } from '../../reducers/category';
import { StickyContainer } from 'react-sticky';

class Registration extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    activeCategory: PropTypes.string,
    customer: PropTypes.array,
    cmsBlock: PropTypes.array,
    customItems: PropTypes.node,
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
  };

  componentDidMount() {
    if (isLoggedIn() && !isEmpty(this.props.customer)) {
      window.location.replace('/');
    }

    if (isEmpty(this.props.categories) && !this.props.categoriesLoading) {
      this.props.fetchCategory();
    }
  }

  handleOnsubmit = () => {
    this.props.register();
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
      activeCategory,
      customItems,
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
        <div className="registration-content">
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.registration.title')}
            keywords={translate('meta_tags.registration.keywords')}
            description={translate('meta_tags.registration.description')}
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
          <div
            className={`regis-wrap ${!isEmpty(filterData) && 'register-upper-header-banner'}`}
          >
            <RegisForm onSubmit={this.handleOnsubmit} onSocialLogin={this.handleSocialLogin} />
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
  cmsBlock: state.cmsBlock.items,
  storeConfig: state.storeConfig.current,
  category: find(
    state.category.items,
    categ => categ.id.toString() === ownProps.activeCategory,
  ),
  categories: state.category.items,
  categoriesLoading: state.category.loading,
  isGrabProvider: isAppGrab(state),
});

const mapDispatchToProps = dispatch => ({
  register: () => dispatch(register()),
  socialLogin: (ref, data) => dispatch(socialLogin(ref, data)),
  closeLoginSidebar: () => dispatch(closeLoginSidebar()),
  fetchCategory: () => dispatch(fetchCategory()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Registration);
