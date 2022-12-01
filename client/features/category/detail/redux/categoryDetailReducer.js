import { FETCH_CATEGORY_DETAIL } from './categoryDetailActionTypes'
import { reducerCreator } from '../../../../utils/reducerCreator'

export const initialState = {
  keys: {}
}

export const categoryDetailReducer = (state = initialState, action) => {
  // Action Values
  const { type } = action
  // Reducer Creator
  const {
    setStateWithKeyRequest,
    setStateWithKeySuccess,
    setStateWithKeyFailure,
  } = reducerCreator(state, action)
  // Switch case
  switch (type) {
    case FETCH_CATEGORY_DETAIL.REQUEST:
      return setStateWithKeyRequest()
    case FETCH_CATEGORY_DETAIL.SUCCESS:
      return setStateWithKeySuccess({ data: action.data })
    case FETCH_CATEGORY_DETAIL.FAILURE:
      return setStateWithKeyFailure()
    default:
      return state
  }
}
