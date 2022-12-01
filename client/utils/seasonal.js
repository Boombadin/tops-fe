import { get as prop } from 'lodash';
import moment from 'moment'
import { format } from '../utils/time';

export const seasonalLimitDate = (config, storeConfig) => {
  const startDateDelivery = prop(config, 'delivery_end_date') && moment(prop(config, 'delivery_start_date')).add(25200000, 'ms').format('YYYY-MM-DD HH:mm');
  const endDateDelivery = prop(config, 'delivery_end_date') && moment(prop(config, 'delivery_end_date')).add(25200000, 'ms').format('YYYY-MM-DD HH:mm');
  const endDeliveryDay = format(endDateDelivery, 'DD', storeConfig.locale);
  const endDeliveryMonth = format(endDateDelivery, 'MM', storeConfig.locale);
  const endDeliveryYear =
    parseInt(format(endDateDelivery, 'YYYY', storeConfig.locale)) + (storeConfig.locale === 'th_TH' ? 543 : 0);

  const checkOneDate = format(startDateDelivery, 'DD MMM YYYY', storeConfig.locale) === format(endDateDelivery, 'DD MMM YYYY', storeConfig.locale)
  let dateLimit;
  if (checkOneDate) {
    dateLimit = format(startDateDelivery, 'DD MMM YYYY', storeConfig.locale)
  } else {
    dateLimit = `${format(startDateDelivery, 'DD MMM', storeConfig.locale)} - ${format(
      `${endDeliveryYear}-${endDeliveryMonth}-${endDeliveryDay}`,
      'DD MMM YYYY',
      storeConfig.locale
    )}`
  }

  return dateLimit
}
