import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import withLocales from '../../hoc/withLocales';
import { withRouter } from 'react-router-dom';
import { TextGuide } from '../../components/Typography';

const LanguageView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 50px;
  position: relative;
`;

const LanguageLink = styled.a`
  cursor: pointer;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    color: #fff;
  }
`;

const LanguageLinkDisabled = styled.span`
  cursor: pointer;
  color: white;
  text-decoration: none;
  opacity: 0.5;
  font-size: 14px;
`;

const WhiteSpace = styled.span`
  /* color: white;
  font-size: ${props => props.theme.fontSize}; */
  margin: 0 7px;
  width: 1px;
  height: 13px;
  background: #fff;
`;

const LangSwitch = ({ lang, location }) => {
  const linkTo = langCode => {
    window.location.href = `/${langCode}${location.pathname}`;
  };
  const LinkTH = lang.code === 'th_TH' ? LanguageLink : LanguageLinkDisabled;
  const LinkEN = lang.code === 'en_US' ? LanguageLink : LanguageLinkDisabled;
  return (
    <LanguageView>
      <LinkTH id="lnk-setLanguageDesktop-th" onClick={() => linkTo('th')}>
        <TextGuide type="caption" color="#fff" size={14}>
          ไทย
        </TextGuide>
      </LinkTH>
      <WhiteSpace />
      <LinkEN id="lnk-setLanguageDesktop-en" onClick={() => linkTo('en')}>
        <TextGuide type="caption" color="#fff" size={14}>
          EN
        </TextGuide>
      </LinkEN>
    </LanguageView>
  );
};

export default compose(withRouter, withLocales)(LangSwitch);
