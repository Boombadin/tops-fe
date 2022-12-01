/**
 * @prettier
 */

import React from 'react'
import pt from 'prop-types'

import { formatPrice } from '../../../utils/price'

export const OrderPrice = ({ children: price }) => (
  <span className="price">{formatPrice(price)}</span>
)

OrderPrice.propTypes = {
  children: pt.number.isRequired
}
