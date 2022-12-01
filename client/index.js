import { CoreUiProvider } from '@central-tech/core-ui';
import * as Sentry from '@sentry/browser';
import axios from 'axios';
import Cookies from 'js-cookie';
import { find } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { addTranslation } from 'react-localize-redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { createBrowserApolloClient } from '@/createGraphqlClient';
import translation from '@/translate/translation.json';
import App from '@client/App';
import theme from '@client/config/theme';
import {
  CartProvider,
  FirebaseProvider,
  ReduxProvider,
} from '@client/contexts';
import CreditCardFrame from '@client/pages/CreditCardFrame';
import { fetchCart } from '@client/reducers/cart';
import { CreateSentryClient } from '@client/sentryClient';
import generateStore from '@client/store';

import './styles/app.scss';

const window_app = window?.App;
const store = generateStore(window_app?.state);
store.dispatch(addTranslation(translation));
const RootCreditCardFrame = document.getElementById('root-credit-card-frame');

class RootApp extends React.Component {
  componentDidCatch(error, errorInfo) {
    if (typeof window !== 'undefined') {
      window?.newrelic?.noticeError(error);
    }
    if (true) {
      Sentry.withScope(scope => {
        scope.setExtras(errorInfo);
        Sentry.captureException(error);
      });
    }
  }

  render() {
    if (RootCreditCardFrame) {
      return (
        <Provider store={store}>
          <CreditCardFrame />
        </Provider>
      );
    }

    const state = store.getState();

    const storeCode = state.storeConfig.current.code;
    const siteId = state.storeConfig.current.website_id;
    const isLogin = Object.keys(state.customer).length > 0;
    const currentLang = find(state.locale.languages, { active: true });

    axios.defaults.headers.common['x-store-code'] = storeCode;
    axios.defaults.headers.common['x-website-id'] = siteId;

    if (isLogin) {
      store.dispatch(fetchCart());
    }
    CreateSentryClient();

    const userToken = Cookies.get('user_token');
    const { client } = createBrowserApolloClient({
      uri: window_app?.graphql_url,
      headers: {
        store: storeCode,
        bu: 'tops',
        client: 'web',
        authorization: userToken ? `Bearer ${userToken}` : '',
      },
    });
    const context = {
      store,
      client,
      storeConfig: window_app?.state?.storeConfig?.current,
      lang: currentLang?.url,
      customer: window_app?.state?.customer,
      userToken: userToken || null,
    };

    return (
      <Provider store={context?.store}>
        <CoreUiProvider client={context?.client} theme={theme}>
          <Router basename={`/${currentLang.url}`}>
            <ReduxProvider store={store}>
              <FirebaseProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </FirebaseProvider>
            </ReduxProvider>
          </Router>
        </CoreUiProvider>
      </Provider>
    );
  }
}

ReactDOM.hydrate(
  <RootApp />,
  RootCreditCardFrame
    ? document.getElementById('root-credit-card-frame')
    : document.getElementById('root'),
);
