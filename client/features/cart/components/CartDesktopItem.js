import { Col, Icon, Image, Padding, Row, Text } from '@central-tech/core-ui';
import get from 'lodash/get';
import includes from 'lodash/includes';
import replace from 'lodash/replace';
import toLower from 'lodash/toLower';
import React from 'react';
import styled from 'styled-components';

import { useCartContext } from '@client/contexts';
import CartIncrementInputQty from '@client/features/cart/components/CartIncrementInputQty';
import BadgeIcon from '@client/features/promotion/BadgeIcons';
import { formatPrice } from '@client/utils/price';

const RowContainerItem = styled(Row)`
  background-color: ${props => props.color || '#ffffff'};
  border-bottom: solid 1px #e9e9e9;
`;

const ColumnItem = styled(Col)`
  display: flex;
  min-height: 80px;
  /* align-items: center; */
  margin-top: ${props => props.marginTop || '13px'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
`;

const ImageProduct = styled(Image)`
  cursor: pointer;
`;

const Text2LineEllipsis = styled(Text)`
  position: relative;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 20px;
  cursor: pointer;
`;

const IconImage = styled(Icon)`
  cursor: pointer;

  ${props =>
    props.isDisabled &&
    `filter: grayscale(100%);
    opacity: 0.3;
  `}
`;

const CartDesktopItem = React.memo(
  ({
    allowTooltipOnMount,
    pid,
    sku,
    qty,
    priceInclTax,
    discountAmount,
    promotionType,
    image,
    name,
    specialBadge,
    extensionAttributes,
    the1cardStartdate,
    the1cardEnddate,
    the1cardPoint,
    the1cardPerQty,
    consumerUnit,
    specialPrice,
    originalPrice,
    specialToDate,
    customAttributesOption,
    storeConfig,
    promoQtyStep,
    onViewProduct,
    url,
    productSkus,
    type = 'product',
  }) => {
    const { cartAction } = useCartContext();
    const baseMediaUrl = get(storeConfig, 'base_media_url', '');
    const productPrice =
      parseInt(specialPrice) > 0 ? parseInt(specialPrice) : priceInclTax;
    const discount =
      parseInt(specialPrice) > 0 ? parseInt(specialPrice) - priceInclTax : 0;
    let netPrice = productPrice * qty;
    netPrice = (productPrice - discount) * qty;

    const onDeleteProduct = () => {
      if (type === 'bundle' || type === 'product_bundle') {
        cartAction.deleteProductBundle({
          productSkus,
        });
      } else {
        cartAction.deleteProduct({
          productSku: sku,
        });
      }
    };

    return (
      <React.Fragment>
        <RowContainerItem color="#ffffff">
          <ColumnItem xs="auto">
            <Padding inline xs="0 10px 0 10px">
              <ImageProduct
                src={`${baseMediaUrl}catalog/product${image}?imwidth=50`}
                lazyload={false}
                defaultImage="/assets/images/tops_default.jpg"
                width={50}
                height={50}
                onClick={onViewProduct}
                data-cart-pid={sku}
                data-cart-target={url}
              />
            </Padding>
            <Row>
              <Col xs={12}>
                <Text2LineEllipsis
                  id="lbl-productName"
                  as="span"
                  size={13}
                  color="#2a2a2a"
                  onClick={onViewProduct}
                >
                  {name}
                </Text2LineEllipsis>
              </Col>
              <Col xs={12}>
                <BadgeIcon
                  specialBadge={specialBadge}
                  extensionAttributes={extensionAttributes}
                  the1cardStartdate={the1cardStartdate}
                  the1cardEnddate={the1cardEnddate}
                  the1cardPoint={the1cardPoint}
                  the1cardPerQty={the1cardPerQty}
                  consumerUnit={consumerUnit}
                  specialPrice={specialPrice}
                  originalPrice={originalPrice}
                  specialToDate={specialToDate}
                  customAttributesOption={customAttributesOption}
                  storeConfig={storeConfig}
                  height={28}
                />
              </Col>
            </Row>
          </ColumnItem>
          <ColumnItem xs="60px" justifyContent="flex-end">
            <Text as="span" size={13} color="#2a2a2a" lineHeight="20px">
              {formatPrice(priceInclTax) || 0}
            </Text>
          </ColumnItem>
          <ColumnItem
            xs="140px"
            justifyContent="center"
            marginTop={type !== 'bundle' ? '8px' : ''}
          >
            {type === 'bundle' ? (
              <Text
                id={`txt-cartQty-sku${sku}`}
                as="span"
                size={13}
                color="#2a2a2a"
                lineHeight="20px"
              >
                {qty}
              </Text>
            ) : (
              <CartIncrementInputQty
                allowTooltipOnMount={allowTooltipOnMount}
                pid={pid}
                sku={sku}
                extensionAttributes={extensionAttributes}
                qty={qty}
                promoQtyStep={promoQtyStep}
                alignTooltip="left"
                type={type}
                tooltipPosition="top"
              />
            )}
          </ColumnItem>
          <ColumnItem xs="60px">
            <Text as="span" size={13} color="#2a2a2a" lineHeight="20px">
              {consumerUnit}
            </Text>
          </ColumnItem>
          <ColumnItem xs="70px" justifyContent="flex-end">
            {type !== 'bundle' && (
              <Text as="span" size={13} color="#2a2a2a" lineHeight="20px">
                {!includes(
                  ['red_hot', 'sale'],
                  toLower(replace(promotionType, ' ', '_')),
                ) && parseInt(discountAmount) !== 0
                  ? formatPrice(discountAmount)
                  : '-'}
              </Text>
            )}
          </ColumnItem>
          <ColumnItem xs="100px" justifyContent="flex-end">
            <Text as="span" size={13} color="#2a2a2a" lineHeight="20px" bold>
              {formatPrice(netPrice) || 0}
            </Text>
          </ColumnItem>
          <ColumnItem xs="50px" justifyContent="center">
            {type !== 'bundle' && (
              <IconImage
                id={`btn-removeCart-sku${sku}`}
                src="/assets/icons/round-delete-24-px.svg"
                width={11.7}
                height={15}
                onClick={onDeleteProduct}
              />
            )}
          </ColumnItem>
        </RowContainerItem>
      </React.Fragment>
    );
  },
);

export default CartDesktopItem;
