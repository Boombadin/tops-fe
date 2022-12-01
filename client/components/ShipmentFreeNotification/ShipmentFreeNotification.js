import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, isEmpty, get as prop } from 'lodash'
import { getTranslate } from 'react-localize-redux'
import './ShipmentFreeNotification.scss'

class ShipmentFreeNotification extends Component {
  state = {
    showNotice: false,
    initial: true
  }

  componentDidMount() {
    document.addEventListener('click', this.resetNotice)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shippingInfo !== this.props.shippingInfo) {
      if (prop(this.props.shippingInfo, 'extension_attributes.free_delivery_customer_segments', null)) {
        this.startNoticeAnimate()
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.resetNotice)
  }

  prepairAnimate = () => {
    this.setState({
      initial: false
    })
  }

  startNoticeAnimate = () => {
    this.setState({
      showNotice: true
    })
  }

  resetNotice = () => {
    this.setState({
      showNotice: false
    })
  }

  render() {
    const { showNotice } = this.state
    const { translate } = this.props
    return (
      <div id="promo-bundle-notice" className={`shipment-bundle-notice--container ${showNotice ? 'active' : ''}`}>
        <div className="title">{ translate('shipping_free.title') }</div>
        <div className="desc">{ translate('shipping_free.description') }</div>
        <div className="mobile-title">{translate('bundle_shipment.shipment_free')}</div>
        <div className="ribbon" />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  shippingInfo: state.checkout.shippingInfo
})

export default connect(mapStateToProps)(ShipmentFreeNotification)
