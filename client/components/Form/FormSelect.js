import React from 'react';
import { Field } from 'formik';
import styled from 'styled-components';
import { TextGuide } from '../Typography';
import { Space } from '@central-tech/core-ui';
import { required as requireValidation } from './validation';

const FormWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
`;

const CustomSelect = styled.select`
  line-height: 30px;
  height: 30px;
  font-size: 14px;
  font-family: sans-serif !important;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #ffffff;
  -webkit-appearance: none;
  width: 100%;
  padding: 0px 10px 0 10px;
  border-color: ${({ error }) => error && `#ec1d24`};
  opacity: ${({ disabled }) => (disabled ? 0.9 : 1)};
  color: ${({ forceOpacity }) => forceOpacity && '#bfbfbf'};
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  &:after {
    content: '';
    background: url('/assets/icons/round-keyboard-arrow-down-24-px.svg');
    position: absolute;
    right: 12px;
    top: 12px;
    width: 10px;
    height: 7px;
    background-size: 100%;
    background-repeat: no-repeat;
    z-index: 1;
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

const FormSelect = ({
  type,
  name,
  label,
  placeholder,
  validates = [],
  children,
  onChange,
  disabled,
  required,
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
        render={({ field, form: { touched, errors } }) => (
          <SelectWrapper>
            <CustomSelect
              {...field}
              disabled={disabled}
              type={type}
              placeholder={placeholder}
              error={touched[field.name] && errors[field.name]}
              onChange={onChange || field.onChange}
              forceOpacity={!field.value}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {children}
            </CustomSelect>
            {touched[field.name] && errors[field.name] && (
              <TextGuide type="body" color="danger">
                {errors[field.name]}
              </TextGuide>
            )}
          </SelectWrapper>
        )}
      />
    </FormWrapper>
  );
};

export default FormSelect;
