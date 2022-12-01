import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { get as prop, find, isEmpty } from 'lodash'
import { isMobile } from 'react-device-detect';
import { getTranslate } from 'react-localize-redux';
import { Loader } from '../../magenta-ui';
import { editProfile } from '../../reducers/customer';
import PersonalForm from './PersonalForm';
import './EditPersonalInfo.scss'
import { getCustomerSelector } from '../../selectors'


class EditPersonalInfo extends PureComponent {
	static propTypes = {
		onBackClick: PropTypes.func.isRequired,
	}

	state = {
    requestsPending: false
	}

	componentDidMount() {
		const { customer } = this.props
		const mobile = find(prop(customer, 'custom_attributes', {}), { attribute_code: 'mobile_phone' });
		const t1Phone = find(prop(customer, 'custom_attributes', {}), { attribute_code: 't1c_phone' });
		const t1Card = find(prop(customer, 'custom_attributes', {}), { attribute_code: 't1c_card' });

		let values = {
			first_name: customer.firstname,
			last_name: customer.lastname,
			contact_number: !isEmpty(mobile) ? mobile.value : '',
			t1c_phone: !isEmpty(t1Phone) ? t1Phone.value : '',
			t1c_card: !isEmpty(t1Card) ? t1Card.value : '',
		}

		this.props.initializeForm(values);
	}

	setLoadingState = (isShow) => {
		this.setState({
			requestsPending: isShow
		})
	}

	renderHeader() {
    const { translate } = this.props;
    return (
      <div className="header-wrapper">
        <p className="text">{translate('edit-profile.edit_profile')}</p>
      </div>
    )
	}

	renderBody() {
		return (
			<div key="body" className="body">
				<PersonalForm onBackClick={this.props.onBackClick} onLoading={this.setLoadingState}/>
			</div>
		)
	}
	
  render() {
    return (
      <div className="edit-profile">
				{!isMobile && this.renderHeader()}
				{this.renderBody()}
				{
          this.state.requestsPending && <div className="edit-profile-tab-mask" />
        }
				<Loader
          className="edit-profile-tab-loader"
          active={this.state.requestsPending}
          size="large"
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
	translate: getTranslate(state.locale),
	form: state.form.editProfile,
	customer: getCustomerSelector(state),
});

const mapDispatchToProps = dispatch => ({
	editProfile: customer => dispatch(editProfile(customer)),
  initializeForm: values => dispatch(initialize('editProfile', values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPersonalInfo)