import { uniqBy, find, result, includes, omit, map } from 'lodash';
import RegistrationApi from '../apis/registration';
import ConsentApi from '../apis/consent';

export const TYPES = {
  REGISTER_SEND: 'REGISTER_SEND',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILED: 'REGISTER_FAILED',
  EMAIL_VALIDATE_SEND: 'EMAIL_VALIDATE_SEND',
  EMAIL_VALIDATED: 'EMAIL_VALIDATED',
};

export const register = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const lang = find(state.locale.languages, lang => lang.active === true)
      .code;
    const customer = state.form.regisForm.values;
    dispatch(sendRegistration());
    try {
      const response = await RegistrationApi.create(customer);
      if (response && response.data.id) {
        const consentDataSet = JSON.parse(
          localStorage.getItem('consentDataSet'),
        );
        const isAcceptConsentMarketing = !!consentDataSet?.accept;
        const consentVersion = consentDataSet?.version;
        const consentEmail = response.data.email;
        const consentID = response.data.id;
        if (consentVersion) {
          await ConsentApi.updateUserConsent({
            email: consentEmail,
            ref_id: `${consentID}`,
            consentPrivacyVersion: consentVersion,
            consentMarketingStatus: isAcceptConsentMarketing,
            consentPrivacyStatus: true,
          });
          localStorage.removeItem('consentDataSet');
        }
        const to = `/${lang === 'en_US' ? 'en' : 'th'}/registration/completed`;
        window.location.replace(to);
      } else {
        dispatch(registerFailed(response.data.message));
      }

      return response;
    } catch (e) {
      return null;
    }
  };
};

export const isEmailAvailable = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const customer = state.form.regisForm.values;

    dispatch(sendValidateEmail());

    const response = await RegistrationApi.isEmailAvailable(customer.email);
    if (response && response.data === false) {
      dispatch(registerFailed(`**This email has already been registered.`));
    } else {
      dispatch(validatedEmail());
    }

    return response.data;
  };
};

export const sendRegistration = () => ({
  type: TYPES.REGISTER_SEND,
});
export const sendValidateEmail = () => ({
  type: TYPES.EMAIL_VALIDATE_SEND,
});

const registerSucceded = customer => ({
  type: TYPES.REGISTER_SUCCESS,
  payload: customer,
});

const registerFailed = message => ({
  type: TYPES.REGISTER_FAILED,
  payload: message,
});

const validatedEmail = () => ({
  type: TYPES.EMAIL_VALIDATED,
});

const initialState = {
  registrationErrorCause: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.REGISTER_SEND: {
      return {
        ...state,
        loading: true,
        registrationErrorCause: null,
      };
    }

    case TYPES.REGISTER_FAILED: {
      return {
        ...state,
        customer: {},
        registrationErrorCause: action.payload,
        // loading: false,
      };
    }

    case TYPES.REGISTER_SUCCESS: {
      return {
        ...state,
        registrationErrorCause: { registrationSuccess: true },
        // loading: false,
      };
    }

    case TYPES.EMAIL_VALIDATE_SEND: {
      return {
        ...state,
        // loading: true,
        registrationErrorCause: null,
      };
    }

    case TYPES.EMAIL_VALIDATED: {
      return {
        ...state,
        // loading: false,
        registrationErrorCause: null,
      };
    }

    default:
      return state;
  }
};
export default reducer;
