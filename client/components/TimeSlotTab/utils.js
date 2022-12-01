import { chunk, map, first, last } from 'lodash';
import { addDays } from 'date-fns';

function addBlankDays(days = [], count = 0) {
  if (days.length >= count) {
    return days;
  }

  const result = [...days];
  const lastDay = last(days);

  for (let i = 0; i < count - days.length; i++) {
    result.push({
      date: addDays(lastDay.date, i + 1),
      slots: map(lastDay.slots, slot => ({ ...slot, enabled: false }))
    });
  }

  return result;
}

export function createIntervals(days, intervalSize = 3, fillBlank = true) {
  const intervalsDays = chunk(days, intervalSize);
  const intervals = map(intervalsDays, (intervalDays, idx) => ({
    id: idx,
    intervalStart: first(intervalDays).date,
    intervalEnd: last(intervalDays).date,
    days: fillBlank ? addBlankDays(intervalDays, intervalSize) : intervalDays
  }));

  return intervals;
}
