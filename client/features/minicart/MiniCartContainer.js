import {
  Col,
  FullScreenLoading,
  Icon,
  Loading,
  Margin,
  Padding,
  Row,
  Text,
  Tooltip,
} from '@central-tech/core-ui';
import { get, size, some } from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import CartContainer from '@client/features/cart/CartContainer';
import { splitLimitDelivery } from '@client/features/cart/utils/functions';
import MiniCartFooter from '@client/features/minicart/components/MiniCartFooter';
import MiniCartHeader from '@client/features/minicart/components/MiniCartHeader';
import OnBoardingCart from '@client/features/onboarding/OnBoardingCart';
import withCartContext from '@client/hoc/withCartContext';
import withLocales from '@client/hoc/withLocales';
import { fetchCart } from '@client/reducers/cart';
import { onBoardingCartClose } from '@client/reducers/layout';
import { isCartLoadedSelector } from '@client/selectors';

const CartQty = styled.div`
  display: block;
  min-width: 30px;
  height: 22px;
  background: #ec1d24;
  border-radius: 20px;
  text-align: center;
  top: 0;
  left: 100%;
  margin-left: 4px;
`;

const LinkQty = styled.div`
  display: flex;
  position: relative;
`;

const MiniCartScroll = styled.div`
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ScreenLoading = styled(FullScreenLoading)`
  position: absolute;
`;

const CartIcon = styled.div`
  z-index: 1002;
`;

@withCartContext
class MiniCartContainer extends PureComponent {
  state = {
    tooltipAlign: 'right',
    showMiniCart: false,
    fetchCartItem: false,
  };

  componentDidUpdate(prevProps) {
    if (
      size(get(prevProps, 'cart.items', [])) !==
        size(get(this.props, 'cart.items', [])) &&
      this.state.fetchCartItem
    ) {
      this.props.fetchCart();
    }
  }

  handleClickViewProduct = () => {
    this.props.history.push('/checkout');
  };

  handleShowHideMiniCart = () => {
    this.setState({
      fetchCartItem: !this.state.showMiniCart,
      showMiniCart: !this.state.showMiniCart,
    });
  };

  handleCloseMiniCart = () => {
    this.setState({ showMiniCart: false });
  };

  render() {
    const {
      cart,
      cartAction,
      storeConfig,
      isCartLoaded,
      cartTotals,
      translate,
      loadingCartProduct,
      onBoardingCart,
      onBoardingCartClose,
    } = this.props;

    const cartProduct = splitLimitDelivery(cart, storeConfig);

    return (
      <OnBoardingCart
        showOnBoarding={onBoardingCart}
        onClickBoardingNextStep={onBoardingCartClose}
      >
        <CartIcon>
          <Tooltip
            className="tooltip-mini-cart"
            arrowBorderWidth={12}
            fadeDuration={0.3}
            distance={12}
            position="bottom"
            radius={4}
            align={this.state.tooltipAlign}
            arrowColor="#f7f7f7"
            border="1px solid #e5e5e5"
            renderTooltip={
              <Padding style={{ width: 418, maxHeight: 600 }}>
                {
                  <React.Fragment>
                    <MiniCartHeader
                      isCartEmpty={get(cart, 'items', []) <= 0}
                      translate={translate}
                      onDeleteAll={cartAction.deleteCart}
                    />
                    <MiniCartScroll>
                      <CartContainer isMiniCart />
                    </MiniCartScroll>
                    <MiniCartFooter
                      isCartEmpty={get(cart, 'items', []) <= 0}
                      dateLimit={get(cartProduct, 'dateLimit', '')}
                      totals={cartTotals}
                      translate={translate}
                      toCheckout={() => this.handleClickViewProduct()}
                    />
                  </React.Fragment>
                }
                {(!isCartLoaded || some(loadingCartProduct, Boolean)) && (
                  <ScreenLoading
                    icon="/assets/icons/loader-2.gif"
                    width="100px"
                    height="auto"
                  />
                )}
              </Padding>
            }
          >
            <Row>
              <Col>
                <LinkQty onClick={() => this.handleShowHideMiniCart()}>
                  <Icon
                    src="/assets/icons/baseline-shopping-cart-24-px.svg"
                    width={20}
                  />
                  <CartQty>
                    {!isCartLoaded ? (
                      <Margin xs="-3px 0 0 -28px" style={{ opacity: 0.7 }}>
                        <Loading type="spinner" width={16} height={16} />
                      </Margin>
                    ) : (
                      <Text size={12} lineHeight="24px" color="#ffffff" bold>
                        {get(cartTotals, 'items_qty', 0)}
                      </Text>
                    )}
                  </CartQty>
                </LinkQty>
              </Col>
            </Row>
          </Tooltip>
        </CartIcon>
      </OnBoardingCart>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  cartTotals: state.cart.cartTotals,
  storeConfig: state.storeConfig.current,
  isCartLoaded: isCartLoadedSelector(state),
  loadingCartProduct: state.cart.loadingProduct,
  onBoardingCart: state.layout.onBoardingCart,
});

const mapDispatchToProps = dispatch => ({
  fetchCart: (isCartLoad = false, isTotalsLoad = false) =>
    dispatch(fetchCart(isCartLoad, isTotalsLoad)),
  onBoardingCartClose: () => dispatch(onBoardingCartClose()),
});

export default withRouter(
  withLocales(connect(mapStateToProps, mapDispatchToProps)(MiniCartContainer)),
);
