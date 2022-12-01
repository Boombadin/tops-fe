import BannerApi from '../apis/banners'
import { find, result, filter, get as prop } from 'lodash'

export const TYPES = {
  FETCH_BANNER: 'FETCH_BANNER',
  FETCH_BANNER_COMPLETE: 'FETCH_BANNER_COMPLETE',
  FETCH_BANNER_FAIL: 'FETCH_BANNER_FAIL'
}

export const fetchBanner = (name) => {
  return async (dispatch, getState) => {
    dispatch(fetchBannerStart())
    try {
      const { banners } = await BannerApi.getBannerByName(name)
      if (banners) {
        dispatch(fetchBannerComplete(banners))
      }
      return banners
    } catch (e) {
      dispatch(fetchBannerFail())
      return null
    } 
  }
}

export const fetchBannerByCategory = (category) => {
  return async (dispatch, getState) => {
    dispatch(fetchBannerStart())
    try {
      const { banners } = await BannerApi.getBannerByCategory(category)
      dispatch(fetchBannerComplete(banners))
      return banners
    } catch (e) {
      dispatch(fetchBannerFail())
      return null
    } 
  }
}

export const fetchBannerComplete = banners => ({
  type: TYPES.FETCH_BANNER_COMPLETE,
  payload: {
    banners
  }
})

export const fetchBannerStart = () => ({
  type: TYPES.FETCH_BANNER,
})

export const fetchBannerFail = () => ({
  type: TYPES.FETCH_BANNER_FAIL,
})


const initialState = {
  items: [],
  loading: true
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_BANNER: {
      return {
        ...state,
        loading: true,
        items: []
      }
    }
    
    case TYPES.FETCH_BANNER_FAIL: {
      return {
        ...state,
        loading: false
      }
    }
    
    case TYPES.FETCH_BANNER_COMPLETE: {
      const { banners } = action.payload
      return {
        ...state,
        items: banners.items,
        loading: false
      }
    }

    default:
      return state
  }
}

export default reducer
