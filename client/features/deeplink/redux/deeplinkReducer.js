import { DEEPLINK_TOPS_HOME_APP, DEEPLINK_TOPS_PDP } from './deeplinkActionTypes'


export const initialState = {
  home: ''
}

export const deeplinkReducer = (state = initialState, action) => {
  // Switch Case
  switch (action.type) {
    case DEEPLINK_TOPS_HOME_APP.SUCCESS:
      return {
        ...state,
        home: action.url
      }
    case DEEPLINK_TOPS_PDP.SUCCESS:
      return {
        ...state,
        url: action.url
      }
    default:
      return state
  }
}
