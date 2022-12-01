import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Padding,
  Row,
  Col,
  Button,
  breakpoint,
  HideMobile,
  FullScreenLoading,
  HideDesktop,
  Icon,
} from '@central-tech/core-ui';
import { isEmpty, get } from 'lodash';
import styled from 'styled-components';
import { TextGuide } from '../../components/Typography';
import AddressForm from '../address/AddressForm';
import AddressList from '../address/AddressList';
import withCustomer from '../../hoc/withCustomer';
import withAddress from '../../hoc/withAddress';
import ModalTemplate from './components/ModalTemplate';
import withLocales from '../../hoc/withLocales';
import withChangeStore from '../../hoc/withChangeStore';

const MAP_ICON = '/assets/icons/map-icon.svg';

const OverflowSection = styled.div`
  overflow: auto;
  max-height: 50vh;
  min-height: 40vh;

  ${breakpoint('xs', 'md')`
    max-height: none;
    height: 100%;
    padding-bottom: 80px;
    min-height: 0px;
  `}
`;

const ButtonWithIcon = styled(TextGuide)`
  display: flex;
  justify-content: center;
`;

const ButtonWithBorder = styled(Button)`
  :hover {
    border: 1px solid #808080;
    border-radius: 4px;
  }
`;
const ButtonRadius = styled(Button)`
  border-radius: 4px;
  ${breakpoint('xs', 'md')`
    border-radius: 0;
  `}
`
const initialState = {
  activeShippingType: 'home_delivery',
  addNewAddress: false,
  editAddress: null,
  selectedAddress: {},
  selectedStore: {},
  loading: false,
};

@withAddress
@withCustomer
@withChangeStore
class ShippingAddressModal extends PureComponent {
  deliveryFormSubmit = null;
  state = initialState;

  componentWillReceiveProps(nextProps) {
    if (nextProps.editMode && this.state.editAddress !== nextProps.address) {
      this.setState({
        editAddress: nextProps.address,
      });
    }
    if (nextProps.addNewMode) {
      this.setState({
        addNewAddress: true,
      });
    }
    if (isEmpty(this.state.selectedAddress) && nextProps.selectedAddress) {
      this.setState({
        selectedAddress: nextProps.selectedAddress,
      });
    }
  }

  handleAddNewAddressSubmit = async (value, showSameAddressButton) => {
    this.setState({ loading: true });
    const address = await this.props.addAddress(value);
    await this.props.onChangeStore(address, showSameAddressButton);
    this.setState({ addNewAddress: false, editAddress: null, loading: false });
  };

  handleAddOrEditAddress = () => {
    this.deliveryFormSubmit();
  };

  handleDeliveryTypeChange = type => {
    this.setState({
      activeShippingType: type,
      addNewAddress: false,
      editAddress: {},
    });
  };

  handleAddAddressClick = () => {
    this.setState({ addNewAddress: true });
  };

  handleAddressSelected = address => {
    this.setState({ selectedAddress: address });
  };

  handleStoreLocatorSelected = store => {
    this.setState({ selectedStore: store });
  };

  handleAddressDelete = address => {
    const addressId = address && address.id;
    if (addressId) {
      this.props.deleteAddress(addressId);
    }
  };

  handleAddressEdit = address => {
    this.setState({ editAddress: address });
  };

  handleChangeStore = async (address, showSameAddressButton) => {
    await this.props.onChange(address, showSameAddressButton);
  };

  handleCloseModal = () => {
    this.setState({
      ...initialState,
    });
    this.props.onModalClose();
  };

  render() {
    const { addresses, open, translate, langCode } = this.props;
    const customerAddress = addresses.length > 0;
    const isSelectStoreFromCreate =
      !customerAddress ||
      this.state.addNewAddress ||
      this.props.addNewAddress ||
      !isEmpty(this.state.editAddress);
    const isNewAddress =
      !customerAddress ||
      this.state.addNewAddress ||
      this.props.addNewAddress ||
      !isEmpty(this.state.editAddress);
    return (
      <ModalTemplate
        open={open}
        onModalClose={this.handleCloseModal}
        headerIcon={MAP_ICON}
        backButtonIcon
        topSpace
        title={
          isNewAddress
            ? translate('shipping_address_modal.new_shipping_address')
            : translate('shipping_address_modal.shipping_address')
        }
        description={
          isNewAddress
            ? translate('shipping_address_modal.new_shipping_address_desc')
            : translate('shipping_address_modal.shipping_address_desc')
        }
        close={this.handleCloseModal}
        renderFooter={
          <Row justify="space-between">
            <Col xs={0} md={6}>
              <HideMobile>
                {!this.state.addNewAddress && isEmpty(this.state.editAddress) && (
                  <ButtonWithBorder color="none" width={120} height={40}>
                    <Modal.Close>
                      <TextGuide type="body" align="center">
                        {translate('button.close')}
                      </TextGuide>
                    </Modal.Close>
                  </ButtonWithBorder>
                )}
                {(this.state.addNewAddress ||
                  !isEmpty(this.state.editAddress)) && (
                  <ButtonWithBorder
                    color="none"
                    width={120}
                    height={40}
                    onClick={() =>
                      this.setState({ addNewAddress: false, editAddress: null })
                    }
                  >
                    <TextGuide type="body" align="center">
                      {translate('button.back')}
                    </TextGuide>
                  </ButtonWithBorder>
                )}
              </HideMobile>
            </Col>
            <Col align="right" xs={12} md="175px">
              {isSelectStoreFromCreate && (
                <ButtonRadius
                  color="success"
                  block
                  height={40}
                  radius="4px"
                  disabled={this.state.loading}
                  onClick={this.handleAddOrEditAddress}
                >
                  <TextGuide type="body" align="center" color="#fff">
                    {translate('shipping_address_modal.btn_save')}
                  </TextGuide>
                </ButtonRadius>
              )}
              {!isSelectStoreFromCreate && (
                <Fragment>
                  {this.state.activeShippingType === 'home_delivery' ? (
                    <ButtonRadius
                      color="success"
                      block
                      height={40}
                      radius="4px"
                      disabled={isEmpty(this.state.selectedAddress)}
                      onClick={() =>
                        this.handleChangeStore(this.state.selectedAddress, true)
                      }
                    >
                      <ButtonWithIcon type="body" align="center" color="#fff">
                        {translate('button.select_delivery_address')}
                        <HideDesktop>
                          <Icon
                            src="/assets/icons/round-arrow-forward-white.svg"
                            style={{ marginLeft: 5 }}
                            height={13}
                          />
                        </HideDesktop>
                      </ButtonWithIcon>
                    </ButtonRadius>
                  ) : (
                    <ButtonRadius
                      color="success"
                      block
                      height={40}
                      radius="4px"
                      disabled={isEmpty(this.state.selectedStore)}
                      onClick={() =>
                        this.handleChangeStore(this.state.selectedStore, true)
                      }
                    >
                      <TextGuide type="body" align="center" color="#fff">
                        {translate('button.select_pickup_store')}
                      </TextGuide>
                    </ButtonRadius>
                  )}
                </Fragment>
              )}
            </Col>
          </Row>
        }
      >
        <OverflowSection>
          {!customerAddress ||
          this.state.addNewAddress ||
          this.props.addNewAddress ||
          !isEmpty(this.state.editAddress) ? (
            <Padding xs="15px 19px 23px">
              <AddressForm
                onSubmit={this.handleAddNewAddressSubmit}
                initialValue={{
                  ...this.state.editAddress,
                  region: get(this.state.editAddress, 'region.region'),
                }}
                submitFunc={submit => (this.deliveryFormSubmit = submit)}
              />
            </Padding>
          ) : (
            <AddressList
              selectedAddress={this.state.selectedAddress}
              onAddAddressClick={this.handleAddAddressClick}
              onAddressSelected={this.handleAddressSelected}
              onEditAddressClick={this.handleAddressEdit}
              onDeleteAddressClick={this.handleAddressDelete}
              lang={langCode}
              disableDelete
            />
          )}
        </OverflowSection>

        {this.state.loading && (
          <FullScreenLoading
            icon="/assets/icons/loader-2.gif"
            width="100px"
            height="auto"
          />
        )}
      </ModalTemplate>
    );
  }
}

export default withLocales(ShippingAddressModal);
