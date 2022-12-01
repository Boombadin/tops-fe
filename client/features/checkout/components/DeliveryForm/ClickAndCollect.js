import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Margin,
  breakpoint,
  HideDesktop,
  HideMobile,
  Row,
  Col,
  Icon,
  Padding,
  FullScreenLoading,
  Space,
} from '@central-tech/core-ui';
import styled, { css } from 'styled-components';
import { ButtonRadio } from '../../../../components/ButtonRadio';
import { get, isEmpty, filter, lowerCase, isNull } from 'lodash';
import * as Yup from 'yup';
import { getDefaultStoreLocator, getDefaultBillingAddress } from '../../utils';
import AddAddressButton from '../../../address/components/AddAddressButton';
import withLocales from '../../../../hoc/withLocales';
import { setAddressDefault } from '.././../../../reducers/customer';
import { fetchNextStoreConfig } from '.././../../../reducers/storeConfig';
import { fetchProductByStore, transferCart } from '.././../../../reducers/cart';
import {
  getStorPickUpSlot,
  setValidCheckout,
  addDeliverySlotInfo,
} from '../../../../reducers/checkout';
import { fetchStoreLocator } from '../../../../reducers/storeLocator';
import { fetchShippingMethods } from '.././../../../reducers/cart';
import ShippingMethodContainer from './ShippingMethodContainer';
import { addressStringBuilder } from '../../../address/utils';
import { TextGuide } from '../../../../components/Typography';
import StoreLocatorModal from '../../../modal/StoreLocatorModal';
import { storeAddressBuilder } from '../../../storeLocator/utils';
import BillingAddressModal from '../../../modal/BillingAddressModal';
import { Formik, Form } from 'formik';
import { FormInput } from '../../../../components/Form';
import withChangeStore from '../../../../hoc/withChangeStore';
import withStoreConfig from '../../../../hoc/withStoreConfig';
import withAddress from '../../../../hoc/withAddress';
import Cookie from 'js-cookie';

const MAP_ICON = '/assets/icons/map-icon.svg';
const DOC_ICON = '/assets/icons/document-icon.svg';

const Section = styled.div`
  width: 100%;
  height: auto;
  border-bottom: dashed 1px #e8e8e8;
  padding: 20px;

  ${props =>
    props.noBackground &&
    `
    background-color: #f7f7f7;
    padding: 5px 20px 5px 20px;
  `}
`;

const SectionTitle = styled.div`
  /* height: 60px; */
  /* width: 900px; */
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${props =>
    props.height &&
    `
    height: ${props.height}
  `}
`;

const SectionTitleMobile = styled.div`
  display: flex;
  align-items: center;
  height: 60px;

  ${props =>
    props.align &&
    `
    align-items: ${props.align}
  `}
`;

const SectionTitleIcon = styled.img`
  height: 25px;
  margin: 0 0 -6px;
`;

const SectionTitleText = styled(TextGuide)`
  padding: 0 0 10px 0;
`;

const SectionContent = styled.div`
  width: 100%;
  height: auto;

  ${props => props.padding && `padding: ${props.padding};`}
  
  ${props =>
    props.inline &&
    `
      display: flex;
    `}
  ${props =>
    props.column &&
    css`
      display: flex;
      flex-direction: column;
      ${breakpoint('md')`
        flex-direction: row;
      `}
    `}
`;

const EditAddressButton = styled.div`
  font-family: Thonburi;
  font-size: 11px;
  color: #666666;
  cursor: pointer;
`;

const defaultValues = {
  receiver_name: '',
  receiver_phone: '',
};

const validationSchema = translate => {
  return Yup.object().shape({
    receiver_name: Yup.string()
      .trim('This field must not be whitespace')
      .max(100, 'Limit 100 character')
      .required(translate('address_form.required_field')),
    receiver_phone: Yup.string()
      .matches(/^[0-9]*$/, translate('address_form.required_field_format'))
      .min(9, translate('address_form.required_field_format'))
      .max(15, translate('address_form.required_field_format'))
      .required(translate('address_form.required_field')),
  });
};

const RequiredBadge = styled.span`
  &:after {
    content: '*';
    font-size: 16px;
    font-weight: bold;
    position: relative;
    top: 4px;
    color: #ec1d24;
  }
`;
@withStoreConfig
@withChangeStore
@withAddress
class ClickAndCollect extends PureComponent {
  state = {
    isFirstLoad: true,
    loading: false,
    isRequestTax: false,
    modalOpened: false,
    modalMessage: '',
    deliveryMethod: 'home_delivery',
    addressType: 'shipping',
    store: null,
    storeLocator: null,
    billingAddress: null,
    editAddressMode: false,
    collector: null,
    store_id: null,
    receiver_name: null,
    receiver_phone: null,
  };

  initialState() {
    const defaultBilling = getDefaultBillingAddress(
      get(this.props, 'customer'),
    );
    const pickupStore = get(
      this.props,
      'cart.extension_attributes.pickup_store',
    );
    this.setState({
      store_id: get(pickupStore, 'store_id', ''),
      receiver_name: get(pickupStore, 'receiver_name', ''),
      receiver_phone: get(pickupStore, 'receiver_phone', ''),
      billingAddress: defaultBilling,
    });
  }

  componentDidMount() {
    this.props.fetchShippingMethods();
    this.setStoreLocator();
    this.validate();
    this.initialState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      isEmpty(prevState.storeLocator) ||
      (!isEmpty(this.props.stores) &&
        prevState.storeLocator !== this.state.storeLocator)
    ) {
      this.setStoreLocator();
    }

    if (prevState.storeLocator !== this.state.storeLocator) {
      this.validate();
    }

    if (prevState.isRequestTax !== this.state.isRequestTax) {
      this.validate();
    }

    if (prevState.receiver_name !== this.state.receiver_name) {
      this.validate();
    }

    if (prevState.receiver_phone !== this.state.receiver_phone) {
      this.validate();
    }
  }

  validate = () => {
    const phonePattern = new RegExp(/^[0-9]{9,15}$/);
    const phone = this.state.receiver_phone;

    let isValid = true;

    if (
      isEmpty(this.state.receiver_name) ||
      !/\S/.test(this.state.receiver_name)
    ) {
      isValid = false;
    } else if (
      isEmpty(this.state.receiver_phone) ||
      !phonePattern.test(phone)
    ) {
      isValid = false;
    } else if (isEmpty(this.state.storeLocator)) {
      isValid = false;
    }
    // else if (isNull(this.state.isRequestTax)) {
    //   isValid = false;
    // }
    else if (this.state.isRequestTax) {
      if (isEmpty(this.state.billingAddress)) {
        isValid = false;
      }
    }

    this.props.setValidCheckout(isValid);

    if (isValid && this.state.isFirstLoad) {
      this.setState({
        isFirstLoad: false,
      });
    }
    return isValid;
  };

  setStoreLocator = () => {
    const { stores, customer, fetchStoreLocator, currentShipping } = this.props;
    if (isEmpty(stores)) {
      fetchStoreLocator();
    }
    // const storeLocator = getDefaultStoreLocator(stores, customer);
    const storeLocator =
      get(currentShipping, 'shipping_method') === 'pickup'
        ? currentShipping
        : '';

    if (storeLocator) {
      this.fetchPickupSlots();
    }

    this.setState({
      storeLocator: storeLocator,
    });
  };

  fetchPickupSlots = () => {
    const { cart } = this.props;
    const { storeLocator } = this.state;

    this.props.getStorPickUpSlot(
      get(cart, 'id'),
      get(storeLocator, 'id'),
      'tops',
    );
  };

  handleDeliveryClick = method => {
    this.setState({
      deliveryMethod: method,
    });
  };

  handleChoouseBillingAddress = async address => {
    this.setState({ loading: true });
    await this.props.editAddress(address);
    await this.props.setAddressDefault(address, 'billing');

    this.setState({
      billingAddress: address,
      loading: false,
      modalOpened: false,
    });
    this.validate();
  };

  handleChangeAddress = (address, type) => {
    this.setState({
      modalOpened: true,
      addressType: type,
      // editAddressMode: true
    });
  };

  handleRequestTax = isRequestTax => {
    this.setState({
      isRequestTax: isRequestTax,
    });
    this.props.onTaxRequestChange(isRequestTax);
  };

  handleCollector = (name, value) => {
    this.setState({
      store_id: get(this.state.storeLocator, 'id'),
      [name]: value,
    });
  };

  handleValidateReceiverChange = () => {
    const isValid = this.validate();
    if (isValid && !this.state.isFirstLoad) {
      setTimeout(() => {
        if (!this.state.loading) {
          this.handleUpdateCollector();
        }
      }, 1000);
    }
  };

  handleUpdateCollector = async () => {
    if (!this.validate()) {
      return;
    }

    const { cart } = this.props;
    const slotId = `${get(
      cart,
      'extension_attributes.shipping_date',
      '',
    )}/${get(cart, 'extension_attributes.shipping_slot_id', '')}`;
    const pickupStore = get(cart, 'extension_attributes.pickup_store');

    if (
      isEmpty(slotId) ||
      isEmpty(pickupStore) ||
      isEmpty(this.state.storeLocator) ||
      (this.state.receiver_name === get(pickupStore, 'receiver_name', '') &&
        this.state.receiver_phone === get(pickupStore, 'receiver_phone', ''))
    ) {
      return;
    }

    this.setState({ loading: true });

    const collector = {
      store_id: this.state.store_id,
      receiver_name:
        this.state.receiver_name || get(pickupStore, 'receiver_name', ''),
      receiver_phone:
        this.state.receiver_phone || get(pickupStore, 'receiver_phone', ''),
    };

    try {
      const response = await this.props.addDeliverySlotInfo(
        slotId,
        'tops',
        collector,
        this.state.storeLocator,
      );
      this.setState({ loading: false });

      if (response.data.error) {
        alert('ไม่สามารถจัดส่งเวลานี้ได้');
      }
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  handleChangeStore = async (address, showSameAddressButton) => {
    await this.props.onChangeStore(address, showSameAddressButton);
    this.setState({ modalOpened: false });
  };

  render() {
    const {
      shippingMethods,
      cart,
      translate,
      customer,
      storeLocatorSlot,
      currentShipping,
      isValidCheckout,
      clearShipping,
      langCode,
    } = this.props;

    const {
      loading,
      storeLocator,
      addressType,
      editAddressMode,
      receiver_name,
      receiver_phone,
    } = this.state;
    const addresses = get(customer, 'addresses', []);
    const billingAddress = getDefaultBillingAddress(customer);
    const collector = {
      store_id: this.state.store_id,
      receiver_name: this.state.receiver_name,
      receiver_phone: this.state.receiver_phone,
    };
    return (
      <React.Fragment>
        <StoreLocatorModal
          open={this.state.modalOpened && addressType === 'shipping'}
          onChange={this.handleChangeStore}
          selectedStore={currentShipping}
          onModalClose={() => this.setState({ modalOpened: false })}
        />

        <BillingAddressModal
          open={this.state.modalOpened && addressType === 'billing'}
          onModalClose={() => this.setState({ modalOpened: false })}
          onChange={this.handleChoouseBillingAddress}
          addNewAddress={
            filter(addresses, addr => addr.customer_address_type === 'billing')
              .length === 0
          }
          editMode={editAddressMode}
          address={billingAddress}
          selectedAddress={billingAddress}
        />

        <HideDesktop>
          <Section noBackground>
            <SectionContent>
              <TextGuide type="caption-2" color="#666666">
                {translate('checkout_delivery.click_and_collect_sub')}
              </TextGuide>
            </SectionContent>
          </Section>
        </HideDesktop>

        <Section>
          <HideMobile>
            <SectionTitle height="45px">
              <SectionTitleText type="topic" bold>
                <SectionTitleIcon src={MAP_ICON} style={{ marginRight: 10 }} />
                {translate(
                  'checkout_delivery.shipping_address.title.click_and_collect',
                )}
              </SectionTitleText>
              {(isEmpty(storeLocator) || clearShipping) && (
                <AddAddressButton
                  theme="green"
                  floatRight
                  text={translate(
                    'checkout_delivery.select_pickup_store.title',
                  )}
                  onAddAddressClick={() =>
                    this.setState({
                      modalOpened: true,
                      addressType: 'shipping',
                    })
                  }
                  border
                />
              )}
            </SectionTitle>
          </HideMobile>

          <HideDesktop>
            <SectionTitle height="45px">
              <SectionTitleText type="topic" bold>
                <SectionTitleIcon src={MAP_ICON} style={{ marginRight: 10 }} />
                {translate(
                  'checkout_delivery.shipping_address.title.click_and_collect',
                )}
              </SectionTitleText>
            </SectionTitle>
            {(isEmpty(storeLocator) || clearShipping) && (
              <SectionTitleMobile align="flex-start">
                <AddAddressButton
                  theme="green"
                  text={translate(
                    'checkout_delivery.select_pickup_store.title',
                  )}
                  onAddAddressClick={() =>
                    this.setState({
                      modalOpened: true,
                      addressType: 'shipping',
                    })
                  }
                />
              </SectionTitleMobile>
            )}
          </HideDesktop>

          <SectionContent>
            {!isEmpty(storeLocator) && !clearShipping && (
              <Row>
                <Col xs="auto">
                  {storeLocator.name && (
                    <TextGuide type="callout" bold>
                      {storeLocator.name}
                    </TextGuide>
                  )}
                  <TextGuide
                    type="caption"
                    padding="0 100px 0 0"
                    dangerouslySetInnerHTML={{
                      __html: storeAddressBuilder(
                        storeLocator,
                        true,
                        translate,
                      ),
                    }}
                  />
                  <Row>
                    <Col>
                      <Space xs="10px" />
                      <EditAddressButton
                        onClick={() =>
                          this.handleChangeAddress(storeLocator, 'shipping')
                        }
                      >
                        <Icon
                          width={10}
                          src="/assets/icons/ic-edit.svg"
                          style={{ marginRight: 5 }}
                        />
                        {translate('checkout_delivery.change_pickup_address')}
                      </EditAddressButton>
                    </Col>
                  </Row>

                  <Formik
                    initialValues={{
                      ...defaultValues,
                      receiver_name,
                      receiver_phone,
                    }}
                    validationSchema={validationSchema(translate)}
                  >
                    {({ setFieldValue }) => {
                      return (
                        <Form autoComplete="off">
                          <Row>
                            <Col lg="300px" sm={6} xs={12}>
                              <Padding xs="10px 0 0 0">
                                <FormInput
                                  type="text"
                                  name="receiver_name"
                                  label={translate(
                                    'checkout_delivery.click_collect.form.collector',
                                  )}
                                  placeholder=""
                                  required
                                  onBlur={() =>
                                    this.handleValidateReceiverChange()
                                  }
                                  onChange={e =>
                                    this.handleCollector(
                                      'receiver_name',
                                      e.target.value,
                                    )
                                  }
                                />
                              </Padding>
                            </Col>
                            <Col lg="250px" sm={6} xs={12}>
                              <Padding xs="0" sm="10px 0 0 10px">
                                <FormInput
                                  type="text"
                                  name="receiver_phone"
                                  label={translate(
                                    'checkout_delivery.click_collect.form.mobile_no',
                                  )}
                                  placeholder=""
                                  required
                                  onBlur={() =>
                                    this.handleValidateReceiverChange()
                                  }
                                  onChange={e => {
                                    setFieldValue(
                                      e.target.name,
                                      e.target.value.replace(/[^0-9]/g, ''),
                                    );
                                    this.handleCollector(
                                      'receiver_phone',
                                      e.target.value.replace(/[^0-9]/g, ''),
                                    );
                                  }}
                                />
                              </Padding>
                            </Col>
                          </Row>
                        </Form>
                      );
                    }}
                  </Formik>
                </Col>
              </Row>
            )}
          </SectionContent>
        </Section>

        <Section>
          <HideMobile>
            <SectionTitle>
              <SectionTitleText type="topic" bold>
                <SectionTitleIcon src={DOC_ICON} style={{ marginRight: 10 }} />
                {translate('checkout_delivery.tax.title')}
                <RequiredBadge />{' '}
              </SectionTitleText>
              {isEmpty(billingAddress) && this.state.isRequestTax && (
                <AddAddressButton
                  theme="green"
                  floatRight
                  text={
                    filter(
                      addresses,
                      addr => addr.customer_address_type === 'billing',
                    ).length > 0
                      ? translate(
                          'checkout_delivery.select_tax_invoice_address',
                        )
                      : translate(
                          'checkout_delivery.create_tax_invoice_address',
                        )
                  }
                  onAddAddressClick={() =>
                    this.setState({ modalOpened: true, addressType: 'billing' })
                  }
                />
              )}
            </SectionTitle>
          </HideMobile>

          <HideDesktop>
            <SectionTitle>
              <SectionTitleText type="topic" bold>
                <SectionTitleIcon src={DOC_ICON} style={{ marginRight: 10 }} />

                {translate('checkout_delivery.tax.title')}
                <RequiredBadge />
              </SectionTitleText>
            </SectionTitle>
          </HideDesktop>

          <SectionContent inline>
            <ButtonRadio
              name="requestTax"
              label={`${translate('checkout_delivery.tax.request')}`}
              checked={this.state.isRequestTax}
              onChange={() => this.handleRequestTax(true)}
            />
            <ButtonRadio
              name="requestTax"
              label={`${translate('checkout_delivery.tax.no_request')}`}
              checked={!this.state.isRequestTax}
              onChange={() => this.handleRequestTax(false)}
            />
          </SectionContent>
          {isEmpty(billingAddress) && this.state.isRequestTax && (
            <SectionContent>
              <br />
              <TextGuide color="red">
                {translate('checkout_delivery.tax.required.address')}
              </TextGuide>
            </SectionContent>
          )}

          {isEmpty(billingAddress) && this.state.isRequestTax && (
            <HideDesktop>
              <SectionTitleMobile>
                <AddAddressButton
                  theme="green"
                  floatRight={true}
                  text={
                    filter(
                      addresses,
                      addr => addr.customer_address_type === 'billing',
                    ).length > 0
                      ? translate(
                          'checkout_delivery.select_tax_invoice_address',
                        )
                      : translate(
                          'checkout_delivery.create_tax_invoice_address',
                        )
                  }
                  onAddAddressClick={() =>
                    this.setState({ modalOpened: true, addressType: 'billing' })
                  }
                />
              </SectionTitleMobile>
            </HideDesktop>
          )}

          {this.state.isRequestTax && (
            <SectionContent>
              {!isEmpty(billingAddress) && (
                <Row>
                  <Col xs="auto">
                    <Margin md="10px 0 0 0" xs="10px 0 0 0" />
                    {billingAddress.firstname &&
                      lowerCase(billingAddress.firstname) !==
                        lowerCase('N/A') && (
                        <TextGuide type="callout" bold>
                          {`${billingAddress.firstname} ${billingAddress.lastname}`}
                        </TextGuide>
                      )}
                    {billingAddress.company &&
                      lowerCase(billingAddress.company) !==
                        lowerCase('N/A') && (
                        <TextGuide type="callout" bold>
                          {billingAddress.company}
                        </TextGuide>
                      )}
                    <TextGuide type="caption" padding="0 100px 0 0">
                      {translate('checkout_delivery.tax.tax_id')}{' '}
                      {billingAddress.vat_id}
                    </TextGuide>
                    <TextGuide type="caption" padding="0 100px 0 0">
                      {translate('checkout_delivery.tax.address')}{' '}
                      {addressStringBuilder(billingAddress, false, langCode)}
                    </TextGuide>
                    <Row justify="space-between">
                      <Col>
                        <TextGuide type="caption" as="span">
                          {translate('checkout_delivery.tax.tel')}
                          {billingAddress.telephone}
                        </TextGuide>
                      </Col>
                    </Row>
                    <Row>
                      <EditAddressButton
                        onClick={() =>
                          this.handleChangeAddress(billingAddress, 'billing')
                        }
                      >
                        <Icon
                          width={10}
                          src="/assets/icons/ic-edit.svg"
                          style={{ marginRight: 5 }}
                        />
                        {translate('checkout_delivery.change_billing_address')}
                      </EditAddressButton>
                    </Row>
                  </Col>
                </Row>
              )}
            </SectionContent>
          )}
        </Section>

        <ShippingMethodContainer
          deliveryMethod="click_and_collect"
          cart={cart}
          shippingMethods={shippingMethods}
          billingAddress={billingAddress}
          collector={{
            store_id: this.state.store_id,
            receiver_name: this.state.receiver_name,
            receiver_phone: this.state.receiver_phone,
          }}
          storeLocator={storeLocator}
          storeLocatorSlot={storeLocatorSlot}
        />

        {loading && (
          <FullScreenLoading
            icon="/assets/icons/loader-2.gif"
            width="100px"
            height="auto"
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  shippingMethods: state.cart.shippingMethods.data,
  customer: state.customer.items,
  stores: state.storeLocator.items,
  storeLocatorSlot: state.checkout.storeLocatorSlot,
  storeLocatorSlotLoading: state.checkout.storeLocatorSlotLoading,
  isValidCheckout: state.checkout.isValid,
  currentShipping: state.customer.currentShipping,
  cart: state.cart.cart,
  clearShipping: state.customer.clearShipping,
});

const mapDispatchToProps = dispatch => ({
  setAddressDefault: (addressId, type, shippingMethod, storeCode, isDefault) =>
    dispatch(
      setAddressDefault(addressId, type, shippingMethod, storeCode, isDefault),
    ),
  fetchShippingMethods: () => dispatch(fetchShippingMethods()),
  getStorPickUpSlot: (cartId, locatorId, method) =>
    dispatch(getStorPickUpSlot(cartId, locatorId, method)),
  fetchStoreLocator: () => dispatch(fetchStoreLocator()),
  setValidCheckout: isValid => dispatch(setValidCheckout(isValid)),
  fetchNextStoreConfig: nextAddress =>
    dispatch(fetchNextStoreConfig(nextAddress)),
  transferCart: storeCode => dispatch(transferCart(storeCode)),
  fetchProductByStore: storeCode => dispatch(fetchProductByStore(storeCode)),
  addDeliverySlotInfo: (slotId, shippingMethod, collector, storeLocator) =>
    dispatch(
      addDeliverySlotInfo(slotId, shippingMethod, collector, storeLocator),
    ),
});

export default withRouter(
  withLocales(connect(mapStateToProps, mapDispatchToProps)(ClickAndCollect)),
);
