import dotenv from 'dotenv';

// Loads data from .env file and adds to process.env
dotenv.config();

/**
 *
 * Returns the config for the headless magento app. Make sure you fill
 * this config appropriately. Some configurations should be set in the
 * .env file.
 *
 */
const config = {
  // The apps name
  app_name: 'Magenta',
  // The magento backend's REST base url to call. This will be used to
  // generate url for API calls.
  magento_api_base_url: process.env.MAGENTO_BASE_URL,
  // Token required to pass with requests to magento. For security,
  // this is loaded from the .env file.
  magento_token: process.env.MAGENTO_TOKEN,
  // Store name will be stored in a cookie. This will be the key used to
  // store the cookie name
  store_view_cookie_name: process.env.STORE_VIEW_COOKIE_NAME,
  // sub district id cookie name
  shipping_address_cookie_name: 'shipping_address_cookie',
  // language for website
  languages: [
    { name: 'ไทย', code: 'th_TH', url: 'th' },
    { name: 'EN', code: 'en_US', url: 'en' },
  ],
  // Default Store view code. If your user does not choose a default store view,
  // all data fecthed will be fetched from this default store view
  default_store_view_code: process.env.DEFAULT_STORE_VIEW,
  // If the app will be protected with an SSL
  ssl_enabled: process.env.SSLEnabled === 'true',
  headers: {
    // 'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MAGENTO_TOKEN}`,
    client: 'web',
  },
  cookie_secret_key: 'A)IPRL)*(&^$)',

  data_team_api_token: process.env.DATA_TEAM_TOKEN,
  data_team_api_base_url: process.env.DATA_TEAM_BASE_URL,
  data_team_api_token_b: process.env.DATA_TEAM_TOKEN_B,
  data_team_api_base_url_b: process.env.DATA_TEAM_BASE_URL_B,

  redis: {
    url: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
    expire: process.env.REDIS_EXPIRE_CATEGORY,
  },

  base_Url: process.env.BASE_URL,

  facebook_id: process.env.FACEBOOK_ID,
  grab_client_id: process.env.GRAB_CLIENT_ID,

  environment: process.env.ENV,

  aws_param_store: process.env.AWS_PARAM_STORE,

  default_store: process.env.DEFAULT_STORE_CODE || 'tops_sa_432',

  // Consent
  consent_api_url: process.env.CONSENT_API_URL,
  consent_api_key: process.env.CONSENT_API_KEY,

  //sentry
  sentry_dsn_server: process.env.SENTRY_DSN_SERVER,

  // google optimize
  google_optimize_exp_id: process.env.GOOGLE_OPTIMIZE_EXP_ID,

  // graphql url
  graphql_url: process.env.GRAPHQL_URL,

  //2c2p encrypt
  my2c2p_encrypt_credit_card_url: process.env.MY2C2P_ENCRYPT_CREDIT_CARD_URL,
};

export default config;

// Need to compose this base URL. This flow is tops specific because the Tops app
// has multiple websites and a user needs to match to the website based on postal
// code before they see any information. We also need language preference to
// compose the url.
// 1. Get the website code for zip code (NO API YET, MOCK IT)
// 2. Get language preferrence or use default
// 3. Compose the url
// The url structure will be something like this
// http://dev.magento.tops.co.th/website-code/lang-code/rest/V1
// <------------BASE-----------><----------WEBCODE----------><-API->
// export const baseUrl = AppConfig.magento_api_base_url;
// const token = AppConfig.magento_token;
// // End of Stuff to move out
//
// const headers = {
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${token}`,
// };
//
// export const config = {
//   method: 'GET',
//   headers,
// };
