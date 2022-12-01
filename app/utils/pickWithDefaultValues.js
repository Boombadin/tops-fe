import { get as prop, forEach, set } from 'lodash'

export function pickWithDefultValues(object, config) {
  let res = {}

  forEach(
    config,
    (defaultValue, path) => set(res, path, prop(object, path, defaultValue))
  )

  return res
}

export default pickWithDefultValues
