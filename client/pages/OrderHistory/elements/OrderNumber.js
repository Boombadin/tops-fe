/**
 * @prettier
 */

import React from 'react'
import pt from 'prop-types'
import { Link } from 'react-router-dom'

export const OrderNumber = ({
  orderId,
  orderNumber
}) => (
  <span className="number">
    <Link to={`/order-detail/${orderId}`}>{orderNumber}</Link>
  </span>
)

OrderNumber.propTypes = {
  orderId: pt.number.isRequired,
  orderNumber: pt.string.isRequired,
}
