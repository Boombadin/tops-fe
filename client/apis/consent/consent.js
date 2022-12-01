import axios from 'axios';
import { consentKey, baseUrl } from '../config';

const headers = {
  'x-api-key': consentKey,
  'Content-Type': 'application/json',
};
const defaultParams = {
  channel: 'MDC',
  partner: 'TOPS',
};

const getConsentInfo = () => {
  const param = {
    url: `${baseUrl}/consent`,
    method: 'GET',
    headers,
    params: defaultParams,
  };
  return axios(param)
    .then(function({ data }) {
      return { data };
    })
    .catch(function({ response }) {
      return { status: 'error', message: response?.statusText };
    });
};

const getUserConsent = ({ email, ref_id }) => {
  const param = {
    url: `${baseUrl}/consent/user-info`,
    method: 'POST',
    headers,
    data: {
      email,
      ref_id,
      channel: 'MDC',
      partner: 'TOPS',
      brand: 'HQ',
    },
  };
  return axios(param)
    .then(function({ data }) {
      return { data };
    })
    .catch(function({ response }) {
      return { status: 'error', message: response?.statusText };
    });
};

const updateUserConsent = ({
  email,
  ref_id,
  consentPrivacyVersion,
  consentPrivacyStatus,
  consentMarketingStatus,
}) => {
  const param = {
    url: `${baseUrl}/consent`,
    method: 'POST',
    headers,
    data: {
      email,
      channel: 'MDC',
      partner: 'TOPS',
      ref_id,
      brand: 'HQ',
      consent_privacy_version: consentPrivacyVersion,
      consent_privacy_status: consentPrivacyStatus,
      consent_marketing_status: consentMarketingStatus,
    },
  };
  return axios(param)
    .then(function({ data }) {
      return { status: 'success', data };
    })
    .catch(function({ response }) {
      return { status: 'error', message: response?.statusText };
    });
};

export default {
  getConsentInfo,
  getUserConsent,
  updateUserConsent,
};
