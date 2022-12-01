import { Button } from '@central-tech/core-ui';
import { get as prop } from 'lodash';
import React, { Component } from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';

import PDPA from '@client/components/PDPA/PDPA';
import withLocales from '@client/hoc/withLocales';
import { Form, Icon, Image } from '@client/magenta-ui';
import { isEmailAvailable } from '@client/reducers/registration';
import { getConsentData } from '@client/utils/consent';
import { getCookie } from '@client/utils/cookie';

import './RegisForm.scss';

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
  confirmPass: '',
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
  } else if (
    !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/.test(values.password)
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

@withLocales
class RegisStep1 extends Component {
  state = {
    shouldShowPass: false,
    shouldShowConfirmPass: false,
    sendRegis: false,
    isCheck: false,
    consentPrivacyVersion: '',
    marketingDisplayText: '',
  };

  componentDidMount() {
    this.fetchConsentPrivacy();
  }

  fetchConsentPrivacy = async () => {
    const { langCode } = this.props;
    const lang = langCode === 'en_US' ? 'en' : 'th';
    if (getCookie('provider') !== 'GrabFresh') {
      const consentData = await getConsentData(lang);
      if (consentData) {
        const {
          consent_privacy_version = '',
          marketing_display_text = '',
        } = consentData;
        this.setState({
          consentPrivacyVersion: consent_privacy_version,
          marketingDisplayText: marketing_display_text,
        });
        const dataBuilder = JSON.stringify({
          version: consent_privacy_version,
          accept: this.state.isCheck,
        });
        localStorage.setItem('consentDataSet', dataBuilder);
      }
    }
  };
  setConsent = () => {
    this.setState(
      {
        isCheck: !this.state.isCheck,
      },
      () => {
        const dataBuilder = JSON.stringify({
          version: this.state.consentPrivacyVersion,
          accept: this.state.isCheck,
        });
        localStorage.setItem('consentDataSet', dataBuilder);
      },
    );
  };
  togglePass = () => {
    this.setState({ shouldShowPass: !this.state.shouldShowPass });
  };

  toggleConfirmPass = () => {
    this.setState({ shouldShowConfirmPass: !this.state.shouldShowConfirmPass });
  };

  checkEmailAvailable() {
    const isEmailAvailable = this.props.isEmailAvailable();
    new Promise(function(resolve, reject) {
      resolve(isEmailAvailable).then(res => res);
    });
  }

  handleErrorFacebook = () => {
    alert(this.props.translate('login_form.login_fail'));
  };

  handleSubmit = async () => {
    const { onSubmit } = this.props;
    const { sendRegis } = this.state;

    if (!sendRegis) {
      this.setState({
        sendRegis: true,
      });
      const resultEmail = await this.props.isEmailAvailable().then(res => res);
      if (resultEmail) {
        onSubmit();
      } else {
        this.setState({
          sendRegis: false,
        });
      }
    }
  };
  render() {
    const {
      translate,
      registrationErrorCause,
      loading,
      pristine,
      invalid,
      onSocialLogin,
      envConfig,
    } = this.props;
    return (
      <div>
        <p className="title">{translate('regis_form.regis_header')}</p>
        <Form onSubmit={this.handleSubmit}>
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
                {translate('regis_form.regis_btn_facebook')}
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
              <span className="lb-error">*</span>
            </label>
            <Field
              className="field"
              name="email"
              component={renderField}
              type="text"
              placeholder={translate('regis_form.form.placeholder.email')}
              msgError={this.props.translate}
            />
          </div>
          <div className="field group-password">
            <label className="label-wrap">
              {translate('regis_form.form.password')}
              <span className="lb-error">*</span>
            </label>
            <Field
              className="field"
              name="password"
              component={renderField}
              type={this.state.shouldShowPass ? 'text' : 'password'}
              placeholder={translate('regis_form.form.placeholder.password')}
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
          <div className="field group-confirm-password">
            <label className="label-wrap">
              {translate('regis_form.form.confirm_password')}
              <span className="lb-error">*</span>
            </label>
            <Field
              className="field"
              name="confirmPass"
              component={renderField}
              type={this.state.shouldShowConfirmPass ? 'text' : 'password'}
              placeholder={translate('regis_form.form.placeholder.confirmPass')}
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
          {registrationErrorCause && registrationErrorCause != null && (
            <p className="register-error">
              {translate('errors.regis.email_has_already_used')}{' '}
            </p>
          )}
          <p className="notice notice_pass">
            {translate('regis_form.notic_pass')}
          </p>
          {this.state.marketingDisplayText && (
            <PDPA
              isCheck={this.state.isCheck}
              onChange={this.setConsent}
              marketingConsentText={this.state.marketingDisplayText}
            />
          )}
          <StyledButton
            disabled={pristine || invalid}
            loading={loading}
            type="submit"
            color="#f70405"
            textColor="#fff"
            height="43"
            radius="4"
            size="18"
            block
          >
            {translate('regis_form.register')}
          </StyledButton>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  formValues: prop(state, 'form.regisForm.values', {}),
  registrationErrorCause: state.registration.registrationErrorCause,
  loading: state.registration.loading,
  envConfig: state.storeConfig.envConfig,
});

const mapDispatchToProps = dispatch => ({
  isEmailAvailable: () => dispatch(isEmailAvailable()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  reduxForm({
    form: 'regisForm',
    validate,
    initialValues,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })(RegisStep1),
);
