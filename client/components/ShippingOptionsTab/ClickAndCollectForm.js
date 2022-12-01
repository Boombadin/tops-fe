import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get as prop, isEmpty, find } from 'lodash'
import { Field, reduxForm, initialize, change} from 'redux-form'
import { getTranslate } from 'react-localize-redux';
import Cookies from 'js-cookie';
import { getCustomerSelector, getOneCardMembershipIdFromCustomer, getThe1MobileFromCustomer } from '../../selectors'
import { Image, Button, Icon, Loader } from '../../magenta-ui';
import ArrowLeft from '../Icons/ArrowLeft'
import DoubleArrowRight from '../Icons/DoubleArrowRight'

const validate = values => {
  const errors = {}
  if (!values.first_name) {
		errors.first_name = 'edit-profile.error.first_name'
	} 
  if (!values.last_name) {
		errors.last_name = 'edit-profile.error.last_name'
	}
	if (!values.contact_number) {
		errors.contact_number = 'edit-profile.error.contact'
	}
	else if (!/^0+[0-9]{8,9}/.test(values.contact_number)) {
		errors.contact_number = 'edit-profile.error.contact'
	}
  return errors
}
const renderField = ({
	msgError,
  className,
  input,
  label,
  type,
  isRequired,
  maxLength,
  // values,
  meta: { touched, error, warning }
}) => {
  return (
    <div className={className} >
			<input
				className={`input-wrap ${(touched && error) ? 'input-error' : ''}`}
				id={label}
				{...input}
				placeholder={label}
				type={type}
				maxLength={maxLength}
				// value={values}
			/>
      <label className="label-wrap" htmlFor={label}>{label}
        {(isRequired) ? <span className="lb-error">{isRequired}</span> : '' }
      </label>
      {touched && ((error && <span className="error">{msgError(error)}</span>) || (warning && <span>{warning}</span>))}
    </div>
  )
}
class ClickAndCollectForm extends PureComponent {
  static propTypes = {
		onBackClick: PropTypes.func.isRequired,
		onLoading: PropTypes.func.isRequired
  }

	componentDidMount() {
	// 	const { customer } = this.props
	// 	const mobile = find(prop(customer, 'custom_attributes', {}), { attribute_code: 'mobile_phone' });
		let values = {}
		if (!isEmpty(Cookies.get('recipient_info'))) {
			const recipientInfo = JSON.parse(Cookies.get('recipient_info'))
			values = {
				first_name: prop(recipientInfo, 'first_name', ''),
				contact_number: prop(recipientInfo, 'contact_number', ''),
			}
			this.props.initializeForm(values);
		}
	}
	
  handleVerifyProfile = () => {
		const { onConfirm, locatorId, formValues } = this.props
		if (prop(formValues, 'first_name')) {
			Cookies.set('recipient_info', JSON.stringify({ 
				first_name: prop(formValues, 'first_name', ''),
				contact_number: prop(formValues, 'contact_number', ''),
				store_id: locatorId
			}))
		}
		
		onConfirm('tops', true, locatorId);
  }
  
  renderBottom() {
		const { handleSubmit } = this.props

    return (
      <div key="bottom" className="bottom">
        <Button className="back" icon  onClick={this.props.onBackClick}>
					<ArrowLeft
            stroke="white"
            fill="white"
            width="15"
            height="15"
          />
          <span className="text">{this.props.translate('right_menu.profile.billing.back')}</span>
        </Button>
        <Button className="verify" onClick={handleSubmit(this.handleVerifyProfile)}>
          <span className="text">{this.props.translate('edit-profile.btn_confirm')}</span>
          <DoubleArrowRight
            stroke="white"
            fill="white"
            width="15"
            height="15"
          />
        </Button>
      </div>
    );
  }
  
  render() {
    const { translate, handleSubmit} = this.props
    return (
      <form className="click-collect-form-section" onSubmit={handleSubmit}>
				<div className="click-collect-form">
					<Field 
						className="field"
						name="first_name"
						component={renderField}
						placeholder={translate('click-and-collect.form.recipient_name')}
						label={translate('click-and-collect.form.recipient_name')}
						msgError={translate}
						isRequired="*"
					/>
					<Field 
						className="field"
						name="contact_number"
						component={renderField}
						placeholder={translate('click-and-collect.form.recipient_tel')}
						label={translate('click-and-collect.form.recipient_tel')}
						msgError={this.props.translate}
						isRequired="*"
					/>
				</div>
				{this.renderBottom()}
      </form>
    )
  }
}

const mapStateToProps = state => ({
	translate: getTranslate(state.locale),
	customer: getCustomerSelector(state),
  formValues: prop(state, 'form.clickCollectInfo.values', {}),
})

const mapDispatchToProps = dispatch => ({
	initializeForm: values => dispatch(initialize('clickCollectInfo', values)),
	changeFieldValue: (field, value) => {
    dispatch(change('clickCollectInfo', field, value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'clickCollectInfo',
	validate,
})(ClickAndCollectForm))