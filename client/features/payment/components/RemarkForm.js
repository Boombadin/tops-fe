import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { FormTextArea } from '../../../components/Form';
import { Padding, breakpoint } from '@central-tech/core-ui';
const RemarkFormWrap = styled.div`
  width: 100%;
  position: relative;
  ${breakpoint('md')`
    width: 390px;
  `}
`;
const defaultValues = { ramark: '' };
class RemarkForm extends PureComponent {
  state = {
    chars_left: 255,
  };

  handleWordCount = e => {
    const charCount = e.target.value.length;
    const charLeft = 255 - charCount;
    this.setState({ chars_left: charLeft });
    this.props.onChange(e.target.value);
  };
  render() {
    const { initialValue, onSubmit, submitFunc, translate } = this.props;
    const { chars_left } = this.state;
    return (
      <Padding xs="26px 20px 19px">
        <Formik
          initialValues={{ ...defaultValues, ...initialValue }}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ submitForm }) => {
            submitFunc && submitFunc(submitForm);
            return (
              <Form noValidate autoComplete="off">
                <RemarkFormWrap>
                  <FormTextArea
                    name="ramark"
                    label={translate('remark_form.note')}
                    rows={5}
                    maxLength={255}
                    charCount={chars_left}
                    onChange={this.handleWordCount}
                    placeholder={translate('remark_form.note_placeholder')}
                  />
                </RemarkFormWrap>
              </Form>
            );
          }}
        </Formik>
      </Padding>
    );
  }
}
export default RemarkForm;
