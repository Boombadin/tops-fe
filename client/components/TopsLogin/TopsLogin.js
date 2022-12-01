import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoginForm from './LoginForm'
import { Grid } from '../../magenta-ui'

class TopsLogin extends Component {
  render() {
    const { onSubmit, onSocialLogin } = this.props;
    return (
      <Grid centered columns={2}>
      <div className="login-form">
        <Grid.Column>
          <LoginForm onSubmit={onSubmit} onSocialLogin={onSocialLogin} />
        </Grid.Column>
      </div>
    </Grid>
    )
  }
}

export default TopsLogin