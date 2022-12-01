import React from 'react';
import { Field } from 'formik';
import styled from 'styled-components';
import { TextGuide } from '../Typography';
import { Space } from '@central-tech/core-ui';
import { required as requireValidation } from './validation';
import withLocales from '../../hoc/withLocales';
import { get } from 'lodash';
const FormWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
`;

const CustomInput = styled.input`
  line-height: 30px;
  height: 30px;
  font-size: 14px;
  font-family: Sans-Serif !important;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #ffffff;
  -webkit-appearance: none;
  width: 100%;
  padding: 0px 10px 0 10px;
  border-color: ${({ error }) => error && `#ec1d24`};
  color: #2a2a2a;
  ::placeholder {
    color: #bfbfbf;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
  [type='number'] {
    -moz-appearance: textfield;
  }
`;

const RequiredBadge = styled.span`
  &:after {
    content: '*';
    font-size: 15px;
    font-weight: bold;
    position: relative;
    top: 3px;
    left: -1px;
    color: #ec1d24;
  }
`;

const FormInput = ({
  type,
  name,
  label,
  placeholder,
  validates = [],
  required,
  onChange,
  onBlur,
}) => {
  return (
    <FormWrapper>
      <TextGuide type="body" bold>
        {label} {required && <RequiredBadge />}
      </TextGuide>
      <Space xs="4px" />
      <Field
        validate={value => {
          const condition = required && requireValidation(value);
          return condition;
        }}
        name={name}
        render={({
          field,
          form: { touched, errors, setFieldValue, handleBlur },
        }) => (
          <div>
            <CustomInput
              {...field}
              type={type}
              placeholder={placeholder}
              error={touched[get(field, 'name')] && errors[get(field, 'name')]}
              onBlur={e => {
                handleBlur(e);
                onBlur && onBlur(e);
              }}
              onChange={e => {
                e.persist();
                setFieldValue(name, e.target.value);
                onChange && onChange(e);
              }}
            />
            {touched[get(field, 'name')] && errors[get(field, 'name')] && (
              <TextGuide type="body" color="danger">
                {errors[get(field, 'name')]}
              </TextGuide>
            )}
          </div>
        )}
      />
    </FormWrapper>
  );
};

export default withLocales(FormInput);
