import { Icon } from '@central-tech/core-ui';
import Cookie from 'js-cookie';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import MetaTags from '@client/components/MetaTags';
import CheckoutHeader from '@client/features/checkout/components/CheckoutHeader';
import { value } from '@client/features/checkout/utils';
import { withDeeplink } from '@client/features/deeplink';
import { Grid } from '@client/magenta-ui';
import { fetchOrder, fetchOrderByIncrementId } from '@client/reducers/order';
import {
  getCustomerSelector,
  isCustomerLoggedInSelector,
  langSelector,
} from '@client/selectors';
import { getCookie } from '@client/utils/cookie';
import { formatPriceWithLocale as formatPrice } from '@client/utils/price';
import { format } from '@client/utils/time';
import { fullpathUrl } from '@client/utils/url';

import './PaymentResponse.scss';

class CheckoutDetail extends Component {
  static defaultProps = {
    customer: [],
    order: [],
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    customer: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.arrayOf(PropTypes.object),
  };

  componentDidMount() {
    const { isCustomerLogged } = this.props;
    this.virtualPageView();
    if (isCustomerLogged) {
      this.fetchOrder();
    }
  }

  virtualPageView() {
    dataLayer.push({
      event: 'vpv',
      provider: !isEmpty(getCookie('provider')) ? getCookie('provider') : 'web',
      customer_id: get(this.props.customer, 'id', ''),
      email: get(this.props.customer, 'email', ''),
      page: {
        pagePath: this.props.location.pathname,
        pageTitle: 'Thankyou',
        pageLang: this.props.lang,
        pageType: 'thankyou',
      },
    });
  }

  setOrderDataLayer = order => {
    const orderAttr = get(order, 'extension_attributes', '');
    const orderAddress = get(
      orderAttr,
      'shipping_assignments.0.shipping.address',
      {},
    );
    const shippingAddress = get(
      orderAddress,
      'extension_attributes.custom_attributes',
    );
    const shipping = {
      region: value(shippingAddress, 'region', ''),
      postcode: value(shippingAddress, 'postcode', ''),
    };

    dataLayer.push({
      payment_type: get(order, 'extension_attributes.payment_method_label'),
      delivery_type: get(order, 'extension_attributes.shipping_method_label'),
      delivery_province: shipping.region,
      delivery_postcode: shipping.postcode,
      discount_amount: Math.abs(get(order, 'discount_amount')),
      distinct_item: get(order, 'items').length,
      event: 'eec.purchase',
      ecommerce: {
        purchase: {
          actionField: {
            id: order.increment_id, // Transaction ID. Required for purchases and refunds.
            affiliation: 'Online',
            revenue: order.grand_total, // Total transaction value (incl. tax and shipping)
            tax: order.tax_amount,
            shipping: order.base_shipping_incl_tax,
            coupon: get(order, 'coupon_code', ''), // All coupon in cart
          },
          products: map(order.items, item => ({
            id: item.sku,
            name: get(item, 'extension_attributes.gtm_data.product_name_en'),
            category: get(item, 'extension_attributes.gtm_data.category_en'),
            price: item.base_price_incl_tax,
            brand: get(item, 'extension_attributes.gtm_data.brand_en'),
            quantity: item.qty_ordered,
            product_normal_price: item.base_original_price,
            discount_amount:
              item.base_original_price - item.base_price_incl_tax,
          })),
        },
      },
    });
    const expiresDate = 15;
    Cookie.set(`Transactionid${order.increment_id}`, order.increment_id, {
      expires: expiresDate,
    });
  };

  fetchOrder = async () => {
    const incrementId = this.props.match.params.slug;
    if (incrementId) {
      const order = await this.props.fetchOrderByIncrementId(incrementId);
      const checkTransactionId = isEmpty(
        Cookie.get(`Transactionid${incrementId}`),
      );
      if (checkTransactionId) {
        this.setOrderDataLayer(order);
      }
    }
  };

  renderShippingAddress() {
    const { order } = this.props;
    let orderId = {};
    orderId = find(order, data => {
      return this.props.match.params.slug === data.increment_id;
    });
    const orderAttr = get(orderId, 'extension_attributes', '');
    const orderAddress = get(
      orderAttr,
      'shipping_assignments.0.shipping.address',
      {},
    );
    const shippingAddress = get(
      orderAddress,
      'extension_attributes.custom_attributes',
    );
    const shipping = {
      address_name: value(shippingAddress, 'address_name', ''),
      region: value(shippingAddress, 'region', ''),
      road: value(shippingAddress, 'road', ''),
      district: value(shippingAddress, 'district', ''),
      subdistrict: value(shippingAddress, 'subdistrict', ''),
      house_no: value(shippingAddress, 'house_no', ''),
      soi: value(shippingAddress, 'soi', ''),
      moo: value(shippingAddress, 'moo', ''),
      village: value(shippingAddress, 'village_name', ''),
      postcode: value(shippingAddress, 'postcode', ''),
    };
    return (
      !isEmpty(shipping) &&
      `${get(shipping, 'house_no') !== null ? get(shipping, 'house_no') : ''} 
        ${get(shipping, 'moo', '') !== null ? get(shipping, 'moo') : ''} 
        ${
          get(shipping, 'village', '') !== null ? get(shipping, 'village') : ''
        } 
        ${get(shipping, 'soi', '') !== null ? get(shipping, 'soi') : ''}
        ${get(shipping, 'road', '') !== null ? get(shipping, 'road') : ''} 
        ${
          get(shipping, 'subdistrict', '') !== null
            ? get(shipping, 'subdistrict')
            : ''
        } 
        ${
          get(shipping, 'district', '') !== null
            ? get(shipping, 'district')
            : ''
        } 
        ${get(shipping, 'region', '') !== null ? get(shipping, 'region') : ''} 
        ${
          get(shipping, 'postcode', '') !== null
            ? get(shipping, 'postcode')
            : ''
        }`
    );
  }

  renderOtherOrderInfo() {
    const { order, customer, storeConfig, history, translate } = this.props;
    if (
      !isEmpty(order) &&
      !isEmpty(customer) &&
      get(customer, 'id') !== get(first(order), 'customer_id')
    ) {
      history.push(`/`);
    }

    let orderId = {};
    orderId = find(order, data => {
      return this.props.match.params.slug === data.increment_id;
    });
    const orderAttr = get(orderId, 'extension_attributes', '');
    const orderAddress = get(
      orderAttr,
      'shipping_assignments.0.shipping.address',
      {},
    );
    const address = this.renderShippingAddress();
    let orderDate = '';
    let orderTime = '';
    if (get(orderAttr, 'shipping_slot_time', '')) {
      orderDate = format(
        get(orderAttr, 'shipping_date', ''),
        'DD MMM',
        storeConfig.locale,
      );
      orderTime = get(orderAttr, 'shipping_slot_time', '').replace(/ /g, '');
    }
    const paymentMethod = get(orderAttr, 'payment_method_label', '');
    const shippingMethod = get(orderAttr, 'shipping_method_label', '');
    const totalPrice = formatPrice(get(orderId, 'grand_total', ''));
    return (
      <React.Fragment>
        <div className="order-info-wrapper">
          <p className="txt-title">{translate('payment_complete.order_no')}</p>
          <p className="txt-val">{orderId ? orderId.increment_id : ''}</p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">{`${translate(
            'payment_complete.shipping_method',
          )}: `}</p>
          <p className="txt-val">{shippingMethod ? shippingMethod : ''}</p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">{`${translate(
            'payment_complete.shipping_address',
          )}: `}</p>
          <p className="txt-val">{!isEmpty(address) ? address : ''}</p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">
            {`${translate('payment_complete.receivers_date_cod')}: `}
          </p>
          <p className="txt-val">
            {orderDate},{' '}
            {`${orderTime} ${translate('payment_complete.time_unit')}`}
          </p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">
            {`${translate('payment_complete.receivers')}: `}
          </p>
          <p className="txt-val">
            {orderAddress
              ? `${get(orderAddress, 'firstname', '')} ${get(
                  orderAddress,
                  'lastname',
                  '',
                )} `
              : ''}
            {get(orderAddress, 'telephone', '') && (
              <p className="tel-contact">
                <span>(</span>
                <NumberFormat
                  value={get(orderAddress, 'telephone', '')}
                  displayType="text"
                  format="###-############"
                />
                <span>)</span>
              </p>
            )}
          </p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">
            {`${translate('payment_complete.payment_method')}: `}
          </p>
          <p className="txt-val">
            {paymentMethod} {`${totalPrice} ${translate('unit.baht')}`}
          </p>
        </div>
      </React.Fragment>
    );
  }

  renderClickAndCollectOrderInfo() {
    const {
      order,
      customer,
      store,
      storeConfig,
      history,
      translate,
    } = this.props;
    if (
      !isEmpty(order) &&
      !isEmpty(customer) &&
      get(customer, 'id') !== get(first(order), 'customer_id')
    ) {
      history.push(`/`);
    }

    let orderId = {};
    orderId = find(order, data => {
      return this.props.match.params.slug === data.increment_id;
    });
    const orderAttr = get(orderId, 'extension_attributes', '');
    const storeAttr = get(store, '0.custom_attributes', '');
    const pickupStore = get(orderAttr, 'pickup_store', {});
    let orderDate = '';
    let orderTime = '';
    if (get(orderAttr, 'shipping_slot_time', '')) {
      orderDate = format(
        get(orderAttr, 'shipping_date', ''),
        'DD MMM',
        storeConfig.locale,
      );
      orderTime = get(orderAttr, 'shipping_slot_time', '').replace(/ /g, '');
    }
    const shippingMethod = get(orderAttr, 'shipping_method_label', '');
    const paymentMethod = get(orderAttr, 'payment_method_label', '');
    const totalPrice = formatPrice(get(orderId, 'grand_total', ''));
    return (
      <React.Fragment>
        <div className="order-info-wrapper">
          <p className="txt-title">{translate('payment_complete.order_no')}</p>
          <p className="txt-val">{orderId ? orderId.increment_id : ''}</p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">{`${translate(
            'payment_complete.shipping_method',
          )}: `}</p>
          <p className="txt-val">{shippingMethod ? shippingMethod : ''}</p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">
            {`${translate('payment_complete.pickup_at')}: `}
          </p>
          <div>
            <p className="txt-val">{get(pickupStore, 'store_name', '')}</p>
            <p className="txt-val">
              {value(storeAttr, 'description')}{' '}
              {`(${value(storeAttr, 'contact_phone')})`}
            </p>
          </div>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">
            {`${translate('payment_complete.receivers_date')}: `}
          </p>
          <p className="txt-val">
            {orderDate},{' '}
            {`${orderTime} ${translate('payment_complete.time_unit')}`}
          </p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">
            {`${translate('payment_complete.pickup_receivers')}: `}
          </p>
          <p className="txt-val">
            {pickupStore ? `${get(pickupStore, 'receiver_name', '')} ` : ''}
            {get(pickupStore, 'receiver_phone', '') && (
              <p className="tel-contact">
                <span>(</span>
                <NumberFormat
                  value={get(pickupStore, 'receiver_phone', '')}
                  displayType="text"
                  format="###-############"
                />
                <span>)</span>
              </p>
            )}
          </p>
        </div>
        <div className="order-info-wrapper">
          <p className="txt-title">
            {`${translate('payment_complete.payment_method')}: `}
          </p>
          <p className="txt-val">
            {paymentMethod} {`${totalPrice} ${translate('unit.baht')}`}
          </p>
        </div>
      </React.Fragment>
    );
  }

  renderSuccessMessage() {
    const { order, translate } = this.props;
    let orderId = {};
    let accessTradeData;
    orderId = find(order, data => {
      return this.props.match.params.slug === data.increment_id;
    });
    const orderShippingMethod = get(
      orderId,
      'extension_attributes.shipping_assignments.0.shipping.method',
      {},
    );

    if (!isEmpty(orderId)) {
      const items = [];
      orderId.items.map(item => {
        items.push({
          id: item.sku,
          category_id: get(
            item,
            'extension_attributes.gtm_data.category_id_level_two',
            '1001',
          ),
          price: item.base_price_incl_tax,
          quantity: item.qty_ordered,
        });
      });

      const params = {
        result_id: 30,
        identifier: orderId.increment_id,
        products: items,
        transaction_discount: Math.abs(get(orderId, 'discount_amount', 0)),
      };

      const script = document.createElement('script');
      script.appendChild(
        document.createTextNode(
          `var __atw = __atw || [];__atw.push({"mcn": "20f07591c6fcb220ffe637cda29bb3f6","param": ${JSON.stringify(
            params,
          )}});(function (d) {var s = d.createElement('script');s.src = 'https://cv.accesstrade.in.th/js/nct/cv.js';s.async = true;var e = d.getElementsByTagName('script')[0];e.parentNode.insertBefore(s, e);})(document);`,
        ),
      );
      document.body.appendChild(script);
    }

    return (
      <div className="checkout-complete-order-detail">
        <h2 className="txt-color-green">
          {translate('payment_complete.order_complete')}
        </h2>

        {orderShippingMethod === 'pickupatstore_tops'
          ? this.renderClickAndCollectOrderInfo()
          : this.renderOtherOrderInfo()}

        <div>
          {accessTradeData && (
            <img src={accessTradeData} width="1" height="1" />
          )}
        </div>
      </div>
    );
  }

  render() {
    const client = Cookie.get('client');
    const { translate, deeplink, order } = this.props;

    return (
      <div className="checkout-content">
        <MetaTags
          canonicalUrl={fullpathUrl(this.props.location)}
          title={translate('meta_tags.checkout_completed.title')}
          keywords={translate('meta_tags.checkout_completed.keywords')}
          description={translate('meta_tags.checkout_completed.description')}
        />
        <CheckoutHeader
          step={3}
          isMobile
          isBackButton={false}
          backText={this.props.translate('payment_complete.order_complete')}
        />
        <div className="checkout-detail-wrapper">
          {!isEmpty(order) && (
            <Grid className="checkout-detail-content">
              <Grid.Column mobile={16} className="checkout-shipping-wrap">
                <div className="checkout-complete-wrap">
                  <div className="checkout-complete-content-wrap">
                    <div className="checkout-complete-content">
                      <img
                        className="checkout-complete-image"
                        src="/assets/images/thanks-img.png"
                      />
                    </div>
                    <div className="checkout-complete-message">
                      {this.renderSuccessMessage()}
                    </div>
                  </div>
                  <div className="checkout-complete-button-wrap hide-mobile">
                    <div className="checkout-complete-button hide-mobile">
                      <Link
                        className="btn-check-order-status"
                        to={`/order-detail/${get(first(order), 'entity_id')}`}
                      >
                        {translate('payment_complete.check_status')}
                      </Link>
                    </div>
                    <div className="checkout-complete-button hide-mobile">
                      <Link className="btn-back" to="/">
                        {translate('payment_complete.back_home')}
                        <Icon
                          src="/assets/images/round-arrow-forward-24-px.svg"
                          style={{ marginLeft: 5 }}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="checkout-complete-button-wrap hide-desktop">
                    <div className="checkout-complete-button hide-desktop">
                      <Link
                        className="btn-back"
                        to={client === 'app' ? deeplink.home : '/'}
                      >
                        {translate('payment_complete.back_home')}
                        <Icon
                          src="/assets/images/round-arrow-forward-24-px.svg"
                          style={{ marginLeft: 5 }}
                        />
                      </Link>
                    </div>
                    <div className="checkout-complete-button hide-desktop">
                      <Link
                        className="btn-check-order-status"
                        to={`/order-detail/${get(first(order), 'entity_id')}`}
                      >
                        {translate('payment_complete.check_status')}
                      </Link>
                    </div>
                  </div>
                </div>
              </Grid.Column>
            </Grid>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: langSelector(state),
  customer: getCustomerSelector(state),
  translate: getTranslate(state.locale),
  order: state.order.item,
  store: state.order.store,
  storeConfig: state.storeConfig.current,
  isCustomerLogged: isCustomerLoggedInSelector(state),
});

const mapDispatchToProps = dispatch => ({
  fetchOrder: id => dispatch(fetchOrder(id)),
  fetchOrderByIncrementId: id => dispatch(fetchOrderByIncrementId(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withDeeplink(CheckoutDetail));
