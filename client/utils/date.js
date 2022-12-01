import moment from 'moment';

// Default timezone is utc
export function checkDate(from, to, isUTCFormat = true) {
  const dateTimeNow = moment.utc().valueOf();

  if (from) {
    from = isUTCFormat ? moment.utc(from).valueOf() : moment(from).valueOf();
    if (from > dateTimeNow) {
      return false;
    }
  }

  if (to) {
    to = isUTCFormat ? moment.utc(to).valueOf() : moment(to).valueOf();
    if (to < dateTimeNow) {
      return false;
    }
  }

  return true;
}

/**
 *
 *
 * @export
 * @param {*} to String
 * @returns Boolean
 */
export function checkDateIsBefore(to) {
  return moment().isBefore(to);
}

// transformDate('27/10/1995', '/', '-')
export function transformDate(strDate, fmFrom, fmTo) {
  try {
    return strDate
      .split(fmFrom)
      .reverse()
      .join(fmTo);
  } catch (e) {
    return '';
  }
}

export function fullDate(date, lang = 'en') {
  return moment(date)
    .add(lang === 'en' ? 0 : 543, 'years')
    .locale(lang)
    .format('DD MMMM YYYY');
}

export const getFullDateOrderCreated = (createdAt, lang) => {
  moment.locale(lang);
  return (
    createdAt &&
    moment(createdAt)
      .add(25200000, 'ms')
      .format('YYYY-MMM-DD, HH:mm')
  );
};

export const getIsCreditCardExpired = ({ expiryMonth, expiryYear }) => {
  const currentMonth = moment.utc().month() + 1; // jan=0, dec=11
  const currentYear = moment.utc().year();

  return (
    expiryYear < currentYear ||
    (expiryMonth < currentMonth && expiryYear === currentYear)
  );
};

export const formatHours = (openHours = [], langcode = 'en') => {
  const todayInWeek = moment()
    .locale('en')
    .format('dddd');
  const openHoursData = openHours.find(item => item.day === todayInWeek);

  if (!openHours.length || !openHoursData) {
    return null;
  }

  const open = openHoursData?.open || openHoursData?.from || null;
  const close = openHoursData?.close || openHoursData?.to || null;

  if (!open && !close) {
    return null;
  }

  const openHour = moment(open, 'hh:mm');
  const formatOpenHour = openHour.format('h:mm A');
  const closeHour = moment(close, 'hh:mm');
  const formatCloseHour = closeHour.format('h:mm A');

  const translationTimeOpenHour =
    langcode === 'en' ? formatOpenHour : `${open}น.`;
  const translationTimeCloseHour =
    langcode === 'en' ? formatCloseHour : `${close}น.`;

  return `${translationTimeOpenHour} - ${translationTimeCloseHour}`;
};
