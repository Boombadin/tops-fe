import { find, first, get as prop, isEmpty, split } from 'lodash';

import { checkDate } from '@app/utils/dayjs';

import config from '../config';
import seoService from '../services/seoService';

export const getRedirectUrl = async url => {
  const checkOldUrl =
    split(url, '/p/').length > 1 ||
    split(url, '/d/').length > 1 ||
    split(url, '/h/').length > 1 ||
    split(url, '/Contact/').length > 1;
  let redirectUrl = url;

  if (checkDate('2020-12-06 16:50')) {
    const splitUrl = split(url, '/');
    if (splitUrl?.length > 1 && splitUrl[1] === 'beer-wine-and-spirits') {
      redirectUrl = '/online-alcohol-products';
    }
  }
  if (checkOldUrl) {
    let character = 'p';
    if (split(url, '/d/').length > 1) {
      character = 'd';
    } else if (split(url, '/h/').length > 1) {
      character = 'h';
    } else if (split(url, '/Contact/').length > 1) {
      character = 'Contact';
    }
    const newUrlRedirect = await seoService.getUrlRedirect(url, character);
    redirectUrl = newUrlRedirect;
  }
  return redirectUrl;
};

export default async (req, res) => {
  const { url, cookies, query } = req;
  let { lang } = cookies;
  const queryLang = prop(query, 'lang');
  const isUseLangFromParam = queryLang && isEmpty(lang);

  if (isUseLangFromParam) {
    lang = queryLang;
  }

  let currentLang = find(config.languages, { code: lang });
  if (!lang || !currentLang) {
    currentLang = first(config.languages);
    res.cookie('lang', currentLang.code);
  }

  const redirectUrl = await getRedirectUrl(url);
  res.redirect(301, `/${currentLang.url}${redirectUrl}`);
};
