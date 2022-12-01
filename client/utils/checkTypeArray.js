import { isEmpty } from 'lodash'

export function checkTypeOfArray(dataArray) {
  try {
    const data = JSON.parse(dataArray)
    return !isEmpty(data) && typeof data === 'object'
  } catch (e) {
    return false
  }
}
