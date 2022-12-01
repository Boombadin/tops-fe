import { uniqBy } from 'lodash'
import CmsBlockApi from '../apis/cmsBlock'

export const TYPES = {
  FETCH_CMSBLOCK: 'FETCH_CMSBLOCK',
  FETCH_CMSBLOCK_COMPLETED: 'FETCH_CMSBLOCK_COMPLETED',
  FETCH_CMSBLOCK_FAILED: 'FETCH_CMSBLOCK_FAILED'
}

export const fetchAllCmsBlock = () => {
  return async (dispatch, getState) => {
    const currentDefaultId = getState().storeConfig.default.id
    let search = ''
    search += 'searchCriteria[filter_groups][0][filters][0][field]=store_id'
    search += `&searchCriteria[filter_groups][0][filters][0][value]=${currentDefaultId}`
    search += '&searchCriteria[filter_groups][0][filters][0][condition_type]=eq'

    const { cmsBlock } = await CmsBlockApi.getAll(search)
    dispatch(fetchCmsBlockCompleted(cmsBlock))
    return cmsBlock
  }
}

export const fetchCmsBlock = (search) => {
  return async (dispatch, getState) => {
    const { cmsBlock } = await CmsBlockApi.getAll(search)
    dispatch(fetchCmsBlockCompleted(cmsBlock))
    return cmsBlock
  }
}

export const fetchCmsBlockStart = () => ({
  type: TYPES.FETCH_CMSBLOCK,
})

export const fetchCmsBlockCompleted = cmsBlock => ({
  type: TYPES.FETCH_CMSBLOCK_COMPLETED,
  payload: {
    cmsBlock
  }
})

export const fetchCmsBlockFailed = error => ({
  type: TYPES.FETCH_CMSBLOCK_FAILED,
  payload: {
    error
  }
})

const initialState = {
  items: [],
  loading: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_CMSBLOCK: {
      const newState = { loading: true }
      return { ...state, ...newState }
    }
    case TYPES.FETCH_CMSBLOCK_COMPLETED: {
      const { cmsBlock } = action.payload
      const newCmsBlock = uniqBy([...state.items, ...cmsBlock], 'id')
      const newState = { items: newCmsBlock, loading: false }
      
      return { ...state, ...newState }
    }
    case TYPES.FETCH_CMSBLOCK_FAILED: {
      return state
    }
    default:
      return state
  }
}

export default reducer
