import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux'
import { withRouter } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { Icon } from '../../magenta-ui'
import Layout from '../../components/Layout';
import BillingTab from '../../components/AccountTab/billing/BillingTab';
import './MobileBilling.scss';
import UpperHeader from '../../components/UpperHeader';
import { getCustomerSelector, isAppGrab } from '../../selectors';
import { NavLink } from 'react-router-dom'

const modes = {
  SELECT: 'SELECT',
  ADD: 'ADD',
  EDIT: 'EDIT'
}

class MobileBilling extends PureComponent {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    customer: PropTypes.array,
    cmsBlock: PropTypes.array,
    storeConfig: PropTypes.array,
    isGrabProvider: PropTypes.bool
  };

  static defaultProps = {
    cmsBlock: [],
    customer: [],
    storeConfig: [],
    isGrabProvider: false
  };

  state = {
    mode: modes.SELECT
  }

  handleChangeMode = mode => this.setState({ mode });

  handleBackClick = () => {
    const { mode } = this.state;

    if (mode === modes.SELECT) {
      this.props.history.push('/profile');
    } else {
      this.setState({ mode: modes.SELECT });
    }
  };

  renderBackText() {
    const { translate } = this.props;
    const { mode } = this.state;

    if (mode === modes.SELECT) {
      return translate('right_menu.profile.profile');
    } else {
      return translate('right_menu.profile.billing.tax_information');
    }
  }

  renderHeaderInfo() {
    const { translate } = this.props;
    const { mode } = this.state;

    if (mode === modes.SELECT) {
      return translate('right_menu.profile.billing.select_billing');
    } else {
      return translate('right_menu.profile.billing.fill_new');
    }
  }

  renderHeader() {
    const { translate, storeConfig, cmsBlock, customer, isGrabProvider } = this.props;
    
    return (
      <React.Fragment>
        <UpperHeader 
          classWrapperName="promo-top-banner-wrapper" 
          className="promo-top-banner" 
          baseMediaUrl={storeConfig.base_media_url} 
          cmsBlock={cmsBlock} 
          isCustomer={!isEmpty(customer)} 
          isGrabProvider={isGrabProvider}
        />
        <div className="mobile-billing-header">
          <div className="back" onClick={this.handleBackClick}>
            <Icon className="chevron left" />
            {this.renderBackText()}
          </div>
          <div className="main">
            <div className="name">{translate('right_menu.profile.billing.billing_address')}</div>
            <div className="info">
              {this.renderHeaderInfo()}
            </div>
          </div>
          {/* <Icon className="question circle outline" /> */}
          <NavLink to="/help" className="question"><img src="/assets/icons/help-icon.svg" width="19" /></NavLink>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Layout 
        className="mobile-billing-layout hide-search-button" 
        header={this.renderHeader()}
        disableFooter
        disableSearch
      >
        <BillingTab
          mode={this.state.mode}
          onChangeMode={this.handleChangeMode}
        />
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  customer: getCustomerSelector(state),
  storeConfig: state.storeConfig.current,
  cmsBlock: state.cmsBlock.items,
  isGrabProvider: isAppGrab(state),
});

export default withRouter(
  connect(mapStateToProps)(MobileBilling)
);
