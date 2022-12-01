import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export const promoTypeBundle = ['bogo', 'b2g1', 'b3g1', 'b1gv', 'b2gv', 'b3gv'];

export const promoAvailableForBundleLink = promoCode => {
  if (isEmpty(promoCode)) {
    return false;
  }
  const availableFormat = promoTypeBundle;
  return !isEmpty(
    find(
      availableFormat,
      formatCode => formatCode === promoCode.toString().toLowerCase(),
    ),
  );
};

export const selectAvailableType = promoList => {
  const availableFormat = promoTypeBundle;
  const transformCodeToLowerCase = map(promoList, code => code.toLowerCase());
  const isContain = find(availableFormat, v =>
    find(transformCodeToLowerCase, code => code === v),
  );
  return isContain;
};
