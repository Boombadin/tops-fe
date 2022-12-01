import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { get as prop } from 'lodash';
import { getTranslate } from 'react-localize-redux';
import RegisStep1 from './RegisStep1';
import { Grid } from '../../magenta-ui';
import { isEmailAvailable } from '../../reducers/registration';
import { NavLink } from 'react-router-dom';
import PrivacyModal from '../../features/modal/PrivacyModal';
import { getCookie } from '../../utils/cookie';
import TermsAndConModal from '../../features/modal/TermsAndConModal';

class RegisForm extends Component {
  state = {
    openPrivacyModal: false,
    openTermsModal: false,
  };

  handleClickPrivacy = () => {
    this.setState({
      openPrivacyModal: true,
    });
  };
  handleClickTermsAndConditions = () => {
    this.setState({
      openTermsModal: true,
    });
  };
  render() {
    const { onSubmit, translate, onSocialLogin } = this.props;
    return (
      <Grid centered columns={2}>
        <div className="regis-form">
          <Grid.Column>
            <RegisStep1 onSubmit={onSubmit} onSocialLogin={onSocialLogin} />
            {getCookie('provider') !== 'GrabFresh' && (
              <div className="terms-con-panel">
                {translate('pdpa.text1')}
                <span
                  className="login-link"
                  onClick={this.handleClickTermsAndConditions}
                >
                  {translate('pdpa.term_condition')}
                </span>
                {translate('pdpa.text2')}
                <span className="login-link" onClick={this.handleClickPrivacy}>
                  {translate('pdpa.privacy_title')}
                </span>
              </div>
            )}
            <div className="login-panel">
              {translate('regis_form.have_account')}{' '}
              <NavLink className="login-link" to="/login">
                {translate('regis_form.login_link')}
              </NavLink>
            </div>
          </Grid.Column>
        </div>
        {this.state.openPrivacyModal && (
          <PrivacyModal
            openModal={this.state.openPrivacyModal}
            onModalClose={() => this.setState({ openPrivacyModal: false })}
          />
        )}
        {this.state.openTermsModal && (
          <TermsAndConModal
            openModal={this.state.openTermsModal}
            onModalClose={() => this.setState({ openTermsModal: false })}
          />
        )}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  formValues: prop(state, 'form.regisForm.values', {}),
});

const mapDispatchToProps = dispatch => ({
  isEmailAvailable: () => dispatch(isEmailAvailable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisForm);
