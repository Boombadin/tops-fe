/**
 * @prettier
 */
import { keyBy } from 'lodash'
import CMSApi from '../apis/cms'

const TYPES = {
  FETCH_CMS_STARTED: 'FETCH_CMS_STARTED',
  FETCH_CMS_COMPLETED: 'FETCH_CMS_COMPLETED'
}

const initialState = {
  pages: {}
}

const fetchPageStarted = pageSlug => ({
  type: TYPES.FETCH_CMS_STARTED,
  payload: pageSlug
})

const fetchPageCompleted = apiResponse => ({
  type: TYPES.FETCH_CMS_COMPLETED,
  payload: apiResponse
})

export const fetchPage = (key, storeId) => async dispatch => {
  dispatch(fetchPageStarted(key))
  const rsp = await CMSApi.getByUrlKey(key, storeId)
  return dispatch(fetchPageCompleted(rsp))
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_CMS_STARTED:
      return {
        ...state,
        pages: {
          [action.payload]: {
            loading: true
          },
          ...state.pages
        }
      }

    case TYPES.FETCH_CMS_COMPLETED:
      return {
        ...state,
        pages: {
          ...state.pages,
          ...keyBy(action.payload.pages, 'identifier')
        }
      }

    default:
      return state
  }
}
