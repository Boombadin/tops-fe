import { format as dateFnsFormat } from 'date-fns';
import { find, get, isEmpty, map, reduce, size, unionBy } from 'lodash';
import pt from 'prop-types';
import React, { PureComponent } from 'react';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { checkLimitQty, validURL } from '@/client/utils/order';
import ProductApi from '@client/apis/product';
import Breadcrumbs from '@client/components/Breadcrumbs';
import Layout from '@client/components/Layout';
import MetaTags from '@client/components/MetaTags';
import Tabbar from '@client/components/Tabbar';
import CartItemsDifferentModal from '@client/features/modal/CartItemsDifferentModal';
import OrderLimitQtyModal from '@client/features/order/OrderLimitQtyModal';
import OrderDetailButtonFooter from '@client/features/orderDetail/components/OrderDetailButtonFooter';
import withLocales from '@client/hoc/withLocales';
import { Accordion, Breadcrumb, Icon, Image } from '@client/magenta-ui';
import { fetchOrder, reorderToCart } from '@client/reducers/order';
import { countDiffItems } from '@client/utils/diffItemCheck';
import { formatPrice } from '@client/utils/price';
import { fullpathUrl } from '@client/utils/url';

import './OrderDetail.scss';

@withLocales
class OrderDetail extends PureComponent {
  state = {
    activeIndex: 1,
    activeIndexPayment: 0,
    processedOrderId: '',
    itemsMissingModal: {
      show: false,
      items: [],
    },
    loadingReorder: false,
    modalValidateOpened: false,
    modalValidateMessage: '',
  };

  static propTypes = {
    translate: pt.func.isRequired,
    getOrder: pt.func.isRequired,
    match: pt.shape({
      params: pt.object.isRequired,
      isExact: pt.bool.isRequired,
      path: pt.string.isRequired,
      url: pt.string.isRequired,
    }).isRequired,
    storeConfig: pt.object.isRequired,
    customer: pt.object.isRequired,
    loaded: pt.bool.isRequired,
  };

  static initialState = (state, dispatch, match) => {
    return dispatch(fetchOrder(match.params.id));
  };

  componentDidMount() {
    const { order, customer } = this.props;

    if (!customer) {
      this.props.history.push('/');
    }

    if (!this.getOrder()) {
      this.props.getOrder(this.props.match.params.id);
    } else if (!find(order, { customer_id: customer.id })) {
      this.handleBack();
    }
  }

  componentDidUpdate(prevProps) {
    const { customer, order } = this.props;

    if (order !== prevProps.order) {
      if (!find(order, { customer_id: customer.id })) {
        this.handleBack();
      }
    }
  }

  getOrder() {
    const { id } = this.props.match.params;
    return find(this.props.order, { entity_id: parseInt(id, 0) });
  }

  renderLine(key, value, className) {
    return (
      <div className={className}>
        <p>{key}</p>
        <span>{value}</span>
      </div>
    );
  }
  renderLineAddress(key, addressName, address, className) {
    return (
      <div className={className}>
        <p>{key}</p>
        {isEmpty(address) ? (
          <span>{addressName}</span>
        ) : isEmpty(addressName) ? (
          <span>{address}</span>
        ) : (
          <div>
            <span>{addressName}</span>
            <br />
            <span>{address}</span>
          </div>
        )}
      </div>
    );
  }

  formatPriceWithCurrency(value, currency) {
    return (
      <div>
        <NumberFormat
          value={formatPrice(value)}
          displayType="text"
          thousandSeparator
        />
        {` ${currency}`}
      </div>
    );
  }

  renderBreadcrumbs() {
    const { translate } = this.props;
    const { increment_id } = this.getOrder();

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
      // {
      //   label: translate('order_history.my_account'),
      //   url: '/profile'
      // },
      {
        label: translate('order_history.order_history'),
        url: '/order-history',
      },
      {
        label: `${translate('order_detail.number')} ${increment_id}`,
        url: `/order-detail/${increment_id}`,
        isStatic: true,
      },
    ];

    return (
      <div className="breadcrumb-background">
        <Breadcrumb>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumbs
              key={breadcrumb.label}
              label={breadcrumb.label}
              url={breadcrumb.url}
              isStatic={breadcrumb.isStatic}
              hasNext={index < breadcrumbs.length - 1}
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  renderGrandTotal(key, value, currency) {
    return (
      <div className="order-detail-payment-line">
        <span>{key}</span>
        <span>
          <span className="order-detail-grand-total">{value}</span>&nbsp;
          {currency}
        </span>
      </div>
    );
  }

  renderTitle(key, value) {
    return (
      <div className="order-detail-header-title">
        <span>{`${key} ${value}`}</span>
      </div>
    );
  }

  renderShippingAddress = () => {
    const { translate } = this.props;
    const { extension_attributes } = this.getOrder();
    let shippingAddress = '';
    if (
      extension_attributes &&
      extension_attributes.shipping_assignments.length > 0
    ) {
      shippingAddress =
        extension_attributes.shipping_assignments[0].shipping.address;
    }
    let addressName = '';
    let address = '';
    let remark = '-';

    if (shippingAddress.extension_attributes.custom_attributes) {
      shippingAddress.extension_attributes.custom_attributes.map(resp => {
        if (
          resp.attribute_code === 'moo' &&
          resp.value !== '' &&
          resp.value !== null
        ) {
          address += `${translate('shipping_address.prefix_moo')} ${
            resp.value
          } `;
        }
        if (
          resp.attribute_code === 'soi' &&
          resp.value !== '' &&
          resp.value !== null
        ) {
          address += `${translate('shipping_address.prefix_soi')} ${
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
          (resp.attribute_code === 'house_no' &&
            resp.value !== '' &&
            resp.value !== null) ||
          (resp.attribute_code === 'village_name' &&
            resp.value !== '' &&
            resp.value !== null) ||
          (resp.attribute_code === 'road' &&
            resp.value !== '' &&
            resp.value !== null) ||
          (resp.attribute_code === 'district' &&
            resp.value !== '' &&
            resp.value !== null) ||
          (resp.attribute_code === 'subdistrict' &&
            resp.value !== '' &&
            resp.value !== null)
        ) {
          address += `${resp.value} `;
        }
        if (
          resp.attribute_code === 'remark' &&
          resp.value !== '' &&
          resp.value !== null
        ) {
          remark = resp.value;
        }
      });
      address += `${shippingAddress.region || ''} ${shippingAddress.postcode ||
        ''}`;
    }

    let shippingInfo = {};
    shippingInfo = {
      address: address,
      address_name: addressName,
      remark: remark,
    };

    return shippingInfo;
  };
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  handleClickPayment = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndexPayment } = this.state;
    const newIndex = activeIndexPayment === index ? -1 : index;

    this.setState({ activeIndexPayment: newIndex });
  };

  confirmReorder = async () => {
    this.setState({
      itemsMissingModal: {
        show: false,
        items: [],
      },
    });
  };

  handleTrackClick = url => {
    window.open(url, '_blank');
  };

  handleReorderClick = async orderId => {
    this.setState({
      processedOrderId: orderId,
      loadingReorder: true,
    });
    const { loadingReorder } = this.state;
    const { storeConfig, cart } = this.props;
    const { code: storeCode } = storeConfig;
    const order = this.getOrder();

    const skus = map(get(order, 'items', []), item => get(item, 'sku', ''));
    const { items: products } = await ProductApi.getCatalogServiceBySku({
      storeCode,
      skus,
    });

    const diffItems = countDiffItems(
      map(get(order, 'items', []), item => ({
        ...item,
        qty: get(item, 'qty_ordered', 1),
      })),
      products,
      storeConfig,
      cart,
    );

    let productsToAdd = reduce(
      get(order, 'items', []),
      (acc, item) => {
        const product = find(products, { sku: get(item, 'sku', '') });

        if (!product) return acc;

        return [
          ...acc,
          {
            ...product,
            ...item,
            qty: get(item, 'qty_ordered', 1),
          },
        ];
      },
      [],
    );
    if (!isEmpty(diffItems)) {
      const updateItems = [];
      map(productsToAdd, item => {
        const diffItem = find(diffItems, { sku: get(item, 'sku', '') });
        const findTypeErrorNotAvailable = find(
          get(diffItem, 'error', []),
          val => {
            return (
              val?.text === 'out_of_stock' ||
              val?.text === 'not_available' ||
              val?.text === 'product_disabled'
            );
          },
        );

        if (
          isEmpty(diffItem) ||
          (!isEmpty(diffItem) && isEmpty(findTypeErrorNotAvailable))
        ) {
          updateItems.push(item);
        }
      });

      this.itemsToAdd = reduce(
        updateItems,
        (acc, item) => {
          const diffItem = find(diffItems, { sku: get(item, 'sku', '') });

          if (!diffItem) {
            return acc.concat(item);
          }

          const findTypeErrorNotEnoughQuant = find(
            get(diffItem, 'error', []),
            val => {
              return (
                val?.text === 'not_enough_quant' || val?.text === 'max_qty'
              );
            },
          );

          if (!isEmpty(findTypeErrorNotEnoughQuant)) {
            return acc.concat({
              ...item,
              qty: findTypeErrorNotEnoughQuant?.missingQuantity || 1,
            });
          }

          return acc.concat({
            ...item,
          });
        },
        [],
      );

      productsToAdd = this.itemsToAdd;
    }

    const compareProduct = unionBy(
      productsToAdd,
      get(cart, 'items', []),
      'sku',
    );

    if (checkLimitQty(compareProduct)) {
      this.setState({
        loadingReorder: false,
        modalValidateOpened: true,
        modalValidateMessage: this.props.translate(
          'product.notification.reorder_limit_qty_200',
        ),
        processedOrderId: '',
      });
      return;
    }

    if (!loadingReorder) {
      const response = await this.props.reorderToCart(productsToAdd, diffItems);

      if (size(response?.diffItems) > 0) {
        this.setState({
          itemsMissingModal: {
            show: true,
            items: response.diffItems,
          },
        });
      }

      this.setState({
        processedOrderId: '',
        loadingReorder: false,
      });
    }
  };

  calculateCouponDiscountAmaty() {
    const { extension_attributes } = this.getOrder();
    const { tops_coupon } = extension_attributes;
    let summaryCoupon = 0;

    map(tops_coupon, list => {
      const thisDiscount = list.coupon_amount.replace(/-฿/i, '');
      summaryCoupon += parseFloat(thisDiscount);
    });

    return summaryCoupon;
  }

  renderHeader() {
    const { translate } = this.props;
    const {
      increment_id,
      extension_attributes,
      subtotal_incl_tax,
      discount_amount,
      shipping_incl_tax,
      base_grand_total,
    } = this.getOrder();
    const {
      shipping_date,
      shipping_slot_time,
      shipping_assignments,
      payment_method_label,
    } = extension_attributes;

    const deliveryStatus = extension_attributes.delivery_status || '';
    const { address } = shipping_assignments[0].shipping;
    const shippingAddress = this.renderShippingAddress();
    const currency = translate('order_detail.currency');

    return (
      <div>
        <div className="order-detail-header">
          {this.renderTitle(translate('order_detail.number'), increment_id)}
          {deliveryStatus ? (
            <div className="order-detail-status">
              <span className="status-title">{deliveryStatus}</span>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="order-detail-form">
          <div className="payment-summary-wrap">
            <Accordion className="checkout-page-accordion">
              <Accordion.Title
                className="checkout-page-accordion-title checkout-page-title"
                active={this.state.activeIndexPayment === 1}
                index={1}
                onClick={this.handleClickPayment}
              >
                <Icon className="checkout-page-title__icon chevron down" />
                <Accordion.Title className="checkout-page-title">
                  {translate('order_detail.payment.summary')}
                </Accordion.Title>
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndexPayment === 1}>
                <div className="order-detail-payment">
                  <div className="order-detail-payment-body">
                    <div className="order-detail-payment-detail-bordered">
                      {this.renderLine(
                        translate('order_detail.subtotal'),
                        this.formatPriceWithCurrency(
                          subtotal_incl_tax,
                          currency,
                        ),
                        'order-detail-payment-line',
                      )}
                      {this.renderLine(
                        translate('order_detail.coupon_discount'),
                        this.formatPriceWithCurrency(
                          discount_amount || '0.00',
                          currency,
                        ),
                        'order-detail-payment-line',
                      )}
                      {this.renderLine(
                        translate('order_detail.staff_discount'),
                        this.formatPriceWithCurrency('0.00', currency),
                        'order-detail-payment-line',
                      )}
                      {this.renderLine(
                        translate('order_detail.delivery.fee'),
                        this.formatPriceWithCurrency(
                          shipping_incl_tax || '0.00',
                          currency,
                        ),
                        'order-detail-payment-line',
                      )}
                    </div>
                    <br />
                    <div className="order-detail-payment-detail-bordered grand_total">
                      {this.renderGrandTotal(
                        translate('order_detail.grand_total'),
                        formatPrice(base_grand_total),
                        currency,
                      )}
                    </div>
                    {/* <div className='order-detail-payment-detail'>
                      {this.renderLine(translate("order_detail.estimate_t1c_point"), formatPrice('0'), 'order-detail-payment-line')}
                    </div> */}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion>
          </div>
          <div className="shipping-address-wrap">
            <Accordion className="checkout-page-accordion">
              <Accordion.Title
                className="checkout-page-accordion-title checkout-page-title"
                active={this.state.activeIndex === 1}
                index={1}
                onClick={this.handleClick}
              >
                <Icon className="checkout-page-title__icon chevron down" />
                <Accordion.Title className="checkout-page-title">
                  {get(extension_attributes, 'pickup_store')
                    ? translate('shipping_address.title_pickup')
                    : translate('order_detail.shipping.summary')}
                </Accordion.Title>
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndex === 1}>
                <div className="order-detail-shipping">
                  <div className="order-detail-shipping-body">
                    <div className="order-detail-shipping-detail address">
                      {get(extension_attributes, 'pickup_store') ? (
                        this.renderLineAddress(
                          `${translate(
                            'shipping_address.recipient_address',
                          )} :`,
                          `${shippingAddress.address_name}`,
                          '',
                          'order-detail-shipping-line',
                        )
                      ) : (
                        <React.Fragment>
                          {this.renderLineAddress(
                            `${translate('shipping_address.address')} :`,
                            `${shippingAddress.address_name}`,
                            `${shippingAddress.address}`,
                            'order-detail-shipping-line',
                          )}
                          {this.renderLine(
                            `${translate('shipping_address.landmark')} :`,
                            shippingAddress.remark,
                            'order-detail-shipping-line',
                          )}
                        </React.Fragment>
                      )}
                    </div>
                    <div className="order-detail-shipping-detail delivery">
                      {this.renderLine(
                        `${
                          get(extension_attributes, 'pickup_store')
                            ? translate('shipping_address.recipient_date')
                            : translate('order_detail.delivery.date')
                        } :`,
                        dateFnsFormat(shipping_date, 'DD/MM/YYYY') || '-',
                        'order-detail-shipping-line',
                      )}

                      {this.renderLine(
                        `${
                          get(extension_attributes, 'pickup_store')
                            ? translate('shipping_address.recipient_time')
                            : translate('order_detail.delivery.time')
                        } :`,
                        shipping_slot_time,
                        'order-detail-shipping-line',
                      )}

                      {this.renderLine(
                        `${translate('order_detail.receiver.name')} :`,
                        get(extension_attributes, 'pickup_store')
                          ? get(
                              extension_attributes,
                              'pickup_store.receiver_name',
                              '',
                            )
                          : `${address.firstname} ${address.lastname}`,
                        'order-detail-shipping-line',
                      )}

                      {this.renderLine(
                        `${translate(
                          'order_detail.receiver.contact_number',
                        )} :`,
                        get(extension_attributes, 'pickup_store')
                          ? get(
                              extension_attributes,
                              'pickup_store.receiver_phone',
                              '',
                            )
                          : address.telephone,
                        'order-detail-shipping-line',
                      )}
                      {this.renderLine(
                        `${translate('order_detail.payment.method')} :`,
                        payment_method_label,
                        'order-detail-shipping-line',
                      )}
                    </div>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion>
          </div>
        </div>
      </div>
    );
  }

  getImageUrl = image =>
    `${this.props.storeConfig.base_media_url}/catalog/product${image}`;

  renderDesktop() {
    const { translate, storeConfig } = this.props;
    const orderInfo = this.getOrder();
    const { items } = orderInfo;

    return (
      <React.Fragment>
        <div className="table-title">
          {translate('order_detail.table.products')}
        </div>
        <div className="header">
          <span className="select-items" />
          <span className="details">
            {translate('order_detail.table.details')}
          </span>
          <span className="count">{translate('order_detail.table.count')}</span>
          <span className="unit">{translate('order_detail.table.unit')}</span>
          <span className="price">{translate('order_detail.table.price')}</span>
          <span className="discount">
            {translate('order_detail.table.discount')}
          </span>
          <span className="net-price">
            {translate('order_detail.table.net_price')}
          </span>
        </div>
        {items.map(item => {
          let consumerUnit = get(
            item,
            'consumer_unit',
            translate('order_detail.unit_item'),
          );
          const weightItemInd = item?.weight_item_ind;
          const sellingUnit = get(item, 'selling_unit', consumerUnit);

          if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
            consumerUnit = sellingUnit;
          }

          return (
            <div className="item-row">
              <span className="select-items" />
              <span className="details order-data">
                <Image
                  className="order-img-product"
                  src={`${storeConfig.base_media_url}catalog/product/${item.image}`}
                />
                <p className="order-product-name">{item.name}</p>
              </span>
              <span className="count">{item.qty_ordered}</span>
              <span className="unit">{consumerUnit}</span>
              <span className="price">
                {formatPrice(item.base_price_incl_tax)}
              </span>
              <span className="discount">
                {formatPrice(item.discount_amount || '0.00')}
              </span>
              <span className="net-price green">
                {formatPrice(
                  item.base_price_incl_tax * item.qty_ordered -
                    item.discount_amount,
                )}
              </span>
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  renderMobile() {
    const { translate, storeConfig } = this.props;
    const orderInfo = this.getOrder();
    const { items } = orderInfo;

    return (
      <div className="order-details-table-root">
        <div className="table-title">
          {translate('order_detail.table.products')}
        </div>
        {items.map(item => {
          let consumerUnit = get(
            item,
            'consumer_unit',
            translate('order_detail.unit_item'),
          );
          const weightItemInd = item?.weight_item_ind;
          const sellingUnit = get(item, 'selling_unit', consumerUnit);

          if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
            consumerUnit = sellingUnit;
          }

          return (
            <div className="item-row-mobile">
              <Image
                className="order-img-product"
                src={`${storeConfig.base_media_url}catalog/product/${item.image}`}
              />
              <div className="description">
                <span className="pro-name">{item.name}</span>
                <span>
                  {`${translate('order_detail.table.price')} ${formatPrice(
                    item.base_price_incl_tax,
                  )} ${translate('unit.baht')}`}
                </span>
                <span>
                  {`${translate('order_detail.table.discount')} ${formatPrice(
                    item.discount_amount,
                  ) || '0.00'} ${translate('order_detail.baht')}`}
                </span>
                <span>
                  {translate('order_detail.table.net_price')}{' '}
                  {`${formatPrice(
                    item.base_price_incl_tax * item.qty_ordered -
                      item.discount_amount,
                  )} ${translate('unit.baht')}`}
                </span>
              </div>
              <div className="qty">{`${item.qty_ordered} ${consumerUnit}`}</div>
            </div>
          );
        })}
      </div>
    );
  }

  handleBack = () => {
    this.props.history.push('/order-history');
  };

  render() {
    const { translate, loaded } = this.props;
    const { itemsMissingModal, processedOrderId, loadingReorder } = this.state;
    const order = this.getOrder();
    let deliveryStatus = '';
    if (order && order.extension_attributes) {
      deliveryStatus = order.extension_attributes.delivery_status;
    }

    if (!order) {
      return (
        <Layout>
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.order_detail.title')}
            keywords={translate('meta_tags.order_detail.keywords')}
            description={translate('meta_tags.order_detail.description')}
          />
          <Tabbar />
        </Layout>
      );
    }

    return (
      <Layout
        title={order.increment_id}
        description={deliveryStatus}
        onHandleBack={this.handleBack}
        backLabelButton={translate('order_history.order_history')}
      >
        <MetaTags
          canonicalUrl={fullpathUrl(this.props.location)}
          title={translate('meta_tags.order_detail.title')}
          keywords={translate('meta_tags.order_detail.keywords')}
          description={translate('meta_tags.order_detail.description')}
        />
        <Tabbar />
        {this.renderBreadcrumbs()}
        <div className="order-detail-wrap">
          {this.renderHeader()}
          <div className="order-details-table-root">
            <div className="pro-list-desktop">{this.renderDesktop()}</div>
            <div className="pro-list-mobile">{this.renderMobile()}</div>
            <OrderDetailButtonFooter
              orderId={this.props.match.params.id}
              loadingReorder={
                (processedOrderId === this.props.match.params.id && !loaded) ||
                loadingReorder
              }
              orderTracking={
                order?.extension_attributes?.tracking_info?.length > 0 &&
                validURL(
                  order?.extension_attributes?.tracking_info[0]?.track_link,
                )
              }
              handleTrackClick={() =>
                this.handleTrackClick(
                  order?.extension_attributes?.tracking_info[0]?.track_link,
                )
              }
              handleReorderClick={() =>
                this.handleReorderClick(this.props.match.params.id)
              }
            />
          </div>
        </div>

        <OrderLimitQtyModal
          visible={this.state.modalValidateOpened}
          message={this.state.modalValidateMessage}
          onModalClose={() =>
            this.setState({
              modalValidateOpened: false,
              modalValidateMessage: '',
            })
          }
        />

        <CartItemsDifferentModal
          open={itemsMissingModal.show}
          products={itemsMissingModal.items}
          handleTransferCart={() => this.confirmReorder()}
        />
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order.item,
  customer: state.customer.items,
  storeConfig: state.storeConfig.current,
  loaded: state.cart.loaded,
  cart: state.cart.cart,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getOrder: fetchOrder,
      reorderToCart,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
