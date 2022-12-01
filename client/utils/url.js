import { getCookie } from './cookie';

export function fullpathUrl(location) {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }

  const langCode = getCookie('lang');
  const lang = langCode === 'th_TH' ? 'th' : 'en';

  return `${window?.App?.api_url}${lang}${location.pathname}${location.search}`;
}

export function getQueryParam(param) {
  const result = window.location.search.match(new RegExp(`(\\?|&)${param}(\\[\\])?=([^&]*)`));

  return result ? result[3] : false;
}
