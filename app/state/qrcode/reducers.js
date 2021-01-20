import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  loading: false,
  otpComplete: null,
  otpError: null,
  activeComplete: null,
  activeError: null,
  changePinComplete: null,
  changePinError: null,
  parseQrCodeResult: null,
  parseQrCodeError: null,
  promotionCodeResult: null,
  promotionCodeError: null,
  sendOtpResult: null,
  sendOtpError: null,
  completeRechargeResult: null,
  completeRechargeError: null,
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
      return { ...action.payload, loading: false }
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
    case types.PARSE_QRCODE_COMPLETED:
      return { ...state, parseQrCodeResult: action.payload }
    case types.PARSE_QRCODE_FAILED:
      return { ...state, parseQrCodeError: action.payload }
    case types.CHECK_PROMOTION_CODE_COMPLETED:
      return { ...state, promotionCodeResult: action.payload }
    case types.CHECK_PROMOTION_CODE_FAILED:
      return { ...state, promotionCodeError: action.payload }
    case types.QRCODE_SEND_OTP_COMPLETED:
      return { ...state, sendOtpResult: action.payload }
    case types.QRCODE_SEND_OTP_FAILED:
      return { ...state, sendOtpError: action.payload }
    case types.COMPLETE_QR_RECHARGE_COMPLETED:
      return { ...state, completeRechargeResult: action.payload }
    case types.COMPLETE_QR_RECHARGE_FAILED:
      return { ...state, completeRechargeError: action.payload }
    case types.RESET: {
      return initialState
    }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
