import { normalizePhone } from './inputFormat';

export const transformCardExpiredDate = (event, handleChange) => {
  const stringValue = event.target.value;
  const isValid = /^([\d/])+$/.test(stringValue);
  if (isValid || stringValue === '') {
    // TODO: support remove every index not only from tail
    const splitCardExpiredDate = stringValue.replace(/\//g, '').split('');
    let formattedExpiredDate = stringValue;
    if (splitCardExpiredDate.length >= 3) {
      formattedExpiredDate = `${splitCardExpiredDate[0] ||
        ''}${splitCardExpiredDate[1] || ''}/${splitCardExpiredDate[2] ||
        ''}${splitCardExpiredDate[3] || ''}`;
    }
    event.target.value = formattedExpiredDate;
    handleChange(event);
  } else {
    event.preventDefault();
  }
};

export const parseAndHandleChange = (handleParse, handleChange) => event => {
  const value = handleParse(event.target.value);
  handleChange(event.target.name)(value);
};

export const transformCardNumber = (event, handleChange) => {
  const value = event?.target?.value;
  const valueString = value.replace(/\s/g, '');
  const isValid = /^([\d])+$/.test(valueString);
  if (isValid || value === '') {
    if (value) {
      const splitCardNumber = valueString.split('');
      let newValue = '';
      splitCardNumber.forEach((text, index) => {
        if (index % 4 === 0 && index !== 0) newValue += ' ';
        newValue += text;
      });
      event.target.value = newValue;
    }
    handleChange(event);
  } else {
    event.preventDefault();
  }
};

export const transformCVV = (event, handleChange) => {
  const value = normalizePhone(event.target.value);
  event.target.value = value;
  handleChange(event);
};
