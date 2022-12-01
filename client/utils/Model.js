import { get } from 'lodash';

/**
 * Set Data Model
 * @param {Object} data
 * @return {Object}
 */
export const setModel = data => ({
  string: (path, defaultValue) => String(get(data, path, defaultValue || '')),
  number: (path, defaultValue) => Number(get(data, path, defaultValue || 0)),
  object: (path, defaultValue) => get(data, path, defaultValue || {}),
  array: (path, defaultValue) => get(data, path, defaultValue || []),
  bool: (path, defaultValue) => Boolean(get(data, path, defaultValue || false)),
  timestamp: (path, defaultValue) => get(data, path, defaultValue || 0),
  condition: (path, callback) => {
    const item = get(data, path, null);
    return callback(item);
  },
});
