import axios from 'axios';
import { logger } from './logger';
import config from '../config';
import { set as redisSet, get as redisGet } from './redis';

export default async function service({ url, method, data, options }) {
  const { magento_api_base_url, headers, redis } = config;
  const cacheKey = `magentoService:${url}`;
  const requestObject = {
    url: `${magento_api_base_url}${url}`,
    method: method || 'GET',
    headers: headers,
    data: data,
  };

  const isRedisEnable =
    redis?.url &&
    requestObject?.method?.toLowerCase() === 'get' &&
    options?.ttl !== 0;

  const dataFromCache = await getDataFromCache(cacheKey, isRedisEnable);

  if (dataFromCache) {
    return dataFromCache;
  }

  return axios(requestObject)
    .then(res => {
      const responseData = res?.data;

      if (isRedisEnable) {
        redisSet(cacheKey, responseData, options?.ttl || config.redis?.expire);
      }

      return responseData;
    })
    .catch(error => {
      logger(error, {
        request: `${requestObject?.url}`,
        response: `${JSON.stringify(error?.response?.data)}`,
      });
      throw error;
    });
}

async function getDataFromCache(cacheKey, enable) {
  if (!enable) {
    return null;
  }

  try {
    const cacheData = await redisGet(cacheKey);

    return cacheData;
  } catch (err) {
    return null;
  }
}
