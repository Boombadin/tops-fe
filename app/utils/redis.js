import Redis from 'redis';
import config from '../config';
import { newrelicErrorLogging } from '../utils/logger';

let isRedisConnected = true;

const client = Redis.createClient({
  host: config.redis.url,
  port: config.redis.port,
  db: config.redis.db,
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      isRedisConnected = false;
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      isRedisConnected = false;
    }
    if (options.attempt > 10) {
      isRedisConnected = false;
    }

    return Math.min(options.attempt * 100, 3000);
  },
});

client.on('error', err => {
  isRedisConnected = false;
  console.error(`${err}`);
});

client.on('connect', () => {
  isRedisConnected = true;
});

export const cache = (req, res, next) => {
  if (client.connected !== false) {
    const storeCode = req.headers['x-store-code'];
    const keyName = req.originalUrl.substr(1).replace('/', ':') + storeCode;
    let isTimeout = false;

    /** timeout handling for redis cache middleware */
    const timer = setTimeout(() => {
      isTimeout = true;
      newrelicErrorLogging(new Error('Redis: get exceed timeout limit 2500ms'));
      return next();
    }, 2500);

    client.get(keyName, (err, resultCache) => {
      clearTimeout(timer);

      if (isTimeout) {
        return;
      }

      if (err) {
        throw err;
      }

      if (
        resultCache !== null &&
        typeof resultCache === 'string' &&
        resultCache !== ''
      ) {
        return res.json(JSON.parse(resultCache));
      }

      req.redis = client;
      req.redisKey = keyName;
      next();
    });
  } else {
    return next();
  }
};

export const get = (key, expectType = '') => {
  return new Promise((resolve, reject) => {
    if (!isRedisConnected) reject('redis client not found');

    client.get(key, (err, value) => {
      const jsonValue = JSON.parse(value);
      const isValueInvalid =
        err ||
        !value ||
        value === '{}' ||
        !key ||
        (expectType !== '' && typeof jsonValue !== expectType);

      if (isValueInvalid) {
        reject(err);
      }

      resolve(jsonValue);
    });
  });
};

export const set = (key, value, timeout = 3600) => {
  const invalidValue =
    !value ||
    !key ||
    value === '' ||
    value === ' ' ||
    (Object.keys(value).length === 0 && value.constructor === Object);

  if (!isRedisConnected || invalidValue) {
    return false;
  }

  client.set(key, JSON.stringify(value), 'EX', timeout);

  return true;
};

export const del = key => {
  return new Promise(resolve => {
    if (!isRedisConnected) resolve(false);

    client.del(key, (err, res) => {
      resolve(res);
    });
  });
};

export const redisClient = isRedisConnected ? client : null;
