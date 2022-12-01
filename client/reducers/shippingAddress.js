import { find, get as prop } from 'lodash'
import ShippingAddressApi from '../apis/shippingAddress'
import RegionApi from '../apis/region'
import { getDefaultShippingAddressSelector } from '../selectors'

export const TYPES = {
  SET_CURRENT_PROVINCE: 'SET_CURRENT_PROVINCE',
  SET_CURRENT_DISTRICT: 'SET_CURRENT_DISTRICT',
  SET_CURRENT_SUB_DISTRICT: 'SET_CURRENT_SUB_DISTRICT',
  SET_CURRENT_ZIPCODE: 'SET_CURRENT_ZIPCODE'
}

export const saveShippingLocation = (regionId, districtId, subdistrictId, zipcode) => {
  return async (dispatch, getState) => {
    const { customer } = getState()
    const response = await ShippingAddressApi.setShippingLocation(regionId, districtId, subdistrictId, zipcode, prop(customer, 'items.id', 0))
    return response
  }
}

export const setCurrentShippingLocation = (regionId, districtId, subdistrictId, zipcode) => {
  return (dispatch) => {
    dispatch(setCurrentProvince(regionId))
    dispatch(setCurrentDistrict(districtId))
    dispatch(setCurrentSubDistrict(subdistrictId))
    dispatch(setZipcode(zipcode))
  }
}

export const setCurrentProvince = regionId => ({
  type: TYPES.SET_CURRENT_PROVINCE,
  payload: { regionId }
})

export const setCurrentDistrict = districtId => ({
  type: TYPES.SET_CURRENT_DISTRICT,
  payload: { districtId }
})

export const setCurrentSubDistrict = subdistrictId => ({
  type: TYPES.SET_CURRENT_SUB_DISTRICT,
  payload: { subdistrictId }
})

export const setZipcode = zipcode => ({
  type: TYPES.SET_CURRENT_ZIPCODE,
  payload: { zipcode }
})

const initialState = {
  province: '',
  district: '',
  subdistrict: '',
  zipcode: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.SET_CURRENT_PROVINCE: {
      const { regionId } = action.payload
      return { ...state, ...{ province: regionId } } 
    }

    case TYPES.SET_CURRENT_DISTRICT: {
      const { districtId } = action.payload
      return { ...state, ...{ district: districtId } } 
    }

    case TYPES.SET_CURRENT_SUB_DISTRICT: {
      const { subdistrictId } = action.payload
      return { ...state, ...{ subdistrict: subdistrictId } } 
    }

    case TYPES.SET_CURRENT_ZIPCODE: {
      const { zipcode } = action.payload
      return { ...state, ...{ zipcode: zipcode } } 
    }

    default:
      return state
  }
}

export default reducer
