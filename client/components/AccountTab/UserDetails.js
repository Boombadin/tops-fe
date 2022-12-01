import React, { PureComponent } from 'react'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import pt from 'prop-types'
import { getCustomerSelector, getOneCardMembershipIdFromCustomer } from '../../selectors'
import './UserDetails.scss'
import PersonalInfoTab from './PersonalInfoTab'
import BillingTab from './billing/BillingTab'
import ProfileMenu from '../ProfileMenu'

const tabs = {
  MAIN: 1,
  PERSONAL_INFO: 2,
  BILLING_ADDRESS: 3
}

class UserDetails extends PureComponent {
  static propTypes = {
    customer: pt.object.isRequired,
    translate: pt.func.isRequired
  }

  state = { currentTab: tabs.MAIN }

  handleMainTab = () => this.setState({ currentTab: tabs.MAIN })

  handlePersonalInfoClick = () => this.setState({ currentTab: tabs.PERSONAL_INFO })

  handleInvoiceInfoClick = () => this.setState({ currentTab: tabs.BILLING_ADDRESS })

  render() {
    if (this.state.currentTab === tabs.PERSONAL_INFO) {
      return <PersonalInfoTab onBackClick={() => this.setState({ currentTab: tabs.MAIN })} />
    }

    if (this.state.currentTab === tabs.BILLING_ADDRESS) {
      return <BillingTab onBackClick={this.handleMainTab} />
    }

    const { customer, translate } = this.props

    return (
      <div className="accounttab-userdetails">
        <div className="accounttab-userdetails-gradient" />
        <div
          className={`accounttab-userdetails-upperpanel ${
            !isEmpty(getOneCardMembershipIdFromCustomer(customer)) ? '' : 'center'
          }`}
        >
          <div className="accounttab-userdetails-upperpanel__name">{`${customer.firstname} ${customer.lastname}`}</div>
          {!isEmpty(getOneCardMembershipIdFromCustomer(customer)) && (
            <div className="accounttab-userdetails-upperpanel__id-text">
              {translate('profile.one_card_membership')}
              <span className="accounttab-userdetails-upperpanel__id">
                {getOneCardMembershipIdFromCustomer(customer)}
              </span>
            </div>
          )}
        </div>
        <ProfileMenu
          onPersonalInfoClick={this.handlePersonalInfoClick}
          onInvoiceInfoClick={this.handleInvoiceInfoClick}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
  translate: getTranslate(state.locale)
})

export default connect(mapStateToProps)(UserDetails)
