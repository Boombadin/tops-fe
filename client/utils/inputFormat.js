import { createTextMask } from 'redux-form-input-masks';

export const phoneMask = createTextMask({
  pattern: '(999) 999-9999',
});

export const normalizePhone = value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  return onlyNums;
};
