import { del as redisDelete, get as redisGet, set as redisSet } from './redis';

const storeConfigsKey = 'storeConfigsAll';
const defaultStoreConfigsKey = 'storeConfigsDefault';

export async function getDefaultConfigs() {
  try {
    const storeConfigsDefault = await redisGet(defaultStoreConfigsKey);

    return storeConfigsDefault;
  } catch (error) {
    return null;
  }
}

export async function getStoreConfigs() {
  try {
    const allStoreConfigs = await redisGet(storeConfigsKey);

    return allStoreConfigs;
  } catch (error) {
    return null;
  }
}

export function setDefaultConfigs(configs) {
  return redisSet(defaultStoreConfigsKey, configs, 86400); // TODO: define expired number in ENV
}

export function setStoreConfigs(configs) {
  return redisSet(storeConfigsKey, configs, 86400); // TODO: define expired number in ENV
}

export function deleteDefaultStoreConfigs() {
  return redisDelete(defaultStoreConfigsKey);
}

export function deleteStoreConfigs() {
  return redisDelete(storeConfigsKey);
}

export function validateStoreConfig(configs) {
  const isConfigValid =
    configs &&
    Array.isArray(configs) &&
    configs.length > 0 &&
    typeof configs[0].code === 'string';

  return isConfigValid;
}
