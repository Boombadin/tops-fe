import { get } from 'lodash'

// Defailt State
export const defaultKeys = {
  isFetching: false,
  isReload: true,
  data: null,
  error: '',
}

// Find State in Redux
export const findCategoryBySubCategoryID = (state, key) => get(state.categoryDetail.keys, key, defaultKeys)
export const findCategoryKeys = (state) => state.categoryDetail.keys
