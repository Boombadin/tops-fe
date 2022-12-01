import authService from '../services/authService';
import { isEmpty, get as prop } from 'lodash';

const login = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const data = req.body;
    const token = await authService.login(store, data.username, data.password);

    if (token) {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();
      const c = new Date(year + 1, month, day);
      res.cookie('user_token', token, { expires: c });
      return res.status(200).send();
    }

    return res.status(500).send();
  } catch (e) {
    return res.json(e);
  }
};

const callback = async (req, res) => {
  const { tempToken, lang } = req.query;
  try {
    if (tempToken) {
      const fetchToken = await authService.getToken(tempToken);
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();
      const c = new Date(year + 1, month, day);
      res.cookie('user_token', fetchToken, { expires: c });
      return res.redirect(301, `/${lang}/callback/success`);
    }

    return res.redirect(301, `/${lang}/callback/error`);
  } catch (e) {
    return res.redirect(301, `/${lang}/callback/error`);
  }
};

const setTokenAndStore = async (req, res) => {
  try {
    const { token, shipping_address, lang } = req.query;

    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const c = new Date(year + 1, month, day);
    const nextDay = new Date(year, month, day + 1);
    res.cookie('user_token', token, { expires: c });
    res.cookie('popup_close', 1, { expires: nextDay });
    res.cookie('shipping_address_cookie', shipping_address, {
      expires: nextDay,
    });
    res.cookie('lang', lang, { expires: c });

    return res.redirect(301, '/cart');
  } catch (e) {
    return res.redirect(301, '/');
  }
};

const register = async (req, res) => {
  try {
    const { customer, subscribe } = req.body;
    const store = req.headers['x-store-code'];
    const response = await authService.register(store, customer, subscribe);

    // PENTEST - remove confirmation token out of register response.
    delete response.confirmation;

    return res.status(200).send(response);
  } catch (e) {
    const errorMessage = e?.response?.message || e?.message || 'error';
    return res.json({ message: errorMessage });
  }
};

const isEmailAvailable = async (req, res) => {
  try {
    const store = req.headers['x-store-code'];
    const { email } = req.params;
    const response = await authService.isEmailAvailable(store, email);
    return res.status(200).send(response);
  } catch (e) {
    return res.json(e);
  }
};

const forgotPassword = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { email } = req.body;

  try {
    const response = await authService.forgotPassword(store, email);

    return res.json({ forgotResp: response });
  } catch (e) {
    return res.status(500).send({
      forgotResp: null,
      status: 'error',
      msg: prop(e, 'response.data.message', ''),
    });
  }
};

const resetPassword = async (req, res) => {
  const store = req.headers['x-store-code'];
  const { resetToken, email, newPassword } = req.body;

  try {
    const response = await authService.resetPassword(
      store,
      resetToken,
      email,
      newPassword,
    );

    if (!isEmpty(response.deep_link)) {
      res.cookie('reset_deep_link', JSON.stringify(response.deep_link), {
        maxAge: 900000,
      });
    }

    return res.json({ resetResp: response });
  } catch (e) {
    return res
      .status(500)
      .send({ resetResp: null, status: 'error', msg: e.message });
  }
};

const socialLogin = async (req, res) => {
  try {
    const { token, provider } = req.query;
    const userToken = await authService.socialLogin(token, provider);
    if (userToken) {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();
      const c = new Date(year + 1, month, day);
      res.cookie('user_token', userToken, { expires: c });
      return res.status(200).send();
    }
    return res.status(500).send();
  } catch (e) {
    return res.json(e);
  }
};

export default {
  register,
  login,
  isEmailAvailable,
  forgotPassword,
  resetPassword,
  callback,
  setTokenAndStore,
  socialLogin,
};
