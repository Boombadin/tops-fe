import { isEmpty, isEqual, split, last } from 'lodash';
import AuthApi from '../apis/auth';
import { getCookie, unsetCookie } from '../utils/cookie';

export const TYPES = {
  LOGIN_SEND: 'LOGIN_SEND',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGIN_SOCIAL: 'LOGIN_SOCIAL',
};

export const login = ref => {
  return async (dispatch, getState) => {
    const state = getState();
    const login = state.form.loginForm.values;

    dispatch(sendLogin());

    try {
      if (!isEmpty(getCookie('product_add_to_cart'))) {
        unsetCookie('product_add_to_cart');
      }

      const response = await AuthApi.login(login);

      if (response && response.status === 200) {
        if (response.data && response.data.message) {
          dispatch(loginFailed(response.data.message));
        } else {
          let to = '/';
          if (
            !isEmpty(ref) &&
            !isEqual(last(split(ref, '/')), 'registration')
          ) {
            to = ref;
          }
          window.location.replace(to);
        }
      } else {
        dispatch(loginFailed(response.data.message));
      }

      return response;
    } catch (e) {
      dispatch(loginFailed(e.message));
    }
  };
};

export const sendLoginSocial = () => ({
  type: TYPES.LOGIN_SOCIAL,
});

export const sendLogin = () => ({
  type: TYPES.LOGIN_SEND,
});

const loginFailed = message => ({
  type: TYPES.LOGIN_FAILED,
  payload: message,
});

export const socialLogin = (ref, data) => {
  return async (dispatch, getState) => {
    dispatch(sendLoginSocial());

    try {
      if (!isEmpty(getCookie('product_add_to_cart'))) {
        unsetCookie('product_add_to_cart');
      }

      const response = await AuthApi.socialLogin(data);

      if (response && response.status === 200) {
        if (response.data && response.data.message) {
          dispatch(loginFailed(response.data.message));
        } else {
          let to = '/';
          if (!isEmpty(ref)) {
            to = ref;
          }
          window.location.replace(to);
        }
      } else {
        dispatch(loginFailed(response.data.message));
      }

      return response;
    } catch (e) {
      dispatch(loginFailed(e.message));
    }
  };
};

const initialState = {
  loginErrorCause: null,
  loading: false,
  loadingFB: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.LOGIN_SEND: {
      return {
        ...state,
        loginFailed: false,
        loginErrorCause: null,
        loading: true,
      };
    }

    case TYPES.LOGIN_SOCIAL: {
      return {
        ...state,
        loginFailed: false,
        loginErrorCause: null,
        loadingFB: true,
      };
    }

    case TYPES.LOGIN_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }

    case TYPES.LOGIN_FAILED: {
      return {
        ...state,
        loginErrorCause: action.payload,
        loading: false,
        loadingFB: false,
      };
    }

    default:
      return state;
  }
};
export default reducer;
