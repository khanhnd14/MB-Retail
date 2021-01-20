import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  listStock: [],
  benefitAcc: null,
  benefitAccError: null,
  otpDataComplete: null,
  otpDataEror: null,
  transferComplete: null,
  transferError: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_LIST_STOCK_COMPLETED:
      return { ...state, listStock: action.payload }
    case types.GET_BENEFIT_STOCK_COMPLETED:
      return { ...state, benefitAcc: action.payload }
    case types.GET_BENEFIT_STOCK_FAILED:
      return { ...state, benefitAccError: action.payload }
    case types.GET_OTP_TRANSFER_COMPLETED:
      return { ...state, otpDataComplete: action.payload }
    case types.GET_OTP_TRANSFER_FAILED:
      return { ...state, otpDataEror: action.payload }
    case types.TRANSFER_COMPLETED:
      return { ...state, transferComplete: action.payload }
    case types.TRANSFER_FAILED:
      return { ...state, transferError: action.payload }
    case types.RESET:
      return initialState
    case appTypes.REACTIVE:
      return initialState

    default:
      return state
  }
}
