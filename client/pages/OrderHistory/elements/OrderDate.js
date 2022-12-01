/**
 * @prettier
 */

import { format } from 'date-fns'
import React from 'react'
import pt from 'prop-types'

export const OrderDate = ({ children: date }) => (
  <span className="date-time">
    <span className="date">{format(date, 'DD/MM/YY')}</span>
    <span className="time">{format(date, 'HH:mm')}</span>
  </span>
  
)

OrderDate.propTypes = {
  children: pt.string.isRequired
}
