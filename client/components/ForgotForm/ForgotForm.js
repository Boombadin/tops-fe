import { Button } from '@central-tech/core-ui';
import { get as prop, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';

import { Form } from '@client/magenta-ui';

import './ForgotForm.scss';

const StyledButton = styled(Button)`
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34, 36, 38, 0.15) inset;

  &:hover {
    filter: brightness(90%);
  }
`;

const initialValues = {
  email: '',
};

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'errors.regis.email';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'errors.regis.email_format';
  }
  return errors;
};

const renderField = ({
  msgError,
  className,
  input,
  label,
  type,
  isRequired,
  maxLength,
  placeholder,
  meta: { touched, error, warning },
}) => {
  return (
    <div className={className}>
      <label className="label-wrap" htmlFor={label}>
        {label}
        {isRequired ? <span className="lb-error">{isRequired}</span> : ''}
      </label>
      <div className="input-section">
        <input
          className={`input-wrap ${touched && error ? 'input-error' : ''}`}
          id={label}
          {...input}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
        />
        {touched &&
          ((error && <span className="error">{msgError(error)}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

class ForgotForm extends Component {
  static propTypes = {
    errorExpToken: PropTypes.string,
  };

  renderErrorMsg = msgError => {
    const { translate } = this.props;

    let messageError;
    if (!isEmpty(msgError)) {
      if (msgError === 'too_many_password_reset_requests') {
        messageError = translate('forgot_password.msg_to_many_password');
      } else {
        messageError = translate('forgot_password.msg_error');
      }
    }

    return messageError;
  };

  render() {
    const {
      handleSubmit,
      translate,
      msgError,
      forgotLoading,
      errorExpToken,
    } = this.props;

    return (
      <div>
        <p className="title">{translate('forgot_password.title')}</p>
        <p className="sub-title">{translate('forgot_password.description')}</p>
        <Form onSubmit={handleSubmit}>
          <Field
            className="field"
            name="email"
            label={translate('regis_form.form.email')}
            component={renderField}
            placeholder={translate('errors.regis.email')}
            msgError={this.props.translate}
          />
          <div
            className={`notice  ${
              !isEmpty(msgError) || !isEmpty(errorExpToken) ? '' : 'hidden'
            }`}
          >
            <p className="text-red">
              {!isEmpty(msgError)
                ? this.renderErrorMsg(msgError)
                : translate('forgot_password.exp_token')}
            </p>
          </div>
          <StyledButton
            loading={forgotLoading}
            type="submit"
            color="#f70405"
            textColor="#fff"
            height="40"
            radius="4"
            size="14"
            block
          >
            {translate('forgot_password.button')}
          </StyledButton>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  formValues: prop(state, 'form.forgotForm.values', {}),
  msgError: state.account.msgError,
  forgotLoading: state.account.forgotLoading,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'forgotForm',
    validate,
    initialValues,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })(ForgotForm),
);
