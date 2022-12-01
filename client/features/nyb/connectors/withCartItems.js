import { get } from 'lodash';
import { connect } from 'react-redux';
import { createDeepEqualSelector } from '../../../utils/selectors';
import { makeGetTranslate } from '../../../utils/translate';

// Find State in Redux
const findCartItems = state => get(state.cart, 'cart.items', []);
const findCartInit = state => state.cart.init;
const findStoreConfig = state => get(state.storeConfig, 'current', []);
const itemAddToCart = state => get(state.cart, 'itemAddToCart', []);

// Selectors
export const makeCartItems = () => createDeepEqualSelector(findCartItems, items => items);
export const makeCartInit = () => createDeepEqualSelector(findCartInit, init => init);
export const makeStoreConfig = () => createDeepEqualSelector(findStoreConfig, config => config);
export const makeitemAddToCart = () => createDeepEqualSelector(itemAddToCart, pro => pro);

const makeMapStateToProps = () => {
  const getCartItems = makeCartItems();
  const getTrans = makeGetTranslate();
  const getCartInit = makeCartInit();
  const getStoreConfig = makeStoreConfig();
  const getitemAddToCart = makeitemAddToCart();
  return state => ({
    translate: getTrans(state),
    carts: getCartItems(state),
    cartInit: getCartInit(state),
    storeConfig: getStoreConfig(state),
    itemAddToCart: getitemAddToCart(state)
  });
};

// High Order Component
export const withCartItems = WrapperComponent =>
  connect(
    makeMapStateToProps,
    {}
  )(WrapperComponent);
