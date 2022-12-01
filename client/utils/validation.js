import { isEmpty } from 'lodash'

export const join = rules => (value, data, props) => (
  rules.map(rule => rule(value, data, props)).filter(error => !!error)[0]
)
export const createValidator = rules => (data = {}, componentProps) => {
  const errors = {}
  Object.keys(rules).forEach((key) => {
    const rule = join([].concat(rules[key])) // concat enables both functions and arrays of functions
    const error = rule(data[key], data, componentProps)
    if (error) {
      errors[key] = error
    }
  })
  return errors
}

export const required = (value) => isEmpty(value) ? 'Required' : null
export const integer = (value) => (!Number.isInteger(Number(value))) ? 'Must be an integer' : null
export const minLength = min => (value) => (
  (!isEmpty(value) && value.length < min) ? `Must be at least ${min} characters` : null
)
export const maxLength = max => (value) => (
  (!isEmpty(value) && value.length > max) ? `Must be no more than ${max} characters` : null
)
export const email = (value) => (
  (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) ? (
    'Invalid email address'
  ) : null
)

export const customMaxMoney = max => value => {
  if (value) {
    const onlyNums = value.replace(/[^\d]/g, '')
    const setNumber = parseInt(onlyNums, 10)
    // const setNumber = parseInt(onlyNums, 10) / 100
    const textMax = new Intl.NumberFormat('th-TH').format(max)
    return setNumber >= max ? `Must be no more than ${textMax} Baht` : null
  }
  return null
}
