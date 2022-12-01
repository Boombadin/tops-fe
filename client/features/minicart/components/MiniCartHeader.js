import { Icon, Padding, Text } from '@central-tech/core-ui';
import React from 'react';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';

const MiniCartHeaderContainer = styled.div`
  display: flex;
  background-color: #f7f7f7;
  height: 39px;
  border-radius: 4px 4px 0 0;
  align-items: center;
  justify-content: space-between;
  padding: 8px 19px 4px;
`;

const DeleteAll = styled(Text)`
  cursor: pointer;
`;

const MiniCartHeader = ({ isCartEmpty, translate, onDeleteAll }) => (
  <MiniCartHeaderContainer>
    <Text as="span" size={15} bold color="#2a2a2a" display="flex">
      {translate('mini_cart.title')}
    </Text>
    {!isCartEmpty && (
      <Padding xs="0" style={{ display: 'flex' }}>
        <Icon
          src="/assets/icons/round-delete.svg"
          style={{ marginRight: 3 }}
          width={8}
        />
        <DeleteAll size={11} onClick={onDeleteAll}>
          <TextGuide xs="auto" type="caption-2" color="#666666">
            {translate('multi_checkout.mobile_header.delete_all')}
          </TextGuide>
        </DeleteAll>
      </Padding>
    )}
  </MiniCartHeaderContainer>
);

export default MiniCartHeader;
