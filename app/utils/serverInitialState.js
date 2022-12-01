import { getSdk } from '@central-tech/graphql-request';
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { filter, find, get as prop, isEmpty, reduce, size } from 'lodash';
import {
  getActiveLanguage,
  initialize,
  setActiveLanguage,
} from 'react-localize-redux';

import {
  fetchEnvConfig,
  fetchStoreConfigCompleted,
  setProvider,
} from '@/client/reducers/storeConfig';
import Exploder from '@/client/utils/mcaex';
import appConfig from '@app/config';
import CategoryService from '@app/services/categoryService';
import CheckoutService from '@app/services/checkoutService';
import CMSBlockService from '@app/services/cmsBlockService';
import CustomerService from '@app/services/customerService';
import MegaMenuService from '@app/services/megaMenuService';
import ProductService from '@app/services/productService';
import StoreConfigService from '@app/services/storeConfigService';
import { fetchMainCategoryComplete } from '@client/reducers/category';
import { fetchCmsBlockCompleted } from '@client/reducers/cmsBlock';
import {
  fetchCurrentShippingAddressCompleted,
  fetchCustomerCompleted,
  fetchShippingInfoCompleted,
} from '@client/reducers/customer';
import { fetchMegaMenu } from '@client/reducers/megaMenu';
import { fetchProductBadgeComplete } from '@client/reducers/product';
import { setCurrentShippingLocation } from '@client/reducers/shippingAddress';

import { get as redisGet, redisClient, set as redisSet } from './redis';
import {
  getDefaultConfigs,
  getStoreConfigs,
  setDefaultConfigs,
  setStoreConfigs,
  validateStoreConfig,
} from './storeConfigVariable';
import { compareValues, transform } from './transformCategory';

const graphqlClient = new GraphQLClient(process.env.GRAPHQL_URL);
const sdk = getSdk(graphqlClient);

const initialUserToken = (store, req, res) => {
  const { token, lang, currentStore, client } = req.query;

  if (!isEmpty(token)) {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const c = new Date(year + 1, month, day);

    res.cookie('user_token', token, { expires: c });
    res.cookie('lang', lang, { expires: c });
    res.cookie('current_store', currentStore);

    if (!isEmpty(client)) {
      res.cookie('client', client);
    }

    req.cookies.user_token = token;
  }
};

export const loadLocale = (store, req) => {
  try {
    const currentLang = req.params.lang;
    const { languages } = appConfig;
    const missingTranslationMsg = '${key}';
    const currentLangObject = find(languages, lang => lang.url === currentLang);
    store.dispatch(initialize(languages, { missingTranslationMsg }));
    store.dispatch(setActiveLanguage(currentLangObject.code));
  } catch (e) {
    console.error(prop(e, 'message', ''));
  }
};

// const getStoreConfigsFalcon = async () => {
//   const { storeConfigs } = await sdk.storeConfigs();
//   return storeConfigs;
// };

const loadStoreConfig = async (store, req, res) => {
  try {
    const { locale, customer } = store.getState();
    const { code: activeLocale, url: activeLang } = find(
      locale.languages,
      lang => lang.active,
    );
    let defaultStoreConfigs = await getDefaultConfigs();
    let storeConfigs = await getStoreConfigs();

    if (!defaultStoreConfigs || !storeConfigs) {
      const [
        apiDefaultStoreConfigs,
        apiStoreConfigs,
        // apiStoreConfigsFalcon,
      ] = await Promise.all([
        StoreConfigService.getDefaultConfig(),
        StoreConfigService.getAllConfig(),
        // getStoreConfigsFalcon(),
      ]);

      // console.log({
      //   apiStoreConfigsFalcon,
      // });

      const isStoreConfigValid = validateStoreConfig(apiStoreConfigs);
      const isStoreConfigDefaultValid = validateStoreConfig(
        apiDefaultStoreConfigs,
      );

      if (!isStoreConfigValid || !isStoreConfigDefaultValid) {
        throw new Error('store code in not valid');
      }

      defaultStoreConfigs = apiDefaultStoreConfigs;
      storeConfigs = apiStoreConfigs;
      setDefaultConfigs(apiDefaultStoreConfigs);
      setStoreConfigs(apiStoreConfigs);
    }

    let activeStoreConfig = find(
      defaultStoreConfigs,
      config => config.locale === activeLocale,
    );
    const defaultConfig = find(
      defaultStoreConfigs,
      config => config.locale === activeLocale,
    );

    if (!isEmpty(customer)) {
      const shippingInfo = prop(customer, 'shippingInfo', {});
      const currentStoreCode = prop(
        shippingInfo,
        'current_store',
        appConfig.default_store,
      );

      if (currentStoreCode) {
        const configFromShippingInfo = find(
          storeConfigs,
          config => config.code === `${currentStoreCode}_${activeLang}`,
        );
        const isValidConfig =
          configFromShippingInfo &&
          configFromShippingInfo.code &&
          configFromShippingInfo.id;

        if (isValidConfig) {
          activeStoreConfig = configFromShippingInfo;
        }
      }
    }

    /* set default header to axios */
    const { code, website_id } = activeStoreConfig;
    axios.defaults.headers.common['x-store-code'] = code;
    axios.defaults.headers.common['x-website-id'] = website_id;

    store.dispatch(fetchStoreConfigCompleted(activeStoreConfig, defaultConfig));

    if (!isEmpty(req.cookies.provider)) {
      await store.dispatch(setProvider(req.cookies.provider));
    }
  } catch (error) {
    console.error(error);
    throw new Error('can not load store config');
  }
};

const loadEnvConfig = async (store, req, res) => {
  const envConfigs = await store.dispatch(fetchEnvConfig(appConfig));

  return envConfigs;
};

const loadMegaMenu = async (store, req, res) => {
  const state = store.getState();
  const currentStoreConfig = state.storeConfig.current;
  const redisKey = `megaMenu${prop(currentStoreConfig, 'id')}`;

  try {
    // console.time('loadMegaMenu');
    const megaMenu = await redisGet(redisKey);
    // console.timeEnd('loadMegaMenu');

    return store.dispatch(fetchMegaMenu(JSON.parse(megaMenu)));
  } catch (error) {
    // console.time('loadMegaMenu');
    const megaMenu = await MegaMenuService.get(prop(currentStoreConfig, 'id'));

    if (redisClient) {
      redisSet(redisKey, JSON.stringify(megaMenu), 86400);
    }
    // console.timeEnd('loadMegaMenu');

    return store.dispatch(fetchMegaMenu(megaMenu));
  }
};

const loadCustomerGroup = async (store, req, res) => {
  const state = store.getState();
  const customer = state.customer.items;
  if (!customer) return;
  try {
    const t1cNo = prop(
      find(prop(customer, 'custom_attributes', ''), {
        attribute_code: 't1c_card',
      }),
      'value',
      0,
    );
    const customerID = prop(customer, 'id', 0);
    const recommendProduct = await CustomerService.getUserGroupConfig(
      customerID,
      t1cNo,
    );

    if (!isEmpty(recommendProduct)) {
      res.cookie('customerGroup', prop(recommendProduct, 'recommend_product'));
    } else {
      res.cookie('customerGroup', '');
    }
  } catch (e) {
    res.clearCookie('customerGroup', '');
    return null;
  }
};

// TODO: Not used
const loadAllCMS = async store => {
  const state = store.getState();
  const currentDefaultId = prop(
    state.storeConfig,
    'current.id',
    prop(state.storeConfig, 'default.id'),
  );
  const storeCode = prop(
    state.storeConfig,
    'current.code',
    prop(state.storeConfig, 'default.code'),
  );
  const redisKey = `allCmsBlock${currentDefaultId}`;

  try {
    // console.time('loadAllCMSFromCache');
    const cmsBlock = await redisGet(redisKey);
    // console.timeEnd('loadAllCMSFromCache');
    return store.dispatch(fetchCmsBlockCompleted(JSON.parse(cmsBlock)));
  } catch (error) {
    // console.time('loadAllCMS');
    let filter = '';
    filter += 'searchCriteria[filter_groups][0][filters][0][field]=store_id';
    filter += `&searchCriteria[filter_groups][0][filters][0][value]=${currentDefaultId}`;
    filter +=
      '&searchCriteria[filter_groups][0][filters][0][condition_type]=eq';

    const cmsBlock = await CMSBlockService.get(storeCode, filter);

    if (redisClient) {
      redisSet(redisKey, JSON.stringify(cmsBlock), 3600);
    }

    // console.timeEnd('loadAllCMS');
    return store.dispatch(fetchCmsBlockCompleted(cmsBlock));
  }
};

const loadMainCategory = async store => {
  // console.time('loadMainCategory');
  const storeCode = store.getState().storeConfig.current.code;
  const redisKeyMainCate = `mainCategory${storeCode}`;
  const redisKeyAllCate = `categories${storeCode}`;

  try {
    const mainCategories = await redisGet(redisKeyMainCate);
    store.dispatch(fetchMainCategoryComplete(JSON.parse(mainCategories)));
    // console.timeEnd('loadMainCategory');
  } catch (error) {
    let mainCategories = [];
    let categories = [];
    const categoryResponse = await CategoryService.get('', storeCode);

    if (!isEmpty(categoryResponse)) {
      categories = prop(categoryResponse, 'items', []);
      categories = categories.map(item => {
        return transform(item);
      });
      categories = categories.sort(compareValues('position'));

      categories = reduce(
        categories,
        (result, value) => {
          result.push({
            ...value,
            children: filter(categories, cate => {
              return cate.parent_id === value.id;
            })
              .map(value => {
                return value.id;
              })
              .toString(),
          });

          return result;
        },
        [],
      );

      if (categories.length > 0) {
        mainCategories = filter(categories, cate => {
          return (
            cate.level === 2 && cate.is_active && cate.include_in_menu === true
          );
        });
      }
    }

    if (redisClient) {
      if (size(categories) > 0) {
        redisSet(redisKeyAllCate, JSON.stringify(categories), 3600);
        redisSet(redisKeyMainCate, JSON.stringify(mainCategories), 3600);
      }
    }

    // console.timeEnd('loadMainCategory');

    store.dispatch(fetchMainCategoryComplete(mainCategories));
  }
};

const loadCustomerAndCurrentShipping = async (store, req, res) => {
  const state = store.getState();
  const lang = getActiveLanguage(state.locale).url;
  const userToken = req.cookies.user_token;

  if (!userToken) {
    return null;
  }

  try {
    const shippingInfo = await CustomerService.getShippingInfo(userToken, '');
    if (
      prop(shippingInfo, 'current_store') ||
      prop(shippingInfo, 'response.status') !== 404
    ) {
      store.dispatch(fetchShippingInfoCompleted(shippingInfo));
    }
    const shippingMethod = prop(shippingInfo, 'shipping_method', '');
    const locationId = prop(shippingInfo, 'location_id', '');
    const currentStoreCode = prop(
      shippingInfo,
      'current_store',
      appConfig.default_store,
    );
    const storeCode = `${currentStoreCode}_${lang}`;

    const customer = await CustomerService.get(userToken, storeCode);

    if (prop(customer, 'response.status') === 401) {
      res.clearCookie('user_token');
      return {
        redirect: true,
      };
    }

    if (
      prop(customer, 'response.status') !== 400 &&
      prop(customer, 'response.status') !== 401
    ) {
      store.dispatch(fetchCustomerCompleted(customer));
    }

    const cusAddr = prop(customer, 'addresses', '');

    if (shippingMethod === 'pickup') {
      const response = await CheckoutService.fethStoreLocator(storeCode);
      const stores = prop(response, 'items', []);
      const currentStore = find(stores, store => store.id == locationId);

      await store.dispatch(
        setCurrentShippingLocation(
          prop(currentStore, 'extension_attributes.address.region_id', ''),
          prop(currentStore, 'extension_attributes.address.district_id', ''),
          prop(currentStore, 'extension_attributes.address.subdistrict_id', ''),
          prop(currentStore, 'extension_attributes.address.postcode', ''),
        ),
      );
      let currentStoreResponse = {};
      if (!isEmpty(shippingMethod) && size(currentStore) > 0) {
        currentStoreResponse = {
          shipping_method: shippingMethod,
          ...currentStore,
        };
      }
      return store.dispatch(
        fetchCurrentShippingAddressCompleted(
          Object.assign(currentStoreResponse),
        ),
      );
    } else if (shippingMethod === 'delivery') {
      if (!isEmpty(cusAddr)) {
        const currentAddress = find(
          cusAddr,
          address => address.id == locationId,
        );

        let curAddress = {};

        if (currentAddress) {
          curAddress = Exploder.explode(currentAddress);
        }

        await store.dispatch(
          setCurrentShippingLocation(
            prop(curAddress, 'region_id', ''),
            prop(curAddress, 'district_id', ''),
            prop(curAddress, 'subdistrict_id', ''),
            prop(curAddress, 'postcode', ''),
          ),
        );

        let currentAddressResponse = {};
        if (!isEmpty(shippingMethod) && !isEmpty(curAddress)) {
          currentAddressResponse = {
            shipping_method: shippingMethod,
            ...curAddress,
          };
        }
        return store.dispatch(
          fetchCurrentShippingAddressCompleted(
            Object.assign(currentAddressResponse),
          ),
        );
      }
    }
  } catch (error) {
    console.log({ error });
  }
};

const loadProductBadge = async store => {
  // console.time('loadProductBadge');
  const storeCode = store.getState().storeConfig.current.code;
  const redisKey = `productBadge${storeCode}`;

  try {
    const productBadge = await redisGet(redisKey);
    // console.timeEnd('loadProductBadge');
    return store.dispatch(fetchProductBadgeComplete(JSON.parse(productBadge)));
  } catch (error) {
    const productBadge = await ProductService.getProductBadge(storeCode);

    if (redisClient) {
      redisSet(redisKey, JSON.stringify(productBadge), 3600);
    }

    // console.timeEnd('loadProductBadge');
    return store.dispatch(fetchProductBadgeComplete(productBadge));
  }
};

const loadState = async (store, req, res) => {
  try {
    // console.time('loadLocale');
    await loadLocale(store, req);
    // console.timeEnd('loadLocale');

    // console.time('initialUserToken');
    await initialUserToken(store, req, res);
    // console.timeEnd('initialUserToken');

    // console.time('loadCustomerAndCurrentShipping');
    const customer = await loadCustomerAndCurrentShipping(store, req, res);

    if (customer?.redirect) {
      return {
        redirect: true,
      };
    }
    // console.timeEnd('loadCustomerAndCurrentShipping');

    // console.time('loadStoreConfig');
    await loadStoreConfig(store, req, res);
    // console.timeEnd('loadStoreConfig');

    // console.time('PromiseAll');
    await Promise.all([
      loadEnvConfig(store, req, res),
      loadMegaMenu(store, req, res),
      loadAllCMS(store),
      loadMainCategory(store, req, res),
      loadProductBadge(store, req, res),
      loadCustomerGroup(store, req, res),
    ]);
    // console.timeEnd('PromiseAll');
  } catch (error) {
    throw error;
  }
};

export default loadState;
