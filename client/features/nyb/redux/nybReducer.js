import { find, result } from 'lodash'
import { 
  CALCULATE_NYB,
  CALCULATE_NYB_CHECKOUT_STEP_1,
  CALCULATE_NYB_CHECKOUT_STEP_2,
  HANDLE_NYB_CHECKOUT_MODAL_ERROR,
  HANDLE_NORMAL_CHECKOUT_MODAL_ERROR,
  FETCH_DISCOUNT_TYPE,
} from './nybActionTypes'
import { reducerCreator } from '../../../utils/reducerCreator';
import { NYB as Model } from '../models/NYB'

export const initialState = {
  isFetching: false,
  isReload: true,
  error: '',
  data: Model.set(),
  isModalNormal: false,
  isModalNYB: false,
  voucher: 0,
  voucherError: '',
  voucherLoading: false,
  voucherForm: {
    discountType: '',
    issue: 'other',
  },
  discountTypeLoading: false,
  discountType: [],
  discountTypeError: '',
}

export const nybReducer = (state = initialState, action) => {
  // Action
  const { type } = action
  // Action Creators
  const {
    setState,
    setStateRequest,
    setStateSuccess,
    setStateFailure,
    errorMessage,
  } = reducerCreator(state, action)
  // Switch Case
  switch (type) {
    case CALCULATE_NYB.REQUEST:
      return setStateRequest()
    case CALCULATE_NYB.SUCCESS:
      return setStateSuccess({ data: Model.set(action.data) })
    case CALCULATE_NYB.FAILURE:
      return setStateFailure()
    case HANDLE_NYB_CHECKOUT_MODAL_ERROR:
      return setState({ isModalNYB: action.visible }) 
    case HANDLE_NORMAL_CHECKOUT_MODAL_ERROR:
      return setState({ isModalNormal: action.visible })
    case CALCULATE_NYB_CHECKOUT_STEP_1.REQUEST:
      return setState({ 
        voucherLoading: true, 
        voucherError: '',
        voucherForm: {
          ...state.voucherForm,
          discountType: action.discountType,
        }
      })
    case CALCULATE_NYB_CHECKOUT_STEP_1.SUCCESS:
      return setState({ 
        voucherLoading: false,
        voucher: action.data.voucher, 
        voucherError: '',
      })
    case CALCULATE_NYB_CHECKOUT_STEP_1.FAILURE:
      return setState({ 
        voucherError: errorMessage(), 
        voucherLoading: false,
        voucher: 0,
      })
    case CALCULATE_NYB_CHECKOUT_STEP_2.REQUEST:
      return setState({ 
        voucherLoading: true, 
        voucherError: '',
        voucherForm: {
          ...state.voucherForm,
          issue: action.issue 
        }
      })
    case CALCULATE_NYB_CHECKOUT_STEP_2.SUCCESS:
      return setState({
        voucherLoading: false,
        voucher: action.data.voucher, 
        voucherError: '',
      })
    case CALCULATE_NYB_CHECKOUT_STEP_2.FAILURE:
      return setState({ 
        voucherError: errorMessage(),
        voucher: 0,
        voucherLoading: false 
      })
    case FETCH_DISCOUNT_TYPE.REQUEST:
      return setState({
        discountTypeLoading: true,
        discountTypeError: '',
        discountType: [],
        voucherForm: initialState.voucherForm,
        voucher: 0,
      })
    case FETCH_DISCOUNT_TYPE.SUCCESS:
      return setState({
        discountType: action.data,
        discountTypeLoading: false,
        discountTypeError: '',
        voucherForm: {
          ...state.voucherForm,
          discountType: result(find(action.data, item => item.selected), 'type', '')
        }
      })
    case FETCH_DISCOUNT_TYPE.FAILURE:
      return setState({
        discountTypeLoading: false,
        discountTypeError: errorMessage(),
      })
    default:
      return state
  }
}
