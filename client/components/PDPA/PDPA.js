import React from 'react';
import styled from 'styled-components';
import FormCheckBox from '../Form/FormCheckBox';
import { withTranslate } from '../../utils/translate';

const PDPA = ({ marketingConsentText, isCheck, onChange, translate }) => {
  return (
    <Wrapper>
      <p>{translate('pdpa.title')}</p>
      <p>
        <FormCheckBox
          id="chk-PDPA"
          name="PDPA"
          checked={isCheck}
          label={marketingConsentText}
          onChange={onChange}
          isHTML
        />
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-size: 13px;
  color: #333333;
  line-height: 100%;
  width: fit-content;
  align-items: center;
  outline: none;

  label {
    font-weight: normal;
    font-size: 10px;
    color: #666666;
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
      border: solid  #80bd00;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
`;
export default withTranslate(PDPA);
