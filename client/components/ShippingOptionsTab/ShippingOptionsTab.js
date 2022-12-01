import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, get as prop, isEmpty, noop, head, isFunction } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import Cookie from 'js-cookie';
import { Loader, NoStockModal } from '../../magenta-ui';
import { setAlwaysShowSidebar } from '../../reducers/layout';
import { setAddressDefault, setShippingAddressDefault } from '../../reducers/customer';
import './ShippingOptionsTab.scss';
import ShippingOverview from './ShippingOverview';
import ShippingAddressSelection from './ShippingAddressSelection';
import AddEditShippingAddress from './AddEditShippingAddress';
import ShippingMethodSelection from './ShippingMethodSelection';
import TimeSlotTab from '../TimeSlotTab';
import { fetchShippingMethods, fetchCartProducts, transferCart, modalNotSelectMethod } from '../../reducers/cart'
import { fullPageLoading } from '../../reducers/layout'
import { fetchNextStoreConfig } from '../../reducers/storeConfig'
import { saveShippingLocation } from '../../reducers/shippingAddress'
import CartWillBeMovedModal from '../CartWillBeMovedModal'
import { countDiffItems } from '../../utils/diffItemCheck'
import { getCurrentStoreConfigSelector } from '../../selectors'
import { getQueryParam } from '../../utils/url';
import ClickAndCollectTab from './ClickAndCollectTab';

const modes = {
  overview: 'overview',
  address_selection: 'address_selection',
  new_address: 'new_address',
  edit_address: 'edit_address',
  timeslot: 'timeslot',
  edit_method: 'edit_method',
  select_store: 'select_store'
};

class ShippingOptionsTab extends PureComponent {
  static propTypes = {
    customer: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    setAddressDefault: PropTypes.func.isRequired,
    setAlwaysShowSidebar: PropTypes.func.isRequired,
    onChangeMode: PropTypes.func,
    shippingMethods: PropTypes.array,
    setDeliveryMethod: PropTypes.func,
    translate: PropTypes.func.isRequired,
    setShippingAddressDefault: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onChangeMode: noop,
    shippingMethods: [],
    setDeliveryMethod: noop,
  }

  state = {
    mode: modes.overview,
    changeAddressModal: { show: false, address: {} },
    itemsMissingModal: {
      show: false,
      items: []
    },
    requestsPending: false,
    deliveryMethod: '',
    errorNoSelectMethod: false,
    shippingCookie: ''
  };
  
  componentDidMount() {
    const { customer } = this.props

    if (prop(customer, 'addresses')) {
      this.props.fetchShippingMethods();
    }

    const deliveryMethod = getQueryParam('delivery_method');
    if (deliveryMethod) {
      this.handleConfirmShipping(deliveryMethod)
    }
  }

  componentWillMount() {
    const { customer, mode } = this.props;
    const customerId = prop(customer, 'id', false);
    let shippingCookie = '';
    const customerAddress = prop(customer, 'addresses', []);

    if (customerId) {
      shippingCookie = Cookie.get(`shipping_address_cookie_${customerId}`);
      if (shippingCookie === undefined) {
        shippingCookie = Cookie.get(`shipping_address_cookie`);
      }
    } else {
      shippingCookie = Cookie.get(`shipping_address_cookie`);
    }

    const customerShipping = customerAddress.filter((addr) => {
      return addr.customer_address_type !== 'billing'
    });

    if (prop(customer, 'id') && shippingCookie !== '' && shippingCookie !== ',,,' && isEmpty(customerShipping)) {
      this.setState({ mode: modes.new_address, shippingCookie: shippingCookie });
    }

    // if (prop(customer, 'id') && isEmpty(customer.addresses)) {
    //    this.setState({ mode: modes.new_address });
    // }
    let defaultAddress = {}

    if (!isEmpty(Cookie.getJSON('default_shipping'))) {
      defaultAddress = Cookie.getJSON('default_shipping')
    } else {
      defaultAddress = find(customer.addresses, addr => addr.default_shipping)
    }
    
    
    if (isEmpty(defaultAddress)) {
      this.setState({ mode: modes.address_selection });
    }

    if (mode) {
      this.setState({ mode });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mode !== this.props.mode) {
      this.setState({ mode: nextProps.mode });
    }
  }

  getAddressCustomAttribute = (address, attrName) => {
    return prop(
      find(address.custom_attributes, attr => attr.attribute_code === attrName),
      'value',
      null
    );
  };

  handleChangeMode = mode => {
    this.setState({ mode });

    if (mode === 'overview') {
      this.props.fetchShippingMethods();
    }
    
    this.props.onChangeMode && this.props.onChangeMode(mode);
  }

  handleConfirmShipping = async (method, selectedStore = false, locatorId = '') => {
    const { shippingMethods, SetLocatorMobile } = this.props

    if (isEmpty(method) && (!isEmpty(shippingMethods) && shippingMethods.length > 1)) {
      this.setState({
        errorNoSelectMethod: true
      })
      return
    }

    this.setState({
      deliveryMethod: method,
      errorNoSelectMethod: false,
      locatorId: locatorId
    })

    this.props.setDeliveryMethod(method)

    // this.handleChangeMode(modes.timeslot)

    if (method === 'tops' && !selectedStore) {
      return this.handleChangeMode(modes.select_store)
    }
    else {
      isFunction(SetLocatorMobile) && SetLocatorMobile(locatorId)
      return this.handleChangeMode(modes.timeslot)
    }
  }

  handleTransferCart = async (isTransfer) => {
    const { customer, translate } = this.props
    const cookieAddress = Cookie.get('default_address');
    
    this.setState({ requestsPending: true })
    this.setState({ itemsMissingModal: { show: false } })
    
    let defaultAddress = {}

    if (!isEmpty(Cookie.getJSON('default_shipping'))) {
      defaultAddress = Cookie.getJSON('default_shipping')
    } else {
      defaultAddress = find(customer.addresses, address => {
        return address.default_shipping
      })
    }
    
    if (!defaultAddress) {
      this.setState({ requestsPending: false })
      return;
    }
    
    const regionId = defaultAddress.region_id
    const districtId = defaultAddress.district_id
    const subDistrictId = defaultAddress.subdistrict_id
    const zipcode = defaultAddress.postcode
    await this.props.saveShippingLocation(regionId, districtId, subDistrictId, zipcode)
    this.setState({ requestsPending: false })
    
    if (isTransfer) {
      this.props.fullPageLoading(true, translate('store_changeing'))
      await this.props.transferCart({ storeCode: this.props.nextStoreConfig.code })
      window.location.reload()
    }
  }

  handleVerifyAddressClick = addressId => {
    this.handleChangeMode(modes.overview);
    
    if (addressId) {
      this.setState({
        changeAddressModal: {
          show: true,
          address: find(this.props.customer.addresses, address => address.id === addressId)
        }
      });
      this.props.setAlwaysShowSidebar(true);
    }
  };

  handleCloseChangeAddressModal = () => {
    this.setState({ changeAddressModal: { show: false, address: {} } });
    this.props.setAlwaysShowSidebar(false);
  };

  handleConfirmChangeAddress = async () => {
    const { setShippingAddressDefault } = this.props
    this.setState({ requestsPending: true })
    
    if (!isEmpty(this.state.changeAddressModal.address)) {
      // this.props.setAddressDefault(this.state.changeAddressModal.address.id);
      setShippingAddressDefault(this.state.changeAddressModal.address.id)
      this.handleCloseChangeAddressModal();
    }
    
    const isStoreDifferent = await this.props.fetchNextStoreConfig();

    if (!isStoreDifferent) {
      await this.handleTransferCart()
      this.handleChangeMode(modes.overview);
      return;
    }

    const { cartItems, storeConfig } = this.props
    const { items: newCartProducts } = await this.props.fetchCartProducts(true)
    const diffItems = countDiffItems(cartItems, newCartProducts, storeConfig)

    if (!isEmpty(diffItems)) {
      this.setState({ requestsPending: false })
      this.setState({
        itemsMissingModal: {
          show: true,
          items: diffItems
        }
      })
    } else {
      this.handleTransferCart(true)
    }
  };

  renderModalMessage() {
    const { lang } = this.props;
    const { changeAddressModal } = this.state;

    switch (lang) {
      case 'th_TH':
        return (
          <div className="text">
            <div className="first-row">การใช้ที่อยู่จัดส่งเป็น <span className="red">‘{changeAddressModal.address.address_name}’</span></div>
            <div>อาจทำให้สินค้าบางรายการมีการเปลี่ยนแปลง</div>
          </div>
        )
      default:
        return (
          <div className="text">
            <div className="first-row">Changing to <span className="red">‘{changeAddressModal.address.address_name}’</span></div>
            <div>address may cause unavailability of some items in your cart</div>
          </div>
        )
    }
  }

  renderChangeAddressModal() {
    const { changeAddressModal } = this.state;

    return (
      <CartWillBeMovedModal
        open={this.state.changeAddressModal.show}
        storeName={changeAddressModal.address.address_name}
        onClose={this.handleCloseChangeAddressModal}
        onConfirm={this.handleConfirmChangeAddress}
      />
    )
  }

  renderContent() {
    const { customer, shippingMethods } = this.props;
    const { mode, shippingCookie } = this.state;
    if (!prop(customer, 'id')) {
      return <div>Login, please</div>;
    }

    switch (mode) {
      case modes.address_selection: {
        return (
          <ShippingAddressSelection
            onAddClick={this.handleChangeMode.bind(this, modes.new_address)}
            onBackClick={this.handleChangeMode.bind(this, modes.overview)}
            onVerifyAddressClick={this.handleVerifyAddressClick}
            onEditClick={this.handleChangeMode.bind(this, modes.edit_address)}
            shippingMethods={shippingMethods}
            onConfirm={this.handleConfirmShipping}
          />
        );
      }
      case modes.new_address: {
        return (
          <AddEditShippingAddress
            onBackClick={this.handleChangeMode.bind(this, modes.address_selection)}
            afterVerify={() => this.handleConfirmChangeAddress()}
            onDefaultLocate={shippingCookie}
          />
        );
      }
      case modes.edit_address: {
        return (
          <AddEditShippingAddress
            onBackClick={this.handleChangeMode.bind(this, modes.address_selection)}
            afterVerify={() => this.handleConfirmChangeAddress()}
          />
        );
      }

      case modes.timeslot: {
        return (
          <TimeSlotTab 
            deliveryMethod={this.state.deliveryMethod} 
            locatorId={this.state.locatorId}
            // onBackClick={() => this.handleChangeMode(!isEmpty(customer.addresses) ?  modes.overview : modes.address_selection )} 
            onBackClick={() => this.handleChangeMode( this.state.deliveryMethod === 'tops' ?  modes.select_store : modes.overview )} 

          />
        );
      }

      case modes.edit_method: {
        return (
          <ShippingMethodSelection
            onBackClick={this.handleChangeMode.bind(this, modes.overview)}
          />
        );
      }

      case modes.select_store: {
        return (
          <ClickAndCollectTab 
            onBackClick={() => this.handleChangeMode( !isEmpty(customer.addresses) ?  modes.overview : modes.address_selection )} 
            shippingMethod={this.state.deliveryMethod}   
            onConfirm={this.handleConfirmShipping}        
          />
        )
      }

      default: {
        return (
          <ShippingOverview
            shippingMethods={shippingMethods}
            errorShippingMethod={this.state.errorNoSelectMethod}
            onChangeAddress={this.handleChangeMode.bind(this, modes.address_selection)}
            onChangeMethod={this.handleChangeMode.bind(this, modes.edit_method)}
            onConfirm={this.handleConfirmShipping}
          />
        )
      }
    }
  }

  renderItemsMissingModal() {
    const { lang } = this.props
    const { itemsMissingModal } = this.state

    return (
      <NoStockModal
        lang={lang}
        open={itemsMissingModal.show}
        items={itemsMissingModal.items}
        onConfirm={this.handleTransferCart}
        onCloseButton={this.handleTransferCart}
      />
    )
  }

  render() {
    return (
      <div className="shipping-options-tab-root">
        {this.state.requestsPending && <div className="shipping-options-tab-mask" />}
        <Loader
          className="shipping-options-tab-loader"
          active={this.state.requestsPending}
          size="large"
        />
        {this.renderChangeAddressModal()}
        {this.renderItemsMissingModal()}
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: state.customer.items,
  translate: getTranslate(state.locale),
  lang: find(state.locale.languages, lang => lang.active === true).code,
  cartItems: state.cart.cart.items,
  storeConfig: getCurrentStoreConfigSelector(state),
  nextStoreConfig: state.storeConfig.next,
  shippingMethods: state.cart.shippingMethods.data
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setAddressDefault,
  setAlwaysShowSidebar,
  fetchShippingMethods,
  fetchNextStoreConfig,
  fetchCartProducts,
  transferCart,
  saveShippingLocation,
  fullPageLoading,
  modalNotSelectMethod,
  setShippingAddressDefault,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ShippingOptionsTab);
