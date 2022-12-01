import React from 'react';
import { Field } from 'formik';
import styled from 'styled-components';
import { TextGuide } from '../Typography';
import { Space } from '@central-tech/core-ui';
import { required as requireValidation } from './validation';

const FormWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
  position: relative;
`;

const CustomTextArea = styled.textarea`
  width: 100%;
  height: 90px;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #ffffff;
  padding: 5px;
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

const CountCharWrap = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  bottom: 5px;
  right: 0;

  .count-char {
    position: absolute;
    bottom: -1px;
    font-size: 11px;
    right: 2px;
    color: $gray;
  }

  .line {
    border-top: 1px solid #cccccc;
    transform: rotate(-45deg);
    position: absolute;
    width: 100%;
    right: -6px;
    bottom: 19px;
  }
`;

const FormTextArea = ({
  name,
  label,
  placeholder,
  validates = [],
  required,
  maxLength,
  rows,
  charCount,
  onChange,
}) => {
  return (
    <FormWrapper>
      <TextGuide type="body" bold>
        {label} {required && <RequiredBadge />}
      </TextGuide>
      <Space xs="6px" />
      <Field
        validate={value => {
          const condition = required && requireValidation(value);
          return condition;
        }}
        name={name}
        render={({ field, form: { touched, errors } }) => (
          <div>
            <CustomTextArea
              {...field}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              error={touched[field.name] && errors[field.name]}
              onKeyUp={onChange}
            />
            <CountCharWrap>
              <div className="line"></div>
              <span className="count-char">{charCount}</span>
            </CountCharWrap>
            {touched[field.name] && errors[field.name] && (
              <TextGuide type="body" color="danger">
                {errors[field.name]}
              </TextGuide>
            )}
          </div>
        )}
      />
    </FormWrapper>
  );
};

export default FormTextArea;
