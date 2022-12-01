import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, get } from 'lodash'
import { getTranslate } from 'react-localize-redux'
import styled from 'styled-components'
import './PromoBundleNotificationOld.scss'

const Center = styled.div`
  text-align: center;
`

class PromoBundleNoticeOld extends PureComponent {
  static propTypes = {
    itemsBundle: PropTypes.array,
    loaded: PropTypes.bool.isRequired,
    cartInit: PropTypes.bool.isRequired,
    translate: PropTypes.func.isRequired
  }

  static defaultProps = {
    itemsBundle: []
  }

  static getDerivedStateFromProps(prevProps, nextState) {
    const { itemsBundle } = prevProps
    let counter = 0

    map(itemsBundle, bundle => {
      const bundleQtyStep = bundle.qty_step
      const itemQty = bundle.items.length
      const bundleCount = Math.floor(itemQty / bundleQtyStep)

      counter += bundleCount
    })
    if (get(nextState, 'bundleCount', 0) !== counter) {
      return {
        bundleCount: counter,
      }
    }
    return null
  }

  state = {
    bundleCount: 0,
    showNotice: false,
    isFirst: false
  }
  
  componentDidMount() {
    setTimeout(() => [
      this.setState({ isFirst: true })
    ], 3000)
  }

  componentWillUnmount() {
    this.setState({ showNotice: false })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bundleCount !== this.state.bundleCount && prevState.bundleCount < this.state.bundleCount && this.state.isFirst) {
      this.handleNotification()
    }
  }

  handleNotification = () => {
    this.setState({ showNotice: true })
    setTimeout(() => {
      this.setState({ showNotice: false })
    }, 3000)
  }
  render() {
    const { showNotice } = this.state
    const { translate } = this.props
    const title = translate('notification.cart.normal')
    return (
      <div id="promo-bundle-old-notice" className={`promo-bundle-old-notice--container ${showNotice ? 'active' : ''}`}>
        <div className="title">
          <Center dangerouslySetInnerHTML={{ __html: title.replace('\n', ' ') }} />
        </div>
        <div className="desc">
          <Center>Bundle completed!</Center>
        </div>
        <div className="mobile-title">Bundle completed!</div>
        <div className="ribbon" />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  itemsBundle: state.cart.itemsBundle,
  loaded: state.cart.loaded,
  cartInit: state.cart.init
})

export default connect(mapStateToProps)(PromoBundleNoticeOld)
