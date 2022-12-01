import * as Sentry from '@sentry/node';

import { version } from '../package.json';
export const CreateSentryServer = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_SERVER,
    environment: process.env.ENV,
    release: `tops-fe@${version}`,
    beforeBreadcrumb(breadcrumb) {
      // IGNORE newrelic request
      if (
        breadcrumb.type === 'http' &&
        breadcrumb.data?.url?.includes('.newrelic.com')
      ) {
        return null;
      }
      return breadcrumb;
    },
    beforeSend(event, hint) {
      return filterBeforeSend({ event, hint });
    },
    integrations: function(integrations) {
      // integrations will be all default integrations
      return integrations.filter(function(integration) {
        return integration.name !== 'Console';
      });
    },
    blacklistUrls: [
      // Facebook flakiness
      /newrelic\.com/i,
    ],
  });
};

export const SentryCaptureException = ({ error, logsData }) => {
  if (logsData) {
    const api = logsData?.api || logsData?.url;
    Sentry.configureScope(function(scope) {
      scope.setTag('transaction_id', logsData?.trace_id);
      if (logsData?.api) scope.setTag('api', logsData?.api);
      if (logsData?.from) scope.setTag('from', logsData?.from);
      if (logsData?.url) scope.setTag('url', logsData?.url);
      if (error?.status) scope.setTag('http_status', error?.status);
      const apiBlackList = ['/customers', '/integration/customer/token'];
      const isFoundApiBlackList = apiBlackList.find(
        value => value.indexOf(api) !== -1,
      );

      if (api && logsData?.params && isFoundApiBlackList) {
        delete logsData.params;
      }

      for (const property in logsData) {
        scope.setExtra(property, logsData[property]);
      }
    });
    Sentry.captureMessage(`${api} | ${error?.message}`, 'error');
  } else {
    Sentry.captureException(error);
  }
};

const filterBeforeSend = ({ event, hint }) => {
  try {
    const httpStatusCode = [200, 301, 302, 401, 402, 404];
    if (hint) {
      // incase register with existing email
      const responseMessage = hint.originalException?.response?.data?.message;
      const blackListMessage = [
        'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.',
        'A customer with the same email address already exists in an associated website.',
      ];
      if (
        responseMessage &&
        blackListMessage.find(message => message.includes(responseMessage))
      )
        return null;

      const eventStatusCode = hint?.originalException?.response?.status || null;
      const isFoundBlackListStatus = eventStatusCode
        ? httpStatusCode.includes(eventStatusCode)
        : false;

      if (isFoundBlackListStatus) return null;
    }
    return event;
  } catch (e) {
    return event;
  }
};
