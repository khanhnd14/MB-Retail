import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  rolloutAcc: [],
  info: null,
  isInfoComplete: false,
  inforError: null,
  otpComplete: null,
  otpError: null,
  activeComplete: null,
  activeError: null,
  balance: 0,
  transferComplete: null,
  transferError: null,
  isGetInfo: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_ACC_COMPLETED:
      return { ...state, rolloutAcc: action.payload }
    case types.GET_INFO:
      return { isInfoComplete: false }
    case types.GET_INFO_COMPLETED:
      return { info: action.payload, isInfoComplete: true }
    case types.GET_INFO_FAILED:
      return { inforError: action.payload, isInfoComplete: true }
    case types.SEND_OTP_COMPLETED:
      return { ...state, otpComplete: action.payload }
    case types.SEND_OTP_FAILED:
      return { ...state, otpError: action.payload }
    case types.ACTIVE_COMPLETED:
      return { ...state, activeComplete: action.payload }
    case types.ACTIVE_FAILED:
      return { ...state, activeError: action.payload }
    case types.GET_BALANCE_COMPLETED:
      return { ...state, balance: action.payload }
      case types.TRANSFER_COMPLETED:
        return { ...state, transferComplete: action.payload }
      case types.TRANSFER_FAILED:
        return { ...state, transferError: action.payload }

        case types.DEREGISTER:
          return { ...state,isInfoComplete: false }
        case types.DEREGISTER_COMPLETED:
          return { ...initialState, isInfoComplete: true }
        case types.DEREGISTER_FAILED:
          return { ...state, isInfoComplete: true }

    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
