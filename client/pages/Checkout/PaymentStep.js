import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get as prop, map, isEmpty } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import { format as dateFnsFormat } from 'date-fns';
import Cookie from 'js-cookie';
import { Grid, NoStockModal } from '../../magenta-ui';
import {
  fetchPayment,
  createOrder,
  closeDiffStockModal,
} from '../../reducers/checkout';
import { fetchCart } from '../../reducers/cart';
import Payment from '../../components/Payment';
import ShippingDetails from '../../components/ShippingDetails';
import BillingAddressWrap from '../../components/BillingAddressWrap/BillingAddressWrap';
import OrderRemarkWrap from '../../components/OrderRemarkWrap/OrderRemarkWrap';
import ProductReplacement from '../../components/ProductReplacement/ProductReplacement';
import { Model } from '../../features/gtm';
import { langSelector } from '../../selectors';

import './Checkout.scss';

class PaymentStep extends PureComponent {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    title: PropTypes.string,
    checkoutForm: PropTypes.object,
    fetchPayment: PropTypes.func.isRequired,
    paymentMethod: PropTypes.string,
    cart: PropTypes.array,
    payment: PropTypes.array,
    fetchCart: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    diffModal: PropTypes.object,
  };

  static defaultProps = {
    title: '',
    paymentMethod: '',
    cart: [],
    payment: [],
    diffModal: {},
  };

  componentDidMount() {
    const { payment } = this.props;

    const userToken = Cookie.get('user_token') || '';

    if (isEmpty(payment)) {
      this.props.fetchPayment(userToken);
    }

    if (!isEmpty(userToken)) {
      this.props.fetchCart(true, false);
    }

    const productItem = prop(this.props.cart, 'items');
    dataLayer.push({
      event: 'checkout',
      ecommerce: {
        checkout: {
          actionField: { step: 2 },
          products: map(productItem, e => Model.Payment(e)),
        },
      },
    });
  }

  renderItemsDiffModal() {
    const { lang, diffModal } = this.props;
    return (
      <NoStockModal
        lang={lang}
        open={diffModal.show}
        items={diffModal.diffItems}
        onConfirm={this.closeModal}
        onCloseButton={this.closeModal}
      />
    );
  }

  closeModal = async () => {
    const cartId = this.props.cart.id;
    this.props.closeDiffStockModal();

    if (cartId) {
      this.props.fetchCart(true, true);
    }
  };

  render() {
    const { cart } = this.props;

    let shippingAddress = '';
    let shippingMethod = '';
    let shippingPickup = {};
    if (
      cart.extension_attributes &&
      cart.extension_attributes.shipping_assignments.length > 0
    ) {
      shippingAddress = prop(
        cart,
        'extension_attributes.shipping_assignments.0.shipping.address',
        {},
      );
      shippingMethod = prop(
        cart,
        'extension_attributes.shipping_assignments.0.shipping.method',
        '',
      );

      if (shippingMethod === 'pickupatstore_tops') {
        shippingPickup = prop(cart, 'extension_attributes.pickup_store', {});
      }
    }

    let address = '';
    let addressName = '';
    let remark = '-';
    if (shippingAddress.custom_attributes) {
      shippingAddress.custom_attributes.map(resp => {
        if (resp.name === 'moo' && resp.value !== '') {
          address += `${this.props.translate('shipping_address.prefix_moo')} ${
            resp.value
          } `;
        }
        if (resp.name === 'soi' && resp.value !== '') {
          address += `${this.props.translate('shipping_address.prefix_soi')} ${
            resp.value
          } `;
        }
        if (
          resp.attribute_code === 'address_name' &&
          resp.value !== '' &&
          resp.value !== null
        ) {
          addressName = resp.value;
        }
        if (
          (resp.name === 'house_no' && resp.value !== '') ||
          (resp.name === 'village_name' && resp.value !== '') ||
          (resp.name === 'road' && resp.value !== '') ||
          (resp.name === 'district' && resp.value !== '') ||
          (resp.name === 'subdistrict' && resp.value !== '')
        ) {
          address += `${resp.value} `;
        }
        if (resp.name === 'remark' && resp.value !== '') {
          remark = resp.value;
        }
      });
      address += `${shippingAddress.region || ''} ${shippingAddress.postcode ||
        ''}`;
    }

    let shippingInfo = {
      address_name: addressName,
    };

    if (shippingMethod !== 'pickupatstore_tops') {
      shippingInfo = {
        ...shippingInfo,
        address: address,
      };
    }

    let date = '';
    let time = '';
    if (cart.extension_attributes) {
      date = cart.extension_attributes.delivery_date;
      time = cart.extension_attributes.delivery_time;

      if (date) {
        date = dateFnsFormat(date, 'DD/MM/YYYY');
      }
    }

    const mobileColItems = [
      {
        label:
          shippingMethod !== 'pickupatstore_tops'
            ? this.props.translate('shipping_address.address')
            : this.props.translate('shipping_address.recipient_address'),
        data: '',
        shipping_info: shippingInfo,
      },
      {
        label:
          shippingMethod !== 'pickupatstore_tops'
            ? this.props.translate('shipping_address.delivery_date')
            : this.props.translate('shipping_address.recipient_date'),
        data: date || '-',
      },
      {
        label:
          shippingMethod !== 'pickupatstore_tops'
            ? this.props.translate('shipping_address.delivery_time')
            : this.props.translate('shipping_address.recipient_time'),
        data: time || '-',
      },
      {
        // label:
        //   shippingMethod !== 'pickupatstore_tops'
        //     ? this.props.translate('shipping_address.recipient_name')
        //     : this.props.translate('shipping_address.recipient_name'),
        label: this.props.translate('shipping_address.recipient_name'),
        data:
          shippingMethod !== 'pickupatstore_tops'
            ? `${shippingAddress.firstname ||
                'N/A'} ${shippingAddress.lastname || 'N/A'}`
            : `${prop(shippingPickup, 'receiver_name', 'N/A')}`,
        // tel: `${shippingAddress.telephone || '-'}`,
      },
      {
        // label:
        //   shippingMethod !== 'pickupatstore_tops'
        //     ? this.props.translate('shipping_address.recipient_tel')
        //     : this.props.translate('shipping_address.recipient_tel'),
        label: this.props.translate('shipping_address.recipient_tel'),
        data:
          shippingMethod !== 'pickupatstore_tops'
            ? `${prop(shippingAddress, 'telephone', '-')}`
            : `${prop(shippingPickup, 'receiver_phone', '-')}`,
      },
      {
        label: this.props.translate('shipping_address.delivery_method'),
        data: '',
        powered_by: this.props.translate(
          'right_menu.shipping_options.powered_by',
        ),
        method: prop(
          cart,
          'extension_attributes.shipping_assignments.0.shipping.method',
          '',
        ),
        delivery_method: this.props.translate(
          'shipping_address.method.express',
        ),
      },
    ];

    const leftColItems = [
      {
        label:
          shippingMethod !== 'pickupatstore_tops'
            ? this.props.translate('shipping_address.address')
            : this.props.translate('shipping_address.recipient_address'),
        data: '',
        shipping_info: shippingInfo,
      },
    ];

    if (shippingMethod !== 'pickupatstore_tops') {
      leftColItems.push({
        label: this.props.translate('shipping_address.landmark'),
        data: remark,
      });
    }

    const rightColItems = [
      {
        label:
          shippingMethod !== 'pickupatstore_tops'
            ? this.props.translate('shipping_address.delivery_date')
            : this.props.translate('shipping_address.recipient_date'),
        data: date || '-',
      },
      {
        label:
          shippingMethod !== 'pickupatstore_tops'
            ? this.props.translate('shipping_address.delivery_time')
            : this.props.translate('shipping_address.recipient_time'),
        data: time || '-',
      },
      {
        label: this.props.translate('shipping_address.recipient_name'),
        data:
          shippingMethod !== 'pickupatstore_tops'
            ? `${prop(shippingAddress, 'firstname', 'N/A')} ${prop(
                shippingAddress,
                'lastname',
                'N/A',
              )}`
            : `${prop(shippingPickup, 'receiver_name', 'N/A')}`,
      },
      {
        label: this.props.translate('shipping_address.recipient_tel'),
        data:
          shippingMethod !== 'pickupatstore_tops'
            ? `${prop(shippingAddress, 'telephone', '-')}`
            : `${prop(shippingPickup, 'receiver_phone', '-')}`,
      },
    ];

    return (
      <div className="section-checkout">
        <Grid>
          <Grid.Column computer={16} mobile={16}>
            <ShippingDetails
              shippingMethod={shippingMethod}
              leftColData={leftColItems}
              rightColData={rightColItems}
              mobileColIData={mobileColItems}
            />
          </Grid.Column>
        </Grid>

        {/* Billing Details Section column */}
        <Grid className="section-billing-payment">
          <Grid.Column
            className="section-billing-address"
            computer={8}
            mobile={16}
          >
            <BillingAddressWrap />
          </Grid.Column>
          <Grid.Column mobile={16} className="order-remark-mobile">
            <OrderRemarkWrap />
          </Grid.Column>
          <Grid.Column mobile={16} className="order-remark-mobile">
            <ProductReplacement />
          </Grid.Column>
          <Grid.Column className="payment-box" computer={8} mobile={16}>
            <Payment />
          </Grid.Column>
        </Grid>

        {this.renderItemsDiffModal()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  lang: langSelector(state),
  translate: getTranslate(state.locale),
  checkoutForm: state.form,
  paymentMethod: state.checkout.paymentMethod,
  checkoutLoading: state.checkout.checkoutLoading,
  cart: state.cart.cart,
  customer: state.customer,
  payment: state.checkout.payment,
  diffModal: state.checkout.diffStockModal,
});

const mapDispatchToProps = dispatch => ({
  fetchPayment: userToken => dispatch(fetchPayment(userToken)),
  createOrder: (userToken, paymentMethod) =>
    dispatch(createOrder(userToken, paymentMethod)),
  fetchCart: (isCartLoad = false, isTotalsLoad = false) =>
    dispatch(fetchCart(isCartLoad, isTotalsLoad)),
  closeDiffStockModal: () => dispatch(closeDiffStockModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentStep);
