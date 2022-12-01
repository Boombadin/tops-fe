import {
  breakpoint,
  Button,
  Col,
  Container,
  FullScreenLoading,
  HideMobile,
  Icon,
  Margin,
  Modal,
  Row,
  Text,
} from '@central-tech/core-ui';
import { filter, find, get, isEmpty, size, some } from 'lodash';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Sticky, StickyContainer } from 'react-sticky';
import styled from 'styled-components';

import PromoBundleModal from '@client/components/PromoBundleModal';
import { hitTimeStamp } from '@client/constants/hitTimeStamp';
import Coupon from '@client/features/campaign/Coupon';
import CartContainer from '@client/features/cart/CartContainer';
import CheckoutHeader from '@client/features/checkout/components/CheckoutHeader';
import CheckoutSummary from '@client/features/checkout/components/CheckoutSummary';
import DeliveryForm from '@client/features/checkout/components/DeliveryForm';
import ShowMoreItem from '@client/features/checkout/components/ShowMoreItem';
import {
  getBillingAddress,
  getCheckoutSummary,
  sumCartRowBundleItems,
  sumItemsInCart,
} from '@client/features/checkout/utils';
import { ProductListPriceInclTax } from '@client/features/gtm/models/Product';
import CartItemsDifferentModal from '@client/features/modal/CartItemsDifferentModal';
import withCartContext from '@client/hoc/withCartContext';
import withCustomer from '@client/hoc/withCustomer';
import withFirebaseContext from '@client/hoc/withFirebaseContext';
import withLocales from '@client/hoc/withLocales';
import withStoreLocator from '@client/hoc/withStoreLocator';
import {
  fetchCart,
  fetchCartProducts,
  transferCart,
  updateDiffCartItems,
} from '@client/reducers/cart';
import {
  deleteDeliverySlot,
  setValidCheckout,
  validateDeliverySlot,
} from '@client/reducers/checkout';
import { fullPageLoading } from '@client/reducers/layout';
import { closePromoBundleModal } from '@client/reducers/promoBundle';
import {
  getCustomerSelector,
  getShippingAddressesSelector,
  isCartLoadedSelector,
  langSelector,
} from '@client/selectors';
import { getCookie, isLoggedIn } from '@client/utils/cookie';
import { countDiffItems } from '@client/utils/diffItemCheck';
import { getQueryParam } from '@client/utils/url';

const ContentCol = styled(Col)`
  min-width: 0;
`;
const CheckoutCartContainer = styled.div`
  background: #fff;
  border: 1px solid #cccccc;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  position: relative;

  ${props =>
    !props.isShowMore &&
    `max-height: 600px;
      overflow: hidden;`}

  ${breakpoint('xs', 'md')`
    border-radius: 0 0 5px 5px;
    border-top: none;

    ${props => !props.isShowMore && `max-height: 500px;`}
  `}
`;
const CheckoutShippingContainer = styled.div`
  background: #fff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  height: auto;

  ${breakpoint('xs', 'md')`
    display: none;

    ${props =>
      props.isMobileShow &&
      `
      display: block;
    `}
  `}
`;
const CheckoutSummaryContainer = styled.div`
  border: 1px solid #cccccc;
  border-radius: 5px;
  ${breakpoint('xs', 'md')`
    position: fixed;
    bottom: 0;
    width: 100%
    border: none;
    border-radius: 0;
    background: #f7f7f7
  `}
`;
const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Show = styled.div`
  display: none;
  ${props => breakpoint(props.from, props.to)`
    display: block;
  `}
`;
const BackButton = styled(Text)`
  width: 150px;
`;
const SubmitButton = styled(Button)`
  line-height: 0;

  ${props =>
    props.disabled &&
    `
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`;
const CouponContainer = styled.div`
  border: 1px solid #cccccc;
  border-top: 1px dashed #cccccc;
  border-radius: 0 0 5px 5px;
  background: #fff;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  max-width: 690px;
  width: 100%;
  min-height: 300px;
  border-radius: 5px;
  padding: 19px 30px 20px 40px;
  text-align: center;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
  ${breakpoint('xs', 'md')`
    width: 90%;
    min-height: 250px;
  `}
`;

const ModalContentText = styled.div``;
const ChcekoutHeaderWrap = styled.div`
  z-index: 1;
`;
const SeasonalRemark = styled.div`
  width: 100%;
  border-radius: 5px;
  border: solid 1px #80bd00;
  background-color: #eff4e6;
  padding: 8px 13px;
  margin-bottom: 10px;

  font-size: 13px;
  color: #666666;
  ${breakpoint('xs', 'md')`
    width: auto;
    margin: 19px 18px 18px 19px;
    font-size: 12px;
  `}
`;
const SeasonalRemarkText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 5;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  ${breakpoint('xs', 'md')`
    white-space: normal;
    display: -webkit-box;
    line-clamp: 6;
    -webkit-line-clamp: 6;
  `}
`;
@withCustomer
@withStoreLocator
@withCartContext
@withFirebaseContext
class CheckoutContainer extends PureComponent {
  state = {
    step: 1,
    showMore: false,
    shippingMethod: 'mds',
    itemsMissingModal: {
      show: false,
      items: [],
      isConfirm: false,
    },
    cartTransfer: false,
    isRequestTax: false,
    modalValidateSlotOpened: false,
    modalValidateSlotMessage: '',
    loading: false,
    remark: '',
  };

  componentDidMount() {
    const cartId = this.props.cart.id;
    this.virtualPageView();
    if (cartId) {
      this.props.fetchCart(true, true);
      this.checkoutValifyItem();
    }
    this.props.setValidCheckout(true);
    const step = Number(getQueryParam('step'));
    if (step) {
      this.setState({ step: step });
    }
    this.virtualPageView();
  }

  componentDidUpdate = async prevProps => {
    const { cart, firestoreAction } = this.props;
    const seasonalItem = find(
      cart?.items,
      item => item?.is_seasonal === 'Is Seasonal',
    );
    if (seasonalItem && this.state.remark === '') {
      const fireStoreData = await firestoreAction.getSeasonalConfig();
      this.setState({
        remark: fireStoreData?.remark,
      });
    }

    if (typeof prevProps.cart.id === 'undefined' && this.props.cart.id) {
      this.checkoutValifyItem();
    }
  };

  virtualPageView() {
    dataLayer.push({
      event: 'vpv',
      provider: !isEmpty(getCookie('provider')) ? getCookie('provider') : 'web',
      customer_id: get(this.props.customer, 'id', ''),
      email: get(this.props.customer, 'email', ''),
      page: {
        pagePath: this.props.location.pathname,
        pageTitle: 'Cart',
        pageLang: this.props.lang,
        pageType: 'cart',
      },
    });
  }

  checkoutValifyItem = async () => {
    const { cart, storeConfig } = this.props;
    const cartItems = get(cart, 'items', []);
    const { items: newCartProducts } = await this.props.fetchCartProducts();
    const diffItems = countDiffItems(cartItems, newCartProducts, storeConfig);
    const notShowPriceChange = filter(diffItems, item => {
      const findTypeErrorIgnorePriceChanged = find(
        get(item, 'error', []),
        val => {
          return val?.text !== 'price_changed';
        },
      );
      return !isEmpty(findTypeErrorIgnorePriceChanged);
    });
    if (!isEmpty(diffItems) && size(notShowPriceChange) > 0) {
      this.setState({
        itemsMissingModal: {
          items: notShowPriceChange,
          show: true,
          isConfirm: false,
        },
      });
    }
  };

  handleTransferCart = async () => {
    const { storeConfig } = this.props;
    const cartId = this.props.cart.id;

    if (!this.state.itemsMissingModal.isConfirm) {
      await this.props.updateDiffCartItems(this.state.itemsMissingModal.items);
    } else {
      this.setState({
        cartTransfer: true,
      });

      await this.props.transferCart({ storeCode: storeConfig.code });

      this.setState({
        cartTransfer: false,
      });

      if (cartId) {
        this.props.fetchCart(true, true);
      }
    }

    this.setState({
      itemsMissingModal: {
        show: false,
        items: [],
        isConfirm: false,
      },
    });
  };

  handleShippingMethod = method => {
    this.setState({
      shippingMethod: method,
    });
  };

  handleMobileClick = async () => {
    const { step } = this.state;
    if (step === 1) {
      this.setState({
        step: 2,
      });
    } else if (step === 2) {
      const countItems = sumItemsInCart(this.props.cart.items);
      if (countItems > 199) {
        alert(
          this.props.translate('multi_checkout.notification.limit_qty_200'),
        );
      } else {
        await this.validateTimeSlot();
      }
    }
  };

  handleClick = async () => {
    const countItems = sumItemsInCart(this.props.cart.items);
    if (countItems > 199) {
      alert(this.props.translate('multi_checkout.notification.limit_qty_200'));
    } else {
      await this.validateTimeSlot();
    }
  };

  validateTimeSlot = async () => {
    const { cart, translate } = this.props;
    this.setState({
      loading: true,
    });

    if (get(cart, 'extension_attributes.shipping_slot_id')) {
      const response = await this.props.validateDeliverySlot();
      if (response.data) {
        if (get(response.data, 'message')) {
          this.setState({
            modalValidateSlotOpened: true,
            modalValidateSlotMessage: translate(
              'timeslot.tab.slot_not_available',
            ),
          });
        } else {
          const { history } = this.props;
          // GTM
          dataLayer.push({
            event: 'eec.Checkout',
            ecommerce: {
              checkout: {
                actionField: {
                  step: 1,
                  option: get(
                    cart,
                    'extension_attributes.shipping_assignments[0].shipping.method',
                    '',
                  ),
                },
                products: ProductListPriceInclTax(cart.items),
              },
            },
            hit_timestamp: hitTimeStamp,
          });
          history.push(
            `/checkout/payment?shipping_method=${this.state.shippingMethod}&request_tax=${this.state.isRequestTax}`,
          );
        }
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          modalValidateSlotOpened: true,
          modalValidateSlotMessage: translate(
            'timeslot.tab.slot_not_available',
          ),
        });
        // this.handleDeleteDeliverySlot();
        this.setState({
          loading: false,
        });
      }
    } else {
      alert(translate('timeslot.tab.header_subtext'));
      this.setState({
        loading: false,
      });
    }
  };

  handleClickBack = async () => {
    const { step } = this.state;
    const { history } = this.props;

    if (step === 1) {
      history.push('/');
    } else {
      this.setState({
        step: 1,
      });
    }
  };

  handleShowMore = () => {
    this.setState({
      showMore: !this.state.showMore,
    });
  };

  renderMobileBackText = () => {
    const { step } = this.state;
    const { translate } = this.props;
    if (step === 1) {
      return translate('multi_checkout.mobile_header.cart_item');
    } else if (step === 2) {
      return translate('multi_checkout.mobile_header.shipping_detail');
    }
  };

  handleTaxRequest = isRequestTax => {
    this.setState({
      isRequestTax: isRequestTax,
    });
  };

  handleDeleteDeliverySlot = () => {
    const { cart } = this.props;
    this.props.deleteDeliverySlot(get(cart, 'id'));
  };

  renderModal() {
    const { modalValidateSlotOpened, modalValidateSlotMessage } = this.state;
    return (
      <Modal
        visible={modalValidateSlotOpened}
        onModalClose={() =>
          this.setState({
            modalValidateSlotOpened: false,
            modalValidateSlotMessage: '',
          })
        }
      >
        <ModalContent>
          <ModalContentText>
            {modalValidateSlotMessage}
            <Margin xs="20px 0 0">
              <Modal.Close>
                <Button height={30} size={13} radius="4px" color="danger">
                  Close
                </Button>
              </Modal.Close>
            </Margin>
          </ModalContentText>
        </ModalContent>
      </Modal>
    );
  }

  render() {
    const {
      cart,
      cartAction,
      cartTotals,
      lang,
      translate,
      isCartLoaded,
      loadingCartProduct,
      isValidCheckout,
      promoOpen,
      closePromoBundleModal,
      currentShipping,
      itemsExcludeBundle,
      itemsBundle,
      isDeliverySlot,
      clearShipping,
    } = this.props;
    const { step, remark } = this.state;
    const seasonalItem = find(
      cart?.items,
      item => item?.is_seasonal === 'Is Seasonal',
    );
    const remarkText = lang === 'th_TH' ? remark?.th?.cart : remark?.en?.cart;
    const billingAddress = getBillingAddress(cart, lang);
    const checkoutSmmary = getCheckoutSummary(cart, cartTotals);
    const shippingAddress = currentShipping;
    const countRowItems =
      sumCartRowBundleItems(itemsBundle) + size(itemsExcludeBundle);
    if (!isLoggedIn() && isEmpty(this.props.customer)) {
      this.props.history.push('/');
      return '';
    }
    return (
      <Fragment>
        {this.renderModal()}
        <StickyContainer>
          <Sticky>
            {({ style }) => (
              <ChcekoutHeaderWrap style={style}>
                <CheckoutHeader
                  step={step}
                  onDeleteAll={cartAction.deleteCart}
                  handleClickBack={this.handleClickBack}
                  backText={this.renderMobileBackText()}
                  lang={lang}
                />
              </ChcekoutHeaderWrap>
            )}
          </Sticky>
          <Container>
            <Row>
              <ContentCol xs={12} md={9} xl="auto">
                <Margin xs="0 0 210px 0" md="24px 20px 20px 0">
                  {step === 1 && get(cart, 'is_active', false) === true && (
                    <Fragment>
                      {seasonalItem && remarkText && (
                        <SeasonalRemark>
                          <SeasonalRemarkText>{remarkText}</SeasonalRemarkText>
                        </SeasonalRemark>
                      )}

                      <CheckoutCartContainer
                        id="cart_container"
                        isShowMore={this.state.showMore}
                      >
                        <CartContainer />
                        {countRowItems >= 5 && (
                          <ShowMoreItem
                            showMore={this.state.showMore}
                            handleShowMore={this.handleShowMore}
                          />
                        )}
                      </CheckoutCartContainer>
                      {countRowItems > 0 && (
                        <CouponContainer>
                          <Coupon cartTotals={cartTotals} />
                        </CouponContainer>
                      )}
                    </Fragment>
                  )}
                  <div className="insider-sr-cart"></div>
                  <Margin xs="20px 0 0 0" md="40px 0 0 0" />
                  {countRowItems > 0 && (
                    <CheckoutShippingContainer isMobileShow={step === 2}>
                      {get(cart, 'is_active', false) === true && (
                        <DeliveryForm
                          shippingAddress={shippingAddress}
                          billingAddress={billingAddress}
                          cart={cart}
                          onTaxRequestChange={this.handleTaxRequest}
                          onDeleteDeliverySlot={this.handleDeleteDeliverySlot}
                        />
                      )}
                      <HideMobile>
                        <Margin md="20px">
                          <ButtonWrap>
                            <BackButton
                              align="center"
                              as="a"
                              href="/"
                              size={13}
                            >
                              {translate('button.continue_shopping')}
                            </BackButton>
                            <SubmitButton
                              size={13}
                              color={
                                isCartLoaded &&
                                isValidCheckout &&
                                isDeliverySlot &&
                                !clearShipping &&
                                !isEmpty(get(cart, 'items'))
                                  ? 'success'
                                  : '#cccccc'
                              }
                              radius="4px"
                              padding="8px 10px"
                              height={40}
                              width={190}
                              disabled={
                                !isValidCheckout ||
                                !isDeliverySlot ||
                                clearShipping ||
                                isEmpty(get(cart, 'items'))
                              }
                              onClick={this.handleClick}
                            >
                              {translate(
                                'multi_checkout.summary.btn_goto_payment',
                              )}
                              <Icon
                                src="/assets/icons/round-arrow-forward-white.svg"
                                style={{ marginLeft: 5 }}
                                height={13}
                              />
                            </SubmitButton>
                          </ButtonWrap>
                        </Margin>
                      </HideMobile>
                    </CheckoutShippingContainer>
                  )}
                </Margin>
              </ContentCol>
              <Col xs={12} md={3} xl="280px">
                <Margin xs="6px 0 0 0" md="24px 0 20px 0">
                  {get(cart, 'is_active', false) === true && (
                    <Show from="md">
                      <Sticky>
                        {({ style, isSticky }) => (
                          <CheckoutSummaryContainer
                            style={{
                              ...style,
                              marginTop: isSticky ? 114 : 0,
                            }}
                          >
                            <CheckoutSummary
                              countRowItems={countRowItems}
                              shipAddress={currentShipping}
                              summary={checkoutSmmary}
                              lang={lang}
                            />
                          </CheckoutSummaryContainer>
                        )}
                      </Sticky>
                    </Show>
                  )}
                  <Show from="xs" to="md">
                    <CheckoutSummaryContainer>
                      <CheckoutSummary
                        shipAddress={currentShipping}
                        summary={checkoutSmmary}
                        lang={lang}
                      />
                      <Button
                        block
                        onClick={this.handleMobileClick}
                        disabled={
                          (step === 2 && !isValidCheckout) ||
                          (step === 2 && !isDeliverySlot) ||
                          (step === 2 && clearShipping) ||
                          isEmpty(get(cart, 'items'))
                        }
                        color={
                          (isCartLoaded && step === 1 && countRowItems > 0) ||
                          (step === 2 &&
                            isValidCheckout &&
                            isDeliverySlot &&
                            !clearShipping &&
                            !isEmpty(get(cart, 'items')))
                            ? 'success'
                            : '#666666'
                        }
                      >
                        {`${translate(
                          step === 1
                            ? 'multi_checkout.summary.btn_select_shipping'
                            : 'multi_checkout.summary.btn_goto_payment',
                        )}`}
                        <Icon
                          src="/assets/icons/round-arrow-forward-white.svg"
                          style={{ marginLeft: 5 }}
                          height={13}
                        />
                      </Button>
                    </CheckoutSummaryContainer>
                  </Show>
                </Margin>
              </Col>
            </Row>
          </Container>
        </StickyContainer>
        {(!isCartLoaded ||
          some(loadingCartProduct, Boolean) ||
          this.state.cartTransfer ||
          this.state.loading) && (
          <FullScreenLoading
            icon="/assets/icons/loader-2.gif"
            width="100px"
            height="auto"
          />
        )}

        <CartItemsDifferentModal
          open={this.state.itemsMissingModal.show}
          products={this.state.itemsMissingModal.items}
          handleTransferCart={() => this.handleTransferCart()}
          isConfirm={this.state.itemsMissingModal.isConfirm}
        />

        {promoOpen && (
          <PromoBundleModal onCloseButton={closePromoBundleModal} />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  shippingAddresses: getShippingAddressesSelector(state),
  cart: state.cart.cart,
  itemsExcludeBundle: state.cart.itemsExcludeBundle,
  itemsBundle: state.cart.itemsBundle,
  cartTotals: state.cart.cartTotals,
  storeConfig: state.storeConfig.current,
  lang: langSelector(state),
  isCartLoaded: isCartLoadedSelector(state),
  loadingCartProduct: state.cart.loadingProduct,
  storeLocatorSlot: state.checkout.storeLocatorSlot,
  storeLocatorSlotLoading: state.checkout.storeLocatorSlotLoading,
  isValidCheckout: state.checkout.isValid,
  promoOpen: state.promoBundle.modalOpen,
  currentShipping: state.customer.currentShipping,
  customer: getCustomerSelector(state),
  isDeliverySlot: state.checkout.isDeliverySlot,
  clearShipping: state.customer.clearShipping,
  notifyLimitQty: state.cart.notifyLimitQty,
});

const mapDispatchToProps = dispatch => ({
  fetchCart: (isCartLoad = false, isTotalsLoad = false) =>
    dispatch(fetchCart(isCartLoad, isTotalsLoad)),
  closePromoBundleModal: () => dispatch(closePromoBundleModal()),
  fetchCartProducts: () => dispatch(fetchCartProducts()),
  transferCart: storeCode => dispatch(transferCart(storeCode)),
  fullPageLoading: (condition, message) =>
    dispatch(fullPageLoading(condition, message)),
  setValidCheckout: isValid => dispatch(setValidCheckout(isValid)),
  deleteDeliverySlot: cartId => dispatch(deleteDeliverySlot(cartId)),
  validateDeliverySlot: () => dispatch(validateDeliverySlot()),
  updateDiffCartItems: items => dispatch(updateDiffCartItems(items)),
});

export default withRouter(
  withLocales(connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer)),
);
