import { Col, Icon, Image, Row, Text } from '@central-tech/core-ui';
import React from 'react';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import { useCartContext } from '@client/contexts';
import { simpleAction } from '@client/features/cart/utils/simpleAction';
import withLocales from '@client/hoc/withLocales';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateTestId,
} from '@client/utils/generateElementId';

const ImageProduct = styled(Image)`
  margin: 10px;
  cursor: pointer;
`;

const TextChangeBundle = styled(Text)`
  cursor: pointer;
  display: flex;
`;

const Text2LineEllipsis = styled(Text)`
  position: relative;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 22px;
  cursor: pointer;
`;

const RowContainerItem = styled(Row)`
  background-color: ${props => props.color};
  border-bottom: solid 1px #e9e9e9;

  ${props => props.height && `height: ${props.height};`}
`;

const ColumnItem = styled(Col)`
  display: flex;
  min-height: 25px;
  align-items: center;
  justify-content: ${props => props.justifyContent || 'flex-start'};
`;

const IconImage = styled(Icon)`
  cursor: pointer;
`;

const ColPromotion = styled(Col)`
  background-color: ${props => props.color || '#f7f7f7'};
`;

const CartDesktopPromotion = ({
  openPromoBundleModal,
  promoCode,
  promoType,
  gtmData,
  productItem,
  productSkus,
  discountAmount,
  baseMediaUrl,
  onViewProduct,
  translate,
  actionDiscountType,
  promotionLabel,
}) => {
  const { cartAction } = useCartContext();

  return actionDiscountType === simpleAction?.groupn ||
    actionDiscountType === simpleAction?.cart_fixed ||
    actionDiscountType === simpleAction?.groupn_fixdisc ? (
    <RowContainerItem color="#f7f7f7">
      <ColumnItem xs="auto">
        <Row>
          <ColPromotion xs={12}>
            <TextGuide
              xs="auto"
              type="caption-2"
              color="#666666"
              padding="0 19px"
            >
              {actionDiscountType === simpleAction?.cart_fixed ||
              actionDiscountType === simpleAction?.groupn_fixdisc
                ? translate('promotion.promotion_online', {
                    label: promotionLabel ? `(${promotionLabel})` : '',
                  })
                : translate('promotion.promotion_discount', {
                    amount: discountAmount,
                  })}
            </TextGuide>
          </ColPromotion>
        </Row>
      </ColumnItem>
      <ColumnItem xs="60px" justifyContent="flex-end" />
      <ColumnItem xs="140px" justifyContent="center" />
      <ColumnItem xs="60px" />
      <ColumnItem xs="70px" justifyContent="flex-end">
        <TextGuide type="caption-2" color="#ec1d24">
          {parseInt(discountAmount) !== 0 ? `-${discountAmount}฿` : '-'}
        </TextGuide>
      </ColumnItem>
      <ColumnItem xs="100px" justifyContent="flex-end" />
      <ColumnItem xs="50px" justifyContent="center">
        <IconImage
          data-testid={generateTestId({
            type: ELEMENT_TYPE.BUTTON,
            action: ELEMENT_ACTION.REMOVE,
            moduleName: 'CartDesktopPromotion',
            uniqueId: 'onDeleteItem',
          })}
          src="/assets/icons/round-delete-24-px.svg"
          width={11.7}
          height={15}
          onClick={() => cartAction.deleteProductBundle({ productSkus })}
        />
      </ColumnItem>
    </RowContainerItem>
  ) : (
    <RowContainerItem color="#f7f7f7" height="60px">
      <ColumnItem xs="auto">
        <ImageProduct
          data-testid={generateTestId({
            type: ELEMENT_TYPE.IMAGE,
            action: ELEMENT_ACTION.VIEW,
            moduleName: 'CartDesktopPromotion',
            uniqueId: `onViewProduct-${productItem?.pid || ''}`,
          })}
          src={`${baseMediaUrl}catalog/product${productItem?.image ||
            ''}?imwidth=50`}
          lazyload={false}
          defaultImage="/assets/images/tops_default.jpg"
          width="40px"
          height="40px"
          onClick={() => onViewProduct(gtmData)}
        />
        <Row>
          <Col xs={12}>
            <Text2LineEllipsis
              data-testid={generateTestId({
                type: ELEMENT_TYPE.BUTTON,
                action: ELEMENT_ACTION.VIEW,
                moduleName: 'CartDesktopPromotion',
                uniqueId: `onViewProduct-${productItem?.pid || ''}`,
              })}
              id="txt-product-name"
              as="span"
              size={12}
              color="#666666"
              onClick={() => onViewProduct(gtmData)}
            >
              {`${productItem?.name || ''}`}
            </Text2LineEllipsis>
          </Col>
          <Col xs={12}>
            <TextChangeBundle
              data-testid={generateTestId({
                type: ELEMENT_TYPE.BUTTON,
                action: ELEMENT_ACTION.VIEW,
                moduleName: 'CartDesktopPromotion',
                uniqueId: 'openPromoBundleModal',
              })}
              color="#666666"
              size={10}
              onClick={() => openPromoBundleModal(promoCode, promoType)}
            >
              <Icon
                width={10}
                src="/assets/icons/ic-edit.svg"
                style={{ marginRight: 1 }}
              />
              <TextGuide
                xs="auto"
                type="caption-2"
                color="#666666"
                style={{ fontSize: '10px' }}
              >
                {translate('promotion.change_free_items')}
              </TextGuide>
            </TextChangeBundle>
          </Col>
        </Row>
      </ColumnItem>
      <ColumnItem xs="60px" justifyContent="flex-end">
        <Text as="span" size={12} color="#666666"></Text>
      </ColumnItem>
      <ColumnItem xs="140px" justifyContent="center">
        <Text as="span" size={12} color="#666666">
          {productItem?.qty || ''}
        </Text>
      </ColumnItem>
      <ColumnItem xs="60px">
        <Text as="span" size={12} color="#666666">
          {productItem?.consumerUnit || ''}
        </Text>
      </ColumnItem>
      <ColumnItem xs="70px" justifyContent="flex-end" />
      <ColumnItem xs="100px" justifyContent="flex-end">
        <Text as="span" size={12} color="#666666" bold margin="2px 0 0 0">
          {translate('promotion.free')}
        </Text>
      </ColumnItem>
      <ColumnItem xs="50px" justifyContent="center">
        <IconImage
          data-testid={generateTestId({
            type: ELEMENT_TYPE.BUTTON,
            action: ELEMENT_ACTION.REMOVE,
            moduleName: 'CartDesktopPromotion',
            uniqueId: 'onDeleteItem',
          })}
          src="/assets/icons/round-delete-24-px.svg"
          width={11.7}
          height={15}
          onClick={() => cartAction.deleteProductBundle({ productSkus })}
        />
      </ColumnItem>
    </RowContainerItem>
  );
};

export default withLocales(CartDesktopPromotion);
