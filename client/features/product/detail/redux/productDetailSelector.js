import { get } from 'lodash'

// Defailt State
export const defaultKeys = {
  isFetching: false,
  isReload: true,
  data: null,
  error: '',
}

// Find State in Redux
export const findProductBySlug = (state, key) => get(state.productDetail.keys, key, defaultKeys)
