import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { find, map, get as prop, reduce, filter, isEmpty } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import { isMobile } from 'react-device-detect';
import Cookie from 'js-cookie';
import AddressIcon from '../../components/Icons/Address';
import TruckIcon from '../../components/Icons/Truck';
import { Button, ShippingAddressPreview, PopupMessage, Icon, Segment, Header, Container, Image } from '../../magenta-ui';
import { deleteAddress } from '../../reducers/customer';
import { setAlwaysShowSidebar } from '../../reducers/layout';
import { fetchDistrict, fetchSubDistrict } from '../../reducers/region';
import { langSelector, getShippingAddressesSelector } from '../../selectors';
import { format } from '../../utils/time';
import ShippingOverviewPreloader from './ShippingOverviewPreloader';
import './ShippingOptionsTab.scss';

class ShippingAddressSelection extends PureComponent {
  static propTypes = {
    shippingAddresses: PropTypes.array.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onBackClick: PropTypes.func.isRequired,
    onVerifyAddressClick: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    setAlwaysShowSidebar: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    fetchDistrict: PropTypes.func.isRequired,
    fetchSubDistrict: PropTypes.func.isRequired,
    deleteAddress: PropTypes.func.isRequired
  };

  state = {
    currentShippingMethod: ''
  };

  getAddressCustomAttribute = (address, attrName) => {
    return prop(
      find(address.custom_attributes, attr => attr.attribute_code === attrName),
      'value',
      null
    );
  };

  handleAddressClick = address => {
    this.setState({ selectedAddress: address });
  };

  handleVerifyAddressClick = () => {
    const { selectedAddress } = this.state;
    this.props.onVerifyAddressClick(selectedAddress.id);
  };

  handleDeleteClick = (event, addressId) => {
    event.preventDefault();
    event.stopPropagation();

    const address = find(this.props.shippingAddresses, addr => addr.id === addressId);
    this.props.setAlwaysShowSidebar(true);

    this.setState({
      addressToDelete: addressId,
      popupMessage: (
        <span className="confirm_address_deletion_message">
          <span>{this.props.translate('right_menu.shipping_options.confirm_address_deletion')}</span>
          {address.address_name && <span className="address"> "{address.address_name}"</span>}
          ?
        </span>
      )
    });
  };

  handleCancelPopup = () => {
    this.props.setAlwaysShowSidebar(false);
    this.setState({ addressToDelete: null, popupMessage: '' });
  };

  handleConfirmPopup = async () => {
    this.props.setAlwaysShowSidebar(false);
    this.setState({ addressToDelete: null, popupMessage: '', selectedAddress: '' });
    this.props.deleteAddress(this.state.addressToDelete);
  };

  handleAddClick = () => {
    this.props.initializeForm({});
    this.props.onAddClick();
  }

  handleEditClick = (event, address) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.initializeForm(address);

    if (address.region_id) {
      this.props.fetchDistrict(address.region_id);

      if (address.district_id) {
        this.props.fetchSubDistrict(address.region_id, address.district_id);
      }
    }

    this.props.onEditClick();
  };

  handleSetMethod = methodCode => {
    this.setState({ currentShippingMethod: methodCode });
  };

  renderDeliveryMethodOptions = shippingMethods => {
    const { translate } = this.props;
 
    return map(shippingMethods, method => {
      const deliverySlot = filter(
        prop(method, 'extensionAttributes.deliverySlot'),
        'isAllow'
      );
      const checkAllowSlot = filter(deliverySlot, slot => {
        return slot.isAllow
      });

      const filterSlot = find(checkAllowSlot, data => {
        return data.isAllow && find(prop(data, 'slots'), slot => {
          return slot.available > 0 && slot.enabled && slot.isAllow;
        })
      })

      const nextRound = find(prop(filterSlot, 'slots'), slot => {
        return slot.available > 0 && slot.enabled && slot.isAllow;
      });

      const storePickupEnable = prop(method, 'extensionAttributes.store_pickup_enabled')
      const shippingDescription = prop(method, 'extensionAttributes.shipping_description[0].value')
      const shippingActive = this.state.currentShippingMethod === method.methodCode || shippingMethods.length <= 1

      return (
        <React.Fragment>
        {
          method.methodCode === 'tops' && shippingMethods.length > 1 && (
            <div className="shipping-method-line">
              <p className="title">{translate('click-and-collect.delivery-method-title')}</p>
         
              <label className="input-radio">
                <input type="radio"  name="shipping_options" checked={shippingActive} />
                <div className={`current-method method-options option-active ${shippingActive && 'active'} ${isEmpty(nextRound) && !storePickupEnable && 'disable-method'} ${method.methodCode === 'express' && 'powered-grab'}`} 
                  onClick={() => (!isEmpty(nextRound) || storePickupEnable) && this.handleSetMethod(method.methodCode)
                 }>
                {/* {this.props.translate('right_menu.shipping_options.standard_delivery')} */}
                  <div className={`shipping-method-body`}>
                    <span className="method-title">{method.methodTitle}</span>
                    {
                      method.methodCode === 'express' && (
                        <div className="method-powered-by">
                          <span className="powered-by-text-grab">{translate('right_menu.shipping_options.powered_by')}</span>
                          <img className="powered-by-icon-grab" src="/assets/images/Grab_logo.svg" alt="" />
                        </div>
                      )
                    }
                  </div>

                  <div className="shipping-method-bottom">
                    {method.methodCode !== 'tops' ? (
                      <React.Fragment>
                        {!isEmpty(filterSlot) && (
                          <span className="method-next-round">
                            {translate('right_menu.shipping_options.next_round')}{' '}
                            {!isEmpty(checkAllowSlot) && !isEmpty(nextRound) ? (
                              <span className="method-datetime">
                                {translate('right_menu.shipping_options.next_round_datetime', {
                                  date: format(filterSlot.date, "DD MMM", this.props.lang),
                                  time: `${nextRound.timeFrom} - ${nextRound.timeTo}`
                                })}
                              </span>
                            ) : !isEmpty(checkAllowSlot) && isEmpty(nextRound) ? (
                              translate('timeslot.grid.slot.full')
                            ) : (
                              '-'
                            )}
                          </span>
                        )}
                        <span className="method-shipping-price">
                          {translate('right_menu.shipping_options.round_cost', {
                            deliveryFee: !isEmpty(nextRound)
                              ? prop(nextRound, 'cost')
                              : !isEmpty(checkAllowSlot)
                              ? prop(head(checkAllowSlot), 'cost', '-')
                              : '-'
                          })}
                        </span>
                      </React.Fragment>
                       ) : (
                          <span className="shipping-description">
                            { shippingDescription }
                          </span>
                       )
                    }
                  </div>

                  {method.methodCode === 'tops' && (
                    <div className="shipping-method-new">
                      <span className="shipping-method-text-new">
                        {translate('right_menu.shipping_options.method_triangle_new')}
                      </span>
                    </div>
                  )}
                  {prop(method, 'extensionAttributes.hint', '') && (this.state
                      .currentShippingMethod === method.methodCode ||
                      shippingMethods.length <= 1) && (
                      <div className="method-shipping-hint">
                        <span className="label">
                          {prop(method, 'extensionAttributes.hint', '')}
                        </span>
                      </div>
                  )}
                </div>
              </label>  
            </div>
          )
        }
        </React.Fragment>
        
      );
    });
    // }

    // return (
    //   <div className="current-method">
    //     {this.props.translate('right_menu.shipping_options.standard_delivery')}
    //   </div>
    // );
  };

  renderMethod() {
    const { shippingMethods, translate, loadingMethods } = this.props;
    return (
      <div className="method">
        {/* <div className="header">
          <div className="name">
            {!isEmpty(shippingMethods) && shippingMethods.length > 1
              ? translate('right_menu.shipping_options.select_methods')
              : translate('click-and-collect.delivery-method-title')}
          </div>
        </div> */}
        {!isEmpty(shippingMethods) && !loadingMethods
          ? this.renderDeliveryMethodOptions(shippingMethods)
          : loadingMethods && <ShippingOverviewPreloader />}
      </div>
    );
  }

  renderHeader() {
    const { shippingAddresses }  = this.props
    return (
      <Segment className="header-wrapper">
        <Container fluid>
          {
            !isEmpty(shippingAddresses) ? (
              <React.Fragment>
                <Header as="h4" className="text" handleToHome={() => this.props.history.push('/')}>{this.props.translate('right_menu.shipping_options.delivery_address')}</Header>
                <div className="info">
                  {this.props.translate('right_menu.shipping_options.header.choose_address')}
                </div>
              </React.Fragment>
              
            ) : (
              <React.Fragment>
                <Header as="h4" className="text" handleToHome={() => this.props.history.push('/')}>{this.props.translate('right_menu.shipping_options.name')}</Header>
                <div className="warning">*
                  {this.props.translate('right_menu.shipping_options.header.warning')}
                </div>
              </React.Fragment>
            )
          }
          
        </Container>
      </Segment>
    )
  }

  renderBody() {
    const { selectedAddress, addressToDelete, popupMessage } = this.state;
    const { shippingAddresses, translate } = this.props;
    return (
      <div key="body" className="body">
  
        {!isEmpty(shippingAddresses) && typeof document !== 'undefined' && ReactDOM.createPortal (
          <PopupMessage
            className="shipping-options-popup-delete-address"
            lang={this.props.lang}
            open={!!addressToDelete}
            onCancel={this.handleCancelPopup}
            onConfirm={this.handleConfirmPopup}
          >
            {popupMessage}
          </PopupMessage>,
          document.getElementById('layout')
        )}
        {
         !isEmpty(shippingAddresses) ? (
          <div className="address-selection-header list_address">
            <span className="icon">
              <AddressIcon/>
            </span>
            <span className="title">{this.props.translate('right_menu.shipping_options.sent_at')}</span>
          </div>
         ) : (
          <div className="address-selection-header">
            <span className="icon">
              <TruckIcon/>
            </span>
            <span className="title">{this.props.translate('right_menu.shipping_options.delivery')}</span>
          </div>
         )
         
        }
        

          {map(shippingAddresses, address => {
            const listIdAddress = prop(address, 'id', '');
            const shippingDefault = prop(Cookie.getJSON('default_shipping'), 'id', '')

            let isCurrent = false;
            if (!isEmpty(shippingDefault)) {
              isCurrent = shippingDefault === listIdAddress
            } else {
              isCurrent = !!address.default_shipping
            }
            
            return (
              <ShippingAddressPreview
                key={address.id}
                lang={this.props.lang}
                className="address-selection-preview"
                isShowDefault
                address={address}
                isDefault={selectedAddress ? address.id === selectedAddress.id : isCurrent}
                onClick={this.handleAddressClick.bind(this, address)}
                onEditClick={event => this.handleEditClick(event, address)}
                onDeleteClick={shippingAddresses.length > 1 && (event => this.handleDeleteClick(event, address.id))}
              />
            )
          })}
          
          {isEmpty(shippingAddresses) && <p className="home-delivery">{translate('right_menu.shipping_options.home_delivery')}</p>}  
          <div className="add-new-address" onClick={this.handleAddClick}>
            <div className="add-new-address-body">
              <div className="plus-wrapper">
                <Image src="/assets/icons/icon-plus-circle-gray.png" avatar className="icon-plus"/>
              </div>
              <div className="text">
                {translate('right_menu.shipping_options.add_shipping_address')}
              </div>
            </div>
            <div className="add-new-address-bottom">
              {translate('right_menu.shipping_options.add_shipping_address_note1')}<br/>
              {translate('right_menu.shipping_options.add_shipping_address_note2')}
            </div>
          </div>

          { isEmpty(shippingAddresses)  && 
            this.renderMethod()
          }

      </div>
    );
  }

  renderBottomNoAddress() {
    const { cartLoaded, onConfirm, shippingMethods } = this.props;

    let address = {} 
    if (!isEmpty(Cookie.getJSON('default_shipping'))) {
      address = Cookie.getJSON('default_shipping')
    } else {
      address = find(
        this.props.customer.addresses,
        addr => addr.default_shipping
      );
    }
    
    return (
      <div key="bottom" className="bottom">
        {this.props.errorShippingMethod && (
          <span className="error-select-method">
            {this.props.translate(
              'right_menu.shipping_options.error_method.label'
            )}
          </span>
        )}
        <Button
          className="confirm"
          icon
          disabled={
            (!cartLoaded || !address || isEmpty(shippingMethods)) &&
            isEmpty(this.state.currentShippingMethod)
          }
          onClick={() => onConfirm(this.state.currentShippingMethod)}
        >
          <span className="text">
            {this.props.translate(
              'right_menu.shipping_options.confirm_shipping_pickup'
            )}
          </span>
          <Icon className="angle double right" />
        </Button>
      </div>
    );
  }

  renderBottom() {
    const { cartLoaded } = this.props    

    return (
      <div key="bottom" className="bottom">
        <Button.Group>
          <Button className="back" icon onClick={this.props.onBackClick}>
            <Icon className="angle left" />
            <span className="text">{this.props.translate('right_menu.shipping_options.back')}</span>
          </Button>
          <Button className="verify" icon disabled={!cartLoaded || !this.state.selectedAddress} onClick={this.handleVerifyAddressClick}>
            <span className="text">{this.props.translate('right_menu.shipping_options.verify_address')}</span>
            <Icon className="angle double right" />
          </Button>
        </Button.Group>
      </div>
    );
  }

  renderFooter() {
    const { shippingAddresses } = this.props
    return (
      !isEmpty(shippingAddresses) ? this.renderBottom() : this.renderBottomNoAddress()
    )
  }
  render() {
    return [
      this.renderHeader(),
      this.renderBody(),
      this.renderFooter()
    ];
  }
}

const mapStateToProps = (state, ownProps) => ({
  shippingAddresses: getShippingAddressesSelector(state),
  translate: getTranslate(state.locale),
  lang: langSelector(state),
  cartLoaded: state.cart.loaded,
  shippingMethods: state.cart.shippingMethods.data,
  customer: state.customer.items,
  loadingMethods: state.cart.shippingMethods.isLoading
});

const mapDispatchToProps = dispatch => ({
  deleteAddress: addressId => dispatch(deleteAddress(addressId)),
  setAlwaysShowSidebar: value => dispatch(setAlwaysShowSidebar(value)),
  initializeForm: values => dispatch(initialize('address', values)),
  fetchDistrict: regionId => dispatch(fetchDistrict(regionId)),
  fetchSubDistrict: (regionId, disctrictId) => dispatch(fetchSubDistrict(regionId, disctrictId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddressSelection);
