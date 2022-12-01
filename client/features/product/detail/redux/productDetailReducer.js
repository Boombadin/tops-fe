import { FETCH_PRODUCT_DETAIL } from './productDetailActionTypes'
import { reducerCreator } from '../../../../utils/reducerCreator'

export const initialState = {
  keys: {}
}

export const productDetailReducer = (state = initialState, action) => {
  // Action Value
  const { type } = action
  // Reducer Creator
  const {
    setStateWithKeyRequest,
    setStateWithKeySuccess,
    setStateWithKeyFailure,
  } = reducerCreator(state, action)
  // Switch case
  switch (type) {
    case FETCH_PRODUCT_DETAIL.REQUEST:
      return setStateWithKeyRequest()
    case FETCH_PRODUCT_DETAIL.SUCCESS:
      return setStateWithKeySuccess({ data: action.data })
    case FETCH_PRODUCT_DETAIL.FAILURE:
      return setStateWithKeyFailure()
    default:
      return state
  }
}
