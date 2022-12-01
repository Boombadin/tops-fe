const PRECISION = 2;
const TRIAD_LNG = 3;

export function formatPrice(amount) {
  if (!amount) {
    return null;
  }

  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  const splittedAmount = price.toFixed(PRECISION).toString().split('.');
  const string = splittedAmount[0];
  const triads = [];
  const tail = splittedAmount[1];

  for (let i = string.length - 1; i >= 0; i -= TRIAD_LNG) {
    if (i > 2) {
      triads.push(string.substr(i - 2, TRIAD_LNG));
    } else {
      triads.push(string.substr(0, i + 1));
    }
  }

  let result = `${triads[triads.length - 1]}`;

  for (let i = triads.length - 2; i >= 0; i--) {
    result += `,${triads[i]}`;
  }

  if (tail) {
    result += `.${tail}`;
  } else {
    result += '.00';
  }

  return result;
}

export const formatPriceWithLocale = (price) => {
  return (+price).toLocaleString('en-US', { minimumFractionDigits: 2 }).slice(-13)
}
