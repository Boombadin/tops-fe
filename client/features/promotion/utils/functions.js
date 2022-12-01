import { get, find } from 'lodash';
import moment from 'moment';
import { formatPrice } from '../../../utils/price';

export const getCustomAttribute = (customAttributesOption, attrName) => {
  return get(
    find(customAttributesOption, attr => attr.attribute_code === attrName),
    'value',
    '',
  );
};

export const getPrice = (productSpecialPrice, originalPrice, specialToDate) => {
  const specialPrice =
    productSpecialPrice && Number(productSpecialPrice) !== 0
      ? productSpecialPrice
      : null;
  const price = originalPrice;

  let isInRange = false;

  if (specialToDate) {
    const currentTime = moment().format('YYYY-MM-DD HH:mm');
    isInRange =
      currentTime <=
      moment(specialToDate, '')
        .add(25200000 - 36000, 'ms')
        .format('YYYY-MM-DD HH:mm');
  }

  const showSpecialPrice =
    specialPrice && parseFloat(specialPrice) < price && isInRange;
  const formatOriginalPrice = formatPrice(price);
  const formatSpecialPrice = formatPrice(specialPrice);

  return {
    showSpecialPrice,
    price: formatOriginalPrice,
    specialPrice: formatSpecialPrice,
  };
};
