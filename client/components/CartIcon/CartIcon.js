import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import OnBoardingCart from '../../features/onboarding/OnBoardingCart';
import { onBoardingCartClose } from '../../reducers/layout';
import './CartIcon.scss';

class CartIcon extends Component {
  static propTypes = {
    url: PropTypes.string,
    itemsCount: PropTypes.number,
  };

  static defaultProps = {
    url: '',
    itemsCount: 0,
  };

  state = {};

  render() {
    const {
      url,
      itemsCount,
      init,
      onClick,
      onBoardingCart,
      onBoardingCartClose,
    } = this.props;

    const total = itemsCount || 0;

    return (
      <OnBoardingCart
        showOnBoarding={onBoardingCart}
        onClickBoardingNextStep={onBoardingCartClose}
      >
        <div className="cart-icon">
          {(url && url !== '' && (
            <NavLink className="m-cart" to={url} onClick={onClick}>
              {(init && <span>0</span>) || <span>{total}</span>}
            </NavLink>
          )) || (
            <div className="m-cart" onClick={onClick}>
              <span>{itemsCount}</span>
            </div>
          )}
        </div>
      </OnBoardingCart>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  loaded: state.cart.loaded,
  init: state.cart.init,
  itemsCount: state.cart.itemsCount,
  onBoardingCart: state.layout.onBoardingCart,
});

const mapDispatchToProps = dispatch => ({
  onBoardingCartClose: () => dispatch(onBoardingCartClose()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);
