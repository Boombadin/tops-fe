export default class PaymentModel {
  constructor({ payment }) {
    this.paymentMethods = filterNewPaymentMethod(
      payment?.payment_methods || [],
    );
    this.extension_attributes = payment?.extension_attributes;
    this.isFullRedeemT1c = this.paymentMethods.find(
      option => option.code === 'free',
    );
    this.creditCardPromotions =
      this.extension_attributes?.p2c2p_credit_card_promotions || [];
    this.paymentAgents = this.extension_attributes?.p2c2p_payment_agents || [];
    this.paymentOptions =
      this.extension_attributes?.p2c2p_payment_options || [];

    // when customer use coupon code for credit cart. will return true
    this.isPaymentPromotionLocked =
      this.extension_attributes?.is_payment_promotion_locked || false;
  }
}

const filterNewPaymentMethod = paymentMethods => {
  const tempPayment = [];
  const allowPayment = [
    'payment_service_fullpayment',
    'fullpaymentredirect',
    'cashondelivery',
    'creditcardondelivery',
    'credit_term',
    'payatstore',
    'free',
  ];
  paymentMethods.forEach(method => {
    if (allowPayment.includes(method.code)) tempPayment.push(method);
  });

  return tempPayment;
};
