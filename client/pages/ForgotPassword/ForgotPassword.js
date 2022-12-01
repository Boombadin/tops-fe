import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { isEmpty, includes, filter, find, get } from 'lodash';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { forgotPassword } from '../../reducers/account';
import RegisHeader from '../../components/RegisHeader';
import Footer from '../../components/Footer';
import ForgotForm from '../../components/ForgotForm';
import { Grid } from '../../magenta-ui';
import { getCustomerSelector } from '../../selectors';
import './ForgotPassword.scss';
import MetaTags from '../../components/MetaTags';
import { fullpathUrl } from '../../utils/url';
import Sidebar from '../../components/Sidebar';
import { fetchCategory } from '../../reducers/category';
import { closeLoginSidebar } from '../../reducers/layout';
import { StickyContainer } from 'react-sticky';

class ForgotPassword extends Component {
  state = {
    expToken: '',
    visible: false,
  };

  static propTypes = {
    activeCategory: PropTypes.string,
    customItems: PropTypes.node,
  };

  static defaultProps = {
    activeCategory: '',
    customItems: null,
  };

  componentDidMount() {
    const search = queryString.parse(this.props.location.search);
    if (!isEmpty(search)) {
      this.setState({
        expToken: search.error,
      });
    }

    if (!isEmpty(this.props.customer)) {
      window.location.replace('/');
    }

    if (isEmpty(this.props.categories) && !this.props.categoriesLoading) {
      this.props.fetchCategory();
    }
  }

  handleCloseSidebar = () => {
    this.setState({ visible: false });
    this.props.closeLoginSidebar();
  };

  leftToggleVisibility = () => this.setState({ visible: !this.state.visible });

  handleOnsubmit = () => {
    const { lang } = this.props;
    this.props.forgotPassword(get(lang, 'url', 'th'));
  };

  render() {
    const {
      translate,
      customer,
      cmsBlock,
      activeCategory,
      customItems,
    } = this.props;
    const { visible } = this.state;

    const filterData = filter(cmsBlock, val => {
      return (
        includes(
          val.identifier,
          !isEmpty(customer)
            ? 'promo_banner_homepage_customer'
            : 'promo_banner_homepage_guest',
        ) && val.active === true
      );
    });

    return (
      <StickyContainer>
        <div className="forgot-password-content">
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.forgot_password.title')}
            keywords={translate('meta_tags.forgot_password.keywords')}
            description={translate('meta_tags.forgot_password.description')}
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
            className={`forgot-password-wrap ${!isEmpty(filterData) &&
              'forgot-upper-header-banner'}`}
          >
            <Grid centered columns={2}>
              <div className="forgot-form">
                <Grid.Column>
                  <ForgotForm
                    onSubmit={this.handleOnsubmit}
                    errorExpToken={this.state.expToken}
                  />
                </Grid.Column>
              </div>
            </Grid>
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
  categoriesLoading: state.category.loading,
  lang: getActiveLanguage(state.locale),
});

const mapDispatchToProps = dispatch => ({
  forgotPassword: lang => dispatch(forgotPassword(lang)),
  fetchCategory: () => dispatch(fetchCategory()),
  closeLoginSidebar: () => dispatch(closeLoginSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
