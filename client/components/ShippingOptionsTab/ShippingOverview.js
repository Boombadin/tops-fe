import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { find, get as prop, isEmpty, map, filter, head } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import { isMobile } from 'react-device-detect';
import Cookie from 'js-cookie';
import { format } from '../../utils/time';
import { unsetCookie } from '../../utils/cookie'
import AddressIcon from '../../components/Icons/Address';
import TruckIcon from '../../components/Icons/Truck';
import {
  Segment,
  Header,
  Container,
  Button,
  ShippingAddressPreview,
  Icon
} from '../../magenta-ui';
import { langSelector } from '../../selectors';
import './ShippingOptionsTab.scss';
import { truncateSync } from 'fs';
import ShippingOverviewPreloader from './ShippingOverviewPreloader';

class ShippingOverview extends PureComponent {
  state = {
    currentShippingMethod: ''
  };

  static propTypes = {
    translate: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    shippingMethods: PropTypes.array,
    lang: PropTypes.string,
    onChangeAddress: PropTypes.func,
    onChangeMethod: PropTypes.func,
    loadingMethods: PropTypes.bool,
    errorShippingMethod: PropTypes.bool
  };

  static defaultProps = {
    loadingMethods: false,
    errorShippingMethod: false
  };

  getAddressCustomAttribute = (address, attrName) => {
    return prop(
      find(address.custom_attributes, attr => attr.attribute_code === attrName),
      'value',
      null
    );
  };

  renderAddress() {
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
      <div className="address">
        <div className="header">
          <div className="name">
            <span className="icon">
              <TruckIcon />
            </span>
            <span className="title">{this.props.translate('right_menu.shipping_options.delivery')}</span>
          </div>
        </div>
        <div className="delivery-title">
          <span className="home-delivery">{this.props.translate('right_menu.shipping_options.home_delivery')}</span>
          <span className="delivey-to">{this.props.translate('right_menu.shipping_options.delivered_to')}</span>
        </div>
        {address && (
          <ShippingAddressPreview
            className="default-address-preview"
            address={address}
            lang={this.props.lang}
          />
        )}
        {this.props.onChangeAddress && (
            <div className="change" onClick={this.props.onChangeAddress}>
              {this.props.translate(
                'right_menu.shipping_options.change_address'
              )}
            </div>
          )}
      </div>
    );
  }

  handleSetMethod = methodCode => {
    unsetCookie('recipient_info')
    Cookie.set('shipping_method', methodCode)
    this.setState({ currentShippingMethod: methodCode });
  };

  renderDeliveryMethodOptions = shippingMethods => {

    const { translate } = this.props;
    // if (shippingMethods.length > 1) {
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
            </div>
          )
        }
        <label className="input-radio">
          <input type="radio" name="shipping_options" checked={shippingActive} />
        <div
          className={`current-method method-options option-active ${shippingActive &&
            'active'} ${isEmpty(nextRound) && !storePickupEnable &&
            'disable-method'} ${method.methodCode === 'express' && 'powered-grab'}`}
          onClick={() =>
            (!isEmpty(nextRound) || storePickupEnable) && this.handleSetMethod(method.methodCode)
          }
        >
          {/* {this.props.translate('right_menu.shipping_options.standard_delivery')} */}
          <div className="shipping-method-body">
            <span className="method-title">{method.methodTitle}</span>
            {
              method.methodCode === 'express' && (
                <div className="method-powered-by">
                  <span className="powered-by-text-grab">{translate('right_menu.shipping_options.powered_by')}</span>
                  <img className="powered-by-icon-grab" src="/assets/images/Grab_logo.svg" alt="" />
                </div>
              )
            }
            { 
              method.carrierCode === 'pickupatstore' && (
                <div className="method-powered-by">
                  <span className="powered-by-text-grab">{translate('right_menu.shipping_options.pickup_free_service')}</span>
                </div>
              )
            }
         
          </div>

          <div className="shipping-method-bottom">
            {
              method.methodCode !== 'tops' ? (
                <React.Fragment>
                  {!isEmpty(filterSlot) && (
                    <span className="method-next-round">
                      {translate('right_menu.shipping_options.next_round')}{' '}
                      {!isEmpty(checkAllowSlot) && !isEmpty(nextRound) ? (
                        <span className="method-datetime">
                          {translate('right_menu.shipping_options.next_round_datetime', {
                            date: moment(moment().format('YYYY-MM-DD')).isSame(filterSlot.date) ? translate('right_menu.shipping_options.today') : format(filterSlot.date, "DD MMM", this.props.lang),
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
                  <span className="method-select-slot">{translate('right_menu.shipping_options.select_slot_next_step')}</span>
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
        <div className="header">
          <div className="name">
            {/* <span className="icon">
              <TruckIcon />
            </span> */}
            {!isEmpty(shippingMethods) && shippingMethods.length > 1
              ? translate('right_menu.shipping_options.select_methods')
              : translate('right_menu.shipping_options.method')}
          </div>
        </div>
        {!isEmpty(shippingMethods) && !loadingMethods
          ? this.renderDeliveryMethodOptions(shippingMethods)
          : loadingMethods && <ShippingOverviewPreloader />}
      </div>
    );
  }

  renderInfo() {
    return (
      <div className="info">
        {this.props.translate('right_menu.shipping_options.time_info')}
      </div>
    );
  }

  renderHeader() {
    return (
      <Segment key="header" className="header-wrapper">
        <Container fluid>
          <Header as="h4" className="text" handleToHome={() => this.props.history.push('/')}>
            {this.props.translate('right_menu.shipping_options.name')}
          </Header>
          <div className="info">
            <span className="warning">
              *
              {this.props.translate(
                'right_menu.shipping_options.header.warning'
              )}
            </span>
          </div>
        </Container>
      </Segment>
    );
  }

  renderBody() {
    return (
      <div key="body" className="body">
        {this.renderAddress()}
        {this.renderMethod()}
        {/* {this.renderInfo()} */}
      </div>
    );
  }

  renderBottom() {
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

  render() {
    return [this.renderHeader(), this.renderBody(), this.renderBottom()];
  }
}

const mapStateToProps = (state, ownProps) => ({
  customer: state.customer.items,
  translate: getTranslate(state.locale),
  cartLoaded: state.cart.loaded,
  lang: langSelector(state),
  shippingMethods: state.cart.shippingMethods.data,
  loadingMethods: state.cart.shippingMethods.isLoading
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShippingOverview);
