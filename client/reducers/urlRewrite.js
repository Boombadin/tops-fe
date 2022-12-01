import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { get as prop } from 'lodash'
import UrlRewriteAPI from '../apis/urlRewrite';

export const TYPES = {
  FETCH_PATH_COMPLETED: 'FETCH_PATH_COMPLETED',
  FETCH_PATH_START: 'FETCH_PATH_START',
}

export const fetchPath = (path, ownProps) => {
  return async (dispatch, getState) => {
    dispatch(showLoading())
    dispatch(fetchPathStart())
    const currentStoreCode = getState().storeConfig.current.code;
    try {
      const { pathObj } = await UrlRewriteAPI.get(currentStoreCode, encodeURIComponent(path));
    
      const redirectType = prop(pathObj, 'redirect_type')
      
      if (redirectType === 301) {
        const targetPath = prop(pathObj, 'target_path')
        ownProps.history.replace(`/${targetPath}`)
      } 
      
      dispatch(fetchPathCompleted(path, pathObj));
      dispatch(hideLoading())
      return pathObj;
    } catch (e) {
      dispatch(hideLoading())
      return null
    }
  }
}

export const fetchPathCompleted = (path, pathObj) => ({
  type: TYPES.FETCH_PATH_COMPLETED,
  payload: {
    item: {
      [path]: pathObj
    }
  }
})

export const fetchPathStart = () => ({
  type: TYPES.FETCH_PATH_START,
})

const initialState = {
  pathesMap: {},
  loading: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_PATH_START: {
      return {
        ...state,
        loading: true
      }
    }
    case TYPES.FETCH_PATH_COMPLETED: {
      const { item } = action.payload
      return {
        ...state,
        pathesMap: {
          ...state.pathesMap,
          ...item
        },
        loading: false
      }
    }

    default:
      return state
  }
}

export default reducer
