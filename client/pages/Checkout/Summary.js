import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get as prop, merge, map, filter, find, isEmpty } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import { PoseGroup } from 'react-pose';
import {
  Form,
  CartSummary,
  Grid,
  Input,
  Button,
  Loader,
  Label,
  PopupMessage,
  Image,
  Radio,
} from '../../magenta-ui';
import { createOrder } from '../../reducers/checkout';
import { putCoupon, deleteCoupon } from '../../reducers/cart';
import { formatPriceWithLocale as formatPrice } from '../../utils/price';
import {
  langSelector,
  getCustomerSelector,
  getOneCardMembershipIdFromCustomer,
} from '../../selectors';
import { findIsNyb } from '../../features/nyb';
import { ImageBackground } from '../../components/ImageBackground';
import { Paragraph, Text, Span } from '../../components/Typography';
import './Checkout.scss';
import { findNyb, fetchDiscountType } from '../../features/nyb/redux';

const formatNumber = number => (number ? new Intl.NumberFormat('th-TH').format(number) : 0);
const FlexCenter = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 250px;
`;
class Summary extends PureComponent {
  state = {
    coupon: '',
    couponErr: '',
    showInputCoupon: false,
  };

  static propTypes = {
    payment: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
    checkoutLoading: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    applyCouponLoading: PropTypes.bool.isRequired,
    deleteCouponLoading: PropTypes.bool.isRequired,
    paymentMethod: PropTypes.string,
    createOrder: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    cart: PropTypes.object.isRequired,
    steps: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    gtmClasses: PropTypes.string,
    stepNum: PropTypes.number.isRequired,
    onRadioChange: PropTypes.func.isRequired,
    nyb: PropTypes.shape({
      voucherLoading: PropTypes.bool,
      voucher: PropTypes.number,
      voucherError: PropTypes.string,
    }).isRequired,
    fetchDiscountType: PropTypes.func.isRequired,
    cartTotals: PropTypes.object,
    loadedTotals: PropTypes.bool,
    btnConfirmDisable: PropTypes.bool,
  };

  static defaultProps = {
    paymentMethod: '',
    payment: [],
    gtmClasses: '',
    cartTotals: {},
    loadedTotals: false,
    btnConfirmDisable: false,
  };

  componentWillMount() {
    if (this.props.cartTotals) {
      this.pushGoogleTagManagerData();
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.fetchDiscountType();
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cartTotals && !this.props.cartTotals) {
      this.pushGoogleTagManagerData(nextProps);
    }
  }

  pushGoogleTagManagerData(props = this.props) {
    const totals = props.cartTotals;
    const couponDiscount = this.calculateCouponDiscountAmaty(props);
    const value = totals.subtotal_incl_tax - (-totals.discount_amount - couponDiscount);

    if (!isEmpty(value)) {
      dataLayer.push({
        event: 'begin_checkout',
        value,
      });
    }
  }

  handleShowInputCoupon = () => {
    this.setState({
      showInputCoupon: true,
    });
  };

  handleApplyCoupon = () => {
    const { translate } = this.props;

    if (this.state.coupon) {
      const couponResp = this.props.putCoupon(this.state.coupon);

      couponResp.then(resp => {
        if (prop(resp.data, 'message')) {
          let errorMsg = resp.data.message;
          if (errorMsg === 'Coupon code is not valid') {
            errorMsg = translate('errors.coupons.is_valid');
          }
          if (errorMsg === 'This coupon is used.') {
            errorMsg = translate('errors.coupons.is_used');
          }
          if (errorMsg === 'can not apply it.') {
            errorMsg = translate('errors.coupons.not_apply');
          }

          this.setState({
            couponErr: errorMsg,
          });
        } else {
          this.setState({
            couponErr: '',
            coupon: '',
          });
        }
      });
    }
  };

  renderPopup() {
    if (typeof document === 'undefined') {
      return null;
    }

    return (
      <PopupMessage
        className="mt-popup-summary-confrim"
        lang={this.props.lang}
        open={!!this.state.popupMessage}
        onCancel={this.handleCancelPopup}
        onConfirm={this.handleConfirmPopup}
      >
        {this.state.popupMessage}
      </PopupMessage>
    );
  }

  handleConfirmPopup = () => {
    this.handleCancelPopup();
    this.props.deleteCoupon(this.state.couponCode);
  };

  handleCancelPopup = () => this.setState({ couponCode: null, popupMessage: null });

  handleDeleteCoupon = couponCode => {
    if (couponCode) {
      this.setState({
        couponCode: couponCode,
        popupMessage: (
          <span className="confirm_item_deletion_message">
            <span>{this.props.translate('summary.confirm_coupon_deletion')}</span>
            <span className="name"> {`"${couponCode}"`}</span>?
          </span>
        ),
      });
    }
  };

  handleRef = c => {
    this.inputRef = c;
  };

  clearInputCouponCode = () => {
    this.inputRef.focus();
    this.setState({ coupon: '' });
  };

  renderHelper = () => {
    const { translate } = this.props;
    return (
      <Fragment>
        <Paragraph style={{ margin: 0 }} color="#808080" size={12}>
          {translate('nyb.helper_1')}
        </Paragraph>
        <Paragraph style={{ margin: 0 }} color="#808080" size={12}>
          {translate('nyb.helper_2')}
        </Paragraph>
      </Fragment>
    );
  };

  renderHeader = stepNum => {
    const { translate, nyb } = this.props;
    switch (stepNum) {
      case 1:
        return nyb.discountType.length > 0 ? (
          <Paragraph padding="10px 0">
            <label className="mt-cartsummary-title">
              {translate('nyb.form.typeof_discount')}
            </label>
          </Paragraph>
        ) : null;
      case 2:
        return nyb.voucher > 0 ? (
          <Paragraph padding="10px 0">
            <label className="mt-cartsummary-title">{translate('nyb.header_step_2')}</label>
          </Paragraph>
        ) : null;
      default:
        return null;
    }
  };

  renderNybForm = () => {
    const { translate, stepNum, onRadioChange, nyb } = this.props;
    const { discountType } = nyb.voucherForm;
    const isVoucher = nyb.discountType.some(item => item.type === 'voucher');
    const isOnTop = nyb.discountType.some(item => item.type === 'ontop');
    return (
      <Fragment>
        {this.renderHeader(stepNum)}
        {stepNum === 1 && nyb.discountTypeLoading && (
          <Paragraph padding="20px">
            <Loader active inline="centered" />
          </Paragraph>
        )}
        {stepNum === 1 && !nyb.discountTypeLoading && (
          <Form>
            {isOnTop && (
              <FlexRow>
                <Form.Field
                  name="discount_type"
                  control={Radio}
                  value="ontop"
                  checked={discountType === 'ontop'}
                  onChange={onRadioChange}
                />
                <Text
                  size={14}
                  style={{ marginLeft: 10 }}
                  color={discountType === 'ontop' ? '#007a33' : '#333'}
                >
                  {translate('nyb.form.gift_coupon')}{' '}
                  {translate('nyb.form.gift_voucher_hint') !== '.' && (
                    <Span color="#808080" size={9}>
                      {translate('nyb.form.gift_coupon_hint')}
                    </Span>
                  )}
                </Text>
              </FlexRow>
            )}
            {isVoucher && (
              <FlexRow>
                <Form.Field
                  name="discount_type"
                  control={Radio}
                  value="voucher"
                  checked={discountType === 'voucher'}
                  onChange={onRadioChange}
                />
                <Text
                  size={14}
                  style={{ marginLeft: 10 }}
                  color={discountType === 'voucher' ? '#007a33' : '#333'}
                >
                  {translate('nyb.form.gift_voucher')}{' '}
                  {translate('nyb.form.gift_voucher_hint') !== '.' && (
                    <Span color="#808080" size={9}>
                      {translate('nyb.form.gift_voucher_hint')}
                    </Span>
                  )}
                </Text>
              </FlexRow>
            )}
          </Form>
        )}
        <FlexCenter>
          <PoseGroup>
            {nyb.voucher !== 0 && (
              <ImageBackground
                key="card"
                src="/assets/images/gift_voucher_card.png"
                size={['220px', '110px']}
                margin="15px 0"
                padding="15px"
              >
                {nyb.voucherLoading ? (
                  <Paragraph style={{ marginTop: 25 }}>
                    <Loader active inline="centered" />
                  </Paragraph>
                ) : (
                  <Fragment>
                    {!nyb.voucherError && (
                      <Fragment>
                        <Text
                          size={10}
                          align="center"
                          color="#808080"
                          style={{ margin: 10, marginLeft: 50 }}
                        >
                          GIFT VOUCHER
                        </Text>
                        <Text
                          size={26}
                          align="center"
                          color="#a90006"
                          style={{ marginLeft: 25 }}
                        >
                          {formatNumber(nyb.voucher)}.-
                        </Text>
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </ImageBackground>
            )}
          </PoseGroup>
        </FlexCenter>
        {nyb.voucherError && (
          <Paragraph align="center" color="red">
            <div>{translate('common.data_not_load')}</div>
          </Paragraph>
        )}
      </Fragment>
    );
  };

  renderCoupon = () => {
    const { translate, applyCouponLoading, cartTotals, deleteCouponLoading } = this.props;

    const couponObj = find(prop(cartTotals, 'total_segments'), segment => {
      return segment.code === 'amasty_coupon_amount';
    });

    const couponList = couponObj.value;

    const couponsCode = [];
    map(couponList, list => {
      const couponJson = JSON.parse(list);
      couponsCode.push(couponJson.coupon_code);
    });

    return (
      <Grid className="section-coupon">
        <Grid.Row>
          <label className="mt-cartsummary-title-coupon">{translate('coupon.title')}</label>
          <Label
            onClick={this.handleShowInputCoupon}
            className={`show-coupon-input ${this.state.showInputCoupon ? 'hidden' : ''}`}
            as="a"
          >
            <Image src="/assets/icons/create-icon.png" />
            <span>{translate('coupon.enter_coupon_code')}</span>
          </Label>
          <div
            className={`mt-cartsummary-coupon ${!this.state.showInputCoupon ? 'hidden' : ''}`}
          >
            <label className="mt-cartsummary-coupon-item">
              {translate('coupon.please_enter_coupon')}
            </label>
            {/* <label className="mt-cartsummary-coupon-item">
              {translate('coupon.choice')}
            </label> */}
            <Input
              ref={this.handleRef}
              disabled={applyCouponLoading}
              className="coupon-input"
              name="coupon_code"
              icon={
                <Button
                  as="a"
                  onClick={() => this.clearInputCouponCode()}
                  className={`icon-clear-text ${!this.state.coupon ? 'hidden' : ''}`}
                  icon="remove circle"
                />
              }
              action={
                <Button loading={applyCouponLoading} onClick={this.handleApplyCoupon}>
                  {translate('coupon.button')}
                </Button>
              }
              onChange={e => {
                this.setState({
                  coupon: e.target.value,
                  couponErr: '',
                });
              }}
              value={this.state.coupon}
            />
          </div>
          {this.state.couponErr ? (
            <span className="coupon-error">{this.state.couponErr}</span>
          ) : (
            ''
          )}
        </Grid.Row>
        {/* <Grid.Row>
          <label className={`mt-cartsummary-title-coupon t1c`}>
            {translate('coupon.t1c.title')}
          </label>
          <Input className="coupon-input" action={<Button onClick={this.handleApplyCoupon}>{translate('coupon.button')}</Button>} />
          <span class="coupon-error">{this.state.couponT1CErr}</span>
        </Grid.Row> */}
        {couponsCode.length > 0 ? (
          <Grid.Row className="row-use-coupon">
            <label className="coupon-item">{translate('coupon.row_coupon-title')}</label>
            <Grid.Row className="row-coupon">
              {couponsCode.map((value, key) => {
                return (
                  <Button
                    disabled={deleteCouponLoading}
                    className="items-coupon"
                    as="div"
                    labelPosition="left"
                  >
                    <Label className="label-coupon" as="a" basic>
                      {value}
                    </Label>
                    <Button
                      className="button-remove-coupon"
                      onClick={() => this.handleDeleteCoupon(value)}
                      icon
                    >
                      {/* <Icon name='remove' /> */}
                      <Image src="/assets/icons/mini-close.svg" />
                    </Button>
                  </Button>
                );
              })}
            </Grid.Row>
          </Grid.Row>
        ) : (
          ''
        )}
      </Grid>
    );
  };

  calculateCouponDiscount(props = this.props) {
    const { cartTotals } = props;
    const productItems = prop(cartTotals, 'items');
    const allSaleRule = [];
    const allowCouponCode = ['CPN2', 'CPN9'];
    let discountTotal = 0;

    if (!productItems) {
      return 0;
    }

    map(productItems, item => {
      const saleRule = prop(item, 'extension_attributes.sales_rules');
      merge(allSaleRule, saleRule);
    });

    const allRule = filter(allSaleRule, rule => {
      return allowCouponCode.includes(rule.description);
    });

    allRule.map(rule => {
      discountTotal += rule.discount_amount;
    });

    return discountTotal;
  }

  calculateCouponDiscountAmaty(props = this.props) {
    const { cartTotals } = props;
    const isNyb =
      prop(cartTotals, 'extension_attributes.product_attribute_restriction') === 'is_nyb';
    if (isNyb) {
      const coupon = prop(cartTotals, 'discount_amount');
      return Math.abs(coupon);
    }
    const couponObj = find(prop(cartTotals, 'total_segments'), segment => {
      return segment.code === 'amasty_coupon_amount';
    });

    if (!couponObj) {
      return 0;
    }

    const couponList = couponObj.value;
    let summaryCoupon = 0;

    map(couponList, list => {
      const couponJson = JSON.parse(list);
      const thisDiscount = couponJson.coupon_amount.replace(/-฿|-\u0e3f|,/g, '');
      summaryCoupon += parseFloat(thisDiscount);
    });

    return summaryCoupon;
  }

  render() {
    const {
      translate,
      checkoutLoading,
      onConfirm,
      lang,
      steps,
      cart,
      isDisabled,
      loaded,
      storeCard,
      creditCardForm,
      paymentMethod,
      customer,
      gtmClasses,
      stepNum,
      loading,
      nyb,
      cartTotals,
      loadedTotals,
      btnConfirmDisable,
    } = this.props;
    const { discountType } = nyb.voucherForm;
    const totals = cartTotals;
    if (!totals) {
      return null;
    }
    const couponDiscount = this.calculateCouponDiscountAmaty();
    const t1cEarn = Math.floor(prop(cart, 'extension_attributes.estimate_t1c_point', 0));
    const isNyb = prop(cart, 'items', []).every(product => findIsNyb(product));
    const summary = [
      {
        title: translate('summary.subtotal'),
        price: (
          <NumberFormat
            value={formatPrice(
              totals.subtotal_incl_tax - (-totals.discount_amount - couponDiscount),
            )}
            displayType="text"
            thousandSeparator
          />
        ),
        unit: translate('unit.baht'),
        type: 'summary',
      },
      {
        title: translate(isNyb ? 'summary.cash_discount' : 'summary.discount'),
        price: (
          <NumberFormat
            value={formatPrice(couponDiscount)}
            displayType="text"
            thousandSeparator
          />
        ),
        unit: translate('unit.baht'),
        type: 'summary',
      },
      {
        title: translate('summary.discount_staff'),
        price: '0.00',
        unit: translate('unit.baht'),
        type: 'summary',
      },
      {
        title: translate('summary.delivery_fee'),
        price: (
          <NumberFormat
            value={formatPrice(totals.shipping_incl_tax)}
            displayType="text"
            thousandSeparator
          />
        ),
        unit: translate('unit.baht'),
        type: 'summary',
      },
      {
        type: 'divider',
      },
      {
        title: translate('summary.grand_total'),
        price: (
          <NumberFormat
            className="grand_total"
            value={formatPrice(totals.base_grand_total)}
            displayType="text"
            thousandSeparator
          />
        ),
        unit: translate('unit.baht'),
        type: 'summary',
        className: 'total',
      },
      {
        type: 'divider',
      },
    ];

    if (!isEmpty(getOneCardMembershipIdFromCustomer(customer)) && !isNyb) {
      summary.push({
        title: translate('summary.t1c_earn'),
        price: <NumberFormat value={t1cEarn} displayType="text" thousandSeparator />,
        unit: translate('unit.point'),
        type: 'summary',
      });
    }

    let checkDisabled = false;
    if (isDisabled) {
      checkDisabled = true;
    }
    if (!loaded) {
      checkDisabled = true;
    }
    if (!discountType && (isNyb && nyb.discountType.length > 0)) {
      checkDisabled = true;
    }
    if (paymentMethod === 'fullpayment') {
      if (storeCard.length > 0) {
        if (prop(creditCardForm, 'values', null)) {
          if (creditCardForm.values.cc_store_card) {
            checkDisabled = false;
          } else if (creditCardForm.values.cc_card_no !== '') {
            checkDisabled = false;
          } else {
            checkDisabled = true;
          }
        }
      }
    }

    return (
      <div className="checkout-summary-content">
        <CartSummary
          isFetching={!loadedTotals || nyb.discountTypeLoading}
          wrapperClassName="checkout-summary-wrapper"
          className={`checkout-summary ${gtmClasses}`}
          title={translate('summary.title')}
          backBtnText={translate('checkout.steps.checklist.back')}
          confirmBtnText={translate('summary.button')}
          confirmBtnIcon="/assets/icons/shape.png"
          onCreateOrder={onConfirm}
          loading={checkoutLoading}
          disabled={checkDisabled}
          listItems={summary}
          lang={lang}
          btnConfirmDisable={btnConfirmDisable}
          componentHelper={stepNum === 1 && isNyb ? this.renderHelper() : null}
          componentCoupon={
            steps !== this.props.translate('checkout.steps.payment.name') && !isNyb
              ? this.renderCoupon()
              : ''
          }
          componentNyb={isNyb ? this.renderNybForm() : null}
        />
        {this.renderPopup()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  lang: langSelector(state),
  customer: getCustomerSelector(state),
  payment: state.checkout.payment,
  cart: state.cart.cart,
  loaded: state.cart.loaded,
  loading: state.checkout.loading,
  checkoutLoading: state.checkout.checkoutLoading,
  applyCouponLoading: state.cart.applyCouponLoading,
  deleteCouponLoading: state.cart.deleteCouponLoading,
  isDisabled: state.cart.isDisabled,
  translate: getTranslate(state.locale),
  paymentMethod: state.checkout.paymentMethod,
  storeCard: state.checkout.storeCard,
  creditCardForm: state.form.creditCardForm,
  nyb: findNyb(state),
  cartTotals: state.cart.cartTotals,
  loadedTotals: state.cart.loadedTotals,
});

const mapDispatchToProps = dispatch => ({
  createOrder: (userToken, paymentMethod) => dispatch(createOrder(userToken, paymentMethod)),
  putCoupon: coupon => dispatch(putCoupon(coupon)),
  deleteCoupon: coupon => dispatch(deleteCoupon(coupon)),
  fetchDiscountType: () => dispatch(fetchDiscountType()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Summary);
