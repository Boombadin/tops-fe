import axios from 'axios';
import config from '../config';
import { get as prop } from 'lodash';
const baseURL = config.consent_api_url;
const headers = {
  'x-api-key': config.consent_api_key,
  'Content-Type': 'application/json',
};

const getConsentInfo = () => {
  const params = {
    url: `${baseURL}/consent_info`,
    method: 'GET',
    headers,
    params: {
      channel: 'MDC',
      partner: 'TOPS',
    },
    timeout: 2000,
  };
  return axios(params)
    .then(function({ data }) {
      return { status: 'success', data };
    })
    .catch(e => {
      console.error('PDPA: getConsentInfo:', prop(e, 'message', ''));
      return { status: 'error', message: prop(e, 'message', '') };
    });
};

const getUserConsent = ({ email, ref_id }) => {
  const params = {
    url: `${baseURL}/check_consent_info`,
    method: 'POST',
    headers,
    data: {
      email: email,
      ref_id: ref_id,
      brand: 'HQ',
      channel: 'MDC',
      partner: 'TOPS',
    },
    timeout: 2000,
  };
  return axios(params)
    .then(function({ data }) {
      return { status: 'success', data };
    })
    .catch(e => {
      console.error('PDPA: getUserConsent:', prop(e, 'message', ''));
      return { status: 'error', message: prop(e, 'message', '') };
    });
};

const updateUserConsent = ({
  email,
  ref_id,
  consent_privacy_version,
  consent_privacy_status,
  consent_marketing_status,
}) => {
  const params = {
    url: `${baseURL}/consent`,
    method: 'POST',
    headers,
    data: {
      email: email,
      ref_id: ref_id,
      brand: '',
      channel: 'MDC',
      partner: 'TOPS',
      consent_privacy_version: consent_privacy_version,
      consent_privacy_status: consent_privacy_status,
      consent_marketing_status: consent_marketing_status,
    },
  };
  return axios(params)
    .then(response => {
      return response.data;
    })
    .catch(e => {
      console.error('PDPA: updateUserConsent:', prop(e, 'message', ''));
      return prop(e, 'message', '');
    });
};

export default {
  getConsentInfo,
  getUserConsent,
  updateUserConsent,
};
