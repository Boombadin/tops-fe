import { find, isEmpty, get } from 'lodash';
import StoreConfigApi from '../apis/storeConfig';
import { getDefaultShippingAddressSelector } from '../selectors';
import customerApi from '../apis/customer';

export const TYPES = {
  FETCH_STORE_CONFIG: 'FETCH_STORE_CONFIG',
  FETCH_STORE_CONFIG_COMPLETED: 'FETCH_STORE_CONFIG_COMPLETED',
  FETCH_STORE_CONFIG_FAILED: 'FETCH_STORE_CONFIG_FAILED',
  FETCH_STORE_CONFIG_DEFAULT_COMPLETED: 'FETCH_STORE_CONFIG_DEFAULT_COMPLETED',
  FETCH_STORE_CONFIG_CURRENT_COMPLETED: 'FETCH_STORE_CONFIG_CURRENT_COMPLETED',
  STORE_CONFIG_STATUS: 'STORE_CONFIG_STATUS',
  NEXT_STORE_CONFIG_FETCHED: 'NEXT_STORE_CONFIG_FETCHED',
  FETCH_ENV_CONFIG: 'FETCH_ENV_CONFIG',
  SET_PROVIDER: 'SET_PROVIDER',
};

export const checkStoreConfig = (subDistrictId = '') => {
  return async dispatch => {
    dispatch(fetchStoreConfigStart());

    try {
      const configResponse = await StoreConfigApi.get(subDistrictId);

      if (configResponse.status === 'error') {
        dispatch(storeStatusReport(false));
      } else {
        dispatch(storeStatusReport(true));
      }
    } catch (e) {
      dispatch(storeStatusReport(false));
    }
  };
};

const nextStoreConfigFetched = nextStoreConfig => ({
  type: TYPES.NEXT_STORE_CONFIG_FETCHED,
  payload: nextStoreConfig,
});

export const fetchNextStoreConfig = nextAddress => {
  return async (dispatch, getState) => {
    const state = getState();
    const activeLanguageCode = find(state.locale.languages, lang => lang.active)
      .code;
    const shippingAddress = !isEmpty(nextAddress)
      ? nextAddress
      : getDefaultShippingAddressSelector(state);

    if (!shippingAddress) {
      return false;
    }

    let store = {};
    let sellerCode = '';
    if (shippingAddress?.delivery_method === 'pickup') {
      sellerCode = `${shippingAddress?.seller_code}_${
        activeLanguageCode === 'th_TH' ? 'th' : 'en'
      }`;
      store = await StoreConfigApi.getBySellerCode(sellerCode);
    } else {
      const subDistrictId = get(
        find(
          get(shippingAddress, 'custom_attributes'),
          x => x.attribute_code === 'subdistrict_id',
        ),
        'value',
      );
      const newSubdistrictId = subDistrictId || shippingAddress.subdistrict_id;
      store = await StoreConfigApi.get(newSubdistrictId);
    }

    const nextStoreConfig = find(
      store?.currentConfig,
      config => config.locale === activeLanguageCode,
    );

    dispatch(nextStoreConfigFetched(nextStoreConfig));

    let storeCode = nextStoreConfig?.code || '';
    if (shippingAddress?.delivery_method === 'pickup' && storeCode === '') {
      storeCode = sellerCode;
    }
    return storeCode;
  };
};

export const fetchStoreConfig = userToken => {
  return async (dispatch, getState) => {
    dispatch(fetchStoreConfigStart());
    const { locale, shippingAddress, customer, storeLocator } = getState();
    const activeLanguageCode = find(locale.languages, lang => lang.active).code;

    let currentConfig, defaultConfig, configResponse;

    if (!userToken) {
      configResponse = await StoreConfigApi.getDefaultConfig();
    } else {
      const shippingInfo = await customerApi.getShippingInfo(userToken);
      const shippingMethod = get(shippingInfo, 'shipping_method', '');
      const locationId = get(shippingInfo, 'location_id', 0);
      let currentShiiping;

      if (locationId > 0) {
        if (shippingMethod === 'delivery') {
          currentShiiping = find(
            get(customer, 'items.addresses', []),
            addr => addr.id == locationId,
          );
        } else {
          currentShiiping = find(
            get(storeLocator, 'items', []),
            store => store.id == locationId,
          );
        }
      }

      const subDistrictId = get(currentShiiping, 'subdistrict_id', '');
      configResponse = await StoreConfigApi.get(subDistrictId, userToken);
    }

    currentConfig = find(
      configResponse.currentConfig,
      config => config.locale === activeLanguageCode,
    );
    defaultConfig = find(
      configResponse.defaultConfig,
      config => config.locale === activeLanguageCode,
    );

    dispatch(fetchStoreConfigCompleted(currentConfig, defaultConfig));
    return configResponse;
  };
};

// current store
export const fetchStoreConfigCurrent = subDistrictId => {
  return async (dispatch, getState) => {
    dispatch(fetchStoreConfigStart());
    const { locale } = getState();
    const activeLanguageCode = find(locale.languages, lang => lang.active).code;

    const { currentConfig } = await StoreConfigApi.get(subDistrictId);
    const current = find(
      currentConfig,
      config => config.locale === activeLanguageCode,
    );

    dispatch(fetchStoreConfigCurrentCompleted(current));
    return current;
  };
};

export const fetchStoreConfigDefault = () => {
  return async (dispatch, getState) => {
    // store config preloader
    dispatch(fetchStoreConfigStart());
    const { locale } = getState();
    const activeLanguageCode = find(locale.languages, lang => lang.active).code;

    const { storeConfig } = await StoreConfigApi.get();
    const currentConfig = find(
      storeConfig,
      config => config.locale === activeLanguageCode,
    );

    dispatch(fetchStoreConfigDefaultCompleted(currentConfig));
    return storeConfig;
  };
};

export const setProvider = provider => ({
  type: TYPES.SET_PROVIDER,
  payload: { provider },
});

export const fetchEnvConfig = envConfig => ({
  type: TYPES.FETCH_ENV_CONFIG,
  payload: { envConfig },
});

export const storeStatusReport = configStatus => ({
  type: TYPES.STORE_CONFIG_STATUS,
  payload: { configStatus },
});

export const fetchStoreConfigStart = () => ({
  type: TYPES.FETCH_STORE_CONFIG,
});

export const fetchStoreConfigCompleted = (currentConfig, defaultConfig) => ({
  type: TYPES.FETCH_STORE_CONFIG_COMPLETED,
  payload: { currentConfig, defaultConfig },
});

export const fetchStoreConfigCurrentCompleted = config => ({
  type: TYPES.FETCH_STORE_CONFIG_CURRENT_COMPLETED,
  payload: { config },
});

export const fetchStoreConfigDefaultCompleted = config => ({
  type: TYPES.FETCH_STORE_CONFIG_DEFAULT_COMPLETED,
  payload: {
    config,
  },
});

const initialState = {
  loading: false,
  current: {},
  default: {},
  next: {},
  storeStatus: false,
  provider: '',
  envConfig: {
    env: '',
    facebookID: '',
    grabClientID: '',
    baseUrl: '',
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_STORE_CONFIG: {
      return { ...state, ...{ loading: true } };
    }

    case TYPES.STORE_CONFIG_STATUS: {
      const newState = {
        storeStatus: action.payload.configStatus,
        loading: false,
      };
      return { ...state, ...newState };
    }

    case TYPES.FETCH_STORE_CONFIG_COMPLETED: {
      const { currentConfig, defaultConfig } = action.payload;
      return {
        ...state,
        ...{ current: currentConfig, default: defaultConfig, loading: false },
      };
    }

    case TYPES.FETCH_STORE_CONFIG_CURRENT_COMPLETED: {
      const { config } = action.payload;
      return { ...state, ...{ current: config, loading: false } };
    }

    case TYPES.FETCH_STORE_CONFIG_DEFAULT_COMPLETED: {
      const { config } = action.payload;
      return { ...state, ...{ default: config, loading: false } };
    }

    case TYPES.NEXT_STORE_CONFIG_FETCHED: {
      return { ...state, next: action.payload };
    }

    case TYPES.FETCH_ENV_CONFIG: {
      return {
        ...state,
        envConfig: {
          env: action.payload.envConfig.environment,
          facebookID: action.payload.envConfig.facebook_id,
          grabClientID: action.payload.envConfig.grab_client_id,
          baseUrl: action.payload.envConfig.base_Url,
        },
      };
    }

    case TYPES.SET_PROVIDER: {
      return { ...state, provider: action.payload.provider };
    }

    default:
      return state;
  }
};

export default reducer;
