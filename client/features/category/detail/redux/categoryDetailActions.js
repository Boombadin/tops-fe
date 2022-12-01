import axios from 'axios'
import queryString from 'query-string'
import { get } from 'lodash'
import { FETCH_CATEGORY_DETAIL } from './categoryDetailActionTypes'
import { baseUrl } from '../../../../apis/config';

export const fetchCategoryDetailRequest = (key) => ({ type: FETCH_CATEGORY_DETAIL.REQUEST, key })
export const fetchCategoryDetailSuccess = (data, key) => ({ type: FETCH_CATEGORY_DETAIL.SUCCESS, data, key })
export const fetchCategoryDetailFailure = (error, key) => ({ type: FETCH_CATEGORY_DETAIL.FAILURE, error, key })
export const fetchCategoryDetail = (subCategId, sort) => (dispatch, getState) => {
  const params = {
    field: `category.category_id,${subCategId},eq`,
    page_size: 20,
    page_number: 1,
    sort
  }
  const search = queryString.stringify(params)
  const url = search ? `${baseUrl}/products?${search}` : `${baseUrl}/products`
  dispatch(fetchCategoryDetailRequest(subCategId))
  return axios({
    method: 'GET',
    url,
  })
    .then(response => dispatch(fetchCategoryDetailSuccess(get(response.data, 'products.items', []), subCategId)))
    .catch(error => dispatch(fetchCategoryDetailFailure(error, subCategId)))
}
