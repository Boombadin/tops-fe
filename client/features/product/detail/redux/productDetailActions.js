import axios from 'axios';
import { find, get, isEmpty, size } from 'lodash';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { getActiveLanguage } from 'react-localize-redux';
import { FETCH_PRODUCT_DETAIL } from './productDetailActionTypes';
import { baseUrl } from '../../../../apis/config';
import {
  fetchRelativeCompleted,
  fetchProductBundle,
} from '../../../../reducers/product';
import { ProductNoQty } from '../../../gtm/models/Product';

export const fetchProductDetailRequest = key => ({
  type: FETCH_PRODUCT_DETAIL.REQUEST,
  key,
});
export const fetchProductDetailSuccess = (data, key) => ({
  type: FETCH_PRODUCT_DETAIL.SUCCESS,
  data,
  key,
});
export const fetchProductDetailFailure = (error, key) => ({
  type: FETCH_PRODUCT_DETAIL.FAILURE,
  error,
  key,
});
export const fetchProductDetail = slug => (dispatch, getState) => {
  const url = `${baseUrl}/products/${slug}`;
  dispatch(showLoading());
  dispatch(fetchProductDetailRequest(slug));
  return axios({
    method: 'GET',
    url,
  })
    .then(res => {
      const data = res.data.product;
      dispatch(fetchProductDetailSuccess(data, slug));
      dispatch(hideLoading());

      // Find Promotion Number
      const promoNoObj = find(data.custom_attributes, {
        attribute_code: 'promotion_no',
      });

      if (size(get(promoNoObj, 'value', [])) > 0) {
        dispatch(fetchProductBundle(promoNoObj.value));
      }

      // Fetch Relative Product by sku
      if (data.sku) {
        dispatch(fetchRelativeProductBySku(data.sku));
      }

      // Data Layer
      setTimeout(() => {
        dataLayer.push({
          event: 'eec.ProductDetail',
          typepage: 'detail',
          ecommerce: {
            currencyCode: 'THB',
            detail: {
              products: [ProductNoQty(data)],
            },
          },
        });
      }, 1000); // Delay Data Layer 1 sec
    })
    .catch(error => {
      dispatch(hideLoading());
      return dispatch(fetchProductDetailFailure(error, slug));
    });
};

export const fetchRelativeProductBySku = sku => (dispatch, getState) => {
  const url = `${baseUrl}/relative-products/${sku}`;
  return axios({
    method: 'GET',
    url,
  }).then(res =>
    dispatch(fetchRelativeCompleted({ items: res.data.products })),
  );
};
