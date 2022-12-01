import {
  breakpoint,
  Col,
  Icon,
  Image,
  Padding,
  Row,
  Text,
} from '@central-tech/core-ui';
import get from 'lodash/get';
import React from 'react';
import styled from 'styled-components';

import { useCartContext } from '@client/contexts';
import CartIncrementInputQty from '@client/features/cart/components/CartIncrementInputQty';
import BadgeIcon from '@client/features/promotion/BadgeIcons';
import { formatPrice } from '@client/utils/price';

const RowContainerItem = styled(Row)`
  background-color: ${props => props.color || '#ffffff'};
  ${props => props.isBorder && `border-bottom: solid 1px #e9e9e9`};
  ${props => props.contentWidth && `width: ${props.contentWidth}`}
`;

const ColumnItem = styled(Col)`
  display: flex;
  min-height: ${props => props.minHeight || 'auto'};
  max-height: ${props => props.maxHeight || 'auto'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  margin: ${props => props.marginContent || '0'};
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
  line-height: 22px;
  cursor: pointer;
  word-break: break-word;

  ${breakpoint('xs', 'sm')`
    max-height: 40px;
    line-height: 22px;
  `};
`;

const IconImage = styled(Icon)`
  cursor: pointer;
`;

const CartMobileItem = React.memo(
  ({
    allowTooltipOnMount,
    pid,
    sku,
    qty,
    priceInclTax,
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
    isMiniCart,
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
        <RowContainerItem color="#ffffff" isBorder>
          <ColumnItem xs="68px" minHeight="80px">
            <Padding inline xs="15px 10px 15px 8px">
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
          </ColumnItem>
          <ColumnItem xs="auto" minHeight="80px">
            <RowContainerItem contentWidth="100%">
              <Col xs={12}>
                <Padding xs="0 22px 0 0">
                  <Row>
                    <ColumnItem
                      xs="auto"
                      justifyContent="flex-start"
                      marginContent="10px 0 10px 0"
                      padding="0 10px 0 0"
                    >
                      <Text2LineEllipsis
                        id="txt-product-name"
                        as="span"
                        size={13}
                        color="#2a2a2a"
                        onClick={onViewProduct}
                      >
                        {name}
                      </Text2LineEllipsis>
                    </ColumnItem>
                    <ColumnItem
                      xs="105px"
                      justifyContent="center"
                      marginContent="10px 0 0 0"
                      minHeight="36px"
                      maxHeight="28px"
                    >
                      {type === 'bundle' ? (
                        <Text
                          id={`txt-cartQty-sku${sku}`}
                          as="span"
                          size={13}
                          color="#2a2a2a"
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
                          alignTooltip="right"
                          type={type}
                          tooltipPosition="bottom"
                        />
                      )}
                    </ColumnItem>
                  </Row>
                </Padding>
              </Col>
              <Col xs={12}>
                <Row>
                  <ColumnItem
                    xs="auto"
                    style={{ display: 'block' }}
                    marginContent="0 0 5px 0"
                  >
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
                      isMiniCart={isMiniCart}
                      height={28}
                    />
                  </ColumnItem>
                  <ColumnItem
                    xs="125px"
                    justifyContent="flex-end"
                    marginContent="0 22px 0 0"
                  >
                    <Row
                      style={{
                        height: '20px',
                        display: 'flex',
                        alignSelf: 'center',
                      }}
                    >
                      <ColumnItem
                        xs="97px"
                        minHeight="20px"
                        marginContent="0 8px 0 0"
                        justifyContent="flex-end"
                      >
                        <Text
                          id="txt-product-price"
                          as="span"
                          size={13}
                          color="#2a2a2a"
                          bold
                          style={{
                            padding: '2px 0 0 0',
                          }}
                        >
                          {`${formatPrice(netPrice) || 0} ฿`}
                        </Text>
                      </ColumnItem>
                      <ColumnItem
                        xs="20px"
                        minHeight="20px"
                        justifyContent="flex-end"
                      >
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
                    </Row>
                  </ColumnItem>
                </Row>
              </Col>
            </RowContainerItem>
          </ColumnItem>
        </RowContainerItem>
      </React.Fragment>
    );
  },
);

export default CartMobileItem;
