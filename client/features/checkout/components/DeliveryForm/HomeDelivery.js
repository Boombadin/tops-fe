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
  FullScreenLoading,
  Space,
} from '@central-tech/core-ui';
import styled, { css } from 'styled-components';
import { ButtonRadio } from '../../../../components/ButtonRadio';
import { get, find, isEmpty, isNull, filter, lowerCase } from 'lodash';
import {
  getDefaultBillingAddress,
  getDefaultShippingAddress,
  getShippingMethod,
} from '../../utils';
import AddAddressButton from '../../../address/components/AddAddressButton';
import withLocales from '../../../../hoc/withLocales';
import { setAddressDefault } from '.././../../../reducers/customer';
import { fetchShippingMethods } from '.././../../../reducers/cart';
import { setValidCheckout } from '.././../../../reducers/checkout';
import ShippingMethodContainer from './ShippingMethodContainer';
import { addressStringBuilder } from '../../../address/utils';
import { TextGuide } from '../../../../components/Typography';
import ShippingAddressModal from '../../../modal/ShippingAddressModal';
import BillingAddressModal from '../../../modal/BillingAddressModal';
import withStoreConfig from '../../../../hoc/withStoreConfig';
import withChangeStore from '../../../../hoc/withChangeStore';
import withAddress from '../../../../hoc/withAddress';

const MAP_ICON = '/assets/icons/map-icon.svg';
const DOC_ICON = '/assets/icons/document-icon.svg';

const Section = styled.div`
  width: 100%;
  height: auto;
  border-bottom: dashed 1px #e8e8e8;
  padding: 20px 20px 30px;

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
  padding-bottom: 10px;
  display: -ms-flexbox;
  /* display: table-cell; */
  display: flex;
  justify-content: space-between;
  -webkit-align-items: center;
  vertical-align: middle;
  -ms-flex-align: center;
  /*border-bottom: 1px dashed #e8e8e8;*/

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
class HomeDelivery extends PureComponent {
  state = {
    loading: false,
    isRequestTax: false,
    modalOpened: false,
    modalMessage: '',
    deliveryMethod: 'home_delivery',
    addressType: 'shipping',
    shippingAddress: null,
    billingAddress: null,
    editAddressMode: false,
  };

  componentDidMount() {
    this.validate();
    this.props.fetchShippingMethods(get(this.props.cart, 'id'));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState !== this.state ||
      (!isEmpty(this.props.shippingMethods) &&
        prevProps.shippingMethods !== this.props.shippingMethods)
    ) {
      this.validate();
    }
  }

  validate = () => {
    const { customer, shippingMethods, currentShipping } = this.props;
    const methodCode = get(
      find(shippingMethods, x => x.carrierCode === 'standard'),
      'methodCode',
      'mds',
    );
    const standard = getShippingMethod(shippingMethods, methodCode);
    const express = getShippingMethod(shippingMethods, 'express');

    let isValid = true;

    if (isEmpty(currentShipping) && isEmpty(this.state.shippingAddress)) {
      isValid = false;
    }
    // else if (isNull(this.state.isRequestTax)) {
    //   isValid = false;
    // }
    else if (this.state.isRequestTax) {
      if (
        isEmpty(this.state.billingAddress) &&
        isEmpty(getDefaultBillingAddress(customer))
      ) {
        isValid = false;
      }
    } else if (
      isEmpty(get(standard, 'nextRound')) &&
      isEmpty(get(express, 'nextRound'))
    ) {
      isValid = false;
    }
    this.props.setValidCheckout(isValid);
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
  };

  handleChangeAddress = (address, type) => {
    this.setState({
      modalOpened: true,
      addressType: type,
      // editAddressMode: true
    });
  };

  handleChangeStore = async (address, showSameAddressButton) => {
    await this.props.onChangeStore(address, showSameAddressButton);
    this.setState({ modalOpened: false });
  };

  handleRequestTax = isRequestTax => {
    this.setState({
      isRequestTax: isRequestTax,
    });
    // this.validate();
    this.props.onTaxRequestChange(isRequestTax);
  };

  render() {
    const {
      shippingMethods,
      onShippingChange,
      // deliveryMethod,
      onChooseSlot,
      translate,
      customer,
      currentShipping,
      cart,
      langCode,
      clearShipping,
    } = this.props;

    const {
      loading,
      addressType,
      editAddressMode,
      deliveryMethod,
    } = this.state;

    const addresses = get(customer, 'addresses', []);
    const shippingAddress =
      get(currentShipping, 'shipping_method') === 'delivery'
        ? currentShipping
        : '';
    const billingAddress = getDefaultBillingAddress(customer);

    return (
      <React.Fragment>
        <ShippingAddressModal
          open={this.state.modalOpened && addressType === 'shipping'}
          onModalClose={() => this.setState({ modalOpened: false })}
          onChange={this.handleChangeStore}
          addNewAddress={
            filter(addresses, addr => addr.customer_address_type === 'shipping')
              .length === 0
          }
          editMode={editAddressMode}
          address={shippingAddress}
          selectedAddress={shippingAddress}
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
                {translate('checkout_delivery.delivery_home_sub')}
              </TextGuide>
            </SectionContent>
          </Section>
        </HideDesktop>

        <Section>
          <HideMobile>
            <SectionTitle>
              <TextGuide type="topic" bold>
                <SectionTitleIcon src={MAP_ICON} style={{ marginRight: 10 }} />
                {translate(
                  'checkout_delivery.shipping_address.title.delivery_home',
                )}
              </TextGuide>
              {(isEmpty(shippingAddress) || clearShipping) && (
                <AddAddressButton
                  theme="green"
                  floatRight
                  border
                  // margin="0 10px 0 0"
                  text={
                    filter(
                      addresses,
                      addr => addr.customer_address_type === 'shipping',
                    ).length > 0
                      ? translate('checkout_delivery.select_delivery_address')
                      : translate('checkout_delivery.create_delivery_address')
                  }
                  onAddAddressClick={() =>
                    this.setState({
                      modalOpened: true,
                      addressType: 'shipping',
                    })
                  }
                />
              )}
            </SectionTitle>
          </HideMobile>

          <HideDesktop>
            <SectionTitle height="45px">
              <TextGuide type="topic" bold>
                <SectionTitleIcon src={MAP_ICON} style={{ marginRight: 10 }} />

                {translate(
                  'checkout_delivery.shipping_address.title.delivery_home',
                )}
              </TextGuide>
            </SectionTitle>
            {(isEmpty(shippingAddress) || clearShipping) && (
              <SectionTitleMobile align="flex-start">
                <AddAddressButton
                  theme="green"
                  text={
                    filter(
                      addresses,
                      addr => addr.customer_address_type === 'shipping',
                    ).length > 0
                      ? translate('checkout_delivery.select_delivery_address')
                      : translate('checkout_delivery.create_delivery_address')
                  }
                  onAddAddressClick={() =>
                    this.setState({
                      modalOpened: true,
                      addressType: 'shipping',
                    })
                  }
                  border
                />
              </SectionTitleMobile>
            )}
          </HideDesktop>

          <SectionContent>
            {!isEmpty(shippingAddress) && !clearShipping && (
              <Row>
                <Col xs="auto">
                  {shippingAddress.address_name && (
                    <TextGuide type="callout" bold>
                      {shippingAddress.address_name}
                    </TextGuide>
                  )}
                  <TextGuide type="caption" padding="0 100px 0 0">
                    {addressStringBuilder(shippingAddress, false, langCode)}
                  </TextGuide>
                  <Row justify="space-between">
                    <Col>
                      <TextGuide type="caption" as="span" padding="0 20px 0 0">
                        {translate('checkout_delivery.receiver_name')}:{' '}
                        {shippingAddress.firstname} {shippingAddress.lastname}
                      </TextGuide>
                      <TextGuide type="caption" as="span">
                        {translate('checkout_delivery.receiver_phone')}:{' '}
                        {shippingAddress.telephone}
                      </TextGuide>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Space xs="10px" />
                      <EditAddressButton
                        onClick={() =>
                          this.handleChangeAddress(shippingAddress, 'shipping')
                        }
                      >
                        <Icon
                          width={10}
                          src="/assets/icons/ic-edit.svg"
                          style={{ marginRight: 5 }}
                        />
                        {translate('checkout_delivery.change_shipping_address')}
                      </EditAddressButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </SectionContent>
        </Section>

        <Section>
          <HideMobile>
            <SectionTitle>
              <TextGuide type="topic" bold>
                <SectionTitleIcon src={DOC_ICON} style={{ marginRight: 10 }} />
                {translate('checkout_delivery.tax.title')}
                <RequiredBadge />{' '}
              </TextGuide>
              {isEmpty(billingAddress) && this.state.isRequestTax && (
                <AddAddressButton
                  theme="green"
                  floatRight
                  // border
                  // margin="0 10px 0 0"
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
              <TextGuide type="topic" bold>
                <SectionTitleIcon src={DOC_ICON} style={{ marginRight: 10 }} />
                {translate('checkout_delivery.tax.title')}
                <RequiredBadge />{' '}
              </TextGuide>
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
            <HideDesktop>
              <SectionTitleMobile>
                <AddAddressButton
                  theme="green"
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
                          {translate('checkout_delivery.tax.tel')}{' '}
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

        {!isEmpty(shippingMethods) && (
          <ShippingMethodContainer
            deliveryMethod={deliveryMethod}
            shippingMethods={shippingMethods}
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            onShippingChange={onShippingChange}
            onChooseSlot={onChooseSlot}
            cart={cart}
          />
        )}

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
  currentShipping: state.customer.currentShipping,
  clearShipping: state.customer.clearShipping,
});

const mapDispatchToProps = dispatch => ({
  setAddressDefault: (
    addressId,
    type,
    shippingMethod,
    storeConfig,
    isDefault,
  ) =>
    dispatch(
      setAddressDefault(
        addressId,
        type,
        shippingMethod,
        storeConfig,
        isDefault,
      ),
    ),
  fetchShippingMethods: cartId => dispatch(fetchShippingMethods(cartId)),
  setValidCheckout: isValid => dispatch(setValidCheckout(isValid)),
});

export default withRouter(
  withLocales(connect(mapStateToProps, mapDispatchToProps)(HomeDelivery)),
);
