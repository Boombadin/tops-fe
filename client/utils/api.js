import { reduce, pick } from 'lodash';

export function createCustomAttributes(values, fields = Object.keys(values)) {
  return reduce(pick(values, fields), (memo, value, key) => [
    ...memo,
    {
      attribute_code: key,
      value: value,
      name: key
    }
  ],
  []);
}
