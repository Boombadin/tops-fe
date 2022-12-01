import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get as prop, isEmpty} from 'lodash'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import { Field, reduxForm, initialize, change} from 'redux-form'
import { editProfile } from '../../reducers/customer';
import { getCustomerSelector, getOneCardMembershipIdFromCustomer, getThe1MobileFromCustomer } from '../../selectors'
import './PersonalForm.scss'
import { Image, Button, Icon, Loader } from '../../magenta-ui';

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
	if (values.t1c === 't1c_phone' && values.t1c_phone) {
		if (!/^0+[0-9]{8,9}/.test(values.t1c_phone)) {
			errors.t1c_phone = 'edit-profile.error.t1c_phone_format'
		}
	}
	if (values.t1c === 't1c_card' && values.t1c_card) {
		if(values.t1c_card.trim().length < 10 ) {
			errors.t1c_card = 'edit-profile.error.t1c_card_format'
		} else if (values.t1c_card.trim().length > 10 && values.t1c_card.trim().length < 16 ) {
			errors.t1c_card = 'edit-profile.error.t1c_card_format'
		}
	}
  return errors
}

const renderField = ({
  id,
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

const renderRadio = (props) => {
	const { checked, label, values} = props
	const { name, onChange } = props.input
	return (
		<label className="input-radio">
			<input type="radio" name={name} value={values} checked={checked} onChange={onChange}/>
			<span>{label}</span>
		</label>
	)
}

class PersonalForm extends PureComponent {
	static propTypes = {
		onBackClick: PropTypes.func.isRequired,
		onLoading: PropTypes.func.isRequired
	}

	state = {
		isT1Card: false,
		isT1Phone: false
	}

	handleT1Card = () => {
		const { customer } = this.props
		const t1cCardNumber = getOneCardMembershipIdFromCustomer(customer)
		this.props.changeFieldValue('t1c_card', t1cCardNumber)

    this.setState({
      isT1Card: true,
      isT1Phone: false
    })
	}

	handleT1Phone = () => {
		const { customer } = this.props
		const t1cCardMobile = getThe1MobileFromCustomer(customer)

		this.props.changeFieldValue('t1c_phone', t1cCardMobile)

    this.setState({
      isT1Card: false,
      isT1Phone: true
    })
	}
	
	handleVerifyProfile = async() =>  {
		const { formValues, onLoading } = this.props
			onLoading(true)
			await this.props.editProfile(formValues)
			window.location.reload()
			// this.props.onBackClick();
			// onLoading(false)
	}

	renderBottom() {
		const {handleSubmit} = this.props

    return (
      <div key="bottom" className="bottom">
        <Button className="back" icon  onClick={this.props.onBackClick}>
          <Icon className="chevron left" />
          {this.props.translate('right_menu.profile.billing.back')}
        </Button>
        <Button className="verify" onClick={handleSubmit(this.handleVerifyProfile)}>
          <span className="text">{this.props.translate('edit-profile.btn_confirm')}</span>
          <Image className="icon-back" src="/assets/icons/shape.png" />
        </Button>
      </div>
    );
	}

  render() {
		const { translate, handleSubmit} = this.props
    const isT1Phone = this.state.isT1Phone ? '' : 'hidden'
    const isT1Card = this.state.isT1Card ? '' : 'hidden'

    return (
      <form className="personalForm" onSubmit={handleSubmit}>
				<div className="personal_detail">
					<p className="title">{translate('edit-profile.my_profile')}</p>
					<Field 
						className="field"
						name="first_name"
						component={renderField}
						placeholder="Name"
						label={translate('edit-profile.first_name')}
						msgError={translate}
						isRequired="*"
					/>
					<Field 
						className="field"
						name="last_name"
						component={renderField}
						placeholder={translate('edit-profile.last_name')}
						label={translate('edit-profile.last_name')}
						msgError={translate}
						isRequired="*"
					/>
					<Field 
						className="field"
						name="contact_number"
						component={renderField}
						placeholder={translate('edit-profile.contact')}
						label={translate('edit-profile.contact')}
						msgError={this.props.translate}
						isRequired="*"
					/>
				</div>
				<div className="t1c_detail">
					<p className="title">{translate('edit-profile.t1c_info')}</p>
					<Field 
						label={translate('edit-profile.t1c_phone')}
						name="t1c"
						values="t1c_phone"
						component={renderRadio}
						checked={this.state.isT1Phone === true}
						onChange={this.handleT1Phone}
					/>
					<div className={isT1Phone}>
						<Field 
							className="field"
							name="t1c_phone"
							component={renderField}
							placeholder={translate('edit-profile.error.t1c_phone')}
							label={translate('edit-profile.error.t1c_phone')}
							msgError={this.props.translate}
						/>
					</div>
					<Field 
						label={translate('edit-profile.t1c_card')}
						name="t1c"
						values="t1c_card"
          	component={renderRadio}
						checked={this.state.isT1Card === true}
						onChange={this.handleT1Card}
					/>
					<div className={isT1Card}>
						<Field 
							className="field"
							name="t1c_card"
							component={renderField}
							placeholder={translate('edit-profile.error.t1c_card')}
							label={translate('edit-profile.error.t1c_card')}
							msgError={this.props.translate}
						/>
					</div>
				</div>
				{this.renderBottom()}
      </form>
    )
  }
}

const mapStateToProps = state => ({
	translate: getTranslate(state.locale),
	customer: getCustomerSelector(state),
  formValues: prop(state, 'form.editProfile.values', {}),
})

const mapDispatchToProps = dispatch => ({
	editProfile: customer => dispatch(editProfile(customer)),
	initializeForm: values => dispatch(initialize('editProfile', values)),
	changeFieldValue: (field, value) => {
    dispatch(change('editProfile', field, value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
	form: 'editProfile',
	validate,
})(PersonalForm))
