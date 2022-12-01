export function orderStatus(translate, status) {
  let mcomStatus = ''
  if (status === "pending") {
    mcomStatus = translate('order_history.status.pending')
  }
  if (status === "processing") {
    mcomStatus = translate('order_history.status.processing')
  }
  if (status === "MCOM_NEW") {
    mcomStatus = translate('order_history.status.new')
  }
  if (status === "MCOM_RECEIVED") {
    mcomStatus = translate('order_history.status.received')
  }
  if (status === "MCOM_ONHOLD") {
    mcomStatus = translate('order_history.status.on_hold')
  }
  if (status === "MCOM_REJECTED") {
    mcomStatus = translate('order_history.status.rejected')
  }
  if (status === "MCOM_ERROR") {
    mcomStatus = translate('order_history.status.error')
  }
  if (status === "MCOM_LOGISTICS") {
    mcomStatus = translate('order_history.status.logistics')
  }
  if (status === "MCOM_COMPLETE") {
    mcomStatus = translate('order_history.status.complete')
  }
  if (status === "MCOM_LOGISTICSCOMPLETE") {
    mcomStatus = translate('order_history.status.logistics_complete')
  }

  return mcomStatus
}
