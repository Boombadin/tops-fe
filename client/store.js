import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import { analyticsMiddleware } from './features/gtm';
import rootReducer from './reducers';

let middleware = applyMiddleware(thunk, analyticsMiddleware);

if (typeof window !== 'undefined' && window?.App?.node_env === 'logger') {
  middleware = applyMiddleware(thunk, logger);
}

const generateStore = (preloadedState = {}) => {
  const store = createStore(rootReducer, preloadedState, middleware);

  return store;
};

export default generateStore;
