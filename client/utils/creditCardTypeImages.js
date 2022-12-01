export function creditCardTypeImages(cardType) {
  const imageTypeCard = {
    visa: '/assets/icons/types-credit-card/visa-disable.svg',
    master: '/assets/icons/types-credit-card/master-disable.svg',
    jcb: '/assets/icons/types-credit-card/jcb-disable.svg',
    amex: '/assets/icons/types-credit-card/amex-disable.svg',
  };
  if (cardType === 'visa') {
    imageTypeCard.visa = '/assets/icons/types-credit-card/visa.svg';
  } else if (cardType === 'mastercard') {
    imageTypeCard.master = '/assets/icons/types-credit-card/master.svg';
  } else if (cardType === 'jcb') {
    imageTypeCard.jcb = '/assets/icons/types-credit-card/jcb.svg';
  } else if (cardType === 'american-express') {
    imageTypeCard.amex = '/assets/icons/types-credit-card/amex.svg';
  }

  return imageTypeCard;
}
