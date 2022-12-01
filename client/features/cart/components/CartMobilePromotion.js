import { Col, Icon, Image, Padding, Row, Text } from '@central-tech/core-ui';
import get from 'lodash/get';
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

const RowContainerItem = styled(Row)`
  background-color: ${props => props.color};
  ${props => props.isBorder && `border-bottom: solid 1px #e9e9e9`};
  ${props => props.contentWidth && `width: ${props.contentWidth}`}
`;

const ColumnItem = styled(Col)`
  display: flex;
  min-height: ${props => props.minHeight || 'auto'};
  max-height: ${props => props.maxHeight || 'auto'};
  align-items: center;
  align-self: center;
  justify-content: ${props => props.justifyContent || 'flex-start'};
  margin: ${props => props.marginContent || '0'};
  padding: ${props => props.padding || '0'};
`;

const Text2LineEllipsis = styled(Text)`
  position: relative;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 20px;
  cursor: pointer;
  word-break: break-word;
`;

const IconImage = styled(Icon)`
  cursor: pointer;
`;

const ImageProduct = styled(Image)`
  margin: 10px;
  cursor: pointer;
`;

const TextChangeBundle = styled(Text)`
  cursor: pointer;
  display: flex;
`;

const ColPromotion = styled(Col)`
  background-color: '#f7f7f7';
`;

const CartMobilePromotion = ({
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
    <RowContainerItem color="#f7f7f7" contentWidth="100%">
      <ColumnItem xs="auto">
        <Row>
          <ColPromotion xs={12}>
            <TextGuide
              xs="auto"
              type="caption-2"
              color="#666666"
              padding="0 0 0 19px"
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
      <ColumnItem
        xs="125px"
        justifyContent="flex-end"
        marginContent="0 22px 0 0"
      >
        <Row>
          <ColumnItem
            xs="97px"
            minHeight="20px"
            marginContent="0 8px 0 0"
            justifyContent="flex-end"
          >
            <TextGuide type="caption-2" color="#ec1d24">
              {parseInt(discountAmount) !== 0 ? `-${discountAmount}฿` : '-'}
            </TextGuide>
          </ColumnItem>
          <ColumnItem xs="20px" minHeight="20px" justifyContent="center">
            <IconImage
              data-testid={generateTestId({
                type: ELEMENT_TYPE.BUTTON,
                action: ELEMENT_ACTION.REMOVE,
                moduleName: 'CartMobilePromotion',
                uniqueId: 'onDeleteItem',
              })}
              src="/assets/icons/round-delete-24-px.svg"
              width={11.7}
              height={15}
              onClick={() => cartAction.deleteProductBundle({ productSkus })}
            />
          </ColumnItem>
        </Row>
      </ColumnItem>
    </RowContainerItem>
  ) : (
    <RowContainerItem color="#f7f7f7" isBorder>
      <ColumnItem xs="68px" minHeight="70px">
        <ImageProduct
          data-testid={generateTestId({
            type: ELEMENT_TYPE.IMAGE,
            action: ELEMENT_ACTION.VIEW,
            moduleName: 'CartMobilePromotion',
            uniqueId: `onViewProduct-${productItem?.pid || ''}`,
          })}
          src={`${baseMediaUrl}catalog/product${get(
            productItem,
            'image',
            '',
          )}?imwidth=50`}
          lazyload={false}
          defaultImage="/assets/images/tops_default.jpg"
          width="40px"
          height="40px"
          onClick={() => onViewProduct(gtmData)}
        />
      </ColumnItem>
      <ColumnItem xs="auto" minHeight="70px">
        <RowContainerItem color="#f7f7f7" contentWidth="100%">
          <Col xs={12}>
            <Padding xs="0 22px 0 0">
              <Row>
                <ColumnItem
                  xs="auto"
                  justifyContent="flex-start"
                  padding="0 10px 0 0"
                >
                  <Text2LineEllipsis
                    id="txt-product-name"
                    data-testid={generateTestId({
                      type: ELEMENT_TYPE.BUTTON,
                      action: ELEMENT_ACTION.VIEW,
                      moduleName: 'CartMobilePromotion',
                      uniqueId: `onViewProduct-${productItem?.pid || ''}`,
                    })}
                    as="span"
                    size={11}
                    color="#666666"
                    onClick={() => onViewProduct(gtmData)}
                    style={{ fontFamily: 'sans-serif ' }}
                  >
                    {`${translate('promotion.free')}: ${get(
                      productItem,
                      'name',
                      '',
                    )}`}
                  </Text2LineEllipsis>
                </ColumnItem>
                <ColumnItem
                  xs="105px"
                  justifyContent="flex-end"
                  // marginContent="0 22px 10px 0"
                  minHeight="36px"
                  maxHeight="28px"
                  padding="0 28px 0 0"
                >
                  <Text as="span" size={11} color="#666666">
                    {`${get(productItem, 'qty', '')} ${get(
                      productItem,
                      'consumerUnit',
                      '',
                    )}`}
                  </Text>
                </ColumnItem>
              </Row>
            </Padding>
          </Col>
          <Col xs={12}>
            <Row>
              <ColumnItem xs="auto">
                <TextChangeBundle
                  data-testid={generateTestId({
                    type: ELEMENT_TYPE.BUTTON,
                    action: ELEMENT_ACTION.VIEW,
                    moduleName: 'CartMobilePromotion',
                    uniqueId: 'openPromoBundleModal',
                  })}
                  color="#666666"
                  size={10}
                  onClick={() => openPromoBundleModal(promoCode, promoType)}
                >
                  <Icon
                    width={10}
                    src="/assets/icons/ic-edit.svg"
                    style={{ marginRight: 3 }}
                  />
                  <TextGuide xs="auto" type="caption-2" color="#666666">
                    {translate('promotion.change_free_items')}
                  </TextGuide>
                </TextChangeBundle>
              </ColumnItem>
              <ColumnItem
                xs="125px"
                justifyContent="flex-end"
                marginContent="0 22px 0 0"
              >
                <Row>
                  <ColumnItem
                    xs="97px"
                    minHeight="20px"
                    marginContent="0 8px 0 0"
                    justifyContent="flex-end"
                  >
                    <Text as="span" size={12} color="#666666" bold>
                      {translate('promotion.free')}
                    </Text>
                  </ColumnItem>
                  <ColumnItem
                    xs="20px"
                    minHeight="20px"
                    justifyContent="center"
                  >
                    <IconImage
                      data-testid={generateTestId({
                        type: ELEMENT_TYPE.BUTTON,
                        action: ELEMENT_ACTION.REMOVE,
                        moduleName: 'CartMobilePromotion',
                        uniqueId: 'onDeleteItem',
                      })}
                      src="/assets/icons/round-delete-24-px.svg"
                      width={11.7}
                      height={15}
                      onClick={() =>
                        cartAction.deleteProductBundle({ productSkus })
                      }
                    />
                  </ColumnItem>
                </Row>
              </ColumnItem>
            </Row>
          </Col>
        </RowContainerItem>
      </ColumnItem>
    </RowContainerItem>
  );
};

export default withLocales(CartMobilePromotion);
