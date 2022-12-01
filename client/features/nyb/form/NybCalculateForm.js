import React, { PureComponent } from 'react';
import { func, object, bool, string } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Radio, Dropdown } from 'semantic-ui-redux-form-fields';
import styled from 'styled-components';
import { Form } from '../../../magenta-ui';
import { withTranslate } from '../../../utils/translate';
import { FormControl, MaxWidth } from '../../../components/Form';
import { Button } from '../../../components/Button';
import { Row, Col } from '../../../components/Grid';
import { createValidator, customMaxMoney } from '../../../utils/validation';

const ErrorMsg = styled.label`
  color: red;
`;
const ErrorInput = styled.span`
  color: red;
`;

// Normalize Number
const MAX_NUMBER = 100000000;
const MAX_WIDTH = '250px';
const FORM = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
};
const normailzeMaxNumber = max => value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '').slice(0, 8);
  let setNumber = parseInt(`${onlyNums}1`, 10) / 1000;
  if (setNumber > max) {
    setNumber = max - 0.001;
  }
  const formatNumber = new Intl.NumberFormat('th-TH').format(onlyNums);
  return formatNumber;
  // return formatNumber.slice(0, -1)
};

// Validations

// Options
const checkboxOptions = [
  { key: 1, value: 't1', text: 'Central The 1 Credit Card' },
  { key: 2, value: 'other', text: 'Other' },
];

const TextField = ({
  input,
  label,
  type,
  placeholder,
  meta: { touched, error, warning },
  isError,
}) => (
  <Form.Field error={isError}>
    <FormControl label={label} width={MAX_WIDTH}>
      <Form.Input
        {...input}
        placeholder={placeholder}
        type={type}
        error={touched && isError}
      />
      {/* {touched &&
        ((error && <ErrorInput>{error}</ErrorInput>) ||
          (warning && <ErrorInput>{warning}</ErrorInput>))} */}
    </FormControl>
  </Form.Field>
);

class NybCalculateForm extends PureComponent {
  static propTypes = {
    handleSubmit: func.isRequired,
    translate: func.isRequired,
    onSetFields: func.isRequired,
    currentValues: object,
    loading: bool.isRequired,
    errorMessage: string,
  };

  static defaultProps = {
    currentValues: {},
    errorMessage: '',
  };

  constructor() {
    super();

    this.state = {
      isError: false,
    };
  }

  static getDerivedStateFromProps(prevProps, nextState) {
    const { currentValues } = prevProps;
    const isInitial = Object.keys(currentValues).length <= 1;
    if (isInitial || currentValues.percent_1 || currentValues.percent_2) {
      return { isError: false };
    }
    return { isError: true };
  }

  render() {
    const { isError } = this.state;
    const {
      handleSubmit,
      translate,
      currentValues,
      loading,
      errorMessage,
      onSetFields,
    } = this.props;
    const isDisabled =
      !currentValues.payment_methods ||
      !currentValues.discount_type ||
      (!currentValues.percent_1 && !currentValues.percent_2);
    return (
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Field
          type="text"
          name="percent_1"
          label={translate('nyb.form.number_1')}
          placeholder={translate('nyb.form.placeholder_num_1')}
          component={TextField}
          normalize={normailzeMaxNumber(MAX_NUMBER)}
          required={false}
          isError={isError}
        />
        <Field
          type="text"
          name="percent_2"
          label={translate('nyb.form.number_2')}
          placeholder={translate('nyb.form.placeholder_num_2')}
          component={TextField}
          normalize={normailzeMaxNumber(MAX_NUMBER)}
          required={false}
          isError={isError}
        />
        <Form.Field inline>
          <FormControl label={translate('nyb.form.typeof_payment')}>
            <Row reverse>
              <Col style={{ padding: 5 }}>
                <Field
                  name="payment_methods"
                  component={Radio}
                  type="radio"
                  value={FORM.CASH}
                  label={translate('nyb.form.payment_money')}
                  checked={currentValues.payment_methods === FORM.CASH}
                  onChange={() => onSetFields({ payment_methods: FORM.CASH })}
                />
              </Col>
              <Col style={{ padding: 5 }}>
                <Field
                  name="payment_methods"
                  component={Radio}
                  value={FORM.CREDIT_CARD}
                  type="radio"
                  checked={currentValues.payment_methods === FORM.CREDIT_CARD}
                  label={translate('nyb.form.payment_credit')}
                  onChange={() => onSetFields({ payment_methods: FORM.CREDIT_CARD })}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <MaxWidth width={MAX_WIDTH}>
                  <Field
                    component={Dropdown}
                    currentValue={currentValues.bank_issued}
                    name="bank_issued"
                    options={checkboxOptions}
                    placeholder={translate('nyb.form.placeholder_dropdown_credit')}
                    disabled={currentValues.payment_methods !== FORM.CREDIT_CARD}
                  />
                </MaxWidth>
              </Col>
            </Row>
          </FormControl>
        </Form.Field>
        <Form.Field inline>
          <FormControl label={translate('nyb.form.typeof_discount')}>
            <Row reverse>
              <Col style={{ padding: 5 }}>
                <Field
                  name="discount_type"
                  component={Radio}
                  value="voucher"
                  type="radio"
                  checked={currentValues.discount_type === 'voucher'}
                  label={translate('nyb.form.gift_voucher')}
                  onChange={() => onSetFields({ discount_type: 'voucher' })}
                />
              </Col>
              <Col style={{ padding: 5 }}>
                <Field
                  name="discount_type"
                  component={Radio}
                  value="ontop"
                  type="radio"
                  checked={currentValues.discount_type === 'ontop'}
                  label={translate('nyb.form.gift_coupon')}
                  onChange={() => onSetFields({ discount_type: 'ontop' })}
                />
              </Col>
            </Row>
          </FormControl>
        </Form.Field>
        <center>
          <div style={{ height: 20 }}>
            {!isError && errorMessage && <ErrorMsg>{translate('nyb.error')}</ErrorMsg>}
            {isError && <ErrorMsg>{translate('nyb.error_validation')}</ErrorMsg>}
          </div>
          <Button
            type="submit"
            color={isDisabled ? '#d8d8d8' : '#007a33'}
            size="large"
            textColor={isDisabled ? '#808080' : 'white'}
            padding={loading ? '5px 50px' : '10px 50px'}
            disabled={isDisabled}
            loading={loading}
            width={200}
            height={40}
          >
            {translate('nyb.submit')}
          </Button>
        </center>
      </Form>
    );
  }
}

const validate = createValidator({
  percent_1: [customMaxMoney(MAX_NUMBER)],
  percent_2: [customMaxMoney(MAX_NUMBER)],
});

export default reduxForm({
  form: 'nyb',
  validate,
})(withTranslate(NybCalculateForm));
