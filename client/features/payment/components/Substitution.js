import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { FormRadio } from '../../../components/Form';
import { Padding, breakpoint } from '@central-tech/core-ui';
import { TextGuide } from '../../../components/Typography';
import withLocales from '../../../hoc/withLocales';

const SubstitutionFormWrap = styled.div`
  padding-top: 10px;
  display: flex;
  ${breakpoint('xs', 'md')`
    flex-direction: column;
  `}
`;

const defaultValues = {};

class Substitution extends PureComponent {
  handleChange = value => {
    this.props.onChange(value);
  };
  render() {
    const { initialValue, onSubmit, submitFunc, translate } = this.props;
    return (
      <Padding xs="26px 20px 0">
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
                <TextGuide type="body" bold>
                  {translate('substitution.title')}
                </TextGuide>
                <SubstitutionFormWrap>
                  <FormRadio
                    name="substitution"
                    label={translate('substitution.by_owner')}
                    onChange={() =>
                      this.handleChange(
                        translate('substitution.get_substitution_by_owner'),
                      )
                    }
                  />
                  <FormRadio
                    name="substitution"
                    label={translate('substitution.by_staff')}
                    onChange={() =>
                      this.handleChange(
                        translate('substitution.get_substitution_by_staff'),
                      )
                    }
                  />
                </SubstitutionFormWrap>
              </Form>
            );
          }}
        </Formik>
      </Padding>
    );
  }
}
export default withLocales(Substitution);
