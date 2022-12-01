import * as Sentry from '@sentry/browser';

import { sentryClient } from './config';

export const CreateSentryClient = () => {
  const window_app = window?.App;
  const release = window_app?.release || `tops-fe@${sentryClient.version}`;
  const environment = window_app?.environment || sentryClient.env;
  const dsn = window_app?.sentry_dsn || sentryClient.dsn;

  if (dsn) {
    Sentry.init({
      dsn,
      environment,
      release,
      defaultIntegrations: false,
      beforeSend(event, hint) {
        return filterBeforeSend({ event, hint });
      },
      integrations: [
        new Sentry.Integrations.InboundFilters(),
        new Sentry.Integrations.FunctionToString(),
        // new Sentry.Integrations.TryCatch(),
        new Sentry.Integrations.Breadcrumbs({
          console: false,
          dom: true,
          fetch: false,
          history: false,
          sentry: false,
          xhr: false,
        }),
        new Sentry.Integrations.GlobalHandlers({
          onerror: false,
          onunhandledrejection: false,
        }),
        new Sentry.Integrations.LinkedErrors(),
        new Sentry.Integrations.UserAgent(),
      ],
      ignoreErrors: [
        // Random plugins/extensions
        'top.GLOBALS',
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        'http://tt.epicplay.com',
        `Can't find variable: ZiteReader`,
        'jigsaw is not defined',
        'ComboSearch is not defined',
        'http://loading.retry.widdit.com/',
        'atomicFindClose',
        // Facebook borked
        'fb_xd_fragment',
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
        // reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268
        'bmi_SafeAddOnload',
        'EBCallBackMessageReceived',
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
        'conduitPage',
        'Network Error',
        'timeout of 0ms exceeded',
        'missing ) after argument list',
      ],
      blacklistUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
        /eatdifferent\.com\.woopra-ns\.com/i,
        /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Other plugins
        /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
        /hit\.api\.useinsider\.com/i,
        /gtm\//i,
        /s\.go-mpulse\.net/i,
        /www\.google-analytics\.com/i,
        /connect\.facebook\.net/i,
        /static\.ads-twitter\.com/i,
        /ads\.yahoo\.com/i,
        /bh\.contextweb\.com/i,
        /pubads\.g\.doubleclick\.net/i,
        /api\.ematicsolutions\.com/i,
        /sg6-api\.ematicsolutions\.com/i,
        /service\.force\.com/i,
        /hit\.api\.useinsider\.com/i,
      ],
    });
    // window.SENTRY = Sentry;
  }
  return Sentry;
};

export const SentryCaptureException = ({ error, logsData, actionName }) => {
  if (logsData) {
    const url = logsData?.url;
    Sentry.configureScope(function(scope) {
      scope.setTag('transaction_id', logsData?.trace_id);
      if (url) scope.setTag('api', url);
      if (logsData?.from) scope.setTag('from', logsData?.from);
      if (error?.status) scope.setTag('http_status', error?.status);
      const apiBlackList = ['/api/register', '/api/login'];
      const isFoundApiBlackList = apiBlackList.find(
        value => value.indexOf(url) !== -1,
      );

      if (url && logsData?.params && isFoundApiBlackList) {
        delete logsData.params;
      }

      for (const property in logsData) {
        scope.setExtra(property, logsData[property]);
      }
    });

    if (actionName) {
      Sentry.captureMessage(actionName, 'error');
    } else {
      Sentry.captureMessage(`${url} | ${error?.message}`, 'error');
    }
  } else {
    Sentry.captureException(error);
  }
};

const filterBeforeSend = ({ event, hint }) => {
  try {
    const httpStatusCode = [200, 301, 302, 401, 402, 404];
    if (hint) {
      const responseMessage =
        hint.originalException?.response?.data?.message ||
        hint.originalException?.response?.data?.cause;
      const blackListMessage = [
        'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.',
        'A customer with the same email address already exists in an associated website.',
      ];
      if (blackListMessage.find(message => message.includes(responseMessage)))
        return null;

      const eventStatusCode = hint?.originalException?.response?.status || null;
      const isFoundBlackListStatus = eventStatusCode
        ? httpStatusCode.includes(eventStatusCode)
        : false;

      if (isFoundBlackListStatus) return null;
    }

    const filterListbreadcrumbs = value =>
      value.category === 'http' &&
      (!httpStatusCode.includes(value.data.status_code) ||
        !value.url.includes('site.webmanifest'));
    event.breadcrumbs.filter(filterListbreadcrumbs);

    return event;
  } catch (e) {
    return event;
  }
};
