import React from 'react'
import pt from 'prop-types'
import { Image } from '../../magenta-ui'


export const OrderBanner = ({ title, src }) => (
  <div className="order-banner-wrap">
    <div className="order-banner">
      <span className="order-banner-text">{ title }</span>
      <div className="order-banner-img">
        <Image src={src} alt={title} />
      </div>
    </div>
  </div>
)

OrderBanner.propTypes = {
  title: pt.string.isRequired
}