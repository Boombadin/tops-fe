import { combineReducers } from 'redux';
import { localeReducer } from 'react-localize-redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { loadingBarReducer } from 'react-redux-loading-bar';
import product from './product';
import category from './category';
import customer from './customer';
import storeConfig from './storeConfig';
import cmsBlock from './cmsBlock';
import region from './region';
import shippingAddress from './shippingAddress';
import layout from './layout';
import checkout from './checkout';
import cart from './cart';
import urlRewrite from './urlRewrite';
import promoBundle from './promoBundle';
import wishlist from './wishlist';
import order from './order';
import search from './search';
import banner from './banner';
import cms from './cms';
import account from './account';
import registration from './registration';
import auth from './auth';
import { nybReducer } from '../features/nyb/redux/nybReducer';
import { productDetailReducer } from '../features/product/detail';
import { categoryDetailReducer } from '../features/category/detail';
import { bannerReducer } from '../features/banner/redux/bannerReducer';
import { deeplinkReducer } from '../features/deeplink';
import megaMenu from './megaMenu';
import storeLocator from './storeLocator';

const app = combineReducers({
  cms,
  product,
  cart,
  category,
  customer,
  storeConfig,
  cmsBlock,
  region,
  shippingAddress,
  layout,
  checkout,
  urlRewrite,
  promoBundle,
  order,
  banner,
  locale: localeReducer,
  form: reduxFormReducer,
  loadingBar: loadingBarReducer,
  search,
  wishlist,
  registration,
  auth,
  account,
  nyb: nybReducer,
  productDetail: productDetailReducer,
  categoryDetail: categoryDetailReducer,
  bannerKeys: bannerReducer,
  deeplink: deeplinkReducer,
  megaMenu,
  storeLocator,
});

export default app;
