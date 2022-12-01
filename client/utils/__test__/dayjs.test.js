import dayjs from 'dayjs';

import {
  checkDate,
  dateTimeTh,
  dateTimeUnix,
  getDateWithFormatWithOutUTC,
  getDateWithPeriodFormat,
  setDayJSLocale,
} from '../dayjs';

const date = dayjs();

beforeEach(() => {
  setDayJSLocale('en');
});

describe('Given Compare FromDate and ToDate with Date.now():', () => {
  describe('When I send empty value both FromDate and ToDate', () => {
    const DateFrom = '';
    const DateTo = '';
    test('Then it should return true', () => {
      const received = checkDate(DateFrom, DateTo);
      expect(received).toBeTruthy();
    });
  });

  describe('When I send FromDate and Past of Date', () => {
    const DateFrom = date
      .add(-1, 'days')
      .utc()
      .format();
    const DateTo = date
      .add(1, 'days')
      .utc()
      .format();
    test('Then it should return false', () => {
      const received = checkDate(DateFrom, DateTo);
      expect(received).toBeTruthy();
    });
  });

  describe('When I send ToDate and Past of Date', () => {
    const DateFrom = date
      .add(-2, 'days')
      .utc()
      .format();
    const DateTo = date
      .add(-1, 'days')
      .utc()
      .format();
    test('Then it should return false', () => {
      const received = checkDate(DateFrom, DateTo);
      expect(received).toBeFalsy();
    });
  });

  describe('When I send FromDate and Over of Date', () => {
    const DateFrom = date
      .add(2, 'days')
      .utc()
      .format();
    const DateTo = date
      .add(1, 'days')
      .utc()
      .format();
    test('Then it should return false', () => {
      const received = checkDate(DateFrom, DateTo);
      expect(received).toBeFalsy();
    });
  });

  describe('When I send ToDate and Over of Date and FromDate Past of Date', () => {
    const DateFrom = date
      .add(-1, 'days')
      .utc()
      .format();
    const DateTo = date
      .add(2, 'days')
      .utc()
      .format();
    test('Then it should return true', () => {
      const received = checkDate(DateFrom, DateTo);
      expect(received).toBeTruthy();
    });
  });
});

describe('Given I would like to get DateTimeTh Format:', () => {
  describe('When I send DateTime with empty value', () => {
    test('Then it should return dateTime format is xxxx-xx-xx', () => {
      const defaultDateTimeFormat = date.format('YYYY-MM-DD');
      const result = dateTimeTh('', 'YYYY-MM-DD');
      expect(result).toBe(defaultDateTimeFormat);
    });
  });

  describe('When I send DateTime value with format', () => {
    test('Then it should return date (xxxx/xx/xx) and time with GMT+7', () => {
      const mockupDateTime = '2020-03-03T00:00:00';
      const format = 'YYYY/MM/DD HH:mm:ss';
      const result = dateTimeTh(mockupDateTime, format);
      expect(result).toHaveLength(19);
    });
  });

  describe('When I send DateTime value with format and set locale is `th`', () => {
    test('Then it should return year according to locale', () => {
      const mockupDateTime = '2020-03-03T00:00:00';
      const format = 'YYYY';
      const result = dateTimeTh(mockupDateTime, format);
      setDayJSLocale('th');
      const resultWithLocale = dateTimeTh(mockupDateTime, format);
      expect(resultWithLocale - result).toBe(543);
    });
  });
});

describe('Given I would like to get unix time:', () => {
  describe('When I send DateTime with empty value', () => {
    test('Then it should return unix time current with Length is 13', () => {
      const result = dateTimeUnix();
      expect(result.toString()).toHaveLength(13);
    });
  });

  describe('When I send DateTime value', () => {
    test('Then it should return specified unix time plus GMT+7', () => {
      const mockupUnix = 1583249587000;
      const result = dateTimeUnix('2020-03-03 15:33:07');
      expect(result).toBe(mockupUnix);
    });
  });
});

describe('Given I would like to get period dateTime format:', () => {
  describe('When I send Min and Max Days', () => {
    test('Then it should return format is (xx) - (xx) Mar 20', () => {
      const result = getDateWithPeriodFormat('2020-03-03 00:00:00', 2, 3);
      expect(result).toBe('5 - 6 Mar 20');
    });
  });

  describe('When I send Min and Max Days difference Month', () => {
    test('Then it should return format is (xx) (xx) - (xx) (xx) 20', () => {
      const result = getDateWithPeriodFormat('2020-03-30 00:00:00', 1, 2);
      expect(result).toBe('31 Mar - 1 Apr 20');
    });
  });

  describe('When I send Min and Max Days difference Year', () => {
    test('Then it should return format is (xx) (xx) (xx) - (xx) (xx) (xx)', () => {
      const result = getDateWithPeriodFormat('2019-12-30 00:00:00', 1, 2);
      expect(result).toBe('31 Dec 19 - 1 Jan 20');
    });
  });

  describe('When I send Min, Max Days and Empty String CurrentDate', () => {
    test('Then it should return Year + 543 convert to B.E.', () => {
      setDayJSLocale();
      const result = getDateWithPeriodFormat('', 1, 2);
      const year = result.slice(-2);
      const mockupYear = dayjs()
        .add(543, 'years')
        .format('YY');
      expect(year).toBe(mockupYear);
    });
  });
});

describe('Given I would like to get dateTime with Format:', () => {
  describe('When I send DateTime with empty value', () => {
    test('Then it should return current DateTime with format is YYYY-MM-DD', () => {
      const mockupDate = date.format('YYYY-MM-DD');
      const result = getDateWithFormatWithOutUTC();
      expect(result).toBe(mockupDate);
    });
  });

  describe('When I send DateTime value', () => {
    test('Then it should return dateTime value with format is YYYY-MM-DD', () => {
      const mockupDate = '2020-03-03';
      const result = getDateWithFormatWithOutUTC(mockupDate);
      expect(result).toBe(mockupDate);
    });
  });
});

describe('Given I would like to set Locale:', () => {
  describe('When I send empty value of locale', () => {
    test('Then it should return Locale is TH', () => {
      setDayJSLocale();
      const result = dayjs('2020-01-03').format('MMM');
      expect(result).toBe('ม.ค.');
    });
  });
});
