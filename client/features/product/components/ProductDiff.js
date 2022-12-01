import React from 'react';
import { get, find, isEmpty, map, forEach } from 'lodash';
import styled from 'styled-components';
import { Row, Col, Padding, Image, Text } from '@central-tech/core-ui';
import withLocales from '../../../hoc/withLocales';

const ProductDiffContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const RowProduct = styled(Row)`
  width: 350px;
`;

const StockQty = styled(Col)`
  display: flex;
  justify-content: center;
  padding: 0 5px;
`;

const TextStockQty = styled(Text)`
  border-radius: 5px;
  background-color: #e2e2e2;
  text-align: center;
  width: 100%;
  line-height: 22px;
  max-height: 22px;
`;

const TextOpacity = styled(Text)`
  opacity: ${props => (props.isOpacity ? '0.3' : '1')};
`;

const ImageProduct = styled(Image)`
  opacity: ${props => (props.isOpacity ? '0.3' : '1')};
`;

const ProductDiff = ({ translate, product, onViewProduct }) => {
  const findUnit = find(get(product, 'custom_attributes_option', {}), item => {
    return get(item, 'attribute_code', '') === 'consumer_unit';
  });
  let consumerUnit = get(findUnit, 'value', get(product, 'consumer_unit'));
  const weightItemInd = product?.weight_item_ind;
  const sellingUnit = get(product, 'selling_unit', consumerUnit);

  if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
    consumerUnit = sellingUnit;
  }

  const oldPrice = get(product, 'old_price', 0);
  const price = get(product, 'base_price_incl_tax', get(product, 'price', 0));

  const isOpacity = find(
    product?.error,
    error => error?.text === 'out_of_stock',
  );
  const productDisabled = find(
    product?.error,
    error => error?.text === 'product_disabled',
  );
  const productBundleNotEnoughQuant = find(
    product?.error,
    error => error?.text === 'product_bundle_not_enough_quant',
  );
  const notEnoughQuant = find(
    product?.error,
    error => error?.text === 'not_enough_quant',
  );
  const priceChanged = find(
    product?.error,
    error => error?.text === 'price_changed',
  );
  const maxQty = find(product?.error, error => error?.text === 'max_qty');
  const byPassError = find(product?.error, error => error?.parameters);

  return (
    <ProductDiffContainer>
      <RowProduct>
        <Col xs={3} minHeight="80px">
          <Padding inline xs="15px 10px 15px 8px">
            <ImageProduct
              src={`${get(product, 'image', '')}?imwidth=50`}
              lazyload={false}
              defaultImage="/assets/images/tops_default.jpg"
              width={50}
              height={50}
              isOpacity={!isEmpty(isOpacity)}
              onClick={onViewProduct}
            />
          </Padding>
        </Col>
        <Col xs={9}>
          <Padding
            inline
            xs="15px 10px 15px 0"
            style={{
              width: '100%',
            }}
          >
            <Row>
              <Col xs={8}>
                <TextOpacity
                  as="span"
                  size={13}
                  color="#2a2a2a"
                  isOpacity={isOpacity}
                >
                  {get(product, 'name', '')}
                </TextOpacity>
              </Col>
              {get(productDisabled, 'text') !== 'product_disabled' &&
                get(productBundleNotEnoughQuant, 'text') !==
                  'product_bundle_not_enough_quant' && (
                  <React.Fragment>
                    <StockQty xs={4}>
                      <TextStockQty as="span" size={13} color="#2a2a2a">
                        {get(notEnoughQuant, 'text', '') ===
                          'not_enough_quant' ||
                        get(maxQty, 'text', '') === 'max_qty' ||
                        get(byPassError, 'text') === 'product_group_limit_alert'
                          ? get(
                              maxQty,
                              'missingQuantity',
                              get(
                                notEnoughQuant,
                                'missingQuantity',
                                get(byPassError, 'parameters.remain_qty', 0),
                              ),
                            )
                          : '-'}
                      </TextStockQty>
                    </StockQty>
                    <Col xs={12}>
                      {get(priceChanged, 'text') === 'price_changed' ? (
                        <TextOpacity
                          size={13}
                          isOpacity={!isEmpty(isOpacity)}
                        >{`${oldPrice} ➝ ${price} / ${consumerUnit}`}</TextOpacity>
                      ) : (
                        <TextOpacity
                          size={13}
                          isOpacity={!isEmpty(isOpacity)}
                        >{`${price} / ${consumerUnit}`}</TextOpacity>
                      )}
                    </Col>
                  </React.Fragment>
                )}

              <Col xs={12}>
                {map(product.error, error => {
                  let errorMessage = '';
                  if (
                    get(error, 'text', '') ===
                    'Product that you are trying to add is not available.'
                  ) {
                    errorMessage = `${get(error, 'text', '')}`;
                  } else if (!isEmpty(get(error, 'parameters', {}))) {
                    errorMessage = `${get(
                      error,
                      'parameters.product_group_error',
                      '',
                    )}`;
                  } else if (
                    get(error, 'maxQuantity', false) ||
                    get(error, 'maxQuantity') === 0
                  ) {
                    errorMessage = translate(`product_diff.error.max_qty`, {
                      qty: get(error, 'maxQuantity', 1),
                    });
                  } else {
                    errorMessage = translate(
                      `product_diff.error.${get(error, 'text', '')}`,
                    );
                  }

                  return (
                    <div>
                      <Text size={13} color="#ec1d24">
                        {`*${errorMessage}`}
                      </Text>
                    </div>
                  );
                })}
              </Col>

              {/* {get(product, 'error.text') !== 'product_disabled' &&
                get(product, 'error.text') !==
                  'product_bundle_not_enough_quant' && (
                  <React.Fragment>
                    <StockQty xs={4}>
                      <TextStockQty as="span" size={13} color="#2a2a2a">
                        {get(product, 'error.text', '') ===
                          'not_enough_quant' ||
                        get(product, 'error.text', '') === 'max_qty'
                          ? get(product, 'error.missingQuantity', '')
                          : '-'}
                      </TextStockQty>
                    </StockQty>
                    <Col xs={12}>
                      {get(product, 'error.text') === 'price_changed' ? (
                        <TextOpacity
                          size={13}
                          isOpacity={isOpacity}
                        >{`${oldPrice} ➝ ${price} / ${consumerUnit}`}</TextOpacity>
                      ) : (
                        <TextOpacity
                          size={13}
                          isOpacity={isOpacity}
                        >{`${price} / ${consumerUnit}`}</TextOpacity>
                      )}
                    </Col>
                  </React.Fragment>
                )} */}

              {/* <Col xs={12}>
                <Text size={13} color="#ec1d24">
                  {get(product, 'error.maxQuantity', false)
                    ? translate(`product_diff.error.max_qty`, {
                        qty: get(product, 'error.maxQuantity', 1),
                      })
                    : translate(
                        `product_diff.error.${get(product, 'error.text', '')}`,
                      )}
                </Text>
              </Col> */}
            </Row>
          </Padding>
        </Col>
      </RowProduct>
    </ProductDiffContainer>
  );
};

export default withLocales(ProductDiff);
