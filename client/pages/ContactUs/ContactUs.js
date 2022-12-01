import { filter, find, get as prop, includes, isEmpty, unescape } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import './ContactUs.scss';

import Breadcrumbs from '../../components/Breadcrumbs';
import Input from '../../components/Input';
import Layout from '../../components/Layout';
import MetaTags from '../../components/MetaTags';
import Tabbar from '../../components/Tabbar';
import saleforceConfig from '../../config/saleforce';
import { Breadcrumb, Button, Form } from '../../magenta-ui';
import { fetchCmsBlock } from '../../reducers/cmsBlock';
import { getCustomerSelector } from '../../selectors';
import { fullpathUrl } from '../../utils/url';

const requiredFields = ['subject', 'name', 'email', 'phoneNumber', 'complains'];

class ContactUs extends Component {
  constructor(props) {
    super(props);

    const capchaConfigKey = prop(
      props.storeConfigDefault,
      'extension_attributes.google_captcha_sitekey',
      null,
    );
    this.captchaVerified = !capchaConfigKey;

    this.state = {
      errors: {},
      howToContact: 'Phone',
      charsLeft: 32000,
      capchaKey: capchaConfigKey,
      submiting: false,
    };

    if (!isEmpty(props.customer)) {
      const phoneNo = find(
        prop(props, 'customer.custom_attributes'),
        attr => prop(attr, 'attribute_code') === 'mobile_phone',
      );
      this.state = {
        ...this.state,
        name: `${prop(props, 'customer.firstname', '')}  ${prop(
          props,
          'customer.lastname',
          '',
        )}`,
        lastName: prop(props, 'customer.lastname', ''),
        email: prop(props, 'customer.email', ''),
        phoneNumber: prop(phoneNo, 'value', ''),
      };
    }
  }

  static defaultProps = {
    cmsBlock: [],
  };

  static propTypes = {
    storeConfig: PropTypes.object.isRequired,
    cmsBlock: PropTypes.array,
    translate: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  filterCMSBlock(identifier) {
    const data = this.props.cmsBlock;
    const baseMediaUrl = this.props.storeConfig.base_media_url;
    let content = '';

    if (data.length > 0) {
      const filterData = filter(data, val => {
        return includes(val.identifier, identifier) && val.active === true;
      });

      filterData.map(resp => {
        content = resp.content
          .replace(/{{media url='/g, baseMediaUrl)
          .replace(/'}}/g, '');
      });
    }

    return content;
  }

  transfromSpecialBannerContent(content) {
    const result = [];
    content.map(resp => {
      resp.props.children.map(children => {
        const data = {};

        if (children.props.href) {
          data.href = children.props.href;
          data.image = children.props.children[0].props.src;
          result.push(data);
        }
      });
    });

    return result;
  }

  renderSpecialBanner() {
    const baseMediaUrl = this.props.storeConfig.base_media_url;

    const contentSpecialBanner = this.filterCMSBlock('contact_us_hero_banner');
    const heroBannerData =
      contentSpecialBanner &&
      unescape(contentSpecialBanner)
        .replace(/{{media url="/g, baseMediaUrl)
        .replace(/"}}/g, '');
    if (contentSpecialBanner.length > 0) {
      return (
        <div
          className="special-banner-contact-us"
          dangerouslySetInnerHTML={{ __html: heroBannerData }}
        />
      );
    }
  }

  renderBreadcrums() {
    const { translate } = this.props;

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
      {
        label: translate('contact_us_text'),
        isStatic: true,
      },
    ];

    return (
      <div className="breadcrumb-background">
        <Breadcrumb>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumbs
              key={breadcrumb.label}
              label={breadcrumb.label}
              url={breadcrumb.url}
              isStatic={breadcrumb.isStatic}
              hasNext={index < breadcrumbs.length - 1}
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  handleRadioChange = (e, { value }) => {
    this.setState({
      howToContact: value,
    });
  };

  handleVerify = () => {
    this.captchaVerified = true;
  };

  handleComplainsChange = event => {
    const { value } = event.target;
    const charsCount = value.length;
    const charsLeft = 32000 - charsCount;

    if (charsLeft < 0) {
      return;
    }

    this.setState({
      complains: value,
      charsLeft,
    });
    this.liveValidation();
  };

  handleOrderNumberChange = event => {
    this.setState({ orderNumber: event.target.value });
    this.liveValidation();
  };

  handleNameChange = event => {
    this.setState({ name: event.target.value });
    this.liveValidation();
  };

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
    this.liveValidation();
  };

  handlePhoneNumberChange = event => {
    this.setState({ phoneNumber: event.target.value });
    this.liveValidation();
  };

  handleAttachmentsChange = files => {
    this.setState({ attachments: files[0].base64 });
  };

  liveValidation = () => {
    const errors = {};
    const emailPattern = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/);
    const phoneNumPattern = new RegExp(/0+[0-9]{8,9}/);

    if (!this.state.subject) {
      errors.subject = true;
    }

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      if (!this.state[field]) {
        errors[field] = true;
      }

      if (field === 'email' && !emailPattern.test(this.state[field])) {
        errors[field] = true;
      }

      if (field === 'phoneNumber' && !phoneNumPattern.test(this.state[field])) {
        errors[field] = true;
      }
    }

    if (!this.captchaVerified) {
      errors.captcha = true;
    }

    this.setState({ errors });
    return errors;
  };

  handleSubmitSalesforce = () => {
    const errors = this.liveValidation();
    const lang = this.props.storeConfig.locale;

    const env = window?.App?.environment;

    let livechatConfig = saleforceConfig.staging;
    if (env === 'prod') {
      livechatConfig = saleforceConfig.prod;
    } else if (env === 'uat') {
      livechatConfig = saleforceConfig.uat;
    }

    if (errors && !isEmpty(errors)) {
      return;
    }

    this.setState({
      submiting: true,
    });

    const formData = new FormData();
    formData.append('orgid', livechatConfig.web2case.orgid);
    formData.append('retURL', livechatConfig.web2case.retURL);
    formData.append(
      livechatConfig.web2case.lang,
      lang === 'th_TH' ? 'Thai' : 'English',
    );
    formData.append('recordType', livechatConfig.web2case.recordType);
    formData.append('name', this.state.name || '');
    formData.append('email', this.state.email || '');
    formData.append('phone', this.state.phoneNumber || '');
    formData.append(livechatConfig.web2case.subject, this.state.subject || '');
    formData.append(
      livechatConfig.web2case.contact,
      this.state.howToContact || '',
    );
    formData.append(
      livechatConfig.web2case.orderNumber,
      this.state.orderNumber || '',
    );
    formData.append('description', this.state.complains || '');

    fetch(livechatConfig.web2case.submitForm, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
      credentials: 'same-origin',
      header: {
        'Content-Type': 'text/plain',
      },
    })
      .then(res => {
        if (!isEmpty(res.error)) {
          alert(this.props.translate('alert_msg.error'));
          this.setState({ success: false });
          return;
        }

        alert(this.props.translate('alert_msg.success'));
        this.setState({
          success: true,
          submiting: false,
          subject: '',
          complains: '',
          orderNumber: '',
          name: '',
          email: '',
          phoneNumber: '',
        });

        // this.recaptcha.reset();
      })
      .catch(e => {
        alert(this.props.translate('alert_msg.error'));
        this.setState({ success: false });
      });
  };

  handleSubjectChange = (event, data) => {
    this.setState({ subject: data.value });
  };

  renderSubjectsList() {
    const { translate } = this.props;

    const subjectOptions = [
      {
        value: 'Delivery',
        text: translate('contact_us_subject.delivery'),
      },
      {
        value: 'Website / Application',
        text: translate('contact_us_subject.website_application'),
      },
      {
        value: 'Promotion',
        text: translate('contact_us_subject.promotion'),
      },
      {
        value: 'Staff Service',
        text: translate('contact_us_subject.staff_service'),
      },
      {
        value: 'Information',
        text: translate('contact_us_subject.information'),
      },
    ];

    return (
      <Form.Select
        fluid
        options={subjectOptions}
        placeholder={translate('contact_us_page.subject')}
        error={this.state.errors.subject && !this.state.subject}
        value={this.state.subject}
        onChange={this.handleSubjectChange}
        className="required-select"
      />
    );
  }

  renderContactForm() {
    const { capchaKey } = this.state;
    const { translate } = this.props;

    return (
      <div className="contact-us-form">
        <Form className="contact-us-form-wrap">
          <h4 className="contact-us-static-title contact-form-title">
            {translate('contact_us_page.contact_form')}
          </h4>
          <p>{translate('contact_us_page.leave_message')}</p>
          <div className="subject-field">
            {this.renderSubjectsList()}
            <span className="form-error form-error-subject">
              {translate('contact_us_page.choose_the_subject')}
            </span>
          </div>
          <Form.Field error={this.state.errors.complains}>
            <div className="field char-count">
              <Input
                textarea
                required
                value={this.state.complains}
                onChange={this.handleComplainsChange}
                placeholder={translate(
                  'contact_us_page.suggestions_and_complaints',
                )}
              />
              <div className="count-char-wrap">
                <div className="line" />
                <span className="count-char">{this.state.charsLeft}</span>
              </div>
            </div>
            <span className="form-error">
              {translate('contact_us_page.describe_your_problem')}
            </span>
          </Form.Field>

          <Form.Field>
            <Input
              value={this.state.orderNumber}
              onChange={this.handleOrderNumberChange}
              placeholder={translate('contact_us_page.order_number')}
              maxlength={30}
            />
          </Form.Field>

          <Form.Field error={this.state.errors.name}>
            <Input
              value={this.state.name}
              onChange={this.handleNameChange}
              placeholder={translate('contact_us_page.name')}
              required
              maxlength={30}
            />
            <span className="form-error">
              {translate('contact_us_page.type_correct_name')}
            </span>
          </Form.Field>

          <Form.Field error={this.state.errors.email}>
            <Input
              value={this.state.email}
              onChange={this.handleEmailChange}
              placeholder={translate('contact_us_page.email_address')}
              required
            />
            <span className="form-error">
              {translate('contact_us_page.type_correct_email')}
            </span>
          </Form.Field>

          <Form.Field error={this.state.errors.phoneNumber}>
            <Input
              value={this.state.phoneNumber}
              onChange={this.handlePhoneNumberChange}
              placeholder={translate('contact_us_page.phone_number')}
              maxlength={10}
              required
            />
            <span className="form-error">
              {translate('contact_us_page.type_correct_phone_number')}
            </span>
          </Form.Field>

          <Form.Field>
            <p>{translate('contact_us_page.how_to_contact')}</p>
            <div className="contact-us-radio-section">
              <Form.Radio
                name="how_to_contact"
                label={translate('contact_us_page.phone')}
                value="Phone"
                checked={this.state.howToContact === 'Phone'}
                onChange={this.handleRadioChange}
              />

              <Form.Radio
                label={translate('contact_us_page.email')}
                value="Email"
                name="how_to_contact"
                checked={this.state.howToContact === 'Email'}
                onChange={this.handleRadioChange}
              />
            </div>
          </Form.Field>

          {capchaKey && (
            <React.Fragment>
              <ReCAPTCHA
                ref={node => (this.recaptcha = node)}
                sitekey={capchaKey}
                onChange={this.handleVerify}
              />
              <p>{translate('contact_us_page.type_captcha')}</p>
            </React.Fragment>
          )}

          {this.state.errors.captcha && (
            <div className="captcha-not-verified">
              {translate('contact_us_page.verify_you_are_human')}
            </div>
          )}

          <Button
            className="contact-us-button"
            onClick={() => this.handleSubmitSalesforce()}
            loading={this.state.submiting}
            disabled={this.state.submiting}
          >
            {translate('contact_us_page.send_answers')}
          </Button>
        </Form>

        {this.state.success && (
          <div className="contant-us-thanks">
            {translate('contact_us_page.thanks_for_the_message')}
          </div>
        )}

        <div className="contact-us-static-content">
          <h4 className="contact-us-static-title">
            {translate('contact_us_page.contact_by_chat')}
          </h4>
          <div className="contact-us-chat-section">
            <p>{translate('contact_us_page.working_hours')}</p>
            <Button
              className="contact-us-chat-button"
              onClick={() => window.embedded_svc.onHelpButtonClick()}
            >
              <img
                className="contact-us-chat-icon"
                src="/assets/icons/contact-us-chat.png"
                alt="Contact Tops Chat Online"
              />
              <span>{translate('contact_us_page.start_chat')}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { translate } = this.props;

    return (
      <div id="contact-us-page">
        <Layout title={translate('contact_us_text')}>
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.contact.title')}
            keywords={translate('meta_tags.contact.keywords')}
            description={translate('meta_tags.contact.description')}
          />
          <Tabbar />
          {this.renderBreadcrums()}
          {this.renderSpecialBanner()}
          <div className="topic-selectors-wrap">{this.renderContactForm()}</div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
  storeConfig: state.storeConfig.current,
  storeConfigDefault: state.storeConfig.default,
  cmsBlock: state.cmsBlock.items,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  fetchCmsBlock: search => dispatch(fetchCmsBlock(search)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
