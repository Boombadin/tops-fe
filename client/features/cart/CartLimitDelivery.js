import React from 'react';
import styled from 'styled-components';
import { Text } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';

const TextHeaderGroup = styled(Text)`
  background-color: ${props => props.bgColor || '#f7f7f7'};
  ${props => props.isMargin && `margin: ${props.isMargin};`}
`;

const CartLimitDelivery = ({ title, children, isLimitItems }) => (
  <React.Fragment>
    <TextHeaderGroup
      xs="auto"
      as="span"
      size={11}
      color={isLimitItems ? '#ff8e00' : '#666666'}
      lineHeight="18px"
      padding="0 19px"
      isMargin={isLimitItems ? '' : '20px 0 0'}
      bgColor={isLimitItems ? '#fff3e4' : '#f7f7f7'}
    >
      {title}
    </TextHeaderGroup>
    {children || ''}
  </React.Fragment>
);

export default withLocales(CartLimitDelivery);
