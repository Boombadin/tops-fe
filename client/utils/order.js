import sumBy from 'lodash/sumBy';

export const checkLimitQty = items => {
  const sumQty = sumBy(items, val => {
    const qty = val?.qty || 1;
    if (val.type_id === 'bundle') {
      return val.qty_per_pack + qty;
    }
    return qty;
  });

  return sumQty > 199;
};

export const validURL = link => {
  return link?.indexOf('http://') == 0 || link?.indexOf('https://') == 0;
};
