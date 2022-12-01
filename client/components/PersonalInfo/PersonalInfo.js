import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import Edit1 from '../Icons/Edit1'
import Edit2 from '../Icons/Edit2'
import { getOneCardMembershipIdFromCustomer, getThe1MobileFromCustomer, getCustomerSelector, getPhoneNumberFromCustomer } from '../../selectors'
import './PersonalInfo.scss'

class PersonalInfo extends PureComponent {

  render() {
    const { translate, customer, mobile } = this.props
    const t1cCardNumber = getOneCardMembershipIdFromCustomer(customer)
    const t1cCardMobile = getThe1MobileFromCustomer(customer)
    const phone = getPhoneNumberFromCustomer(customer)

    return (
      <div className="personal-info">
        {!mobile && <div className="personal-info__gradient" />}
        <div className="personal-info__pi-surname">
          <div className="personal-info__prop-value-pair">
            <div className="personal-info__fieldName">{translate('right_menu.profile.personal.name')}</div>
            <div className="personal-info__fieldValue">
              {customer.firstname} {customer.lastname}
            </div>
          </div>
        </div>
        <div className="personal-info__pi-card">
          <div className="personal-info__prop-value-pair">
            <div className="personal-info__fieldName">{translate('right_menu.profile.personal.t1c_phone')}</div>
            <div className="personal-info__fieldValue">{t1cCardMobile}</div>
          </div>
          {/* <Edit1 width={13} /> */}
        </div>
        <div className="personal-info__pi-card">
          <div className="personal-info__prop-value-pair">
            <div className="personal-info__fieldName">{translate('right_menu.profile.personal.t1c_item')}</div>
            <div className="personal-info__fieldValue">{t1cCardNumber}</div>
          </div>
          {/* <Edit1 width={13} /> */}
        </div>
        <div className="personal-info__pi-number">
          <div className="personal-info__prop-value-pair">
            <div className="personal-info__fieldName">{translate('right_menu.profile.personal.phone')}</div>
            <div className="personal-info__fieldValue">{phone}</div>
          </div>
          {/* <Edit2 width={13} /> */}
        </div>
        <div className="personal-info__pi-email">
          <div className="personal-info__prop-value-pair">
            <div className="personal-info__fieldName">{translate('right_menu.profile.personal.email')}</div>
            <div className="personal-info__fieldValue">{customer.email}</div>
          </div>
          {/* <Edit2 width={13} /> */}
        </div>
        {/* <div className="personal-info__sign-out">
            <div className="personal-info__sign-out-text">
              Change Password
            </div>
          </div> */}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
  translate: getTranslate(state.locale)
})

export default connect(mapStateToProps)(PersonalInfo)
