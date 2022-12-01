import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/th';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function checkDate(from, to) {
  const dateNow = dayjs();

  if (
    (from && dateTimeUnix(from) > dateNow) ||
    (to && dateTimeUnix(to) < dateNow)
  ) {
    return false;
  }

  return true;
}

function getUTCOffset(dateTime = '') {
  return dateTime ? dayjs(dateTime).utcOffset() : 0;
}

export function dateTimeTh(dateTime = '', format = 'YYYY-MM-DD HH:mm:ss') {
  const addYears = dayjs.locale() === 'th' ? 543 : 0;

  return !dateTime
    ? dayjs().format(format)
    : dayjs(dateTime)
        .add(getUTCOffset(dateTime), 'minute')
        .add(addYears, 'years')
        .format(format);
}

export function dateTimeUnix(dateTime = '') {
  return !dateTime
    ? dayjs().valueOf()
    : dayjs(dateTime)
        .add(getUTCOffset(dateTime), 'minute')
        .valueOf();
}

export function getDateWithPeriodFormat(currentDate, minDate, maxDate) {
  const dateTime = currentDate ? currentDate : dayjs();
  const convertMinDate = dayjs(dateTime).add(minDate, 'days');
  const convertMaxDate = dayjs(dateTime).add(maxDate, 'days');
  const monthDiff = isMonthDiff(convertMinDate, convertMaxDate);
  const yearDiff = isYearDiff(convertMinDate, convertMaxDate);
  const minDateFormat = yearDiff ? 'D MMM YY' : monthDiff ? 'D MMM' : 'D';

  return `${convertDate(dateTime, minDate, minDateFormat)} - ${convertDate(
    dateTime,
    maxDate,
  )}`;
}

function isMonthDiff(minDate, maxDate) {
  return dayjs(minDate).get('month') !== dayjs(maxDate).get('month');
}

function isYearDiff(minDate, maxDate) {
  return dayjs(minDate).get('year') !== dayjs(maxDate).get('year');
}

function convertDate(currentDate, days, format = 'D MMM YY') {
  const addYears = dayjs.locale() === 'th' ? 543 : 0;

  return dayjs(currentDate)
    .add(getUTCOffset(), 'minute')
    .add(days, 'days')
    .add(addYears, 'years')
    .format(format);
}

export function getDateWithFormatWithOutUTC(dateTime = '') {
  setDayJSLocale('en');
  const date = dateTime ? dayjs(dateTime) : dayjs();
  return date.format('YYYY-MM-DD');
}

export function setDayJSLocale(lang = 'th') {
  dayjs.locale(lang);
}
