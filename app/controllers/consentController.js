import { isEmpty, get as prop } from 'lodash';
import consentService from '../services/consentService';

const fetch = async (req, res) => {
  try {
    let response = {};
    response = await consentService.getConsentInfo();
    if (response?.status === 'success') {
      const tranForm = {
        ...response,
        marketing_display_text: response?.data?.marketing_display_text,
        privacy_policy: response?.data?.privacy_policy,
        consent_privacy_version: response?.data?.consent_privacy_version,
      };
      response = { ...response, ...tranForm };
      delete response.data;
    }
    return res.json(response);
  } catch (e) {
    return res.json({ response: null });
  }
};

const fetchUserConsent = async (req, res) => {
  try {
    const { email, ref_id } = req.body;
    let response = {};
    response = await consentService.getUserConsent({ email, ref_id });
    if (response?.status === 'success') {
      let content = response?.data?.content || {};
      if (
        response?.data?.consent_marketing_status !== true &&
        isEmpty(content)
      ) {
        content = await consentService.getConsentInfo();
        if (content?.status === 'success') {
          const tranForm = {
            ...content,
            consent_privacy_status: response?.data?.consent_privacy_status,
            consent_marketing_status: response?.data?.consent_marketing_status,
            marketing_display_text: content?.data?.marketing_display_text,
            consent_privacy_version: response?.data?.consent_privacy_version,
            last_update: response?.data?.last_update,
          };
          response = { ...response, ...tranForm };
          delete tranForm.data;
          delete response.data;
        }
      } else {
        const tranForm = {
          ...response,
          consent_privacy_status: response?.data?.consent_privacy_status,
          consent_marketing_status: response?.data?.consent_marketing_status,
          last_update: response?.data?.last_update,
          marketing_display_text:
            response?.data?.content?.marketing_display_text,
          consent_privacy_version:
            response?.data?.content?.consent_privacy_version,
        };
        response = { ...response, ...tranForm };
        delete response.data;
      }
    }
    return res.json(response);
  } catch (e) {
    console.error('PDPA: fetchUserConsent:', prop(e, 'message', ''));
    return prop(e, 'message', '');
  }
};

const updateUserConsent = async (req, res) => {
  try {
    const {
      email,
      ref_id,
      consent_privacy_version,
      consent_privacy_status,
      consent_marketing_status,
    } = req.body;
    const response = await consentService.updateUserConsent({
      email,
      ref_id,
      consent_privacy_version,
      consent_privacy_status,
      consent_marketing_status,
    });
    return res.json(response);
  } catch (e) {
    return res.json({ response: null });
  }
};

export default {
  fetch,
  fetchUserConsent,
  updateUserConsent,
};
