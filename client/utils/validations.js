import { size } from 'lodash';
import moment from 'moment';

export const validateIdCard = value => {
  if (!value) return false;
  const thisVal = String(value.trim().replace(/\s/g, ''));
  if (thisVal.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseFloat(thisVal.charAt(i)) * (13 - i);
    }
    if (
      (11 - (sum % 11)) % 10 !== parseFloat(thisVal.charAt(12)) ||
      thisVal[0] === '0'
    ) {
      return false;
    }
    return true;
  }
  return false;
};

export const validateTaxId = value => {
  if (value && String(value.trim().replace(/\s/g, '')).length >= 10) {
    return true;
  }
  return false;
};

export const validateBranchId = value => {
  if (value && String(value.trim().replace(/\s/g, '')).length >= 5) {
    return true;
  }
  return false;
};

export const validateAddressLine = addressLine => {
  if (
    !addressLine ||
    addressLine === ' ' ||
    (size(addressLine) > 0 && addressLine[0] === ' ')
  ) {
    return false;
  }
  return true;
};

export const validateTelephoneNumber = telephone => {
  const regex = /^([0]{1})([0-9]*)$/;
  const isCorrectFormat = regex.test(String(telephone));
  return isCorrectFormat;
};

export function validateCreditCardNumber(value = '', cardInfo) {
  // Accept only digits
  const creditCardLength = validateCreditCardMaxLength(
    cardInfo[0]?.lengths || [],
  );
  value = value.replace(/\s/g, '');

  if (/[^0-9]+/.test(value)) return false;

  let cardNumber = String(value);
  if (
    cardNumber?.length >= creditCardLength?.cardMinLeghth &&
    cardNumber?.length <= creditCardLength?.cardMaxLeghth
  ) {
    // The Luhn Algorithm. It's so pretty.
    let nCheck = 0;
    let bEven = false;
    cardNumber = cardNumber.replace(/\D/g, '');

    for (let n = cardNumber.length - 1; n >= 0; n--) {
      const cDigit = cardNumber.charAt(n);
      let nDigit = parseInt(cDigit, 10);

      if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

      nCheck += nDigit;
      bEven = !bEven;
    }
    return nCheck % 10 === 0;
  }
  return false;
}

export function validateCreditCardExpiredDate(value) {
  let result = value !== null;
  const inValidExpiredDate = /^(0[1-9]|1[0-2])[\/]([2-9][0-9])$/.test(value);
  if (inValidExpiredDate) {
    const valueYear = value.substring(3, 5);
    const valueMonth = value.substring(0, 2);
    const currentYear = moment().format('YY');
    const currentMonth = moment().format('MM');
    if (valueYear === currentYear && valueMonth < currentMonth) {
      result = false;
    } else {
      const maxYear = moment()
        .add(20, 'years')
        .format('YY');
      if (valueYear > maxYear) result = false;
    }
  }
  return result && inValidExpiredDate;
}

export function validateCreditCardCVV(value, cardCvvSize) {
  let inValidCVV = /^\d{3}$/.test(value);
  if (cardCvvSize === 4) {
    inValidCVV = /^\d{4}$/.test(value);
  }

  return inValidCVV;
}
export function validateCreditCardCVV4Digits(value) {
  const inValidCVV = /^\d{4}$/.test(value);
  return inValidCVV;
}

export const validateCreditCardMaxLength = cardLenghts => {
  const cardMaxLeghth = cardLenghts[cardLenghts?.length - 1] || 16;
  const cardMinLeghth = cardLenghts[0] || 16;
  const maxLengthInput = cardMaxLeghth + Math.ceil(cardMaxLeghth / 4 - 1);

  return { cardMaxLeghth, cardMinLeghth, maxLengthInput };
};
