export function paymentMethods(translate, payment) {
  let paymentMethod = ''
  if (payment === 'fullpayment') {
    paymentMethod = translate('payment.methods.fullpayment')
  }
  if (payment === 'fullpaymentredirect') {
    paymentMethod = translate('payment.methods.fullpayment')
  }
  if (payment === 'cashondelivery') {
    paymentMethod = translate('payment.methods.cashondelivery')
  }
  if (payment === 'creditcardondelivery') {
    paymentMethod = translate('payment.methods.creditcardondelivery')
  }

  return paymentMethod
}
