import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import styled from 'styled-components';
import { Padding } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';
import withCustomer from '../../hoc/withCustomer';
import withStoreLocator from '../../hoc/withStoreLocator';
import AddressSection from './components/AddressSection';
import ShippingAddressModal from '../modal/ShippingAddressModal';
import BillingAddressModal from '../modal/BillingAddressModal';
import PersonalProfileModal from '../modal/PersonalProfileModal';
import InfomationSection from './components/InformationSection';
import { fullPageLoading } from '../../reducers/layout';
import { editProfile, setAddressDefault } from '../../reducers/customer';
import withAddress from '../../hoc/withAddress';
import withChangeStore from '../../hoc/withChangeStore';
import { getCustomerSelector } from '../../selectors';

const MAP_ICON = '/assets/icons/map-icon.svg';
const DOC_ICON = '/assets/icons/document-icon.svg';

const Section = styled.div`
  width: 100%;
  height: auto;
  background-color: #ffffff;

  ${props =>
    props.bottomLine &&
    `
        border-bottom: dashed 1px #e8e8e8;
    `}
`;

const initialState = {
  modalShippingOpened: false,
  modalBillingOpened: false,
  addressType: 'shipping',
  // address: {},
  shippingAddress: {},
  billingAddress: {},
  addNewAddressMode: false,
  editAddressMode: false,
  modalPersonalOpened: false,
};

@withCustomer
@withAddress
@withChangeStore
@withStoreLocator
class ProfileContainer extends React.Component {
  state = initialState;

  handleAddAddress = type => {
    this.setState({
      modalShippingOpened: type === 'shipping',
      modalBillingOpened: type === 'billing',
      addressType: type,
      addNewAddressMode: true,
      editAddressMode: false,
      address: {},
    });
  };

  handleEditAddress = (type, address) => {
    this.setState({
      modalShippingOpened: type === 'shipping',
      modalBillingOpened: type === 'billing',
      addressType: type,
      addNewAddressMode: false,
      editAddressMode: true,
      shippingAddress: type === 'shipping' ? address : {},
      billingAddress: type === 'billing' ? address : {},
    });
  };

  handleDeleteAddress = async address => {
    this.props.fullPageLoading(true, 'Loading...');
    const textConfirm = confirm(
      `${this.props.translate(
        'right_menu.shipping_options.confirm_address_deletion',
      )}`,
    );
    if (textConfirm) {
      await this.props.deleteAddress(get(address, 'id'));
      await this.props.setAddressDefault(address, 'shipping', null, null);
      window.location.reload(true);
    }
    this.props.fullPageLoading(false);
  };

  handleEditProfile = async customer => {
    this.props.fullPageLoading(true, 'Loading...');
    await this.props.editProfile(customer);
    this.props.fullPageLoading(false);
    this.setState({
      modalPersonalOpened: false,
    });
  };

  handleChoouseShippingAddress = async address => {
    this.props.fullPageLoading(true, 'Loading...');
    await this.props.editAddress(address);
    await this.props.setAddressDefault(address, 'shipping', null, null);
    await this.props.onChangeStore(address, false);
    this.props.fullPageLoading(false);
    this.setState({
      modalShippingOpened: false,
    });
  };

  handleChoouseBillingAddress = async (address, isDefault = false) => {
    this.props.fullPageLoading(true, 'Loading...');
    await this.props.editAddress(address);
    await this.props.setAddressDefault(
      address,
      'billing',
      null,
      null,
      isDefault,
    );
    this.props.fullPageLoading(false);
    this.setState({
      modalBillingOpened: false,
    });
  };

  render() {
    const { customer } = this.props;
    return (
      <React.Fragment>
        <ShippingAddressModal
          open={this.state.modalShippingOpened}
          onModalClose={() => this.setState({ ...initialState })}
          onChange={this.handleChoouseShippingAddress}
          addNewMode={this.state.addNewAddressMode}
          editMode={this.state.editAddressMode}
          address={this.state.shippingAddress}
        />

        <BillingAddressModal
          open={this.state.modalBillingOpened}
          onModalClose={() => this.setState({ ...initialState })}
          onChange={this.handleChoouseBillingAddress}
          addNewMode={this.state.addNewAddressMode}
          editMode={this.state.editAddressMode}
          address={this.state.billingAddress}
        />

        <PersonalProfileModal
          open={this.state.modalPersonalOpened}
          onModalClose={() => this.setState({ modalPersonalOpened: false })}
          onChange={this.handleEditProfile}
        />

        <Section bottomLine>
          <InfomationSection
            customer={customer}
            onEditPersonalInfoClick={() =>
              this.setState({ modalPersonalOpened: true })
            }
          />
        </Section>

        <Section bottomLine>
          <Padding xs="10px">
            <AddressSection
              icon={MAP_ICON}
              onAddAddressClick={() => this.handleAddAddress('shipping')}
              onEditAddressClick={address =>
                this.handleEditAddress('shipping', address)
              }
              onDeleteAddressClick={address =>
                this.handleDeleteAddress(address)
              }
            />
          </Padding>
        </Section>

        <Section>
          <Padding xs="10px">
            <AddressSection
              icon={DOC_ICON}
              addressType="billing"
              onAddAddressClick={() => this.handleAddAddress('billing')}
              onEditAddressClick={address =>
                this.handleEditAddress('billing', address)
              }
              onDeleteAddressClick={address =>
                this.handleDeleteAddress(address)
              }
            />
          </Padding>
        </Section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
});

const mapDispatchToProps = dispatch => ({
  editProfile: customer => dispatch(editProfile(customer)),
  fullPageLoading: (condition, message) =>
    dispatch(fullPageLoading(condition, message)),
  setAddressDefault: (
    addressId,
    type,
    shippingMethod,
    storeCode,
    setUseDefault,
  ) =>
    dispatch(
      setAddressDefault(
        addressId,
        type,
        shippingMethod,
        storeCode,
        setUseDefault,
      ),
    ),
});

export default withLocales(
  connect(mapStateToProps, mapDispatchToProps)(ProfileContainer),
);
