import AccountApi from '../apis/account';
import { get as prop } from 'lodash';

export const TYPES = {
  FORGOT_PASSWORD_START: 'FORGOT_PASSWORD_START',
  FORGOT_PASSWORD_COMPLETED: 'FORGOT_PASSWORD_COMPLETED',
  FORGOT_PASSWORD_FAILED: 'FORGOT_PASSWORD_FAILED',
  RESET_PASSWORD_START: 'RESET_PASSWORD_START',
  RESET_PASSWORD_COMPLETED: 'RESET_PASSWORD_COMPLETE',
  RESET_PASSWORD_FAILED: 'RESET_PASSWORD_FAILED',
};

export const forgotPassword = lang => {
  return async (dispatch, getState) => {
    dispatch(forgotPasswordStart());
    try {
      const email = prop(getState(), 'form.forgotForm.values.email', false);
      const response = await AccountApi.forgotPassword(email);

      dispatch(forgotPasswordCompleted());

      if (response) {
        return (window.location.href = `/${lang}/forgot-password/completed`);
      }
    } catch (e) {
      dispatch(forgotPasswordFailed(prop(e, 'response.data.msg', '')));
      return e;
    }
  };
};

export const resetPassword = (resetToken, email, lang) => {
  return async (dispatch, getState) => {
    dispatch(resetPasswordStart());
    try {
      const newPassword = prop(
        getState(),
        'form.resetPassForm.values.password',
        false,
      );
      const response = await AccountApi.resetPassword(
        resetToken,
        email,
        newPassword,
      );

      dispatch(resetPasswordCompleted());

      if (response) {
        return (window.location.href = `/${lang}/reset-password/completed`);
      }
    } catch (e) {
      dispatch(resetPasswordFailed(e));
      return e;
    }
  };
};

export const forgotPasswordStart = () => ({
  type: TYPES.FORGOT_PASSWORD_START,
});

export const forgotPasswordCompleted = () => ({
  type: TYPES.FORGOT_PASSWORD_COMPLETED,
});

export const forgotPasswordFailed = error => ({
  type: TYPES.FORGOT_PASSWORD_FAILED,
  payload: {
    error,
  },
});

export const resetPasswordStart = () => ({
  type: TYPES.RESET_PASSWORD_START,
});

export const resetPasswordCompleted = () => ({
  type: TYPES.RESET_PASSWORD_COMPLETED,
});

export const resetPasswordFailed = error => ({
  type: TYPES.RESET_PASSWORD_FAILED,
  payload: {
    error,
  },
});

const initialState = {
  forgotLoading: false,
  resetLoading: false,
  msgError: '',
  resetPassword: [],
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FORGOT_PASSWORD_START: {
      return { ...state, forgotLoading: true };
    }

    case TYPES.FORGOT_PASSWORD_COMPLETED: {
      return { ...state, forgotLoading: false };
    }

    case TYPES.FORGOT_PASSWORD_FAILED: {
      const { error } = action.payload;
      return {
        ...state,
        forgotLoading: false,
        msgError: error,
      };
    }

    case TYPES.RESET_PASSWORD_START: {
      return { ...state, resetLoading: true };
    }

    case TYPES.RESET_PASSWORD_COMPLETED: {
      return { ...state, resetLoading: false };
    }

    case TYPES.RESET_PASSWORD_FAILED: {
      const { error } = action.payload;
      return {
        ...state,
        resetLoading: false,
        msgError: error,
      };
    }

    default:
      return state;
  }
};

export default accountReducer;
