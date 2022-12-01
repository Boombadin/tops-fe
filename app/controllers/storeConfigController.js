import { get } from 'lodash';
import storeConfigService from '../services/storeConfigService';
import {
  deleteDefaultStoreConfigs,
  deleteStoreConfigs,
} from '../utils/storeConfigVariable';

async function fetch(req, res) {
  try {
    const userToken = req.query.user_token;
    const subDistrictId = req.query.sub_district_id;
    const defaultConfig = await storeConfigService.getDefaultConfig(userToken);
    let currentConfigRes;

    try {
      if (subDistrictId) {
        currentConfigRes = await storeConfigService.get(subDistrictId);
      } else {
        currentConfigRes = defaultConfig;
      }

      if (currentConfigRes === '') {
        currentConfigRes = defaultConfig;
      }
    } catch (error) {
      currentConfigRes = defaultConfig;
    }

    let currentConfig;
    let status = 'error';
    if (currentConfigRes) {
      status = 'success';
      currentConfig = currentConfigRes;
    } else {
      currentConfig = defaultConfig;
    }

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({
          status: status,
          currentConfig: currentConfig,
          defaultConfig: defaultConfig,
        }),
        'EX',
        86400,
      );
    }

    return res.json({
      status: status,
      currentConfig: currentConfig,
      defaultConfig: defaultConfig,
    });
  } catch (e) {
    const errorMessage = e.response
      ? get(e, 'response.data.message')
      : e.message;
    return res.status(500).json({ status: 'error', message: errorMessage });
  }
}

async function fetchBySellerCode(req, res) {
  try {
    const userToken = req.query.user_token;
    const { sellerCode } = req.query;

    const defaultConfig = await storeConfigService.getDefaultConfig(userToken);
    const currentConfig = await storeConfigService.getBySellerCode(sellerCode);

    if (currentConfig) {
      return res.json({
        status: 'success',
        currentConfig: currentConfig,
        defaultConfig: defaultConfig,
      });
    }

    return res.json({
      status: 'error',
      currentConfig: defaultConfig,
      defaultConfig: defaultConfig,
    });
  } catch (e) {
    const errorMessage = e.response
      ? get(e, 'response.data.message')
      : e.message;
    return res.status(500).json({ status: 'error', message: errorMessage });
  }
}

async function fetchDefaultConfig(req, res) {
  try {
    const userToken = req.query.user_token;
    const defaultConfig = await storeConfigService.getDefaultConfig(userToken);

    if (defaultConfig) {
      return res.json({
        status: 'success',
        currentConfig: defaultConfig,
        defaultConfig: defaultConfig,
      });
    }

    return res.json({
      status: 'error',
      message: 'not found store config.',
      currentConfig: [],
      defaultConfig: [],
    });
  } catch (e) {
    const errorMessage = e.response
      ? get(e, 'response.data.message')
      : e.message;
    return res.status(500).json({ status: 'error', message: errorMessage });
  }
}

async function deleteStoreConfigsCache(req, res) {
  try {
    const response = await deleteStoreConfigs();
    res.json({ success: !!response });
  } catch (error) {
    res.json({ success: false });
  }
}

async function deleteDefaultStoreConfigsCache(req, res) {
  try {
    const response = await deleteDefaultStoreConfigs();
    res.json({ success: !!response });
  } catch (error) {
    res.json({ success: false });
  }
}

export default {
  fetch,
  fetchDefaultConfig,
  fetchBySellerCode,
  deleteStoreConfigsCache,
  deleteDefaultStoreConfigsCache,
};
