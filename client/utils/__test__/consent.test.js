import { consentInfo, userConsentInfo, userInfo } from '../__mocks__/consent';
import {
  getConsentData,
  getConsentInfoPolicy,
  getUserConsent,
  saveConsent,
} from '../consent';

const mockConsentInfo = consentInfo;
const mockUserConsentInfo = userConsentInfo;
const mockUserInfo = userInfo;
const mockUUID = '47e24ac0-9689-11ea-849c-d5cbf0265af0';
const mockResponseStatus = {
  success: 'success',
  fail: 'fail',
};
jest.mock('../../apis/consent', () => ({
  getConsentInfo: () => {
    return {
      data: mockConsentInfo,
    };
  },
  getUserConsent: () => {
    return {
      data: mockUserConsentInfo,
    };
  },
  updateUserConsent: () => {
    return {
      status: mockResponseStatus.success,
      data: {
        uuid: mockUUID,
      },
    };
  },
}));
describe('consent is work correctly', () => {
  test('getConsentData | fetch consentInfo successfully data from an API', async () => {
    const expectedResponse = {
      consent_privacy_version: consentInfo.consent_privacy_version,
      marketing_display_text: consentInfo.marketing_display_text.en,
    };
    const result = await getConsentData('en');
    expect(result).toEqual(expectedResponse);
  });
  test('getConsentInfoPolicy | fetch consentInfo successfully data from an API', async () => {
    const expectedResponse = {
      privacy_policy: consentInfo.privacy_policy.en,
    };
    const result = await getConsentInfoPolicy('en');
    expect(result).toEqual(expectedResponse);
  });
  test('getUserConsent | fetch user consent successfully data from an API', async () => {
    const userInfo = {
      email: 'pdpa@central.tech',
      ref_id: '1234',
    };
    const expectedResponse = userConsentInfo;
    const result = await getUserConsent(userInfo);
    expect(result).toEqual(expectedResponse);
  });
  test('saveConsent | post user consent info data to an API successfully', async () => {
    const expectedResponse = {
      status: mockResponseStatus.success,
      data: { uuid: mockUUID },
    };
    const result = await saveConsent(mockUserInfo);
    expect(result).toEqual(expectedResponse);
  });
});
