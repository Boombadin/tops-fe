import { breakpoint, Col, Icon, Padding, Row } from '@central-tech/core-ui';
import { Form, Formik } from 'formik';
import { get } from 'lodash';
import { func, object } from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { FormInput, FormRadio } from '@client/components/Form';
import { TextGuide } from '@client/components/Typography';
import withLocales from '@client/hoc/withLocales';
import { setValidCheckout } from '@client/reducers/checkout';

const defaultValues = {
  t1c_card: '',
  t1c_phone: '',
};
const FormWrap = styled.div`
  padding-top: 10px;
`;
const ColTitle = styled(Col)`
  display: flex;
  align-items: center;
`;
const T1Detail = styled.div`
  display: block;
`;
const T1cTitle = styled(TextGuide)`
  font-size: 15px;
  ${breakpoint('xs', 'md')`
    font-size: 13px;
  `}
`;
class T1Form extends PureComponent {
  state = {
    connectT1Type: '',
  };

  validate = values => {
    let isValid = true;
    const errors = {};
    const { translate } = this.props;

    if (
      values.t1c_card.length > 0 &&
      !/^[\d]{10}$|^[\d]{16}$/g.test(values.t1c_card)
    ) {
      errors.t1c_card = translate(
        'profile_info.edit_personal_form.validate_t1c_format',
      );
      isValid = false;
    }
    if (
      values.t1c_phone.length > 0 &&
      !/^[\d]{9,15}$/g.test(values.t1c_phone)
    ) {
      errors.t1c_phone = translate(
        'profile_info.edit_personal_form.required_field_format',
      );
      isValid = false;
    }

    this.props.setValidCheckout(isValid);
    return errors;
  };
  componentDidMount() {
    this.props.setValidCheckout(true);
  }

  render() {
    const {
      initialValue,
      onSubmit,
      submitFunc,
      the1,
      translate,
      handleAddT1c,
    } = this.props;
    const isT1C = get(the1, 't1c_card') !== '' || get(the1, 't1c_phone') !== '';
    const t1Number =
      isT1C && get(the1, 't1c_card') !== ''
        ? get(the1, 't1c_card')
        : get(the1, 't1c_phone');
    return (
      <Padding xs="26px 20px 19px">
        {isT1C ? (
          <Row>
            <ColTitle>
              <Icon
                src="/assets/images/the-1@3x.png"
                width={40}
                style={{ marginRight: 5 }}
              />
              <T1Detail>
                <TextGuide type="body" bold>
                  {`${translate('profile_info.personal.t1c_no')}: ${t1Number}`}
                </TextGuide>
                <TextGuide type="caption-2" color="#666666">
                  {translate('profile_info.personal.receive', {
                    the1: get(the1, 't1c_earn', ''),
                  })}
                </TextGuide>
              </T1Detail>
            </ColTitle>
          </Row>
        ) : (
          <Formik
            initialValues={{ ...defaultValues, ...initialValue }}
            onSubmit={(values, { setSubmitting }) => {
              onSubmit(values);
              setSubmitting(false);
            }}
            validate={this.validate}
          >
            {({ submitForm, setFieldValue }) => {
              submitFunc && submitFunc(submitForm);
              return (
                <Form noValidate autoComplete="off">
                  <Row>
                    <ColTitle>
                      <Icon
                        src="/assets/images/the-1@3x.png"
                        width={40}
                        style={{ marginRight: 5 }}
                      />
                      <T1Detail>
                        <T1cTitle bold>
                          {translate('profile_info.personal.connect_t1c', {
                            the1: get(the1, 't1c_earn', ''),
                          })}
                        </T1cTitle>
                        <TextGuide type="caption-2" color="#666666">
                          {translate('profile_info.personal.receive', {
                            the1: get(the1, 't1c_earn', ''),
                          })}
                        </TextGuide>
                      </T1Detail>
                    </ColTitle>
                  </Row>
                  <FormWrap>
                    <Row>
                      <Col lg="290px" sm={12} xs={12}>
                        <FormRadio
                          name="t1c"
                          label={translate(
                            'profile_info.personal.connect_t1c_tel',
                          )}
                          checked={this.state.connectT1Type === 't1c_phone'}
                          onChange={() => {
                            this.setState({ connectT1Type: 't1c_phone' });
                            setFieldValue('t1c', 't1c_phone');
                            setFieldValue('t1c_card', '');
                          }}
                        />
                      </Col>
                      <Col lg="290px" sm={12} xs={12}>
                        <FormRadio
                          name="t1c"
                          label={translate(
                            'profile_info.personal.connect_t1c_member',
                          )}
                          checked={this.state.connectT1Type === 't1c_card'}
                          onChange={() => {
                            this.setState({ connectT1Type: 't1c_card' });
                            setFieldValue('t1c', 't1c_card');
                            setFieldValue('t1c_phone', '');
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="290px" sm={12} xs={12}>
                        <Padding xs="0" sm="0 10px 0 0">
                          {this.state.connectT1Type === 't1c_card' && (
                            <FormInput
                              type="text"
                              name="t1c_card"
                              placeholder={translate(
                                'profile_info.personal.t1c_placeholder_member',
                              )}
                              onChange={e => {
                                handleAddT1c(e);
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
                                'profile_info.personal.t1c_placeholder_tel',
                              )}
                              onChange={e => {
                                handleAddT1c(e);
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
                  </FormWrap>
                </Form>
              );
            }}
          </Formik>
        )}
      </Padding>
    );
  }
}

T1Form.propTypes = {
  initialValue: object,
  onSubmit: func,
  submitFunc: func,
};

T1Form.defaultProps = {
  initialValue: {},
  onSubmit: () => null,
  submitFunc: () => null,
};
const mapDispatchToProps = dispatch => ({
  setValidCheckout: isValid => dispatch(setValidCheckout(isValid)),
});

export default withLocales(connect(null, mapDispatchToProps)(T1Form));
