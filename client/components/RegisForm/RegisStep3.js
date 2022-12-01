import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change } from 'redux-form'
import { get as prop, find } from 'lodash'
import { getTranslate } from 'react-localize-redux'
import './RegisForm.scss'
import { Form, Button, Divider } from '../../magenta-ui'
import NumberFormat from 'react-number-format'
import { date, month, year } from '../../utils/birthDate'
import { Radio } from 'semantic-ui-redux-form-fields'

const initialValues = {
  first_name: '',
  last_name: '',
  mobile: '',
  t1c_radio: false,
  condition: false,
  store_code: ''
 }
 
 const validate = values => {
   const errors = {}
    if (!values.first_name) {
      errors.first_name = 'errors.regis.first_name'
    }
    if (!values.last_name) {
      errors.last_name = 'errors.regis.last_name'
    }
    if (!values.mobile) {
      errors.mobile = 'errors.regis.mobile'
    }
    else if (!/^0+[0-9]{9}/.test(values.mobile)) {
      errors.mobile = 'errors.regis.mobile1'
    }
    if (values.t1c_radio) {
      if (values.t1c_phone) {
        if (!/^0+[0-9]{8,9}/.test(values.t1c_phone)) {
          errors.t1c_phone = 'errors.regis.mobile1'
        }
      }
      if (values.t1c_card) {
        if(values.t1c_card.trim().length < 10 ) {
          errors.t1c_card = 'errors.regis.t1c_10'
        } else if (values.t1c_card.trim().length > 10 && values.t1c_card.trim().length < 16 ) {
          errors.t1c_card = 'errors.regis.t1c_16'
        }
      }
    }
    
    if (values.date || values.month || values.year) {
      if (!values.date) {
        errors.date = 'errors.regis.birth_day'
      }
      if (!values.month) {
        errors.month = 'errors.regis.birth_month'
      }
      if (!values.year) {
        errors.year = 'errors.regis.birth_year'
      }
    }
    return errors
 }

const renderField = ({
  msgError,
  id,
  className,
  input,
  label,
  type,
  placeholder,
  isRequired,
  maxLength,
  disabled,
  meta: { touched, error, warning }
}) => {
  return (
    <div className={className} >
      <label className="label-wrap" htmlFor={label}>{label}
        {(isRequired) ? <span className="lb-error">{isRequired}</span> : '' }
      </label>
      <div className="input-section">
      {
        (id === 'mobile' || id === 't1c_phone')
        ?
        <NumberFormat
          format="##########"
          className={`input-wrap ${(touched && error) ? 'input-error' : ''}`}
          id={id} {...input}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
         />
      : ''
      }
      {
        (id === 't1c_card')
        ?
        <NumberFormat
            format="################"
            className={`input-wrap ${(touched && error) ? 'input-error' : ''}`}
            id={id} {...input}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
           />
        : ''
        }
      {
      (id === 'first_name' || id === 'last_name')
      ?
      <input
          className={`input-wrap ${(touched && error) ? 'input-error' : ''}`}
          id={id}
          {...input}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
        />
        : ''
      }
        
        {touched && ((error && <span className="error">{msgError(error)}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}

const renderFieldSelect = ({
  className,
  input,
  label,
  options,
  msgError,
  isRequired,
  selectOption,
  meta: { touched, error, warning } }) => (
    <div className={className}>
      <label
        className="label-wrap"
        htmlFor={label}>{label}
        {(isRequired) ? <span className="lb-error">{isRequired}</span> : '' }
      </label>
      <div className="input-section">
        <select
          id={label}
          className={`input-wrap ${input.value === '' ? 'placeholdered' : ''} ${(touched && error) ? 'input-error' : ''}`}
          {...input}
        >
        {
          selectOption && (
            <option value="" disabled  selected >{selectOption}</option>
          )
        }

        {
          options.map(option => {
            return (
              <option value={option.value}>{option.text}</option>
            )
          })
        }
        </select>
        {touched && ((error && <span className="error">{msgError(error)}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
)

const renderCheckbox = ({ className, input, label }) => (
  <div className={`ui checkbox ${className}`}>
    <input type="checkbox" {...input} />
    <label>{label}</label>
  </div>
)

const renderHiddenFiled = ({ input }) => (
  <div>
    <input type="hidden" {...input}  />
  </div>
)

class RegisStep3 extends Component {

  state = {
    isNeedSMS: false,
    isChecked: false,
    isAgree: true,
    t1cChecked: '',
    isT1Card : true,
    isT1Phone : true,
    date: false,
    month: false,
    year: false,
    storeCode: ''
  }

  handleCheckCondition = () => {
    this.setState({
      isChecked: !this.state.isChecked,
      isAgree: !this.state.isAgree
    })
  }

  handleRadioChecked = (value) => {
    this.setState({
      t1cChecked: value,
    })

    if (value === 't1c-phone') {
      this.setState({
        isT1Phone: false,
        isT1Card: true
      })
      this.props.changeFieldValue('t1c_card', '')
    }
    else if (value === 't1c-card') {
      this.setState({
        isT1Phone: true,
        isT1Card: false
      })
      this.props.changeFieldValue('t1c_phone', '')
    }
  }

  handleNumericKeyPress = e => {
    const validate = /^[0-9\s]+$/g.test(e.target.value) || e.target.value === ''
    if(validate){
      this.setState({
        mobile: e.target.value
      })
    }
  }

  componentDidMount() {
    this.props.formValues.store_code = this.props.storeConfigCurrent.code;
  }

  render() {
    const { handleSubmit, translate, lang, registrationErrorCause, storeConfig, storeConfigCurrent, loading } = this.props;
    return (
      <div>
        <p className="title">{translate('regis_form.title_step3')}</p>
        <p className="sub-title">{translate('regis_form.topic_contact')}</p>
        <Form onSubmit={handleSubmit}>
          <Field
            id="first_name"
            className="field"
            name="first_name"
            label={translate('regis_form.form.first_name')}
            component={renderField}
            type="text"
            placeholder={translate('regis_form.form.placeholder.first_name')}
            isRequired="*"
            msgError={this.props.translate}
            maxLength="60"
          />
          <Field
            id="last_name"
            className="field"
            name="last_name"
            label={translate('regis_form.form.last_name')}
            component={renderField}
            type="text"
            placeholder={translate('regis_form.form.placeholder.last_name')}
            isRequired="*"
            msgError={this.props.translate}
            maxLength="60"
          />
          <label className="label-wrap">{translate('regis_form.form.birth_title')}</label>
          <Form.Group widths='equal' key="birthday">
            <Field
              className="field"
              name="date"
              component={renderFieldSelect}
              msgError={this.props.translate}
              options={date()}
              selectOption={translate('regis_form.form.placeholder.birth_day')}
            />
          <Field
            className="field"
            name="month"
            component={renderFieldSelect}
            msgError={this.props.translate}
            options={month(translate)}
            selectOption={translate('regis_form.form.placeholder.birth_month')}
          />
          <Field
            className="field"
            name="year"
            component={renderFieldSelect}
            msgError={this.props.translate}
            options={year(lang)}
            selectOption={translate('regis_form.form.placeholder.birth_year')}
          />
          </Form.Group>
          <Field
            id="mobile"
            className="field"
            name="mobile"
            label={translate('regis_form.form.mobile')}
            component={renderField}
            type="text"
            placeholder={translate('regis_form.form.placeholder.mobile')}
            isRequired="*"
            msgError={this.props.translate}
            onChange={this.handleNumericKeyPress}
          />
          <Divider/>
          <p className="sub-title">{translate('regis_form.form.topic_t1c')}</p>
          <label className="label-radio">
            <Field
              className=""
              name="t1c_radio"
              component={Radio}
              type="radio"
              checked={this.state.t1cChecked === "t1c-phone"}
              onClick={() => this.handleRadioChecked("t1c-phone")}
            />
            <span className="t1c-title">{translate('regis_form.form.t1c_phone')}</span> 
            <Field
              id="t1c_phone"
              className="field"
              name="t1c_phone"
              component={renderField}
              type="text"
              placeholder={translate('regis_form.form.placeholder.t1c_phone')}
              msgError={this.props.translate}
              onChange={this.handleNumericKeyPress}
              disabled={this.state.isT1Phone}
            />
          </label>
          <label className="label-radio">
            <Field
              className=""
              name="t1c_radio"
              component={Radio}
              currentValue="หมาย"
              type="radio"
              checked={this.state.t1cChecked === "t1c-card"}
              onClick={() => this.handleRadioChecked("t1c-card")}
            />
            <span className="t1c-title">{translate('regis_form.form.t1c_card')}</span> 
            <Field
              id="t1c_card"
              className="field"
              name="t1c_card"
              component={renderField}
              type="text"
              placeholder={translate('regis_form.form.placeholder.t1c_card')}
              msgError={this.props.translate}
              disabled={this.state.isT1Card}
            />
          </label>
          <p className="notice center">{translate('regis_form.form.t1c_checked1')}<br/> {translate('regis_form.form.t1c_checked2')}</p>
          <p className="notice text-acc-t1c center">{translate('regis_form.form.t1c_account')}<a target="_blank" href={storeConfig.extension_attributes.register_url || ''}>{translate('regis_form.form.t1c_account_link')}</a></p>
          <Divider/>
          <Field
            className="field"
            name="condition"
            label={translate('regis_form.sub_topic_condition1', { 
              term: `<a target="_blank" href="${lang === 'th_TH' ? '/th' : '/en'}/terms-and-conditions">${translate('regis_form.sub_topic_condition2')}</a>`
            })}
            component={renderCheckbox}
            onChange={this.handleCheckCondition}
            checked={this.state.isChecked}
          />
          <Field
            name="store_code"
            type="hidden"
            component={renderHiddenFiled}
          />
          <Button disabled={loading} loading={loading} className={`next-step ${this.state.isAgree ? 'disable' : ''}`} type='submit' disabled={this.state.isAgree}>{translate('regis_form.register')}</Button>
          
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  formValues: prop(state, 'form.regisForm.values', {}),
  lang: find(state.locale.languages, lang => lang.active === true).code,
  registrationErrorCause: state.registration.registrationErrorCause,
  storeConfig: state.storeConfig.default,
  storeConfigCurrent: state.storeConfig.current,
  loading: state.registration.loading
})

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue: (field, value) => {
    dispatch(change('regisForm', field, value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'regisForm',
  validate,
  initialValues,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(RegisStep3))