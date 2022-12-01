import axios from 'axios'
import { camelCase, get } from 'lodash'
import { FETCH_KEY_BANNER } from './bannerActionTypes'
import { baseUrl } from '../../../apis/config';

export const fetchBannerRequest = (key) => ({ type: FETCH_KEY_BANNER.REQUEST, key })
export const fetchBannerSuccess = (data, key) => ({ type: FETCH_KEY_BANNER.SUCCESS, data, key })
export const fetchBannerFailure = (error, key) => ({ type: FETCH_KEY_BANNER.FAILURE, error, key })
export const fetchBanner = (type, key) => (dispatch, getState) => {
  dispatch(fetchBannerRequest(camelCase(key)))
  return axios({
    method: 'GET',
    url: `${baseUrl}/banners`,
    params: {
      name: key
    }
  })
    .then(res => dispatch(fetchBannerSuccess(get(res.data, 'banners.items', []), camelCase(key))))
    .catch(error => dispatch(fetchBannerFailure(error, camelCase(key))))
}

export const fetchBannerByCategoryId = (key) => (dispatch, getState) => {
  dispatch(fetchBannerRequest(key))
  return axios({
    method: 'GET',
    url: `${baseUrl}/banners`,
    params: {
      category: key
    }
  })
    .then(res => dispatch(fetchBannerSuccess(get(res.data, 'banners.items', []), key)))
    .catch(error => dispatch(fetchBannerFailure(error, key)))
}
