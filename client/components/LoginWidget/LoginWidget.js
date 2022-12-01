import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { HeadTitle, Button } from '../../magenta-ui';
import { withRouter } from 'react-router';
import { getTranslate } from 'react-localize-redux';
import './LoginWidget.scss';

class LoginWidget extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  handleClickLogin = () => {
    this.props.history.push('/login');
  };

  handleClickRegister = () => {
    this.props.history.push('/registration');
  };

  render() {
    const { translate, className } = this.props;

    return (
      <div className={`login-Widget-wrap ${className}`}>
        <p className="login-title">{translate('login_widget.login')}</p>
        <div className="login-widget">
          <HeadTitle className="head-title" topic={translate('login_widget.login_shopping')} button={false} />
          <Button className="regis-button" onClick={this.handleClickLogin}>
            {translate('login_widget.login')}
          </Button>
        </div>
        <div className="login-widget">
          <HeadTitle className="head-title" topic={translate('login_widget.member_top')} button={false} />
          <Button className="signup-button" onClick={this.handleClickRegister}>
            {translate('login_widget.sign_up')}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale)
});

export default withRouter(connect(mapStateToProps)(LoginWidget));
