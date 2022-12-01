import {
  breakpoint,
  Button,
  Col,
  Collaspe,
  Container,
  FullScreenLoading,
  HideMobile,
  Icon,
  Margin,
  Row,
  Text,
} from '@central-tech/core-ui';
import Cookie from 'js-cookie';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Sticky, StickyContainer } from 'react-sticky';
import { compose } from 'redux';
import styled from 'styled-components';

import DiscardNewCreditCardFormModal from '@/client/features/modal/DiscardNewCreditCardFormModal';
import { TextGuide } from '@client/components/Typography';
import { hitTimeStamp } from '@client/constants/hitTimeStamp';
import {
  useCreditCardContext,
  usePaymentContext,
  useReduxContext,
} from '@client/contexts';
import { typesPaymentMethods } from '@client/contexts/payment/types';
import CheckoutHeader from '@client/features/checkout/components/CheckoutHeader';
import CheckoutSummary from '@client/features/checkout/components/CheckoutSummary';
import { getCheckoutSummary } from '@client/features/checkout/utils';
import { ProductListPriceInclTax } from '@client/features/gtm/models/Product';
import CartItemsDifferentModal from '@client/features/modal/CartItemsDifferentModal';
import PrivacyModal from '@client/features/modal/PrivacyModal';
import TermsAndConModal from '@client/features/modal/TermsAndConModal';
import withCustomer from '@client/hoc/withCustomer';
import withLocales from '@client/hoc/withLocales';
import withPayment from '@client/hoc/withPayment';
import withStoreLocator from '@client/hoc/withStoreLocator';
import { isCartLoadedSelector, langSelector } from '@client/selectors';
import { getCustomerSelector } from '@client/selectors';
import { getCookie } from '@client/utils/cookie';
import { isLoggedIn } from '@client/utils/cookie';
import { countDiffItems } from '@client/utils/diffItemCheck';
import { getQueryParam } from '@client/utils/url';

import SelectCreditCardModal from '../modal/SelectCreditCardModal';
import ModalValidateSlot from './components/ModalValidateSlot';
import PaymentMethod from './components/PaymentMethod';
import RemarkForm from './components/RemarkForm';
import Substitution from './components/Substitution';
import T1Form from './components/T1Form';
import usePaymentOnsite from './hooks/usePaymentOnsite';

const PaymentMethodContainer = styled.div`
  background: #fff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  ${breakpoint('xs', 'md')`
    border-radius: 0 0 5px 5px;
    border-top: none;
  `}
`;
const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CheckoutSummaryContainer = styled.div`
  border: 1px solid #cccccc;
  border-radius: 5px;
  margin-top: 114px;
  ${breakpoint('xs', 'md')`
    position: fixed;
    bottom: 0;
    width: 100%
  `}
`;
const Show = styled.div`
  display: none;
  ${props => breakpoint(props.from, props.to)`
    display: block;
  `}
`;
const BackButton = styled(Text)`
  width: 174px;
  cursor: pointer;
  &:hover {
    color: #2a2a2a;
  }
`;
const SubmitButton = styled(Button)`
  line-height: 0;
`;

const PaymentMethodBlock = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 24px 20px 29px;
  border-bottom: solid 1px #e8e8e8;
  flex-wrap: nowrap;
`;

const SectionTitle = styled.div`
  padding: 30px 20px 0;
`;

const RemarkBlock = styled.div`
  background: #fbfbfb;
  padding: 20px 0 30px;
`;

const CollaspeButton = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  justify-items: center;
`;

const T1FormWrap = styled.div``;
const ChcekoutHeaderWrap = styled.div`
  z-index: 1;
`;
const TermConPrivacy = styled.div`
  color: #666;
  font-size: 10px;
  text-align: center;
  span {
    text-decoration: underline;
    cursor: pointer;
  }
  ${breakpoint('xs', 'md')`
    padding: 0 20px 10px;
    background: #f7f7f7;
  `}
`;

const PaymentContainer = ({
  translate,
  fetchCartProducts,
  updateDiffCartItems,
  validateDeliverySlot,
  createOrder,
  fetchStoreConfigCurrent,
  fullPageLoading,
  transferCart,
}) => {
  const history = useHistory();
  const { reduxState } = useReduxContext();
  const {
    handleCreateOrder,
    handleSetPaymentCode,
    handleSetT1CInfo,
    handleSetRemark,
    handleSetSubstitution,
    handleSetIsRequestTax,
  } = usePaymentOnsite();
  const { payment } = usePaymentContext();

  const step = 2;
  const state = reduxState;
  const cart = state?.cart?.cart;
  const cartTotals = state?.cart?.cartTotals;
  const storeConfig = state?.storeConfig?.current;
  const location = useLocation();
  const shippingAddress = state?.customer?.currentShipping;
  const lang = langSelector(state);
  const checkoutSmmary = getCheckoutSummary(cart, cartTotals);
  const isCartLoaded = isCartLoadedSelector(state);
  const isValidCheckout = state?.checkout?.isValid;
  const checkoutLoading = state?.checkout?.checkoutLoading;
  const paymentMethod = payment?.paymentMethods || {};
  const customer = state?.customer?.items || {};
  const pathname = location?.pathname;
  const customerSelector = getCustomerSelector(state);
  const userToken = Cookie.get('user_token');

  const [isRequestTax, setIsRequestTax] = useState(null);
  const [t1cNumber, setT1cNumber] = useState('');
  const [t1cName, setT1cName] = useState('');
  const [isCollapseRemark, setIsCollapseRemark] = useState(false);
  const [substitution, setSubstitution] = useState('');
  const [remark, setRemark] = useState('');
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [cartTransfer, setCartTransfer] = useState(false);
  const [itemsMissingModal, setItemsMissingModal] = useState({
    show: false,
    items: [],
    isConfirm: false,
  });
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null);
  const [isProceedCheckout, setProceedCheckout] = useState(false);
  const [modalValidateSlotOpened, setModalValidateSlotOpened] = useState(false);
  const [modalValidateSlotMessage, setModalValidateSlotMessage] = useState('');
  const [openSelectCreditCardModal, setOpenSelectCreditCardModal] = useState(
    false,
  );

  const {
    isCreditCardFormActive,
    configDiscardFormModal,
    setOpenDiscardNewCreditCardFormModal,
    currentSelectedCard,
    currentSelectedCardPromotion,
    setCurrentSelectedCardPromotion,
    isShowCardPromotion,
    isCardPromotionLoading,
  } = useCreditCardContext();
  useEffect(() => {
    if (!isLoggedIn() && isEmpty(customerSelector)) {
      window.location.replace('/');
    }
    const isRequestTax = getQueryParam('request_tax') === 'true';
    if (getQueryParam('request_tax')) {
      handleSetIsRequestTax(isRequestTax);
      setIsRequestTax(isRequestTax);
    }
  }, []);

  useEffect(() => {
    if (customer) {
      virtualPageView({ customer, lang, pathname });
    }
  }, [customer]);

  useEffect(() => {
    (async () => {
      if (isProceedCheckout) {
        try {
          await checkoutValifyItem();
        } finally {
          setProceedCheckout(false);
        }
      }
    })();
  }, [isProceedCheckout]);

  const virtualPageView = useCallback(({ customer, lang, pathname }) => {
    if (size(customer) > 0) {
      dataLayer.push({
        event: 'vpv',
        provider: !isEmpty(getCookie('provider'))
          ? getCookie('provider')
          : 'web',
        customer_id: customer?.id || '',
        email: customer?.email || '',
        page: {
          pagePath: pathname,
          pageTitle: 'Checkout',
          pageLang: lang,
          pageType: 'checkout',
        },
      });
    }
  }, []);

  const handleClickBack = ({ goToCheckoutStep2 = false }) => {
    const navigatePath = goToCheckoutStep2 ? '/checkout?step=2' : '/checkout';
    if (isCreditCardFormActive) {
      setOpenDiscardNewCreditCardFormModal({
        open: true,
        navigatePath,
      });
    } else {
      history.replace(navigatePath);
    }
  };

  const onCollpseRemark = () => {
    setIsCollapseRemark(!isCollapseRemark);
  };

  const handleAddT1c = e => {
    // wait for remove
    setT1cNumber(e.target.value);
    setT1cName(e.target.name);
    // ----

    const t1cName = e?.target?.name;
    const t1cNumber = e?.target?.value;
    let t1cInfo = {
      t1c_card: '',
      t1c_phone: '',
    };
    if (t1cName === 't1c_card') {
      t1cInfo = {
        t1c_card: t1cNumber,
      };
    } else if (t1cName === 't1c_phone') {
      t1cInfo = {
        t1c_phone: t1cNumber,
      };
    }

    if (!isEmpty(t1cInfo?.t1c_card) || !isEmpty(t1cInfo?.t1c_phone)) {
      handleSetT1CInfo(t1cInfo);
    }
  };

  const handleClickTermsAndConditions = () => {
    setOpenTermsModal(true);
  };

  const handleClickPrivacy = () => {
    setOpenPrivacyModal(true);
  };

  const handleTransferCart = async () => {
    const cartId = cart?.id;

    if (!itemsMissingModal?.isConfirm) {
      const redirect = '/checkout/';
      await updateDiffCartItems(itemsMissingModal?.items, redirect);
    } else {
      setCartTransfer(true);
    }

    setItemsMissingModal({
      show: false,
      items: [],
      isConfirm: false,
    });

    if (cartId) {
      window.location.href = '/checkout';
    }
  };

  const confirmPayment = code => {
    setPaymentMethodSelected(code);
    handleSetPaymentCode(code);
    setCurrentSelectedCardPromotion('');
  };

  const handlePayment = () => {
    setProceedCheckout(true);
  };

  const checkoutValifyItem = async () => {
    try {
      const cartItems = cart?.items || {};
      const { items: newCartProducts } = await fetchCartProducts();
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
        setItemsMissingModal({
          items: notShowPriceChange,
          show: true,
          isConfirm: false,
        });
      } else {
        await handleCheckout();
      }
    } catch (e) {
      throw e;
    }
  };

  const handleCheckout = async () => {
    if (!userToken) {
      alert('Your account invalid please try again.');
      throw 'Your account invalid please try again.';
    }
    if (!paymentMethodSelected) {
      alert('Please select payment method.');
      throw 'Please select payment method.';
    }
    const isSeasonal = cart?.items.some(
      item => item?.is_seasonal === 'Is Seasonal',
    );
    if (
      paymentMethodSelected ===
        typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT &&
      currentSelectedCard === null &&
      !isCreditCardFormActive
    ) {
      setOpenSelectCreditCardModal(true);
      throw 'Please select credit card.';
    }
    if (
      paymentMethodSelected === typesPaymentMethods.CREDITCARDONDELIVERY &&
      isSeasonal
    ) {
      if (isShowCardPromotion && currentSelectedCardPromotion === '') {
        setOpenSelectCreditCardModal(true);
        throw 'Please select credit card.';
      }
    }

    try {
      const { shipping_date, shipping_slot_id } = cart?.extension_attributes;

      if (isEmpty(shipping_date) || isEmpty(shipping_slot_id)) {
        alert(translate('timeslot.tab.header_subtext'));
        return (window.location.href = '/checkout');
      }

      const response = await validateDeliverySlot();

      if (response?.data) {
        if (
          response?.data?.message?.message ===
          'No such entity with %fieldName = %fieldValue'
        ) {
          // case: store has been changed
          history.replace('/checkout');
        } else if (response?.data?.message) {
          setModalValidateSlotOpened(true);
          setModalValidateSlotMessage(
            translate('timeslot.tab.slot_not_available'),
          );
        } else {
          dataLayer.push({
            event: 'eec.Checkout',
            ecommerce: {
              checkout: {
                actionField: {
                  step: 2,
                  option: paymentMethodSelected || '',
                },
                products: ProductListPriceInclTax(cart.items),
              },
            },
            hit_timestamp: hitTimeStamp,
          });

          if (
            paymentMethodSelected ===
              typesPaymentMethods.PAYMENT_SERVICE_FULLPAYMENT ||
            paymentMethodSelected === typesPaymentMethods.CREDITCARDONDELIVERY
          ) {
            await handleCreateOrder();
          } else {
            const order = await createOrder(
              userToken,
              paymentMethodSelected,
              isRequestTax,
              remark,
              substitution,
              t1cNumber,
              t1cName,
            );
            if (order?.redirect) {
              let subdistrictId = 0;
              if (!isEmpty(getCookie('default_shipping'))) {
                subdistrictId = get(
                  JSON.parse(getCookie('default_shipping')),
                  'subdistrict_id',
                  '',
                );
              } else {
                const { default_shipping } = state?.customer;
                const addIndex = findIndex(
                  state?.customer?.addresses,
                  o => o.id == default_shipping,
                );
                subdistrictId = get(
                  state?.customer?.addresses,
                  `[${addIndex}].subdistrict_id`,
                  '',
                );
              }
              const currentCode = state?.storeConfig?.code || '';
              const storeConfig = await fetchStoreConfigCurrent(subdistrictId);
              const storeCode = storeConfig?.code || '';
              fullPageLoading(true, translate('store_changeing'));
              await transferCart({
                storeCode: storeCode,
                currentCode: currentCode,
              });
              window.location = '/';
            }
          }
        }
      } else {
        setModalValidateSlotOpened(true);
        setModalValidateSlotMessage(
          translate('timeslot.tab.slot_not_available'),
        );
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <Fragment>
      <ModalValidateSlot
        modalValidateSlotOpened={modalValidateSlotOpened}
        modalValidateSlotMessage={modalValidateSlotMessage}
        handleClickBack={handleClickBack}
      />
      <StickyContainer>
        <Sticky>
          {({ style }) => (
            <ChcekoutHeaderWrap style={style}>
              <CheckoutHeader
                step={step}
                isMobile
                handleClickBack={() =>
                  handleClickBack({ goToCheckoutStep2: true })
                }
                backText={translate('multi_checkout.mobile_header.payment')}
              />{' '}
            </ChcekoutHeaderWrap>
          )}
        </Sticky>
        <Container>
          <Row>
            <Col xs={12} md={9} xl="auto">
              <Margin xs="19px 0 240px 0" md="24px 20px 20px 0">
                <PaymentMethodContainer>
                  <SectionTitle>
                    <Icon
                      src="/assets/icons/payment-method.svg"
                      style={{ marginRight: 7 }}
                      height={25}
                    />{' '}
                    <Text bold size={15}>
                      {translate('payment.methods.title')}
                    </Text>
                  </SectionTitle>
                  <PaymentMethodBlock>
                    <PaymentMethod
                      paymentMethod={paymentMethod}
                      onConfirmPayment={confirmPayment}
                    />
                  </PaymentMethodBlock>
                  <T1FormWrap>
                    <T1Form
                      the1={getCheckoutSummary(cart, cartTotals)}
                      handleAddT1c={handleAddT1c}
                    />
                  </T1FormWrap>
                  <RemarkBlock>
                    <CollaspeButton
                      color="transparent"
                      onClick={onCollpseRemark}
                      id="btn-open-remark"
                    >
                      <div>
                        <TextGuide type="body" bold>
                          {translate('title_substitution.more_detail')}
                        </TextGuide>
                        <TextGuide type="caption-2" color="#666666">
                          {translate('title_substitution.description')}
                        </TextGuide>
                      </div>
                      <Icon
                        style={{ alignSelf: 'center' }}
                        src={`/assets/icons/${
                          isCollapseRemark
                            ? 'round-keyboard-arrow-up.svg'
                            : 'round-keyboard-arrow-down.svg'
                        }`}
                      />
                    </CollaspeButton>
                    <Collaspe visible={isCollapseRemark}>
                      <Substitution
                        onChange={e => {
                          handleSetSubstitution(e);
                          // wait for remove
                          setSubstitution(e);
                        }}
                      />
                      <RemarkForm
                        translate={translate}
                        onChange={e => {
                          handleSetRemark(e);
                          // wait for remove
                          setRemark(e);
                        }}
                      />
                    </Collaspe>
                  </RemarkBlock>
                  <HideMobile>
                    <TermConPrivacy>
                      {translate('pdpa.payment_text1')}
                      <span onClick={handleClickTermsAndConditions}>
                        {translate('pdpa.term_condition')}
                      </span>
                      {translate('pdpa.text2')}
                      <span onClick={handleClickPrivacy}>
                        {translate('pdpa.privacy_title')}
                      </span>
                    </TermConPrivacy>
                    <Margin md="20px">
                      <ButtonWrap>
                        <BackButton
                          align="center"
                          onClick={handleClickBack}
                          size={13}
                        >
                          {translate('button.back_to_productlist')}
                        </BackButton>
                        <SubmitButton
                          size={13}
                          radius="4px"
                          padding="8px 10px"
                          height={40}
                          width={190}
                          onClick={handlePayment}
                          color={
                            !isValidCheckout ||
                            !isCartLoaded ||
                            isProceedCheckout ||
                            isCardPromotionLoading ||
                            payment?.paymentLoading
                              ? '#cccccc'
                              : 'success'
                          }
                          disabled={
                            !isValidCheckout ||
                            !isCartLoaded ||
                            isProceedCheckout ||
                            isCardPromotionLoading ||
                            payment?.paymentLoading
                          }
                        >
                          {translate('button.back_proceed_checkout')}
                          <Icon
                            src="/assets/icons/round-arrow-forward-white.svg"
                            style={{ marginLeft: 5 }}
                            height={13}
                          />
                        </SubmitButton>
                      </ButtonWrap>
                    </Margin>
                  </HideMobile>
                </PaymentMethodContainer>
              </Margin>
            </Col>
            <Col xs={12} md={3} xl="280px">
              <Margin xs="24px 0 0 0" md="24px 0 20px 0">
                <Show from="md">
                  <Sticky>
                    {({ style, isSticky }) => (
                      <CheckoutSummaryContainer
                        style={{
                          ...style,
                          marginTop: isSticky ? 114 : 0,
                        }}
                      >
                        {shippingAddress && (
                          <CheckoutSummary
                            countRowItems={1}
                            shipAddress={shippingAddress}
                            summary={checkoutSmmary}
                            lang={lang}
                            isShowSummary
                          />
                        )}
                      </CheckoutSummaryContainer>
                    )}
                  </Sticky>
                </Show>
                <Show from="xs" to="md">
                  <CheckoutSummaryContainer>
                    <CheckoutSummary
                      shipAddress={shippingAddress}
                      summary={checkoutSmmary}
                      lang={lang}
                    />
                    <TermConPrivacy>
                      {translate('pdpa.payment_text1')}
                      <span onClick={handleClickTermsAndConditions}>
                        {translate('pdpa.term_condition')}
                      </span>
                      {translate('pdpa.text2')}
                      <span onClick={handleClickPrivacy}>
                        {translate('pdpa.privacy_title')}
                      </span>
                    </TermConPrivacy>
                    <Button
                      block
                      onClick={handlePayment}
                      color={
                        !isValidCheckout ||
                        !isCartLoaded ||
                        isProceedCheckout ||
                        isCardPromotionLoading ||
                        payment?.paymentLoading
                          ? '#cccccc'
                          : 'success'
                      }
                      disabled={
                        !isValidCheckout ||
                        !isCartLoaded ||
                        isProceedCheckout ||
                        isCardPromotionLoading ||
                        payment?.paymentLoading
                      }
                    >
                      {translate('button.back_proceed_checkout')}
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
      {openPrivacyModal && (
        <PrivacyModal
          openModal={openPrivacyModal}
          onModalClose={() => setOpenPrivacyModal(false)}
        />
      )}
      {openTermsModal && (
        <TermsAndConModal
          openModal={openTermsModal}
          onModalClose={() => setOpenTermsModal(false)}
        />
      )}
      {(checkoutLoading ||
        !isCartLoaded ||
        cartTransfer ||
        isProceedCheckout ||
        payment?.paymentLoading) && (
        <FullScreenLoading
          icon="/assets/icons/loader-2.gif"
          width="100px"
          height="auto"
        />
      )}
      <CartItemsDifferentModal
        open={itemsMissingModal?.show}
        products={itemsMissingModal?.items}
        handleTransferCart={() => handleTransferCart()}
        isConfirm={itemsMissingModal?.isConfirm}
      />
      <DiscardNewCreditCardFormModal
        openModal={configDiscardFormModal?.isOpen}
        onModalClose={() =>
          setOpenDiscardNewCreditCardFormModal({ open: false })
        }
      />
      <SelectCreditCardModal
        openModal={openSelectCreditCardModal}
        onModalClose={() => setOpenSelectCreditCardModal(false)}
      />
    </Fragment>
  );
};

export default compose(
  withLocales,
  withCustomer,
  withStoreLocator,
  withPayment,
)(PaymentContainer);
