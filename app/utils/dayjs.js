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

export function dateTimeUnix(dateTime = '') {
  return !dateTime
    ? dayjs().valueOf()
    : dayjs(dateTime)
        .add(getUTCOffset(dateTime), 'minute')
        .valueOf();
}
