import Cookies from 'js-cookie';

export function unsetCookie(cookieName) {
  Cookies.remove(cookieName);
}

export function getCookie(cookieName) {
  return Cookies.get(cookieName);
}

export function isLoggedIn() {
  return Cookies.get('user_token') !== undefined;
}
