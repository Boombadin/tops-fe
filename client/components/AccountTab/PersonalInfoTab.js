import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { getTranslate } from 'react-localize-redux'
import { CustomButton } from '../../magenta-ui'
import { getOneCardMembershipIdFromCustomer, getCustomerSelector } from '../../selectors'
import PersonalInfo from '../PersonalInfo'
import ArrowLeft from '../Icons/ArrowLeft'
import EditPersonalInfo from '../PersonalInfo/EditPersonalInfo';

const modes = {
  SELECT: 'SELECT',
  EDIT: 'EDIT'
};

class PersonalInfoTab extends PureComponent {
  state = {
    mode: modes.SELECT
  }

  handleEditProfile = () => {
    this.setState({
      mode: modes.EDIT,
    });
  }

  handleOvervieProfile = () => {
    if (this.props.onChangeMode) {
      this.props.onChangeMode(modes.SELECT);
    }

    this.setState({ mode: modes.SELECT });
  }
  
  render() {
    const { translate, customer } = this.props
    const { mode } = this.state
    const t1cCardNumber = getOneCardMembershipIdFromCustomer(customer)
    if(mode === modes.EDIT) {
      return (
        <EditPersonalInfo 
          edit={mode === modes.EDIT}
          onBackClick={this.handleOvervieProfile}
        />
      )
    }
    return (
      <div className="accounttab-userdetails">
        <div className="accounttab-userdetails-gradient" />
        <div className="accounttab-userdetails-upperpanel">
          <div className="accounttab-userdetails-upperpanel__header">
            <div className="accounttab-userdetails-upperpanel__name">
              {translate('right_menu.profile.personal.title')}
            </div>
            <div
              className="accounttab-userdetails-upperpanel__edit"
              onClick={this.handleEditProfile}
            >
              {translate('right_menu.profile.personal.edit')}
            </div>
          </div>
          {/* {!isEmpty(t1cCardNumber) && (
            <div className="accounttab-userdetails-upperpanel__id-text">
              {translate('right_menu.profile.personal.t1c_id')}
              <span className="accounttab-userdetails-upperpanel__id">{t1cCardNumber}</span>
            </div>
          )} */}
        </div>
        <PersonalInfo mobile={false} />
        <div className="personal-info__greedy-container" />
        <div className="personal-info__button-row">
          <CustomButton
            size="large"
            color="grey"
            primary={false}
            onClick={this.props.onBackClick}
            className="personal-info__button"
          >
            <ArrowLeft stroke="white" fill="white" className="personal-info__arrow-left" />
            {translate('right_menu.shipping_options.back')}
          </CustomButton>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  customer: getCustomerSelector(state),
  translate: getTranslate(state.locale)
})

export default connect(mapStateToProps)(PersonalInfoTab)
