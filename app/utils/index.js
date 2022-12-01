import {
  fieldConditions as Conditions,
  sortDirections as Directions,
} from '../../client/utils/maqb';
import { map } from 'lodash';

export const addFieldToQueryBuilder = (builder, filter) => {
  const field = filter.split(',')[0];
  const value = filter.split(',')[1];
  // const condition = filter.split(',')[2];
  const condition = filter.split(',')[filter[filter.length - 1]];

  const valueToSend = condition === Conditions.LIKE ? `%25${value}%25` : value;

  builder.field(field, encodeURIComponent(valueToSend), condition);
};

export const addFieldSetToQueryBuilder = (builder, field, value, condition) => {
  builder.field(field, value, condition);
};

export const addFiltersToQueryBuilder = (builder, filters) => {
  if (typeof filters === 'string') {
    filters = JSON.parse(filters);
  }

  map(filters, (filterValue, filterKey) => {
    builder.field(filterKey, encodeURIComponent(filterValue), 'in');
  });
};

export const addSortingToQueryBuilder = (builder, sorting) => {
  const [field, directionString] = sorting.split(',');
  let direction;

  if (directionString === 'asc') {
    direction = Directions.ASCENDING;
  } else {
    direction = Directions.DESCENDING;
  }

  builder.sort(field, direction);
};
