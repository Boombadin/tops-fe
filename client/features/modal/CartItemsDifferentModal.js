import React from 'react';
import { map } from 'lodash';
import styled from 'styled-components';
import { Modal, Row, Col, Button, breakpoint } from '@central-tech/core-ui';
import { TextGuide } from '../../components/Typography';
import ModalTemplate from './components/ModalTemplate';
import ProductDiff from '../product/components/ProductDiff';
import withLocales from '../../hoc/withLocales';

const ProductListContainer = styled.div`
  height: 300px;
  overflow-y: scroll;

  ${breakpoint('xs', 'sm')`
    height: 100%;
  `}
`;
const ButtonConfirm = styled(Button)`
  border-radius: 4px;
  ${breakpoint('xs', 'sm')`
    border-radius: 0;
  `}
`;
const CustomCol = styled(Col)`
  text-align: left;
  ${breakpoint('xs', 'sm')`
    text-align: center;
  `};
`;
const CartItemsDifferentModal = ({
  translate,
  open,
  products,
  handleTransferCart,
  isConfirm,
  close,
}) => {
  return (
    <ModalTemplate
      open={open}
      title={translate('product_diff.title')}
      description={translate('product_diff.description', {
        qty: products.length,
      })}
      isCloseIcon={false}
      close={close}
      closeOnClick={false}
      renderFooter={
        <Row justify={isConfirm ? 'space-between' : 'center'}>
          {isConfirm ? (
            <React.Fragment>
              <CustomCol xs={6} md={6}>
                <Button color="none" width={120} height={40} onClick={close}>
                  <Modal.Close>
                    <TextGuide type="body" align="center">
                      {translate('product_diff.button.same_address')}
                    </TextGuide>
                  </Modal.Close>
                </Button>
              </CustomCol>
              <Col align="right" xs={6} md="170px">
                <ButtonConfirm
                  color="success"
                  block
                  height={40}
                  onClick={handleTransferCart}
                >
                  <TextGuide type="body" align="center" color="#fff">
                    {translate('product_diff.button.change_address')}
                  </TextGuide>
                </ButtonConfirm>
              </Col>
            </React.Fragment>
          ) : (
            <Col align="center" xs={12} md="170px">
              <ButtonConfirm
                color="success"
                block
                height={40}
                onClick={handleTransferCart}
              >
                <TextGuide type="body" align="center" color="#fff">
                  {translate('product_diff.button.ok')}
                </TextGuide>
              </ButtonConfirm>
            </Col>
          )}
        </Row>
      }
    >
      <ProductListContainer>
        {map(products, product => {
          return <ProductDiff product={product} />;
        })}
      </ProductListContainer>
    </ModalTemplate>
  );
};

export default withLocales(CartItemsDifferentModal);
