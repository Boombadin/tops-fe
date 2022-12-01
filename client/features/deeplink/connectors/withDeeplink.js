import React, { PureComponent } from 'react'
import { func, object } from 'prop-types'
import { connect } from 'react-redux'
import { deeplinkTopsApp, deeplinkPDP } from '../redux/deeplinkActions'
import { makeGetDeeplink } from '../redux/deeplinkSelector'

export const withDeeplink = (WrapperComponent, isPDP = false) => {
  class DeeplinkHOC extends PureComponent {
    static propTypes = {
      deeplinkTopsApp: func.isRequired,
      deeplink: object.isRequired,
    }

    componentDidMount() {
      if (isPDP) this.props.deeplinkPDP()
      this.props.deeplinkTopsApp()
    }
    render() {
      return <WrapperComponent {...this.props} />
    }
  }

  const makeMapStateToProps = () => {
    const getDeeplink = makeGetDeeplink()
    return (state) => ({
      deeplink: getDeeplink(state),
    })
  }

  const mapDispatchToProps = dispatch => ({
    deeplinkTopsApp,
    deeplinkPDP: dispatch(deeplinkPDP()),
  })

  return connect(makeMapStateToProps, mapDispatchToProps)(DeeplinkHOC)
}