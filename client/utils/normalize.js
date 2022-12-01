export function normalizeCreditCard(value, previousValue) {
  let onlyNums = value.replace(/[^\d]/g, '')

  if (!previousValue || onlyNums.length > previousValue.length) {
    if (onlyNums.length === 5) {
      return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4)
    }
    if (onlyNums.length === 9) {
      return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 8) + '-' + onlyNums.slice(8)
    }
    if (onlyNums.length === 13) {
      return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 8) + '-' + onlyNums.slice(8, 12) + '-' + onlyNums.slice(12)
    }
  }
  if (onlyNums.length <= 4) {
    return onlyNums
  }
  if (onlyNums.length <= 8) {
    return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4)
  }
  if (onlyNums.length <= 12) {
    return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 8) + '-' + onlyNums.slice(8)
  }
  return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 8) + '-' + onlyNums.slice(8, 12) + '-' + onlyNums.slice(12, 16)
}

export function normalizeExpCard(value, previousValue) {
  let onlyNums = value.replace(/[^\d]/g, '')
  if (!previousValue || onlyNums.length > previousValue.length) {
    if (parseInt(onlyNums.slice(0, 2)) > 12) {
      return onlyNums = `0${onlyNums.slice(0, 1)}/${onlyNums.slice(1)}`
    }
    if(onlyNums.length === 3) {
      return onlyNums.slice(0, 2) + '/' + onlyNums.slice(2)
    }
  }
  if (onlyNums.length <= 2) {
    if (onlyNums.length === 1) {
      if (parseInt(onlyNums) > 1) {
        onlyNums = `0${onlyNums}`
      }
    }
    return onlyNums
  }
  return onlyNums.slice(0, 2) + '/' + onlyNums.slice(2, 4)
}

export function limit(val, max) {
  if (val.length === 1 && val[0] > max[0]) {
    val = '0' + val
  }

  if (val.length === 2) {
    if (Number(val) === 0) {
      val = '01'
    } else if (val > max) {
      val = max
    }
  }

  return val
}

export function normalizeCardExpiry(val) {
  let month = limit(val.substring(0, 2), '12')
  let year = val.substring(2, 4)

  return month + (year.length ? '/' + year : '')
}
