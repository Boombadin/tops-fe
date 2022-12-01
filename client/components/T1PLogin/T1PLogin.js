import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import { Image, Segment, Header, Container, Modal, Button } from '../../magenta-ui'
import { openLoginPopup, openRegisterPopup } from '../../reducers/layout'
import SiteLogo from '../Utils/SiteLogo'
import './TIPLogin.scss'

class T1PLogin extends Component {
  static propTypes = {
    openLoginPopup: PropTypes.func.isRequired,
    openRegisterPopup: PropTypes.func.isRequired
  }

  state = {
    login: false,
    regis: false
  }

  openLogin = () => {
    this.props.openLoginPopup()

    // this.setState({ login: true })
  }

  onClose = () => {
    this.setState({
      login: false,
      regis: false
    })
  }

  openRegister() {
    this.props.openRegisterPopup()

    // this.setState({ regis: true })
  }

  renderLogin() {
    const { translate } = this.props
    return (
      <div>
        <Segment padded className="header-background-register">
          <Container fluid style={{ margin: '0 !important' }}>
            <h4 className="login-header">{translate('login.title')}</h4>
            <p className="text-short-login">
              {translate('login.description')}
              <button className="header-invalid-register" onClick={() => this.openRegister()}>
                {translate('login.button_label')}
              </button>
            </p>
          </Container>
        </Segment>
        <Segment padded className="content-background-login">
          <label className="content-login-title">{translate('login.content.title_1')} <SiteLogo className="title-logo" /> {translate('login.content.title_2')}</label>
          <label className="content-login-description">{translate('login.content.description')}</label>
          <button className="t1p-button" onClick={this.openLogin}>
            <Image className="btn_login" src="/assets/images/T1C_Button-Connect-01.png" />
          </button>
        </Segment>

        <Modal
          open={this.state.login}
          style={{ padding: 0, zIndex: 9999 }}
          size="small"
          onClose={this.onClose}
        >
          <Modal.Content style={{ padding: 0 }}>
            <iframe
              title="login"
              src={this.props.storeConfig.extension_attributes.login_url}
              width="100%"
              height="550"
            />
          </Modal.Content>
        </Modal>

        <Modal
          open={this.state.regis}
          style={{ padding: 0, zIndex: 9999 }}
          size="small"
          onClose={this.onClose}
        >
          <Modal.Content style={{ padding: 0 }}>
            <iframe
              title="regis"
              src={this.props.storeConfig.extension_attributes.register_url}
              width="100%"
              height="600"
            />
          </Modal.Content>
        </Modal>

      </div>
    )
  }

  render() {
    return this.renderLogin()
  }
}

const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale),
  storeConfig: state.storeConfig.current
})

const mapDispatchToProps = dispatch => ({
  openLoginPopup: () => dispatch(openLoginPopup()),
  openRegisterPopup: () => dispatch(openRegisterPopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(T1PLogin)
