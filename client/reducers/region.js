import { filter } from 'lodash'
import RegionApi from '../apis/region'

export const TYPES = {
  SELECT_PROVINCE: 'SELECT_PROVINCE',
  FETCH_PROVINCE: 'FETCH_PROVINCE',
  FETCH_PROVINCE_COMPLETE: 'FETCH_PROVINCE_COMPLETE',
  FETCH_PROVINCE_FAILED: 'FETCH_PROVINCE_FAILED',
  SELECT_DISTRICT: 'SELECT_DISTRICT',
  FETCH_DISTRICT: 'FETCH_DISTRICT',
  FETCH_DISTRICT_COMPLETE: 'FETCH_DISTRICT_COMPLETE',
  FETCH_DISTRICT_FAILED: 'FETCH_DISTRICT_FAILED',
  SELECT_SUB_DISTRICT: 'SELECT_SUB_DISTRICT',
  FETCH_SUB_DISTRICT: 'FETCH_SUB_DISTRICT',
  FETCH_SUB_DISTRICT_COMPLETE: 'FETCH_SUB_DISTRICT_COMPLETE',
  FETCH_SUB_DISTRICT_FAILED: 'FETCH_SUB_DISTRICT_FAILED',
  SELECT_ZIPCODE: 'SELECT_ZIPCODE'
}

// Province
export const fetchProvince = (delivery = true) => {
  return async (dispatch, getState) => {
    dispatch(fetchProvinceLoading())
    try {
      const { storeConfig } = getState()
      const currentStoreCode = storeConfig.current.code

      const { provinces } = await RegionApi.getProvince(currentStoreCode, delivery)

      dispatch(fetchProvinceCompleted(provinces))
      return provinces
    } catch (e) {
      return dispatch(fetchProvinceFail())
    }
  }
}

export const fetchProvinceLoading = () => ({ type: TYPES.FETCH_PROVINCE })

export const fetchProvinceFail = () => ({ type: TYPES.FETCH_PROVINCE_FAILED })

export const fetchProvinceCompleted = provinces => ({ type: TYPES.FETCH_PROVINCE_COMPLETE, payload: { provinces } })

// District
export const fetchDistrict = (regionId, delivery = true) => {
  return async (dispatch, getState) => {
    dispatch(fetchDistrictLoading())
    try {
      const { storeConfig } = getState()
      const currentStoreCode = storeConfig.current.code

      if (!regionId) return dispatch(fetchDistrictFail())

      const { districts } = await RegionApi.getDistrict(currentStoreCode, regionId, delivery)
      dispatch(fetchDistrictCompleted(districts))
      return districts
    } catch (e) {
      return dispatch(fetchDistrictFail())
    }
  }
}

export const fetchDistrictLoading = () => ({ type: TYPES.FETCH_DISTRICT })

export const fetchDistrictFail = () => ({ type: TYPES.FETCH_DISTRICT_FAILED })

export const fetchDistrictCompleted = districts => ({ type: TYPES.FETCH_DISTRICT_COMPLETE, payload: { districts } })

// Sub District
export const fetchSubDistrict = (regionId, districtId, delivery = true) => {
  return async (dispatch, getState) => {
    dispatch(fetchSubDistrictLoading())
    try {
      const { storeConfig } = getState()
      const currentStoreCode = storeConfig.current.code

      if (!regionId || !districtId) return dispatch(fetchSubDistrictFail())

      const { subdistricts } = await RegionApi.getSubDistrict(currentStoreCode, regionId, districtId, delivery)

      // format subdistrict
      const formatSubDistricts = subdistricts.map(item => {
        item.formatValue = `${item.subdistrict_id}-${item.zip_code}`

        const isHasMore = filter(subdistricts, subd => subd.subdistrict_id === item.subdistrict_id).length >= 2

        if (isHasMore) item.formatName = `${item.name} - ${item.zip_code}`
        else item.formatName = `${item.name}`

        return item
      })

      await dispatch(fetchSubDistrictCompleted(formatSubDistricts))
      return subdistricts
    } catch (e) {
      return dispatch(fetchSubDistrictFail())
    }
  }
}

export const fetchSubDistrictLoading = () => ({ type: TYPES.FETCH_SUB_DISTRICT })

export const fetchSubDistrictFail = () => ({ type: TYPES.FETCH_SUB_DISTRICT_FAILED })

export const fetchSubDistrictCompleted = subdistricts => ({
  type: TYPES.FETCH_SUB_DISTRICT_COMPLETE,
  payload: { subdistricts }
})

export const selectProvince = (selectedProvince = '') => ({
  type: TYPES.SELECT_PROVINCE,
  payload: { selectedProvince }
})

export const selectDistrict = (selectedDistrict = '') => ({
  type: TYPES.SELECT_DISTRICT,
  payload: { selectedDistrict }
})

export const selectSubDistrict = (selectedSubDistrict = '') => ({
  type: TYPES.SELECT_SUB_DISTRICT,
  payload: { selectedSubDistrict }
})

export const selectZipcode = (selectedZipcode = '') => ({ type: TYPES.SELECT_ZIPCODE, payload: { selectedZipcode } })

const initialState = {
  provinces: [],
  provincesLoading: false,
  districts: [],
  districtsLoading: false,
  subdistricts: [],
  subdistrictsLoading: false,
  selectedProvince: '',
  selectedDistrict: '',
  selectedSubDistrict: '',
  selectedZipcode: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.SELECT_PROVINCE: {
      const newState = {
        selectedProvince: action.payload.selectedProvince,
        selectedDistrict: '',
        selectedSubDistrict: '',
        selectedZipcode: ''
      }

      return { ...state, ...newState }
    }

    case TYPES.SELECT_DISTRICT: {
      const newState = {
        selectedDistrict: action.payload.selectedDistrict,
        selectedSubDistrict: '',
        selectedZipcode: ''
      }
      return { ...state, ...newState }
    }

    case TYPES.SELECT_SUB_DISTRICT: {
      const newState = { selectedSubDistrict: action.payload.selectedSubDistrict }
      return { ...state, ...newState }
    }

    case TYPES.SELECT_ZIPCODE: {
      const newState = { selectedZipcode: action.payload.selectedZipcode }
      return { ...state, ...newState }
    }

    case TYPES.FETCH_PROVINCE: {
      return { ...state, ...{ provincesLoading: true } }
    }

    case TYPES.FETCH_PROVINCE_COMPLETE: {
      const { provinces } = action.payload

      return { ...state, provinces, provincesLoading: false }
    }

    case TYPES.FETCH_PROVINCE_FAILED: {
      return { ...state, ...{ provinces: [], districts: [], subdistricts: [], provincesLoading: false } }
    }

    case TYPES.FETCH_DISTRICT: {
      return { ...state, ...{ districtsLoading: true, districtSelected: '' } }
    }

    case TYPES.FETCH_DISTRICT_COMPLETE: {
      const { districts } = action.payload

      return { ...state, ...{ districts, districtsLoading: false } }
    }

    case TYPES.FETCH_DISTRICT_FAILED: {
      return { ...state, ...{ districts: [], subdistricts: [], districtsLoading: false } }
    }

    case TYPES.FETCH_SUB_DISTRICT: {
      return { ...state, ...{ subdistrictsLoading: true, subdistrictSelected: '' } }
    }

    case TYPES.FETCH_SUB_DISTRICT_COMPLETE: {
      const { subdistricts } = action.payload

      return { ...state, ...{ subdistricts, subdistrictsLoading: false } }
    }

    case TYPES.FETCH_SUB_DISTRICT_FAILED: {
      return { ...state, ...{ subdistricts: [], subdistrictsLoading: false } }
    }

    default:
      return state
  }
}

export default reducer
