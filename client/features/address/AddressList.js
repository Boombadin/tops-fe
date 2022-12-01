import React from 'react';
import styled from 'styled-components';
import { object, bool } from 'prop-types';
import withAddress from '../../hoc/withAddress';
import AddressListItem from './components/AddressListItem';
import AddAddressButton from './components/AddAddressButton';
import withLocales from '../../hoc/withLocales';

const AddressListWrapper = styled.div`
  background: #ffffff;
`;

const AddressList = ({
  addresses,
  addressType = 'shipping',
  selectedAddress,
  onAddAddressClick,
  onEditAddressClick,
  onDeleteAddressClick,
  onAddressSelected,
  withBorder,
  disableRadio,
  disableAdd = false,
  disableEdit,
  disableDelete,
  translate,
  justifyContent,
}) => {
  return (
    <AddressListWrapper>
      {addresses
        .filter(address => {
          return address.customer_address_type === addressType;
        })
        .map(address => (
          <AddressListItem
            key={address.id}
            address={address}
            addressType={addressType}
            selected={parseInt(selectedAddress.id) === parseInt(address.id)}
            onAddressSelected={onAddressSelected}
            onEditAddressClick={onEditAddressClick}
            onDeleteAddressClick={onDeleteAddressClick}
            withBorder={withBorder}
            disableRadio={disableRadio}
            disableEdit={disableEdit}
            disableDelete={disableDelete}
            justifyContent={justifyContent}
          />
        ))}
      {!disableAdd && (
        <AddAddressButton
          onAddAddressClick={onAddAddressClick}
          text={
            addressType === 'shipping'
              ? translate('delivery_tool_bar_modal.add_new_address')
              : translate('delivery_tool_bar_modal.add_new_billing')
          }
        />
      )}
    </AddressListWrapper>
  );
};

AddressList.propTypes = {
  selectedAddress: object,
  disableEdit: bool,
  disableDelete: bool,
};

AddressList.defaultProps = {
  selectedAddress: {},
  disableEdit: false,
  disableDelete: false,
};

export default withLocales(withAddress(AddressList));
