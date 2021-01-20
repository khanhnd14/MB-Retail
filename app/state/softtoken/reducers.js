import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  info: null,
  loading: false,
  otpComplete: null,
  otpError: null,
  activeComplete: null,
  activeError: null,
  changePinComplete: null,
  changePinError: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_INFO:
      return {
        ...state,
        loading: true,
      }
    case types.GET_INFO_FAILED:
      return {
        ...state,
        loading: false,
      }
    case types.GET_INFO_COMPLETED:
      return { info: action.payload, loading: false }
    case types.SEND_OTP_COMPLETED:
      return { ...state, otpComplete: action.payload }
    case types.SEND_OTP_FAILED:
      return { ...state, otpError: action.payload }
    case types.ACTIVE_COMPLETED:
      return { ...state, activeComplete: action.payload }
    case types.ACTIVE_FAILED:
      return { ...state, activeError: action.payload }
    case types.CHANGE_PIN_COMPLETED:
      return { ...state, changePinComplete: {} }
    case types.CHANGE_PIN_FAILED:
      return { ...state, changePinError: action.payload }

    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
