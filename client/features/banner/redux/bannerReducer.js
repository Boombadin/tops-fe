import { FETCH_KEY_BANNER } from './bannerActionTypes'
import { reducerCreator } from '../../../utils/reducerCreator'

export const initialState = {
  keys: {}
}

export const bannerReducer = (state = initialState, action) => {
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
    case FETCH_KEY_BANNER.REQUEST:
      return setStateWithKeyRequest()
    case FETCH_KEY_BANNER.SUCCESS:
      return setStateWithKeySuccess({ data: action.data })
    case FETCH_KEY_BANNER.FAILURE:
      return setStateWithKeyFailure()
    default:
      return state
  }
}
