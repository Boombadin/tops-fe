import moment from 'moment';

export const isDateBetween = dateTo => {
  const currentDate = moment().format('YYYY-MM-DD HH:mm');
  const endDate = moment(dateTo)
    .add(25200000 - 36000, 'ms')
    .format('YYYY-MM-DD HH:mm');

  return currentDate <= endDate;
};
