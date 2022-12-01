import React from 'react';
import styled from 'styled-components';
import { ButtonRadio } from '../ButtonRadio';

const FormWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
`;

const RequiredBadge = styled.span`
  &:after {
    content: '*';
    font-size: 16px;
    font-weight: bold;
    position: relative;
    top: 4px;
    color: #ec1d24;
  }
`;

const FormRadio = ({ name, label, checked, required, onChange }) => {
  return (
    <FormWrapper>
      <ButtonRadio name={name} label={label} onChange={onChange} checked={checked} /> {required && <RequiredBadge />}
    </FormWrapper>
  );
};

export default FormRadio;
