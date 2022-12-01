import { format as dateFnsFormat } from 'date-fns';
import moment from 'moment';
import enLocale from 'date-fns/locale/en';
import thLocale from 'date-fns/locale/th';

export function format(date, formatStr, lang) {
  switch (lang) {
    case 'th_TH':
      return dateFnsFormat(date, formatStr, { locale: thLocale });
    case 'en_US':
      return dateFnsFormat(date, formatStr, { locale: enLocale });
    default:
      return dateFnsFormat(date, formatStr, { locale: enLocale });
  }
}

export const isDateBetween = dateTo => {
  const currentDate = moment().format('YYYY-MM-DD HH:mm');
  const endDate = moment(dateTo)
    .add(25200000 - 36000, 'ms')
    .format('YYYY-MM-DD HH:mm');

  return currentDate <= endDate;
};

export function createDate(dateStr) {
  const improvedString = dateStr ? dateStr.replace(/-/g, '/') : '';
  return new Date(improvedString);
}
