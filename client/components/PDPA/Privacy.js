import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import withLocales from '../../hoc/withLocales';
import { getConsentInfoPolicy } from '../../utils/consent';
import styled from 'styled-components';
const Wrapper = styled.div`
  background: ${({ noBackGround }) => (noBackGround ? 'none' : '#fff')};
`;
const Privacy = ({ langCode, noBackGround }) => {
  const lang = langCode === 'en_US' ? 'en' : 'th';
  const [consentPolicy, setConsentPolicy] = useState('');
  useEffect(() => {
    (async () => {
      const consentData = await getConsentInfoPolicy(lang);
      setConsentPolicy(consentData?.privacy_policy || '');
    })();
  }, []);

  return (
    <Wrapper noBackGround={noBackGround}>
      {!isEmpty(consentPolicy) ? (
        <div dangerouslySetInnerHTML={{ __html: consentPolicy }} />
      ) : (
        <div>Loading...</div>
      )}
    </Wrapper>
  );
};
export default withLocales(Privacy);
