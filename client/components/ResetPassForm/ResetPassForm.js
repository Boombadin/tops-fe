import { Button } from '@central-tech/core-ui';
import prop from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';

import { Form, Image } from '@client/magenta-ui';

import './ResetPassForm.scss';

const StyledButton = styled(Button)`
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34, 36, 38, 0.15) inset;

  &:hover {
    filter: brightness(90%);
  }
`;

const initialValues = {
  password: '',
  confirmPass: '',
};

const validate = values => {
  const errors = {};
  if (!values.password) {
    errors.password = 'errors.regis.password';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/.test(
      values.password,
    )
  ) {
    errors.password = 'errors.regis.password_format';
  }
  if (!values.confirmPass) {
    errors.confirmPass = 'errors.regis.confirmPass';
  } else if (values.confirmPass !== values.password) {
    errors.confirmPass = 'errors.regis.pass_not_match';
  }
  return errors;
};

const renderField = ({
  msgError,
  input,
  type,
  maxLength,
  placeholder,
  meta: { touched, error, warning },
}) => {
  return (
    <div className="input-section">
      <input
        className={`input-wrap ${touched && error ? 'input-error' : ''}`}
        {...input}
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
      />
      {touched &&
        ((error && <span className="error">{msgError(error)}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  );
};

class ResetPassForm extends Component {
  state = {
    shouldShowPass: false,
    shouldShowConfirmPass: false,
  };

  static propTypes = {
    email: PropTypes.string.isRequired,
  };

  static defaultProps = {
    email: '',
  };

  togglePass = () => {
    this.setState({ shouldShowPass: !this.state.shouldShowPass });
  };
  toggleConfirmPass = () => {
    this.setState({ shouldShowConfirmPass: !this.state.shouldShowConfirmPass });
  };

  render() {
    const {
      handleSubmit,
      translate,
      email,
      msgError,
      resetLoading,
    } = this.props;
    return (
      <div className="reset-password-form">
        <p className="title">{translate('reset_password.title')}</p>
        <p className="sub-title">{translate('reset_password.description')}</p>
        <p className="show-email center">
          {translate('reset_password.username')}: {email}
        </p>
        <Form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label-wrap">
              {translate('regis_form.form.new_password')}
              <span className="lb-error">*</span>
            </label>
            <Field
              className="field"
              name="password"
              component={renderField}
              type={this.state.shouldShowPass ? 'text' : 'password'}
              placeholder={translate('errors.regis.password')}
              msgError={this.props.translate}
            />
            <Image
              className="icon"
              width="25"
              src={
                this.state.shouldShowPass
                  ? '/assets/icons/show-pass.svg'
                  : '/assets/icons/hide-pass.svg'
              }
              onClick={this.togglePass}
            />
          </div>
          <div className="field">
            <label className="label-wrap">
              {translate('regis_form.form.confirm_password')}
              <span className="lb-error">*</span>
            </label>
            <Field
              className="field"
              name="confirmPass"
              component={renderField}
              type={this.state.shouldShowConfirmPass ? 'text' : 'password'}
              placeholder={translate('errors.regis.confirmPass')}
              msgError={this.props.translate}
            />
            <Image
              className="icon"
              width="25"
              src={
                this.state.shouldShowConfirmPass
                  ? '/assets/icons/show-pass.svg'
                  : '/assets/icons/hide-pass.svg'
              }
              onClick={this.toggleConfirmPass}
            />
          </div>
          <p className="notice notice_pass">
            {translate('regis_form.notic_pass')}
          </p>
          <label
            className={`text-red ${isEmpty(msgError.message) ? 'hidden' : ''}`}
          >
            {translate('reset_password.msg_error')}
          </label>
          {console.log({ resetLoading })}
          <StyledButton
            loading={resetLoading}
            type="submit"
            color="#f70405"
            textColor="#fff"
            height="40"
            radius="4"
            size="14"
            block
            bold
          >
            {translate('reset_password.button')}
          </StyledButton>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  formValues: prop(state, 'form.resetPassForm', {}),
  msgError: state.account.msgError,
  resetLoading: state.account.resetLoading,
});

export default withRouter(
  connect(mapStateToProps)(
    reduxForm({
      form: 'resetPassForm',
      validate,
      initialValues,
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
    })(ResetPassForm),
  ),
);
