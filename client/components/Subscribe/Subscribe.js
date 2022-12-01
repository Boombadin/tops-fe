import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get as prop, isEmpty } from 'lodash';
// import ReCAPTCHA from 'react-google-recaptcha'
import Recaptcha from 'react-recaptcha';
import { getTranslate } from 'react-localize-redux';
import SubscriptionApi from '../../apis/subscription';
import { setSubscribed } from '../../reducers/customer';
import { Input, Button } from '../../magenta-ui';
import { getCustomerSelector } from '../../selectors';

import './Subscribe.scss';

class Subscribe extends Component {
  static defaultProps = {
    storeConfig: [],
  };

  static propTypes = {
    storeConfig: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
  };

  state = {
    errors: {},
    isGuestSubscribed: false,
    captchaVerified: false,
  };

  static initialState = async (state, dispatch, match, query) => {};

  componentDidMount() {
    const { configDefault } = this.props;
    const captchaSitekey = prop(
      configDefault,
      'extension_attributes.google_captcha_sitekey',
      '',
    );

    if (captchaSitekey === '') {
      this.setState({
        captchaVerified: true,
      });
    }
  }

  handleVerify = () => {
    this.setState({
      captchaVerified: true,
    });
  };

  handleInputChange = (event, data) => {
    this.setState({ email: data.value });
  };

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  handleSubmit = () => {
    let errors = {};
    if (!this.state.captchaVerified) {
      errors.captcha = true;
    }

    if (!this.state.email || !this.validateEmail(this.state.email)) {
      errors.email = true;
    }

    this.setState({ errors });

    if (!isEmpty(errors)) {
      return;
    }

    if (this.state.email && this.state.email !== '' && this.validateEmail(this.state.email)) {
      SubscriptionApi.addGuestSubscription(this.state.email).then(res =>
        this.setState({ isGuestSubscribed: true }),
      );
      return;
    }
  };

  renderButton() {
    return (
      <Button
        style={{
          background: '#534741',
          color: '#fff',
          fontWeight: 400,
          borderBottom: '3px solid rgba(0,0,0,.2)',
        }}
        onClick={this.handleSubmit}
      >
        {this.props.translate('footer.subscribe.button')}
      </Button>
    );
  }

  render() {
    const { translate, configDefault } = this.props;
    const captchaSitekey = prop(
      configDefault,
      'extension_attributes.google_captcha_sitekey',
      '',
    );
    const isSubscribed = this.state.isGuestSubscribed;

    return (
      <div className="subscribe-cover">
        <p className="title">{this.props.translate('footer.subscribe.header')}</p>
        {isSubscribed ? (
          <div>{this.props.translate('footer.subscribe.successfully_subscribed')}</div>
        ) : (
          <div>
            <Input
              onChange={this.handleInputChange}
              action={this.renderButton()}
              placeholder={this.props.translate('footer.subscribe.placeholder')}
              className="subscribe-input-section"
            />
            {this.state.errors.email && (
              <label className="text-danger">
                {translate('contact_us_page.verify_you_email')}
              </label>
            )}
            <div className="recaptcha-size">
              {captchaSitekey ? (
                <Recaptcha
                  ref={el => {
                    this.captcha = el;
                  }}
                  sitekey={captchaSitekey}
                  render="explicit"
                  verifyCallback={this.handleVerify}
                />
              ) : (
                //   <ReCAPTCHA
                //     ref={(el) => { this.captcha = el }}
                //     sitekey={captchaSitekey}
                //     onChange={this.handleVerify}
                // />
                ''
              )}
            </div>
            {this.state.errors.captcha && (
              <label className="text-danger">
                {translate('contact_us_page.verify_you_are_human')}
              </label>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
  storeConfig: state.storeConfig,
  configDefault: state.storeConfig.default,
  cmsBlock: state.cmsBlock.items,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  setSubscribed: email => dispatch(setSubscribed(email)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Subscribe);
