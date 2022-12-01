import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { withRouter } from 'react-router';
import { withTranslate } from '../../utils/translate';
import './PcHeadLogin.scss';
import LanguageSwitch from '../LanguageSwitch';
import Help from '../../components/Icons/RightBar/Help';
import { isCustomerLoggedInSelector } from '../../selectors';

class PcHeadLogin extends PureComponent {
  handleClickLogin = () => {
    const { lang } = this.props;
    window.location.href = encodeURI(
      `/${lang.url}/login?ref=${window.location.pathname}${window.location.search}`,
    );
  };

  render() {
    const { translate, lang, isCustomerLogged } = this.props;
    return (
      <div className="topbar_login">
        <a className="help_menu" href={`/${lang.url}/help`}>
          <Help className="icon-img" fill="#333" stroke="#333" />
          {translate('right_menu.help')}
        </a>
        <div className="login_section">
          {!isCustomerLogged && (
            <React.Fragment>
              <div>
                <a onClick={() => this.handleClickLogin()} className="topbar_btn login_btn">
                  {translate('sp_sidebar.login')}
                </a>
              </div>
              <div>
                <a href={`/${lang.url}/registration`} className="topbar_btn regis_btn">
                  {translate('sp_sidebar.register')}
                </a>
              </div>
            </React.Fragment>
          )}
        </div>

        <div className="lang">
          <LanguageSwitch className="language-switch" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isCustomerLogged: isCustomerLoggedInSelector(state),
  translate: getTranslate(state.locale),
});

export default withRouter(withTranslate(connect(mapStateToProps)(PcHeadLogin)));
