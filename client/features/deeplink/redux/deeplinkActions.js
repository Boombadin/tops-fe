import axios from 'axios';
import { get } from 'lodash';
import { getActiveLanguage } from 'react-localize-redux';

import { baseUrl } from '@client/apis/config';

import {
  DEEPLINK_TOPS_HOME_APP,
  DEEPLINK_TOPS_PDP,
} from './deeplinkActionTypes';

export const deeplinkTopsAppRequest = () => ({
  type: DEEPLINK_TOPS_HOME_APP.REQUEST,
});
export const deeplinkTopsAppSuccess = url => ({
  type: DEEPLINK_TOPS_HOME_APP.SUCCESS,
  url,
});
export const deeplinkTopsAppFailure = error => ({
  type: DEEPLINK_TOPS_HOME_APP.FAILURE,
  error,
});

export const deeplinkTopsPDPRequest = () => ({
  type: DEEPLINK_TOPS_PDP.REQUEST,
});
export const deeplinkTopsPDPSuccess = url => ({
  type: DEEPLINK_TOPS_PDP.SUCCESS,
  url,
});
export const deeplinkTopsPDPFailure = error => ({
  type: DEEPLINK_TOPS_PDP.FAILURE,
  error,
});

export const deeplinkTopsApp = () => (dispatch, getState) => {
  const state = getState();
  const feature = 'checkout_nyb_complete';
  const lang = getActiveLanguage(state.locale);
  const storeConfig = state.storeConfig.current;
  const DESKTOP_URL = `${window?.App?.api_url}/${lang.url}/`;
  const branchKey = get(storeConfig, 'extension_attributes.branch_io_key', '');
  dispatch(deeplinkTopsAppRequest());
  // Data Body
  const data = {
    branch_key: branchKey,
    feature,
    data: {
      $canonical_identifier: feature,
      $desktop_url: DESKTOP_URL,
      $android_deeplink_path: feature,
      $ios_deeplink_path: feature,
      $fallback_url: DESKTOP_URL,
    },
  };
  return axios({
    method: 'POST',
    url: `${baseUrl}/deeplink`,
    responseType: 'json',
    data,
  })
    .then(res => dispatch(deeplinkTopsAppSuccess(res.data.data.url)))
    .catch(error => dispatch(deeplinkTopsAppFailure(error)));
};

export const deeplinkPDP = product => (dispatch, getState) => {
  const state = getState();
  const feature = 'sharing_pdp';
  const lang = getActiveLanguage(state.locale);
  const storeConfig = state.storeConfig.current;
  // const prodURL = Object.keys(state.productDetail.keys).toString();
  const prodURL = get(product, 'url_key', '');
  const DESKTOP_URL = `${window?.App?.api_url}/${lang.url}/${prodURL}`;
  //console.log(storeConfig.base_media_url)
  //const DESKTOP_URL = `https://staging.tops.co.th/${lang.url}/${prodURL}`
  //const IMAGE_URL = `https://res.cloudinary.com/dgfakeunx/image/fetch/c_scale,q_auto,w_400/${get(storeConfig, 'base_media_url', '')}catalog/product${get(product, 'image', '')}`
  const IMAGE_URL = `${get(
    storeConfig,
    'base_media_url',
    '',
  )}catalog/product${get(
    product,
    'image',
    '',
  )}?impolicy=crop&width=400&height=400`;
  const title = get(product, 'title', '');
  const description = get(product, 'description', '');
  const appId = get(product, 'appId', '');
  const branchKey = get(storeConfig, 'extension_attributes.branch_io_key', '');
  // const sku = prodURL.substring(prodURL.lastIndexOf("-") + 1, prodURL.length);
  // dispatch(deeplinkTopsPDPRequest())
  const sku = get(product, 'sku', '');
  // Data Body
  const data = {
    branch_key: branchKey,
    feature,
    data: {
      $desktop_url: DESKTOP_URL,
      $android_deeplink_path: `detail?sku=${sku}`,
      $ios_deeplink_path: `detail?sku=${sku}`,
      $canonical_identifier: DESKTOP_URL,
      $canonical_url: DESKTOP_URL,
      $og_url: DESKTOP_URL,
      $og_title: title,
      $og_description: description,
      $og_image_url: IMAGE_URL,
      $og_app_id: appId,
      $og_type: 'product',
    },
  };
  const returnData = axios({
    method: 'POST',
    url: `${baseUrl}/deeplink`,
    responseType: 'json',
    data,
  })
    .then(response => {
      return response.data.data.url;
    })
    .catch(error => dispatch(deeplinkTopsPDPFailure(error)));
  return returnData;
};
