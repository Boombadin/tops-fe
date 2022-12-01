import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobile } from 'react-device-detect'
import { getTranslate } from 'react-localize-redux'
import { withRouter } from 'react-router-dom'
import { map, isEmpty } from 'lodash'
import { langSelector, getBillingAddressesSelector } from '../../../selectors'
import { deleteAddress, setAddressDefault } from '../../../reducers/customer'
import { setAlwaysShowSidebar } from '../../../reducers/layout'
import AddEditBillingAddress from './AddEditBillingAddress'
import { Icon, PopupMessage, Button, Modal, Image } from '../../../magenta-ui'
import '../UserDetails.scss'

// const cards = [{
//   name: 'Pheromone Company Ltd.'
// }, {
//   name: 'Tops Online Co., Ltd.'
// }]

const modes = {
  SELECT: 'SELECT',
  ADD: 'ADD',
  EDIT: 'EDIT'
};

class BillingTab extends PureComponent {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    billingAddresses: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
    deleteAddress: PropTypes.func.isRequired,
    setAddressDefault: PropTypes.func.isRequired,
    onChangeMode: PropTypes.func
  };

  state = {
    mode: modes.SELECT
  };

  componentWillMount() {
    if (isEmpty(this.props.billingAddresses)) {
      this.handleAddAddress();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mode !== this.props.mode) {
      this.setState({ mode: nextProps.mode });
    }
  }

  handleOverviewBilling = () => {
    if (this.props.onChangeMode) {
      this.props.onChangeMode(modes.SELECT);
    }

    this.setState({ mode: modes.SELECT });
  }

  handleAddAddress = () => {
    if (this.props.onChangeMode) {
      this.props.onChangeMode(modes.ADD);
    }

    this.setState({ mode: modes.ADD, selectedAddress: null });
  };

  handleAddressClick = address => {
    this.setState({ selectedAddress: address });
  }

  handleEditAddress = (event, address) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.onChangeMode) {
      this.props.onChangeMode(modes.EDIT);
    }

    this.setState({
      mode: modes.EDIT,
      addressToEdit: address,
      selectedAddress: null
    });
  };

  handleDeleteAddress = (event, address) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.setAlwaysShowSidebar(true);

    this.setState({
      addressToDelete: address.id,
      popupMessage: (
        <span className="confirm_address_deletion_message">
          <span>{this.props.translate('right_menu.profile.billing.confirm_address_deletion')}</span>
          <span className="address"> "{address.company || `${address.firstname} ${address.lastname}`}"</span>
          ?
        </span>
      )
    });
  };

  handleCancelPopup = () => {
    this.props.setAlwaysShowSidebar(false);

    this.setState({ addressToDelete: null, popupMessage: '' });
  };

  handleConfirmPopup = () => {
    this.props.setAlwaysShowSidebar(false);
    this.props.deleteAddress(this.state.addressToDelete);

    this.setState({ addressToDelete: null, popupMessage: '', selectedAddress: null });
  };

  handleConfirmTaxInvoice = () => {
    const { selectedAddress } = this.state;

    if (!selectedAddress || selectedAddress.default_billing) {
      return;
    }

    this.props.setAddressDefault(selectedAddress.id);
    this.setState({ selectedAddress: null });

    if (isMobile) {
      this.props.history.push('/profile');
    } else {
      this.props.onBackClick();
    }
  };

  isAddressSelected(address) {
    const { selectedAddress } = this.state;

    return selectedAddress ? address.id === selectedAddress.id : !!address.default_billing;
  }

  render() {
    const { mode, addressToEdit, popupMessage, addressToDelete } = this.state;
    const { billingAddresses, translate, lang } = this.props;

    if (mode === modes.ADD || mode === modes.EDIT) {
      return (
        <AddEditBillingAddress
          address={addressToEdit}
          edit={mode === modes.EDIT}
          onBackClick={this.handleOverviewBilling}
        />
      );
    };

    return (
      <div className="accounttab-userdetails">
        <div className="accounttab-userdetails-gradient" />
        <div className="accounttab-userdetails-upperpanel">
          <div className="accounttab-userdetails-upperpanel__name">{translate('right_menu.profile.billing.invoice_information')}</div>
          <div className="accounttab-userdetails-upperpanel__id-text">
            {translate('right_menu.profile.billing.select_billing')}
          </div>
        </div>
        <div className="at-ud-billing__main-panel">
          <div className="at-ud-billing__main-panel-title">
            <img src="/assets/icons/billing.svg" />
            <div className="at-ud-billing__title">
              {translate('right_menu.profile.billing.tax_invoice')}
            </div>
          </div>
          <div className="at-ud-billing__billing">
            {map(billingAddresses, address => (
              <div
                className={`at-ud-billing__address ${this.isAddressSelected(address) ? 'selected-address': ''}`}
                onClick={this.handleAddressClick.bind(this, address)}
              >
                <div className="at-ud-billing__address-name">
                  {(address.firstname === 'N/A' && address.lastname === 'N/A' && address.campany !== '' ) ? address.company : `${address.firstname} ${address.lastname}`}
                </div>
                <div className="at-ud-billing__controls">
                  <div className="at-ud-billing__edit" onClick={event => this.handleEditAddress(event, address)}>
                    {translate('right_menu.profile.billing.edit')}
                  </div>
                  {billingAddresses.length > 1 && (
                    <span className="at-ud-billing__delete-wrapper">
                      |
                      <div className="at-ud-billing__delete" onClick={event => this.handleDeleteAddress(event, address)}>
                        {translate('right_menu.profile.billing.delete')}
                      </div>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="at-ud-billing__address-new" onClick={this.handleAddAddress}>
              <div className="at-ud-billing__address-new__plus">
                <Image src="/assets/icons/icon-plus-circle-gray.png" size='mini' avatar />
              </div>
              <div className="at-ud-billing__address-new__title">
                {translate('right_menu.profile.billing.add_new')}
              </div>
            </div>
          </div>
        </div>
        <div className="at-ud-billing__bottom">
          <Button className="back" onClick={this.props.onBackClick}>
            <Icon className="chevron left" />
            {this.props.translate('right_menu.profile.billing.back')}
          </Button>
          <Button className="verify" onClick={this.handleConfirmTaxInvoice}>
            <span className="text">{this.props.translate('right_menu.profile.billing.confirm_tax_invoice')}</span>
            <Image className="icon-back" src="/assets/icons/shape.png" />
          </Button>
        </div>
        {typeof document !== 'undefined' && document.getElementById('layout') &&
          ReactDOM.createPortal(
            <PopupMessage
              className="shipping-options-popup-delete-address"
              lang={lang}
              open={!!addressToDelete}
              onCancel={this.handleCancelPopup}
              onConfirm={this.handleConfirmPopup}
            >
              {popupMessage}
            </PopupMessage>,
            document.getElementById('layout')
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  billingAddresses: getBillingAddressesSelector(state),
  translate: getTranslate(state.locale),
  lang: langSelector(state)
});

const mapDispatchToProps = dispatch => ({
  setAddressDefault: addressId => dispatch(setAddressDefault(addressId, 'billing')),
  deleteAddress: addressId => dispatch(deleteAddress(addressId, 'billing')),
  setAlwaysShowSidebar: value => dispatch(setAlwaysShowSidebar(value)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BillingTab)
);
