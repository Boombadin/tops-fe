/**
 * @prettier
 */

import React from 'react'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'

const statusMap = translate => ({
  logistics: {
    title: translate('order_history.status.logistics'),
    color: 'yellow'
  },
  complete: {
    title: translate('order_history.status.complete'),
    color: 'green'
  },
  canceled: {
    title: translate('order_history.status.canceled'),
    color: 'red'
  },
  on_hold: {
    title: translate('order_history.status.on_hold'),
    color: 'yellow'
  },
  new: {
    title: translate('order_history.status.new'),
    color: 'yellow'
  },
  rejected: {
    title: translate('order_history.status.rejected'),
    color: 'red'
  },
  error: {
    title: translate('order_history.status.error'),
    color: 'red'
  },
  partial_shipped: {
    title: translate('order_history.status.partial_shipped'),
    color: 'yellow'
  },
  pending_payment: {
    title: translate('order_history.status.pending_payment'),
    color: 'yellow'
  },
  approved: {
    title: translate('order_history.status.approved'),
    color: 'green'
  },
  processing: {
    title: translate('order_history.status.processing'),
    color: 'yellow'
  }
})

const mapStateToProps = state => ({
  translate: getTranslate(state.locale)
})

export const OrderStatus = connect(mapStateToProps)(
  ({
    children: status,
    translate,
    coloredStatus = status
  }) =>
    coloredStatus ? (
      <span className={`status ${coloredStatus}`}>
        {coloredStatus}
      </span>
    ) : 
    <span className={`status new`}>
      {translate('order_history.status.new')}
    </span>
)
