import { values, includes } from 'lodash';

export const valueOrDefault = (value, where, defaultValue = '') => 
  (includes(values(where), value)) ? value : defaultValue;
;