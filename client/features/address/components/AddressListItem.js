import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { TextGuide } from '../../../components/Typography';
import { ButtonRadio } from '../../../components/ButtonRadio';
import { addressStringBuilder } from '../utils';
import { Row, Col, Icon, breakpoint } from '@central-tech/core-ui';
import withLocales from '../../../hoc/withLocales';

const AddressListItemWrapper = styled.div`
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f3f3f3;

  ${props =>
    props.withBorder &&
    `
    border: 1px solid #f3f3f3;
    border-radius: 4px;
    margin: 20px;
  `}
`;
const CustomCol = styled(Col)`
  text-align: right;
  display: flex;
  flex: 0 20%;
  justify-content: flex-end;
  /* justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : 'flex-end'}; */
  align-items: flex-end;
  ${breakpoint('xs', 'sm')`
    margin-top: 5px;
    justify-content: ${({ justifyContent }) =>
      justifyContent ? justifyContent : 'flex-end'};
    align-items: flex-end;
    flex: 0 auto;
  `}
`;
const EditButton = styled.div`
  cursor: pointer;
`;
const AddressCol = styled(Col)`
  ${breakpoint('xs', 'sm')`
    word-break: break-word;
  `}
`;
const AddressText = styled(TextGuide)`
  padding: 0 100px 0 0;
  ${breakpoint('xs', 'sm')`
    padding: 0
  `}
`;
const AddressListItem = ({
  address,
  addressType,
  selected,
  onAddressSelected,
  onEditAddressClick,
  onDeleteAddressClick,
  withBorder = false,
  disableRadio = false,
  disableEdit,
  disableDelete,
  translate,
  langCode,
  justifyContent,
}) => {
  return (
    <AddressListItemWrapper
      withBorder={withBorder}
      onClick={() => onAddressSelected(address)}
    >
      <Row>
        {!disableRadio && (
          <Col xs="40px" style={{ alignSelf: 'center' }}>
            <ButtonRadio name={address.id} checked={selected} />
          </Col>
        )}
        <AddressCol xs="auto">
          {addressType === 'shipping' && address.address_name && (
            <AddressText type="callout" bold>
              {address.address_name}
            </AddressText>
          )}
          {addressType === 'billing' &&
            get(address, 'firstname', '') &&
            get(address, 'firstname', '').toUpperCase() !== 'N/A' && (
              <TextGuide type="callout" bold>
                {`${address.firstname} ${address.lastname}`}
              </TextGuide>
            )}
          {addressType === 'billing' &&
            get(address, 'company') &&
            get(address, 'company').toUpperCase() !== 'N/A' && (
              <TextGuide type="callout" bold>
                {address.company}
              </TextGuide>
            )}
          <AddressText type="caption">
            {addressStringBuilder(address, false, langCode)}
          </AddressText>
          <Row justify="space-between">
            {addressType === 'shipping' && (
              <AddressCol>
                <TextGuide type="caption" as="span" padding="0 20px 0 0">
                  {translate('delivery_tool_bar_modal.receiver')}{' '}
                  {address.firstname} {address.lastname}
                </TextGuide>
                <TextGuide type="caption" as="span">
                  {translate('delivery_tool_bar_modal.mobile_no')}{' '}
                  {address.telephone}
                </TextGuide>
              </AddressCol>
            )}
            {addressType === 'billing' && (
              <Col>
                <TextGuide type="caption" as="span" padding="0 20px 0 0">
                  {translate('checkout_delivery.tax.tax_id')} {address.vat_id}
                </TextGuide>
                <br />
                <TextGuide type="caption" as="span">
                  {translate('checkout_delivery.tax.tel')} {address.telephone}
                </TextGuide>
              </Col>
            )}

            {(!disableEdit || !disableDelete) && (
              <CustomCol xs={12} sm={6} justifyContent={justifyContent}>
                {!disableEdit && (
                  <EditButton>
                    <Icon
                      width={10}
                      src="/assets/icons/ic-edit.svg"
                      style={{ marginRight: 5 }}
                    />
                    <TextGuide
                      as="span"
                      type="caption"
                      color="#666"
                      onClick={() => onEditAddressClick(address)}
                    >
                      {translate('button.edit')}
                    </TextGuide>
                  </EditButton>
                )}
                {!disableEdit && !disableDelete && (
                  <TextGuide
                    as="span"
                    type="caption"
                    color="#666"
                    padding="0 4px"
                  >
                    |
                  </TextGuide>
                )}

                {!disableDelete && (
                  <TextGuide
                    as="span"
                    type="caption"
                    color="#666"
                    onClick={() => onDeleteAddressClick(address)}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    {translate('button.del')}
                  </TextGuide>
                )}
              </CustomCol>
            )}
          </Row>
        </AddressCol>
      </Row>
    </AddressListItemWrapper>
  );
};

export default withLocales(AddressListItem);
