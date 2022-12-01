import { get as prop, isEmpty, find } from 'lodash';

// Check is Seasonal
export const findIsSeasonal = (product, seasonal) => {
  const isSeasonal = prop(find(product.custom_attributes_option, attr => attr.attribute_code === 'seasonal'), 'value');
  return !isEmpty(seasonal) && isSeasonal === seasonal;
};
