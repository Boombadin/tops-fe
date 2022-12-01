import { getIsCreditCardExpired } from '../../utils/date';

// static content
const CARD_TYPE_ICONS = {
  MasterCard: '/icons/types-credit-card/master-no-border.svg',
  Visa: '/icons/types-credit-card/visa-no-border.svg',
  JCB: '/icons/types-credit-card/jcb-no-border.svg',
  AMEX: '/icons/types-credit-card/amex-no-border.svg',
  Others: '/icons/types-credit-card/default-card.png',
};
const CARD_BANK_ICONS = {
  Others: '/images/payment/product-img-empty.svg', // TODO: follow up icon
};

export default class CreditCardModel {
  constructor({ card }) {
    // format data
    this.id = card?.id;
    this.bankId = card?.bank_id;
    this.expiryMonth = card?.expiry_month;
    this.expiryYear = card?.expiry_year;
    this.isDefault = card?.is_default;
    this.maskedNumber = card?.masked_number; // original data from api '477376XXXXXX0006'
    this.type = card?.type;
    this.bankName = card?.bank_name;
    this.bankImage = card?.bank?.image || CARD_BANK_ICONS.Others;
    this.bankIcon = card?.bank?.icon || CARD_BANK_ICONS.Others;
    this.typeIcon = CARD_TYPE_ICONS[this.type] || CARD_TYPE_ICONS.Others;
    this.isExpired = getIsCreditCardExpired({
      expiryMonth: this.expiryMonth,
      expiryYear: this.expiryYear,
    });
    this.maskedNumberByStar = `**** **** **** ${this.maskedNumber?.substring(
      12,
    )}`;
    this.expiryDate = `${`0${this.expiryMonth}`.slice(
      -2,
    )}/${`${this.expiryYear}`.substr(2, 2)}`;
  }
}
