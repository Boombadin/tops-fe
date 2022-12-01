import { Button } from '@central-tech/core-ui';
import prop from 'lodash/get';
import React, { Component } from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';

import { Form, Icon, Image } from '@client/magenta-ui';

import './TopsLogin.scss';

const StyledButton = styled(Button)`
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34, 36, 38, 0.15) inset;

  &:hover {
    filter: brightness(90%);
  }
`;

const initialValues = {
  email: '',
  password: '',
};

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'errors.regis.email';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'errors.regis.email_format';
  }
  if (!values.password) {
    errors.password = 'errors.regis.password';
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

class LoginForm extends Component {
  state = {
    shouldShowPass: false,
    shouldShowConfirmPass: false,
  };

  togglePass = () => {
    this.setState({ shouldShowPass: !this.state.shouldShowPass });
  };
  handleClickRegister = () => {
    this.props.history.push('/registration');
  };
  handleErrorFacebook = () => {
    alert(this.props.translate('login_form.login_fail'));
  };
  render() {
    const {
      handleSubmit,
      translate,
      loginErrorCause,
      loading,
      onSocialLogin,
      envConfig,
    } = this.props;
    return (
      <div>
        <p className="title">{translate('login_form.title')}</p>
        <Form onSubmit={handleSubmit}>
          <FacebookProvider appId={prop(envConfig, 'facebookID')}>
            <LoginButton
              className="btn-login-facebook"
              rerequest
              reauthorize={false}
              scope="public_profile,email"
              onCompleted={onSocialLogin}
              onError={this.handleErrorFacebook}
            >
              <Icon
                className="btn-login-facebook-icon"
                name="facebook official"
              />
              <span className="btn-login-facebook-text">
                {translate('login_form.login_btn_facebook')}
              </span>
            </LoginButton>
          </FacebookProvider>

          <div className="horizontal-line-middle">
            <span className="horizontal-line-middle-text">
              {translate('login_form.or')}
            </span>
          </div>

          <div className="field">
            <label className="label-wrap">
              {translate('regis_form.form.email')}
              {/* <span className="lb-error">*</span>   */}
            </label>
            <Field
              className="field"
              name="email"
              component={renderField}
              type="text"
              placeholder={translate('errors.regis.email')}
              msgError={this.props.translate}
            />
          </div>
          <div className="field field-password">
            <label className="label-wrap">
              {translate('regis_form.form.password')}
              {/* <span className="lb-error">*</span>   */}
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
          {loginErrorCause && (
            <div className="login-error">
              <p>{translate('errors.login.invalid')}</p>
            </div>
          )}
          <p className="notice right">
            <NavLink to="/forgot-password">
              {translate('login_form.forgot')}
            </NavLink>
          </p>
          <StyledButton
            loading={loading}
            type="submit"
            color="#f70405"
            textColor="#fff"
            height="40"
            radius="4"
            size="14"
            block
          >
            {translate('login_form.login_btn')}
          </StyledButton>
        </Form>
        {/* <p className="notice center text-or"> {translate('login_form.or')} </p> */}
        {/* <Button className="signup-button" onClick={this.handleClickRegister}>{translate('login_form.register')}</Button> */}
        <div className="login-new-customer">
          <p className="text-new-to-tops-online">
            {translate('login.tops_login.new_to_tops_online')}
          </p>
          <NavLink className="register-link" to="/registration">
            {translate('login_form.register')}
          </NavLink>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  formValues: prop(state, 'form.loginForm.values', {}),
  loginErrorCause: state.auth.loginErrorCause,
  loading: state.auth.loading,
  envConfig: state.storeConfig.envConfig,
});

LoginForm = connect(mapStateToProps)(LoginForm);

export default withRouter(
  reduxForm({
    form: 'loginForm',
    validate,
    initialValues,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })(LoginForm),
);
