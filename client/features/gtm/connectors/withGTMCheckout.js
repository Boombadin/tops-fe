import React, { PureComponent } from 'react'
import { func } from 'prop-types'
import { connect } from 'react-redux'
import { gtmFetchCheckout } from '../redux/gtmActions'

export const withGTMCheckout = (WrapperComponent) => {
  class WithGTM extends PureComponent {
    static propTypes = {
      gtmFetchCheckout: func.isRequired,
    }
    componentDidMount() {
      this.props.gtmFetchCheckout()
    }

    render() {
      return (
        <WrapperComponent {...this.props} />
      )
    }
  }

  const mapDispatchToProps = {
    gtmFetchCheckout,
  }

  return connect(null, mapDispatchToProps)(WithGTM)
}
