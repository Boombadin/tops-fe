import { isEmpty } from 'lodash';
import ConsentApi from '../apis/consent';
import { getCookie } from './cookie';

const CONSENT_PRIVACY_VERSION = 'consent_privacy_version';
const MARKETING_DISPLAY_TEXT = 'marketing_display_text';
const PRIVACY_POLICY = 'privacy_policy';

export const getConsentData = async (langCode = 'th') => {
  let consentData = {};
  if (getCookie('provider') !== 'GrabFresh') {
    const { data } = await ConsentApi.getConsentInfo();
    if (data?.status === 'success') {
      consentData = {
        [CONSENT_PRIVACY_VERSION]: data[CONSENT_PRIVACY_VERSION],
        [MARKETING_DISPLAY_TEXT]: data[MARKETING_DISPLAY_TEXT]?.[langCode],
      };
    }
  }
  return consentData;
};

export const getConsentInfoPolicy = async (langCode = 'th') => {
  const { data } = await ConsentApi.getConsentInfo();
  let consentData = {};
  if (data?.status === 'success') {
    consentData = {
      [PRIVACY_POLICY]: data[PRIVACY_POLICY]?.[langCode],
    };
  }
  return consentData;
};

export const getUserConsent = async ({ email, id, langCode }) => {
  if (getCookie('provider') !== 'GrabFresh') {
    const { data } = await ConsentApi.getUserConsent({
      email,
      ref_id: `${id}`,
    });
    let consentData = {};
    if (data?.status === 'success') {
      consentData = {
        ...data,
        ..._transformConsentInfo(data, langCode),
      };
      return consentData;
    }
  }
};

function _transformConsentInfo(data, langCode) {
  return {
    [CONSENT_PRIVACY_VERSION]: data[CONSENT_PRIVACY_VERSION],
    [MARKETING_DISPLAY_TEXT]: data[MARKETING_DISPLAY_TEXT]?.[langCode],
  };
}

export const saveConsent = async ({
  email,
  id,
  consentPrivacyVersion = '',
  consentMarketingStatus = false,
  consentPrivacyStatus = true,
}) => {
  const consentDataSet = JSON.parse(localStorage.getItem('consentDataSet'));
  const isAcceptConsentMarketing = consentDataSet
    ? !!consentDataSet?.accept
    : consentMarketingStatus;
  const consentVersion = consentDataSet?.version || consentPrivacyVersion;
  const consentEmail = email;
  const consentID = id;
  if (consentVersion) {
    const response = await ConsentApi.updateUserConsent({
      email: consentEmail,
      ref_id: `${consentID}`,
      consentPrivacyVersion: consentVersion,
      consentMarketingStatus: isAcceptConsentMarketing,
      consentPrivacyStatus: true || consentPrivacyStatus,
    });
    localStorage.removeItem('consentDataSet');
    return response;
  }
};
