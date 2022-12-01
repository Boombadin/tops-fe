import React from 'react';
import {
  Padding,
  Row,
  Col,
  Button,
  breakpoint,
  HideMobile,
  HideDesktop,
  Icon,
} from '@central-tech/core-ui';
import { isEmpty, get } from 'lodash';
import styled from 'styled-components';
import { TextGuide } from '../../components/Typography';
import AddressForm from '../address/AddressForm';
import AddressList from '../address/AddressList';
import StoreLocatorList from '../storeLocator/StoreLocatorList';
import withCustomer from '../../hoc/withCustomer';
import withAddress from '../../hoc/withAddress';
import withLocales from '../../hoc/withLocales';
import withStoreConfig from '../../hoc/withStoreConfig';
import DeliveryTabs from '../checkout/components/DeliveryForm/DeliveryTabs';
import ModalTemplate from './components/ModalTemplate';
import withChangeStore from '../../hoc/withChangeStore';
import withFullPageLoading from '../../hoc/withFullPageLoading';
import withStoreLocator from '../../hoc/withStoreLocator';

const OverflowSection = styled.div`
  overflow: auto;
  height: ${({ isRemark }) => (isRemark ? '40vh' : 'calc(40vh + 60px)')};
  border-top: 1px solid #f3f3f3;

  ${breakpoint('xs', 'md')`
    max-height: none;
    height: 100%;
    padding-bottom: 80px;
    min-height: 0px;
  `};
`;
const BackButton = styled(Button)`
  width: 120px;
  background: none;
  :hover {
    border: 1px solid #808080;
    border-radius: 4px;
  }
  ${breakpoint('xs', 'md')`
    width: 100%;
    background: #2a2a2a;
  `};
`;
const TextBackButton = styled(TextGuide)`
  ${breakpoint('xs', 'md')`
    color: #ffffff;
  `}
`;
const Section = styled.div`
  width: 100%;
  height: auto;
  border-bottom: dashed 1px #e8e8e8;
  padding: 20px;

  ${props =>
    props.noBackground &&
    `
    background-color: #fbfbfb;
    padding: 5px 20px 5px 20px;
  `}
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
`;
const ModalInputSearch = styled.div`
  background-color: #ffffff;
  padding: 15px 17px;

  ${breakpoint('xs', 'md')`
    padding: 12.5px 20px 12.7px;
  `}
`;
const InputSearchPickUpStore = styled.input`
  width: 100%;
  height: 39px;
  border-radius: 8px;
  border: solid 1px #e1e1e1;
  padding: 3px 10px 3px 34px;
  ::placeholder {
    font-family: Thonburi, sans-serif !important;
    line-height: 20px;
    font-size: 14px;
    color: #bfbfbf;
  }
`;
const SearchPickUpStore = styled.div`
  position: relative;
`;
const IconSearchPickUpStore = styled(Icon)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
`;

const InputError = styled(TextGuide)`
  display: flex;
  width: 100%;
  height: 32px;
  margin-top: 14px;
  align-items: center;
  background-color: #f8f8f8;
  border: 1px solid #e5e5e5;
  padding: 0 11px 0;
  color: #949494;
`;
@withFullPageLoading
@withStoreConfig
@withChangeStore
@withAddress
@withCustomer
@withStoreLocator
class DeliveryToolBar extends React.Component {
  deliveryFormSubmit = null;
  state = {
    activeShippingType: 'home_delivery',
    addNewAddress: false,
    editAddress: {},
    selectedAddress: this.props.defaultShipping,
    selectedStore: {},
    openModalShipping: this.props.open,
    loading: false,
    searchStoreName: '',
    isChangeShippingType: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({
        openModalShipping: this.props.open,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentShipping) {
      this.setState({
        selectedStore: get(nextProps, 'currentShipping'),
        selectedAddress: get(nextProps, 'currentShipping'),
      });
      if (!this.state.isChangeShippingType) {
        this.setState({
          activeShippingType:
            get(
              nextProps.currentShipping,
              'shipping_method',
              'home_delivery',
            ) === 'pickup'
              ? 'click_and_collect'
              : 'home_delivery',
        });
      }
    }
  }

  handleAddNewAddressSubmit = async value => {
    const { translate } = this.props;
    this.props.fullPageLoading(true, translate('common.system_recording'));
    const address = await this.props.addAddress(value);
    await this.handleChangeStore(address, false);
    this.setState({ loading: false });
  };

  handleAddOrEditAddress = () => {
    this.deliveryFormSubmit();
  };

  handleDeliveryTypeChange = type => {
    this.setState({
      activeShippingType: type,
      addNewAddress: false,
      editAddress: {},
      isChangeShippingType: true,
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

  // handleAddressDelete = address => {
  //   const addressId = address && address.id;
  //   if (addressId) {
  //     this.props.deleteAddress(addressId);
  //   }
  // };

  handleAddressEdit = address => {
    this.setState({ editAddress: address });
  };

  handleChangeStore = async (address, showSameAddressButton) => {
    this.setState({
      openModalShipping: false,
    });

    await this.props.onChangeStore(address, showSameAddressButton);
    this.setState({
      openModalShipping: false,
      addNewAddress: false,
      editAddress: {},
      selectedAddress: {},
      selectedStore: {},
    });
  };

  handleClose = () => {
    this.setState({
      openModalShipping: false,
      addNewAddress: false,
      editAddress: {},
      selectedAddress: {},
      selectedStore: {},
      isChangeShippingType: false,
    });

    this.setState({ searchStoreName: '' });

    this.props.resetSearchStore();
    this.props.closeDeliveryToolBar();
  };

  handleSearchStore = event => {
    this.setState({
      searchStoreName: event.target.value,
    });
    this.props.searchStoreLocator(event.target.value);
  };

  render() {
    const { addresses, translate, storeLocator } = this.props;
    const {
      openModalShipping,
      activeShippingType,
      addNewAddress,
      editAddress,
      selectedStore,
      selectedAddress,
    } = this.state;
    const customerAddress = addresses.length > 0;
    const isSelectStoreFromCreate =
      (!customerAddress && activeShippingType === 'home_delivery') ||
      this.state.addNewAddress ||
      !isEmpty(this.state.editAddress);
    const isAddEditAddress =
      this.state.addNewAddress || !isEmpty(this.state.editAddress);
    const isRemark = !addNewAddress && isEmpty(editAddress);
    return (
      <React.Fragment>
        <ModalTemplate
          open={openModalShipping}
          onModalClose={this.handleClose}
          title={translate('delivery_tool_bar_modal.title')}
          description={translate('delivery_tool_bar_modal.description')}
          remark={
            isRemark && (
              <Padding xs="0 20px">
                <TextGuide color="#e02020" type="caption-2" align="center">
                  {translate('delivery_tool_bar_modal.remark')}
                </TextGuide>
              </Padding>
            )
          }
          close={this.handleClose}
          ShowMobileCloseIcon
          renderFooter={
            <Row justify="space-between">
              <Col xs={4} md={6}>
                <HideMobile>
                  {!this.state.addNewAddress &&
                    isEmpty(this.state.editAddress) && (
                      <ButtonWithBorder
                        color="none"
                        width={120}
                        height={40}
                        onClick={this.handleClose}
                      >
                        <TextGuide type="body" align="center">
                          {translate('delivery_tool_bar_modal.btn_close')}
                        </TextGuide>
                      </ButtonWithBorder>
                    )}
                </HideMobile>

                {isAddEditAddress && (
                  <BackButton
                    height={40}
                    onClick={() =>
                      this.setState({ addNewAddress: false, editAddress: null })
                    }
                  >
                    <TextBackButton type="body" align="center">
                      {translate('address_form.btn_back')}
                    </TextBackButton>
                  </BackButton>
                )}
              </Col>
              <Col align="right" xs={isAddEditAddress ? 8 : 12} md="175px">
                {isSelectStoreFromCreate && (
                  <ButtonRadius
                    color="success"
                    block
                    height={40}
                    disabled={this.state.loading}
                    onClick={this.handleAddOrEditAddress}
                  >
                    <TextGuide type="body" align="center" color="#fff">
                      {translate('address_form.btn_save')}
                    </TextGuide>
                  </ButtonRadius>
                )}
                {!isSelectStoreFromCreate && (
                  <React.Fragment>
                    {this.state.activeShippingType === 'home_delivery' ? (
                      <ButtonRadius
                        color="success"
                        block
                        height={40}
                        disabled={isEmpty(selectedAddress)}
                        onClick={() =>
                          this.handleChangeStore(selectedAddress, true)
                        }
                      >
                        <TextGuide type="body" align="center" color="#fff">
                          {translate(
                            'delivery_tool_bar_modal.btn_select_address',
                          )}
                        </TextGuide>
                      </ButtonRadius>
                    ) : (
                      <ButtonRadius
                        color={isEmpty(selectedStore) ? '#ebebeb' : 'success'}
                        block
                        height={40}
                        disabled={isEmpty(selectedStore)}
                        onClick={() =>
                          this.handleChangeStore(selectedStore, true)
                        }
                      >
                        <TextGuide
                          type="body"
                          align="center"
                          color={isEmpty(selectedStore) ? '#808080' : '#fff'}
                        >
                          {translate(
                            'delivery_tool_bar_modal.btn_select_store',
                          )}
                        </TextGuide>
                      </ButtonRadius>
                    )}
                  </React.Fragment>
                )}
              </Col>
            </Row>
          }
        >
          <DeliveryTabs
            deliveryMethod={this.state.activeShippingType}
            onClick={this.handleDeliveryTypeChange}
          />
          <HideDesktop>
            <Section noBackground>
              <TextGuide type="caption-2" color="#666666">
                {this.state.activeShippingType === 'home_delivery'
                  ? translate('checkout_delivery.delivery_home_sub')
                  : translate('checkout_delivery.click_and_collect_sub')}
              </TextGuide>
            </Section>
          </HideDesktop>
          {this.state.activeShippingType === 'home_delivery' ? (
            <OverflowSection isRemark={isRemark}>
              {!customerAddress ||
              this.state.addNewAddress ||
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
                  selectedAddress={selectedAddress}
                  onAddAddressClick={this.handleAddAddressClick}
                  onAddressSelected={this.handleAddressSelected}
                  onEditAddressClick={this.handleAddressEdit}
                  // onDeleteAddressClick={this.handleAddressDelete}
                  disableDelete
                  justifyContent="flex-start"
                />
              )}
            </OverflowSection>
          ) : (
            <React.Fragment>
              <ModalInputSearch>
                <SearchPickUpStore>
                  <IconSearchPickUpStore src="/assets/icons/search-icon-gray.svg" />
                  <InputSearchPickUpStore
                    type="text"
                    name="searchPickUpStore"
                    label=""
                    placeholder={translate(
                      'search_store_locator.input_search_placeholder',
                    )}
                    onChange={this.handleSearchStore}
                    value={this.state.searchStoreName}
                  />
                </SearchPickUpStore>
                {storeLocator?.search?.error && (
                  <InputError>{storeLocator?.search?.error}</InputError>
                )}
              </ModalInputSearch>
              <OverflowSection isRemark={isRemark}>
                <StoreLocatorList
                  selectedStore={selectedStore}
                  onStoreSelected={this.handleStoreLocatorSelected}
                  translate={translate}
                />
              </OverflowSection>
            </React.Fragment>
          )}
        </ModalTemplate>
      </React.Fragment>
    );
  }
}

export default withLocales(DeliveryToolBar);
