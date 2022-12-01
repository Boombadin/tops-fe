import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Segment, Container, Button } from '../../magenta-ui';
import { withTranslate } from '../../utils/translate';
import './TopsLoginSideBar.scss';

class TopsLoginSideBar extends PureComponent {
  handleClickLogin = () => {
    const { lang } = this.props;
    window.location.href = encodeURI(`/${lang.url}/login?ref=${window.location.pathname}${window.location.search}`);
  };

  handleClickRegister = () => {
    const { lang } = this.props;
    window.location.href = `/${lang.url}/registration`;
  };

  renderLogin() {
    const { translate } = this.props;
    return (
      <div className="tops_login">
        <Segment padded className="header-background-register">
          <Container fluid style={{ margin: '0 !important' }}>
            <h4 className="login-header">{translate('login.tops_login.title')}</h4>
            <p className="text-short-login">
              {translate('login.tops_login.description')}
              <button className="header-invalid-register" onClick={this.handleClickRegister}>
                {translate('login.tops_login.button_label')}
              </button>
            </p>
          </Container>
        </Segment>
        <Segment padded className="content-background-login">
          <label className="content-login-title">{translate('login.tops_login.content.title_1')}</label>
          <Button className="login-button" onClick={this.handleClickLogin}>
            {translate('login.tops_login.content.button')}
          </Button>
        </Segment>
      </div>
    );
  }

  render() {
    return this.renderLogin();
  }
}

export default withRouter(withTranslate(TopsLoginSideBar));
