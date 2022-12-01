import React from 'react';
import styled from 'styled-components';
import { Text, Image, Row, Button } from '@central-tech/core-ui';
import withLocales from '../../hoc/withLocales';

const Wrapper = styled(Row)`
  align-items: center;
  min-height: 295px;
  flex-direction: column;
`;

const CartEmpty = ({ translate, isMiniCart }) => (
  <Wrapper alignItem="center" justify="center">
    <Image
      src="/assets/images/no-item-in-cart.svg"
      lazyload={false}
      width="50px"
    />
    <Text as="span" size={15} color="#cccccc" margin="19px 0" bold>
      {translate('checkout.steps.checklist.empty_cart')}
    </Text>
    {!isMiniCart && (
      <Button
        id={`btn-cartEmpty`}
        className="btn-cartEmpty"
        color="#ec1d24"
        textColor="#ffffff"
        size={15}
        width={220}
        height={40}
        radius="4px"
        onClick={() => (window.location.href = '/')}
      >
        {translate('button.continue_shopping')}
      </Button>
    )}
  </Wrapper>
);

export default withLocales(CartEmpty);
