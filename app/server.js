import * as Sentry from '@sentry/node';
import axios from 'axios';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'ignore-styles';

import config from './config';
import routes from './routes';
import { CreateSentryServer } from './sentryServer';
import identifyRequestToken from './utils/identifyRequestToken';
import insiderRendering from './utils/insiderRendering';
import pageRendering, { renderCreditCardFrame } from './utils/pageRendering';
import redirectToRouteWithLang from './utils/redirectToRouteWithLang';
import robotRendering from './utils/robotRendering';

const app = express();

const isEnableSentry =
  process.env.ENV &&
  process.env.SENTRY_DSN_SERVER &&
  (process.env.ENV === 'prod' ||
    process.env.ENV === 'uat' ||
    process.env.ENV === 'staging');

if (isEnableSentry) {
  CreateSentryServer();
  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
}

app.use(cors({ origin: process.env.BASE_URL }));

app.use(compression());
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.cookie_secret_key));
app.use(identifyRequestToken);

app.get('/robots.txt', robotRendering);
app.get('/insider/insider-sw-sdk.js', insiderRendering);
app.get('/health-check', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  return res.status(200).send('hello ^^');
});

const publicPath = path.resolve('build', 'public');

axios.defaults.timeout = 2 * 60 * 1000;

app.use('/', express.static(publicPath, { maxAge: 31557600000 }));
app.use('/assets', express.static(publicPath, { maxAge: 31557600000 }));
// app.use('/assets', express.static(publicPath));

app.get(
  /^.+\.(jpg|jpeg|gif|png|bmp|ico|webp|svg|css|js|zip|rar|flv|swf|xls|woff|woff2|ttf|eot)$/,
  (req, res) => {
    res.status(404).end();
  },
);

app.use('/api', routes);
app.get(
  `/:lang((${config.languages
    .map(lang => lang.url)
    .join('|')}))/credit-card-frame`,
  renderCreditCardFrame,
);
app.get(
  `/:lang((${config.languages.map(lang => lang.url).join('|')}))/*`,
  pageRendering,
);
app.get('*', redirectToRouteWithLang);

if (isEnableSentry) app.use(Sentry.Handlers.errorHandler());

app.all('*', (req, res) => {
  res.status(405).send({ error: true, message: 'Method Not Allowed' });
});

const PORT = config.listenPort || 3000;

const server = app.listen(PORT, () => {
  const serverAddress = server.address();
  console.log(
    `Server start at port ${serverAddress.port}, redis start at ${process.env.REDIS_ENDPOINT}`,
  );
});

server.timeout = 60000 * 5;
server.keepAliveTimeout = 61 * 1000;
server.headersTimeout = 65 * 1000;
