import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { Button } from '@central-tech/core-ui';
import FormCheckBox from '../../../components/Form/FormCheckBox';
import withLocales from '../../../hoc/withLocales';
import { getUserConsent, saveConsent } from '../../../utils/consent';
import PrivacyModal from '../../modal/PrivacyModal';
import TermsAndConModal from '../../modal/TermsAndConModal';
import moment from 'moment';

const PDPA = ({ translate, email, id, langCode }) => {
  const [consentData, setConsentData] = useState({});
  const [isCheck, setIsCheck] = useState(false);
  const [isOpenPrivacyModal, setIsOpenPrivacyModal] = useState(false);
  const [isOpenTermsAndConModal, setIsOpenTermsAndConModal] = useState(false);
  const [isSubmitConsent, setIsSubmitConsent] = useState(false);
  let userConsent;
  const lang = langCode === 'th_TH' ? 'th' : 'en';
  useEffect(() => {
    if (isEmpty(consentData)) {
      (async () => {
        userConsent = await getUserConsent({ email, id, langCode: lang });
        if (userConsent?.consent_marketing_status !== true) {
          setConsentData(userConsent || '');
          const dataBuilder = JSON.stringify({
            version: userConsent?.consent_privacy_version || '',
            accept: isCheck,
          });
          localStorage.setItem('consentDataSet', dataBuilder);
        }
      })();
    } else {
      const dataBuilder = JSON.stringify({
        version: consentData?.consent_privacy_version || '',
        accept: isCheck,
      });
      localStorage.setItem('consentDataSet', dataBuilder);
    }
  }, [isCheck]);

  useEffect(() => {
    let response;
    if (isSubmitConsent) {
      (async () => {
        response = await saveConsent({ email, id });
      })();
    }
  }, [isSubmitConsent]);

  const currentDate = moment();
  const lastUpdate = moment(consentData?.last_update, 'DD/MM/YYYY');
  const isShow7Days =
    consentData?.consent_marketing_status === false &&
    currentDate.diff(lastUpdate, 'days') >= 7;
  return (
    !isSubmitConsent &&
    !isEmpty(consentData) &&
    (consentData?.consent_marketing_status === null || isShow7Days) && (
      <Wrapper>
        <ChkWrapper>
          <FormCheckBox
            id="chk-PDPA"
            name="PDPA"
            checked={isCheck}
            label={consentData.marketing_display_text}
            onChange={() => setIsCheck(!isCheck)}
            isHTML
          />
        </ChkWrapper>
        <TermConPrivacyPanel>
          <TermConPrivacyInner>
            {translate('pdpa.home_text1')}
            <span
              onClick={() => setIsOpenTermsAndConModal(!isOpenTermsAndConModal)}
            >
              {translate('pdpa.term_condition')}
            </span>
            {translate('pdpa.text2')}
            <span onClick={() => setIsOpenPrivacyModal(!isOpenPrivacyModal)}>
              {translate('pdpa.privacy_title')}
            </span>
          </TermConPrivacyInner>
          <SubmitConsentWrapper>
            <SubmitConsent
              color="#fff"
              onClick={() => setIsSubmitConsent(true)}
            >
              {translate('pdpa.btn_consent')}
            </SubmitConsent>
          </SubmitConsentWrapper>
        </TermConPrivacyPanel>
        <PrivacyModal
          openModal={isOpenPrivacyModal}
          onModalClose={() => setIsOpenPrivacyModal(false)}
        />
        <TermsAndConModal
          openModal={isOpenTermsAndConModal}
          onModalClose={() => setIsOpenTermsAndConModal(false)}
        />
      </Wrapper>
    )
  );
};
const Wrapper = styled.div`
  width: 100%;
  min-height: 88px;
  position: fixed;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.85);
  padding: 25px 50px 25px 260px;
  z-index: 999;
  @media only screen and (max-width: 991px) {
    border-radius: 10px 10px 0 0;
    padding: 20px;
  }
`;
const ChkWrapper = styled.div`
  font-size: 13px;
  color: #fff;
  line-height: 100%;
  width: fit-content;
  align-items: center;
  outline: none;
  margin-right: 190px;
  @media only screen and (max-width: 1280px) {
    max-width: 622px;
  }
  @media only screen and (max-width: 991px) {
    width: 100%;
    margin-right: 0;
  }
  label {
    font-weight: normal;
    font-size: 13px;
    color: #fff;
    position: relative;
  }
  input:checked ~ .checkbox-checkmark {
    background-color: #ffffff;
  }
  .checkbox-checkmark {
    top: 0;
    transform: none;

    &:after {
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid #80bd00;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
`;
const TermConPrivacyPanel = styled.div`
  margin-top: 15px;
  @media only screen and (max-width: 991px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
const TermConPrivacyInner = styled.div`
  color: #fff;
  font-size: 12px;
  padding-left: 25px;
  span {
    text-decoration: underline;
    cursor: pointer;
  }
  @media only screen and (max-width: 991px) {
    flex: 1;
    margin-right: 10px;
  }
`;
const SubmitConsentWrapper = styled.div`
  @media only screen and (max-width: 991px) {
    flex: 0 0 auto;
    width: 130px;
  }
`;
const SubmitConsent = styled(Button)`
  width: 170px;
  height: 40px;
  border-radius: 4px;
  color: #000000;
  font-size: 14px;
  background-color: #ffffff;
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  @media only screen and (max-width: 991px) {
    position: static;
    width: 130px;
    transform: none;
  }
`;

export default withLocales(PDPA);
