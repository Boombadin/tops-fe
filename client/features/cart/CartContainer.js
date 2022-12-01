import { Col, HideMobile, Padding, Row, Text } from '@central-tech/core-ui';
import get from 'lodash/get';
import map from 'lodash/map';
import pt from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { TextGuide } from '@client/components/Typography';
import CartBundleItems from '@client/features/cart/CartBundleItems';
import CartEmpty from '@client/features/cart/CartEmpty';
import CartItems from '@client/features/cart/CartItems';
import CartLimitDelivery from '@client/features/cart/CartLimitDelivery';
import {
  splitBundleLimitDelivery,
  splitLimitDelivery,
} from '@client/features/cart/utils/functions';
import withLocales from '@client/hoc/withLocales';
import { openPromoBundleModal } from '@client/reducers/promoBundle';
import { isCartLoadedSelector } from '@client/selectors';

const RowHeaderContainer = styled(Row)`
  background-color: #ffffff;
`;

const TextHeaderGroup = styled(Text)`
  background-color: ${props => props.bgColor || '#f7f7f7'};
  display: flex;
`;

const ColumnHeader = styled(Col)`
  display: flex;
  height: 36px;
  align-items: center;
  justify-content: ${props => props.justifyContent || 'flex-start'};
`;

const PaddingContainer = styled(Padding)`
  /* overflow: hidden; */
`;

const RowGroupCategory = styled(Row)`
  flex-direction: column;
`;

@withLocales
class CartContainer extends PureComponent {
  static propTypes = {
    isMiniCart: pt.bool,
  };

  static defaultProps = {
    isMiniCart: false,
  };

  renderHeader = () => {
    const { translate } = this.props;
    return (
      <RowHeaderContainer>
        <ColumnHeader xs="auto">
          <TextGuide type="caption" bold="bold" color="#2a2a2a">
            {translate('cart.product_list')}
          </TextGuide>
        </ColumnHeader>
        <ColumnHeader xs="60px" justifyContent="flex-end">
          <TextGuide type="caption" bold="bold" color="#2a2a2a">
            {translate('cart.product_price')}
          </TextGuide>
        </ColumnHeader>
        <ColumnHeader xs="140px" justifyContent="center">
          <TextGuide type="caption" bold="bold" color="#2a2a2a">
            {translate('cart.product_quantity')}
          </TextGuide>
        </ColumnHeader>
        <ColumnHeader xs="60px">
          <TextGuide type="caption" bold="bold" color="#2a2a2a">
            {translate('cart.product_unit')}
          </TextGuide>
        </ColumnHeader>
        <ColumnHeader xs="70px" justifyContent="flex-end">
          <TextGuide type="caption" bold="bold" color="#2a2a2a">
            {translate('cart.product_discount')}
          </TextGuide>
        </ColumnHeader>
        <ColumnHeader xs="100px" justifyContent="flex-end">
          <TextGuide type="caption" bold="bold" color="#2a2a2a">
            {translate('cart.product_subtotal')}
          </TextGuide>
        </ColumnHeader>
        <ColumnHeader xs="50px" />
      </RowHeaderContainer>
    );
  };

  renderProductItem = products => {
    const { storeConfig, isMiniCart, mainCategory } = this.props;
    return (
      <CartItems
        mainCategory={mainCategory}
        products={products}
        storeConfig={storeConfig}
        isMiniCart={isMiniCart}
      />
    );
  };

  openPromoBundleModal = (promotionNo, promotionType) => {
    this.props.openPromoBundleModal(promotionNo, promotionType);
  };

  renderRowBundle = bundle => {
    const { isMiniCart } = this.props;
    return (
      <CartBundleItems
        key={bundle?.id}
        bundle={bundle}
        openPromoBundleModal={this.openPromoBundleModal}
        isMiniCart={isMiniCart}
      />
    );
  };

  renderBundlePromotion = (cartBundle, itemsBundle) => {
    const { translate, isMiniCart } = this.props;

    return (
      cartBundle > 0 && (
        <React.Fragment>
          <TextHeaderGroup
            xs="auto"
            as="span"
            size={12}
            color="#2a2a2a"
            lineHeight="20px"
            padding={isMiniCart ? '0 19px' : '0 10px'}
          >
            {translate('promotion.title')}
          </TextHeaderGroup>
          {cartBundle > 0 && map(itemsBundle, this.renderRowBundle)}
        </React.Fragment>
      )
    );
  };

  render() {
    const {
      storeConfig,
      translate,
      isMiniCart,
      itemsBundle,
      itemsExcludeBundle,
    } = this.props;
    const cartProduct = splitLimitDelivery(itemsExcludeBundle, storeConfig);
    const cartBundle = splitBundleLimitDelivery(itemsBundle, storeConfig);

    return itemsExcludeBundle.length > 0 || itemsBundle.length > 0 ? (
      <PaddingContainer xs="0" md={!isMiniCart ? '20px' : '0'}>
        {!isMiniCart && <HideMobile>{this.renderHeader()}</HideMobile>}
        <Padding xs="0 0 70px" md="0">
          <RowGroupCategory>
            {get(cartProduct, 'seasonal', []).length > 0 ? (
              <React.Fragment>
                <CartLimitDelivery
                  title={translate(
                    'right_menu.cart.limited_day_shipping_item',
                    {
                      date: get(cartProduct, 'dateLimit', ''),
                    },
                  )}
                  isLimitItems
                >
                  {this.renderBundlePromotion(
                    get(cartBundle, 'seasonalBundles', []).length,
                    itemsBundle,
                  )}
                  {this.renderProductItem(get(cartProduct, 'seasonal', []))}
                </CartLimitDelivery>
                <CartLimitDelivery
                  title={`${translate('right_menu.cart.normal_shipping_item')}`}
                >
                  {this.renderBundlePromotion(
                    get(cartBundle, 'normalBundles', []).length,
                    itemsBundle,
                  )}
                  {this.renderProductItem(get(cartProduct, 'normal', []))}
                </CartLimitDelivery>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.renderBundlePromotion(
                  get(cartBundle, 'normalBundles', []).length,
                  itemsBundle,
                )}
                {this.renderProductItem(get(cartProduct, 'normal', []))}
              </React.Fragment>
            )}
          </RowGroupCategory>
        </Padding>
      </PaddingContainer>
    ) : (
      <CartEmpty isMiniCart={isMiniCart} />
    );
  }
}

const mapStateToProps = state => ({
  itemsExcludeBundle: state.cart.itemsExcludeBundle,
  itemsBundle: state.cart.itemsBundle,
  mainCategory: state.category.mainCategory,
  storeConfig: state.storeConfig.current,
  isCartLoaded: isCartLoadedSelector(state),
});

const mapDispatchToProps = dispatch => ({
  openPromoBundleModal: (promotionNo, promotionType) =>
    dispatch(openPromoBundleModal(promotionNo, promotionType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);
