import { get, camelCase } from 'lodash';
import { createDeepEqualSelector } from '../../../utils/selectors';

// Defailt State
export const defaultKeys = {
  isFetching: false,
  isReload: true,
  data: [],
  error: '',
};

// Find State in Redux
export const findBannerByName = (state, key) =>
  get(state.bannerKeys.keys, camelCase(key), defaultKeys);
export const findBannerKeys = state => state.bannerKeys.keys;
export const findStoreConfig = state => state.storeConfig.current;

// Selectors
export const makeGetBanner = () => createDeepEqualSelector(findBannerByName, banner => banner);
export const makeGetBannerKeys = () =>
  createDeepEqualSelector(findBannerKeys, bannerKeys => bannerKeys);
export const makeGetStoreConfig = () =>
  createDeepEqualSelector(findStoreConfig, storeConfig => storeConfig);
