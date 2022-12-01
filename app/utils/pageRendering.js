import { dropRight, find, get, head, isEmpty, last } from 'lodash';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

import packageJson from '@/package.json';
import appConfig from '@app/config';
import { staticRoutes, staticRouteWithParam } from '@app/constants/seo';
import { newrelicErrorLogging } from '@app/utils/logger';
import { metaData, mockMetaData } from '@app/utils/metaData';
import { getHtmlTemplate, TEMPLATE } from '@app/utils/readIndexHtml';
import { getRedirectUrl } from '@app/utils/redirectToRouteWithLang';
import serverInitialState, { loadLocale } from '@app/utils/serverInitialState';
import saleforceConfig from '@client/config/saleforce';
import {
  getCustomerSelector,
  getPhoneNumberFromCustomer,
} from '@client/selectors';
import generateStore from '@client/store';

const renderPage = async (req, res, store) => {
  const context = {};
  const state = store.getState();
  const slug = req.params['1'];
  const code = get(state, 'storeConfig.current.code', '');
  const locate = get(req, 'cookies.lang', 'th_TH');
  const mockSlug = get(req, 'params.1', '');
  const slugArr = mockSlug.split('/');
  const slugNotParams = dropRight(slugArr).join('/');
  const topic = get(req, 'query.topic', '');
  const setSlug = mockSlug || 'home';
  const baseUrl = process.env.BASE_URL + req.url;
  const metaLink = `<link data-react-helmet="true" rel="canonical" href="${head(
    baseUrl.split('?'),
  )}"/>`;
  let metaResponse = {};
  let metaTitle = '';
  let metaTags = '';
  let metaOgTitle = '';
  let metaOgTags = '';
  let metaOgImg = '';
  let metaFbAppID = '';
  let metaType = 'website';
  let metaUrl = '';
  // Saleforct
  let saleforce_firstname = '';
  let saleforce_lastname = '';
  let saleforce_email = '';
  let saleforce_phone = '';
  // Micro data
  let microDataName = '';
  let microDataImg = '';
  let microDataDescription = '';
  let microDataPrice = '';
  let microData = '';
  let metaBranchProduct = '';
  let metaBranchCategory = '';

  if (staticRoutes.includes(setSlug)) {
    metaResponse = mockMetaData(setSlug, locate, topic);
  } else if (staticRouteWithParam.includes(slugNotParams)) {
    const params = last(slugArr);
    metaResponse = mockMetaData(slugNotParams, locate, topic, params);
  } else {
    metaResponse = await metaData(code, slug, locate, state);
    if (metaResponse.redirect === 301) {
      return res.redirect(
        301,
        `/${req.params.lang}/${metaResponse.url_redirect}`,
      );
    }
  }
  metaTitle = metaResponse.metaTitle;
  metaTags = metaResponse.metaTags;

  metaOgTitle = metaResponse.metaOgTitle;
  metaOgTags = metaResponse.metaOgTags;
  metaOgImg = metaResponse.metaOgTagsImg;

  metaFbAppID = metaResponse.metaFbAppID;
  metaType = metaResponse.metaType;
  metaUrl = metaResponse.metaUrl;

  microDataName = metaResponse.microDataName;
  microDataImg = metaResponse.microDataImg;
  microDataDescription = metaResponse.microDataDescription;
  microDataPrice = metaResponse.microDataPrice;
  if (metaResponse?.metaBranchProduct) {
    metaBranchProduct = metaResponse.metaBranchProduct;
  }
  if (metaResponse?.metaBranchCategory) {
    metaBranchCategory = metaResponse?.metaBranchCategory;
  }
  microData = microDataName
    ? `
  <script type="application/ld+json">
    {
      "@context": "http://schema.org/",
      "@type": "Product",
      "image": "${microDataImg}",  
      "name": "${microDataName}",
      "description": "${microDataDescription}",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "THB",
        "price": "${microDataPrice}"
      }
    }
  </script>`
    : '';

  // Saleforct
  if (!isEmpty(getCustomerSelector(state))) {
    // PENTEST - add serialize for customer object
    const customer = JSON.parse(
      serialize(getCustomerSelector(state), { isJSON: true }),
    );
    const phone = getPhoneNumberFromCustomer(customer);
    saleforce_firstname = customer.firstname;
    saleforce_lastname = customer.lastname;
    saleforce_email = customer.email;
    saleforce_phone = phone;
  }
  const env = process.env.ENV;

  let livechatConfig = saleforceConfig.staging;
  if (env === 'prod') {
    livechatConfig = saleforceConfig.prod;
  } else if (env === 'uat') {
    livechatConfig = saleforceConfig.uat;
  }
  const {
    liveChat_Offline_th,
    liveChat_UrlBase,
    liveChat_UrlService,
    liveChat_SlgId,
    liveChat_ContentUrl,
    liveChat_DeploymentId,
    liveChat_ButtonId_th,
    liveChat_ButtonId_en,
    liveChat_AgentUrl,
    liveChat_DevName_th,
    liveChat_DevName_en,
    liveChat_SetAttribute,
    liveChat_ScriptUrl,
    liveChat_Online_en,
    liveChat_Offline_en,
    liveChat_Online_th,
  } = livechatConfig.liveChat;

  const gtmEnable = req.query?.gtm !== '0';

  const isEnableSentry =
    process.env.ENV &&
    process.env.SENTRY_DSN &&
    (process.env.ENV === 'prod' ||
      process.env.ENV === 'staging' ||
      process.env.ENV === 'uat');

  const app = {
    state,
    graphql_url: appConfig.graphql_url,
    my2c2p_encrypt_credit_card_url: appConfig.my2c2p_encrypt_credit_card_url,
    release: packageJson?.version,
    sentry_dsn: isEnableSentry ? process.env.SENTRY_DSN_FE : null,
    environment: process.env.ENV,
    api_url: process.env.API_URL,
    node_env: process.env.NODE_ENV,
  };

  try {
    const htmlTemplate = await getHtmlTemplate();
    const html = htmlTemplate
      .replace('{version}', packageJson.version)
      .replace(/{google_opt_code}/g, process.env.GOOGLE_OPT_CONTAINER_ID)
      .replace(/{ga_code}/g, gtmEnable ? process.env.GA_CODE : '')
      .replace(
        /{gtm_code}/g,
        gtmEnable ? process.env.GOOGLE_TAG_MANAGER_ID : '',
      )
      .replace(
        /{gtm_code360}/g,
        gtmEnable ? process.env.GOOGLE_TAG_MANAGER_ID360 : '',
      )
      .replace(/{branch_key}/g, process.env.BRANCH_KEY)
      .replace('{version}', packageJson.version)
      .replace('{language}', req.params.lang)
      .replace('{saleforce_lang}', req.params.lang)
      .replace('{title}', metaTitle)
      .replace('{meta}', metaTags)
      .replace('{og_title}', metaOgTitle)
      .replace('{og_meta}', metaOgTags)
      .replace('{og_image}', metaOgImg)
      .replace('{fb_appid}', metaFbAppID)
      .replace('{og_type}', metaType)
      .replace('{og_url}', metaUrl)
      .replace('{metaBranchProduct}', metaBranchProduct)
      .replace('{metaBranchCategory}', metaBranchCategory)
      .replace('{link}', metaLink)
      .replace('{script}', '')
      .replace('{app_state}', serialize(app, { isJSON: true }))
      .replace(/{saleforce_firstname}/g, saleforce_firstname)
      .replace(/{saleforce_lastname}/g, saleforce_lastname)
      .replace(/{saleforce_email}/g, saleforce_email)
      .replace(/{saleforce_phone}/g, saleforce_phone)
      .replace(/{liveChat_UrlBase}/g, liveChat_UrlBase)
      .replace(/{liveChat_UrlService}/g, liveChat_UrlService)
      .replace(/{liveChat_SlgId}/g, liveChat_SlgId)
      .replace(/{liveChat_ContentUrl}/g, liveChat_ContentUrl)
      .replace(/{liveChat_DeploymentId}/g, liveChat_DeploymentId)
      .replace(/{liveChat_ButtonId_th}/g, liveChat_ButtonId_th)
      .replace(/{liveChat_ButtonId_en}/g, liveChat_ButtonId_en)
      .replace(/{liveChat_AgentUrl}/g, liveChat_AgentUrl)
      .replace(/{liveChat_DevName_th}/g, liveChat_DevName_th)
      .replace(/{liveChat_DevName_en}/g, liveChat_DevName_en)
      .replace(/{liveChat_SetAttribute}/g, liveChat_SetAttribute)
      .replace(/{liveChat_ScriptUrl}/g, liveChat_ScriptUrl)
      .replace(/{liveChat_Online_en}/g, liveChat_Online_en)
      .replace(/{liveChat_Offline_en}/g, liveChat_Offline_en)
      .replace(/{liveChat_Online_th}/g, liveChat_Online_th)
      .replace(/{liveChat_Offline_th}/g, liveChat_Offline_th)
      .replace('{microData}', microData)
      .replace('{app}', '');

    // const htmls = html.split('{app}');

    if (context.url) {
      return res.redirect(301, context.url);
    }

    let statusCode = 200;
    if (metaResponse.pageNotFound) {
      statusCode = 404;
    }

    Helmet.renderStatic();
    return res.status(statusCode).send(html);
  } catch (e) {
    return errorRendering(req, res, e);
  }
};

const errorRendering = (req, res, error) => {
  const { requestId } = req;
  let errHtml = requestId;
  const errorMessage =
    get(error, 'response.data.message') || get(error, 'message');

  if (process.env.NODE_ENV !== 'production') {
    const errStack = JSON.stringify(error.stack);
    const errorReplace = errStack.replace(/\\n/g, '<br>');
    errHtml = `${errorReplace} requestId: ${requestId}`;
  }

  newrelicErrorLogging(errorMessage, { url: req.path });

  return res.render('pages/maintenance', {
    error: errHtml,
  });
};

export const renderCreditCardFrame = async (req, res) => {
  const store = generateStore();
  await loadLocale(store, req);
  const state = store.getState();

  const app = {
    state,
    graphql_url: appConfig.graphql_url,
    my2c2p_encrypt_credit_card_url: appConfig.my2c2p_encrypt_credit_card_url,
  };
  const htmlTemplate = await getHtmlTemplate(TEMPLATE.CREDIT_CARD_FRAME);
  const html = htmlTemplate
    .replace('{version}', packageJson.version)
    .replace('{language}', req.params.lang)
    .replace('{app_state}', serialize(app, { isJSON: true }));

  res.set('X-Frame-Options', 'SAMEORIGIN');
  res.set(
    'Content-Security-Policy',
    `base-uri 'self' https://*.tops.co.th:*;` +
      `connect-src 'self' https://*.tops.co.th:*;` +
      `script-src 'self' https://*.tops.co.th:* https://*.2c2p.com:* 'unsafe-inline'`,
  );
  return res.status(200).send(html);
};

const pageRendering = async (req, res) => {
  // Redirect in th/en Url
  const { url } = req;

  if (url.includes('//')) {
    return res.redirect(301, url.replace(/\/\//gi, '/'));
  }

  if (res.statusCode === 200) {
    const splitUrl = url.slice(1).split('/');
    if (splitUrl.length > 0) {
      const generateUrl = `/${splitUrl.slice(1).join('/')}`;
      const redirectUrl = await getRedirectUrl(
        generateUrl === '/th' || generateUrl === '/en' ? '/' : generateUrl,
      );

      if (redirectUrl !== generateUrl) {
        const newUrl = `/${splitUrl[0]}${redirectUrl}`;
        if (generateUrl === '/th' || generateUrl === '/en') {
          return res.redirect(301, `${generateUrl}${redirectUrl}`);
        }
        return res.redirect(301, newUrl);
      }
    }
  }

  const { lang } = req.cookies;

  if (lang) {
    const reqLang = find(appConfig.languages, { url: req.params.lang });

    if (reqLang.code !== lang) {
      res.cookie('lang', reqLang.code);
    }
  }

  try {
    const store = generateStore();
    const initialState = await serverInitialState(store, req, res);

    if (initialState?.redirect) {
      return res.redirect('/login?token_expired=true');
    }

    return renderPage(req, res, store);
  } catch (e) {
    return errorRendering(req, res, e);
  }
};

export default pageRendering;
