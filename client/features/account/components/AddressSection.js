import React from 'react';
import styled from 'styled-components';
import { Row, Col, Padding, breakpoint, HideDesktop, HideMobile } from '@central-tech/core-ui';
import { TextGuide } from '../../../components/Typography';
import AddAddressButton from '../../address/components/AddAddressButton';
import AddressList from '../../address/AddressList';
import withLocales from '../../../hoc/withLocales';

const AddressListItemWrapper = styled.div`
  width: 680px;

  ${breakpoint('xs', 'md')`
        width: 100%;
    `}
`;

const Icon = styled.img`
  height: 25px;
  margin: 0 0 -6px;
`;

const AddressSection = ({
  icon,
  addressType = 'shipping',
  onAddAddressClick,
  onEditAddressClick,
  onDeleteAddressClick,
  translate,
}) => {
  return (
    <AddressListItemWrapper>
      <Row>
        {icon && (
          <Col xs="60px">
            <Padding xs="20px 0 0 20px">
              <Icon src={icon} />
            </Padding>
          </Col>
        )}
        <Col xs="60%">
          <Padding xs="20px 0 0 0">
            <TextGuide type="topic" bold>
              {addressType === 'shipping'
                ? translate('profile_info.dilivery_address.address_info')
                : translate('profile_info.billing_address.billing_info')}
            </TextGuide>
          </Padding>
        </Col>
        <HideMobile>
          <Col xs="auto">
            <Padding xs="20px 20px 0 0">
              <AddAddressButton
                text={`${
                  addressType === 'shipping'
                    ? translate('profile_info.dilivery_address.add_new_address')
                    : translate('profile_info.billing_address.add_new_billing')
                }`}
                theme="green"
                floatRight
                margin="0 5px 0 0"
                bold={false}
                onAddAddressClick={onAddAddressClick}
              />
            </Padding>
          </Col>
        </HideMobile>
      </Row>
      <HideDesktop>
        <Row>
          <Col>
            <Padding xs="20px 0 0 20px">
              <AddAddressButton
                text={`${
                  addressType === 'shipping'
                    ? translate('profile_info.dilivery_address.add_new_address')
                    : translate('profile_info.billing_address.add_new_billing')
                }`}
                theme="green"
                margin="0 5px 0 0"
                onAddAddressClick={onAddAddressClick}
              />
            </Padding>
          </Col>
        </Row>
      </HideDesktop>
      <Row>
        <Col>
          <AddressList
            addressType={addressType}
            // selectedAddress={this.state.selectedAddress}
            // onAddAddressClick={onAddAddressClick}
            // onAddressSelected={this.handleAddressSelected}
            onEditAddressClick={onEditAddressClick}
            onDeleteAddressClick={onDeleteAddressClick}
            withBorder
            disableRadio
            disableAdd
          />
        </Col>
      </Row>
    </AddressListItemWrapper>
  );
};

export default withLocales(AddressSection);
