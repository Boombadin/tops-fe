import config from './config'

// If cookie for store is set, it will return the value stored in cookie,
// else it will return the default store view code
const currentStoreViewCode = cookie => {
  const storeName = cookie[config.store_view_cookie_name];
  return storeName === 'undefined' || !storeName ? '' : storeName;
}

export { currentStoreViewCode }
