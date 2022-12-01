import { uniq, get, find, trim, last, isEmpty } from 'lodash';
import moment from 'moment';
import { createDate } from '../../utils/time';
import { formatPrice } from '../../utils/price';

/**
 * get custom attribute name to string.
 * @param {Array<Object>} customAttribute;
 * @param {String} attrName;
 * @return {Any}
 */
export const getCustomAttribute = (customAttribute = [], attrName) => {
  return get(
    find(customAttribute, attr => attr.attribute_code === attrName),
    'value',
    '',
  );
};

/**
 * Fix Product Badge
 * if (promoBadges > 3) then remove field MONEYBACK in array
 * remove SALE when promotion_type = SALE
 * remove Red Hot when promotion_type = Red Hot
 * @param {String} productRemark
 * @param {Array} promoBadges
 * @return {Array}
 */
export const fixPromotionBadges = (productRemark, promoBadges) => {
  const maxBadge = productRemark ? 2 : 3;
  const newPromotionBadges = uniq(promoBadges).filter(item => {
    if (promoBadges.length > maxBadge) {
      return item !== 'MONEYBACK';
    }
    return item !== null;
  });
  return newPromotionBadges.filter(
    item => item !== 'SALE' && item !== 'Red Hot',
  );
};

export const getPromoName = (string, promoValue, product, textUnitItem) => {
  let consumerUnit = getCustomAttribute(
    product.custom_attributes_option,
    'consumer_unit',
  );

  const weightItemInd = product?.weight_item_ind;
  const sellingUnit = get(product, 'selling_unit', consumerUnit);

  if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
    consumerUnit = sellingUnit;
  }

  let promoPrice = null;
  const promoDiscount = parseFloat(
    get(product, 'extension_attributes.promotion.amount', 0),
  );
  if (/b[1-9]gv/i.test(promoValue)) {
    promoPrice = formatPrice(
      parseFloat((product.special_price || product.price).toString()) *
        (parseInt(promoValue[1], 10) + 1) -
        parseFloat(promoDiscount, 10),
    );
  }

  const dictionary = {
    consumer_unit: consumerUnit || textUnitItem,
    promotion_amount: formatPrice(promoDiscount),
    discount_amount: formatPrice(promoDiscount),
    the1card_point: parseInt(product.the1card_point, 10),
    the1card_qty: parseInt(product.the1card_qty, 10),
    price: promoPrice || formatPrice(product.special_price || product.price),
  };

  let empty = false;
  const replaced = string.replace(/{{.+?}}/gi, str => {
    const trimmed = trim(str, ' {}');
    if (!dictionary[trimmed]) {
      empty = true;
    }
    return dictionary[trimmed];
  });
  return empty ? '' : replaced;
};

export const getAllPromotionBadges = (product, locale, textToday) => {
  let promoBadges = [];
  if (
    get(product, 'extension_attributes.promotion.type') &&
    get(product, 'extension_attributes.promotion.end_date')
  ) {
    const currentTime = moment().format('YYYY-MM-DD HH:mm');
    const endPromotion = moment(
      get(product, 'extension_attributes.promotion.end_date'),
      '',
    )
      .add(25200000 - 36000, 'ms')
      .format('YYYY-MM-DD HH:mm');

    if (currentTime <= endPromotion) {
      promoBadges = get(
        product,
        'extension_attributes.promotion.type',
        '',
      ).split();
    }
  }

  const startMoneyBack = createDate(product.the1card_startdate);
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  let endMoneyBack = product.the1card_enddate
    ? createDate(product.the1card_enddate)
    : null;
  let endPromotion = get(product, 'extension_attributes.promotion.end_date')
    ? createDate(get(product, 'extension_attributes.promotion.end_date'))
    : null;

  if (
    (endPromotion && endPromotion.valueOf() < yesterday.valueOf()) ||
    !endPromotion
  ) {
    endPromotion = null;
    promoBadges = [];
  }

  if (
    endMoneyBack &&
    Date.now().valueOf() >= startMoneyBack.valueOf() &&
    endMoneyBack.valueOf() >= yesterday.valueOf()
  ) {
    promoBadges = [...promoBadges, 'MONEYBACK'];
  } else {
    endMoneyBack = null;
  }

  if (endMoneyBack || endPromotion) {
    const date =
      endMoneyBack && endPromotion
        ? endMoneyBack.valueOf() > endPromotion.valueOf() ||
          startMoneyBack.valueOf() > Date.now().valueOf()
          ? endPromotion
          : endMoneyBack
        : endMoneyBack || endPromotion;

    promoBadges = [
      ...promoBadges,
      getTimeTodayToLastDay(textToday, date, locale),
    ];
  }
  const productRemark = get(product, 'product_remark', '');
  promoBadges = fixPromotionBadges(productRemark, promoBadges);
  return promoBadges;
};

/**
 * Get Time Today - Last Day
 * @param {String} textToday
 * @param {Date} date
 * @param {String} locale
 * @return {String}
 */
export const getTimeTodayToLastDay = (textToday, date, locale) => {
  const day = date.toLocaleString(locale, { day: 'numeric' });
  const month = date.toLocaleString(locale, { month: 'long' });
  const year = last(
    date.toLocaleString(locale, { year: 'numeric' }).split(' '),
  );
  return `${textToday}${day} ${month} ${year}`;
};
