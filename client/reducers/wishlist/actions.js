import queryString from 'query-string';
import { find, get as prop } from 'lodash';
import * as WishlistApi from '../../apis/wishlist';
import * as TYPES from './types';
import { isCustomerLoggedSelector, getStoreSelector } from '../../selectors';
import { setSidebar } from '../layout';
import {
  fetchProductCompleted,
  fetchNewProductCompleted,
  clearProductProp,
} from '../product';

// fetch wishlist

const wishlistFetchStarted = () => ({
  type: TYPES.WISHLIST_FETCH_STARTED,
  payload: null,
});

const wishlistFetched = wishlist => ({
  type: TYPES.WISHLIST_FETCHED,
  payload: wishlist,
});

export const fetchWishlist = () => {
  return async (dispatch, getState) => {
    const state = getState();

    if (!isCustomerLoggedSelector(state)) {
      return null;
    }

    dispatch(wishlistFetchStarted());
    const storeCode = getStoreSelector(state).code;
    const wishlist = await WishlistApi.get({ storeCode });
    dispatch(wishlistFetched(wishlist));
  };
};

// add to wishlist

const addToWishlistStarted = productId => ({
  type: TYPES.ADD_TO_WISHLIST_STARTED,
  payload: productId,
});

export const addtoWishlist = (productId, ref = '') => {
  return async (dispatch, getState) => {
    const state = getState();
    const product =
      find(state.product.items, p => p.id === productId) ||
      state.product.activeProduct;

    if (!isCustomerLoggedSelector(state)) {
      // return dispatch(setSidebar(3));
      return (window.location.href = `${
        ref === '' ? '/login' : `/login?ref=${ref}`
      }`);
    }

    dispatch(addToWishlistStarted(productId));

    const store = getStoreSelector(state);

    const wishlist = await WishlistApi.addItem({
      productId,
      storeCode: store.code,
      storeId: store.id,
    });

    dataLayer.push({ event: 'add_to_wishlist', item_id: prop(product, 'sku') });

    return dispatch(wishlistFetched(wishlist));
  };
};

// remove from  wishlist

const removeFromWishlistStarted = productId => ({
  type: TYPES.REMOVE_FROM_WISHLIST_STARTED,
  payload: productId,
});

const removeFromWishlistFinished = productId => ({
  type: TYPES.REMOVE_FROM_WISHLIST_FINISHED,
  payload: productId,
});

const removeFromWishlistFailed = productId => ({
  type: TYPES.REMOVE_FROM_WISHLIST_FAILED,
  payload: productId,
});

export const removeFromWishlist = productId => {
  return async (dispatch, getState) => {
    const state = getState();

    if (!isCustomerLoggedSelector(state)) {
      return dispatch(setSidebar(3));
    }

    dispatch(removeFromWishlistStarted(productId));

    const store = getStoreSelector(state);

    try {
      await WishlistApi.removeItem({
        productId,
        storeCode: store.code,
      });
      dispatch(removeFromWishlistFinished(productId));
    } catch (error) {
      dispatch(removeFromWishlistFailed(productId));
    }
  };
};

// fetch wishlist products

const fetchWishlistProductsStarted = () => ({
  type: TYPES.WISHLIST_FETCH_PRODUCTS_STARTED,
  payload: null,
});

const wishlistProductsFetched = () => ({
  type: TYPES.WISHLIST_PRODUCTS_FETCHED,
  payload: null,
});

export const fetchWishlistProducts = ({ needReload, ...params }) => {
  return async (dispatch, getState) => {
    dispatch(fetchWishlistProductsStarted());
    const paramString = queryString.stringify(params);
    const state = getState();
    const store = getStoreSelector(state);

    if (needReload) {
      dispatch(clearProductProp());
    }

    const products = await WishlistApi.getProducts({
      storeCode: store.code,
      qry: paramString,
    });

    dispatch(fetchProductCompleted(products.products));
    return dispatch(wishlistProductsFetched());
  };
};
