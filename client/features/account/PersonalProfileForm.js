import React, { PureComponent } from 'react';
import { get, isEmpty } from 'lodash';
import { object, func } from 'prop-types';
import { Formik, Form } from 'formik';
import { FormInput, FormRadio } from '../../components/Form';
import { Row, Col, Padding, Space } from '@central-tech/core-ui';
import styled from 'styled-components';
import { TextGuide } from '../../components/Typography';
import withLocales from '../../hoc/withLocales';

const CustomLineSpace = styled.div`
  height: 1px;
  border-bottom: 1px dashed #e8e8e8;
  margin: 10px -19px 18px;
`;

const defaultValues = {
  firstname: '',
  lastname: '',
  t1c_card: '',
  t1c_phone: '',
  mobile_phone: '',
};

class PersonalProfileForm extends PureComponent {
  state = {
    connectT1Type: 't1c_card',
  };

  validate = values => {
    let errors = {};
    const { translate } = this.props;
    // t1c_card
    if (values.t1c_card.length > 0) {
      if (/\D/g.test(values.t1c_card)) {
        errors.t1c_card = translate(
          'profile_info.edit_personal_form.validate_t1c_format',
        );
      } else if (!/^[\d]{10}$|^[\d]{16}$/g.test(values.t1c_card)) {
        errors.t1c_card = translate(
          'profile_info.edit_personal_form.validate_t1c_format',
        );
      }
    }

    // t1c_phone
    if (values.t1c_phone.length > 0) {
      if (/\D/g.test(values.t1c_phone)) {
        errors.t1c_phone = translate(
          'profile_info.edit_personal_form.required_field_format',
        );
      } else if (!/^[\d]{9,15}$/g.test(values.t1c_phone)) {
        errors.t1c_phone = translate(
          'profile_info.edit_personal_form.required_field_format',
        );
      }
    }

    // mobile phone
    if (!/^[\d]{9,15}$/g.test(values.mobile_phone)) {
      if (values.mobile_phone.length === 0) {
        errors.mobile_phone = translate(
          'profile_info.edit_personal_form.required_field',
        );
      } else if (/\D/g.test(values.mobile_phone)) {
        errors.mobile_phone = translate(
          'profile_info.edit_personal_form.required_field_format',
        );
      } else {
        errors.mobile_phone = translate(
          'profile_info.edit_personal_form.required_field_format',
        );
      }
    }

    // firstname
    if (values.firstname.trim().length === 0) {
      errors.firstname = translate(
        'profile_info.edit_personal_form.required_field',
      );
    }

    // lastname
    if (values.lastname.trim().length === 0) {
      errors.lastname = translate(
        'profile_info.edit_personal_form.required_field',
      );
    }
    return errors;
  };

  componentDidMount() {
    const { initialValue } = this.props;
    this.setState({
      connectT1Type: get(initialValue, 't1c', 't1c_card'),
    });
  }

  render() {
    const { initialValue, onSubmit, submitFunc, translate } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={{ ...defaultValues, ...initialValue }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.t1c === 't1c_card') {
            values.t1c_phone = '';
          } else if (values.t1c === 't1c_phone') {
            values.t1c_card = '';
          }
          onSubmit(values);
          setSubmitting(false);
        }}
        validate={this.validate}
      >
        {({ submitForm, values, setFieldValue }) => {
          submitFunc && submitFunc(submitForm);
          return (
            <Form noValidate autoComplete="off">
              <Row>
                <Col>
                  <TextGuide type="callout" bold>
                    {translate('profile_info.edit_personal_form.personal')}
                  </TextGuide>
                </Col>
              </Row>
              <Space xs="10px" />
              <Row>
                <Col xs={12} sm={6}>
                  <Padding xs="0" sm="0 10px 0 0">
                    <FormInput
                      type="text"
                      name="firstname"
                      label={translate(
                        'profile_info.edit_personal_form.first_name',
                      )}
                      placeholder={translate(
                        'profile_info.edit_personal_form.first_name',
                      )}
                      required
                    />
                  </Padding>
                </Col>
                <Col xs={12} sm={6}>
                  <FormInput
                    type="text"
                    name="lastname"
                    label={translate(
                      'profile_info.edit_personal_form.last_name',
                    )}
                    placeholder={translate(
                      'profile_info.edit_personal_form.last_name',
                    )}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={6}>
                  <Padding xs="0" sm="0 10px 0 0">
                    <FormInput
                      type="text"
                      name="mobile_phone"
                      label={translate(
                        'profile_info.edit_personal_form.phone_no',
                      )}
                      placeholder="000-000-0000"
                      required
                      onChange={e => {
                        setFieldValue(
                          e.target.name,
                          e.target.value.replace(/[^0-9]/g, ''),
                        );
                      }}
                    />
                  </Padding>
                </Col>
              </Row>

              <CustomLineSpace />

              <Row>
                <Col>
                  <TextGuide type="callout" bold>
                    {translate('profile_info.edit_personal_form.t1c_title')}
                  </TextGuide>
                </Col>
              </Row>
              <Space xs="10px" />
              <Row>
                <Col lg="270px" sm={6}>
                  <FormRadio
                    name="t1c"
                    label={translate(
                      'profile_info.edit_personal_form.t1_phone_no',
                    )}
                    checked={this.state.connectT1Type === 't1c_phone'}
                    onChange={() => {
                      this.setState({ connectT1Type: 't1c_phone' });
                      setFieldValue('t1c', 't1c_phone');
                      setFieldValue(
                        't1c_card',
                        get(initialValue, 't1c_card', ''),
                      );
                    }}
                  />
                </Col>
                <Col lg="200px" sm={6}>
                  <FormRadio
                    name="t1c"
                    label={translate('profile_info.edit_personal_form.t1c_no')}
                    checked={this.state.connectT1Type === 't1c_card'}
                    onChange={() => {
                      this.setState({ connectT1Type: 't1c_card' });
                      setFieldValue('t1c', 't1c_card');
                      setFieldValue(
                        't1c_phone',
                        get(initialValue, 't1c_phone', ''),
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6}>
                  <Padding xs="0" sm="0 10px 0 0">
                    {this.state.connectT1Type === 't1c_card' && (
                      <FormInput
                        type="text"
                        name="t1c_card"
                        placeholder={translate(
                          'profile_info.edit_personal_form.t1c_placeholder',
                        )}
                        onChange={e => {
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/[^0-9]/g, ''),
                          );
                        }}
                      />
                    )}
                    {this.state.connectT1Type === 't1c_phone' && (
                      <FormInput
                        type="text"
                        name="t1c_phone"
                        placeholder={translate(
                          'profile_info.edit_personal_form.t1_phone_no_placeholder',
                        )}
                        onChange={e => {
                          setFieldValue(
                            e.target.name,
                            e.target.value.replace(/[^0-9]/g, ''),
                          );
                        }}
                      />
                    )}
                  </Padding>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

PersonalProfileForm.propTypes = {
  initialValue: object,
  onSubmit: func,
  submitFunc: func,
};

PersonalProfileForm.defaultProps = {
  initialValue: {},
  onSubmit: () => null,
  submitFunc: () => null,
};

export default withLocales(PersonalProfileForm);
