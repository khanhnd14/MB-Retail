import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  loading: false,
  otpLoading: false,
  tranId: '',
  isPasswordStrong: '',
  verifyUser: null,
  verifyUserError: null,
  authUser: null,
  authError: null,
  forgotUser: null,
  forgotError: null,
  forgotUserOTP: null,
  forgotErrorOTP: null,
  activeUser: null,
  activeUserError: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:
      return { ...state, loading: true }
    case types.AUTH_USER:
      return { ...state, authUser: null, authError: null }
    case types.LOGIN_COMPLETED:
      return { ...action.payload, loading: false }
    case types.AUTH_USER_COMPLETED:
      return { ...action.payload, authUser: true }
    case types.LOGIN_FAILED:
      return { ...state, loading: false }
    case types.AUTH_USER_FAILED:
      return { ...state, authError: true }
    // case types.ACTIVE:
    //   return { ...state, otpLoading: true }
    case types.ACTIVE_COMPLETED:
      return { ...state, activeUser: action.payload }
    case types.ACTIVE_FAILED:
      return { ...state, activeUserError: action.payload }
    case types.VERIFY_USER_COMPLETED:
      return { ...state, verifyUser: true }
    case types.VERIFY_USER_FAILED:
      return { ...state, verifyUserError: false }

    case types.FORGOT_COMPLETED:
      return { ...state, forgotUser: action.payload }
    case types.FORGOT_FAILED:
      return { ...state, forgotError: action.payload }
    case types.FORGOT_OTP:
      return { ...state, forgotUserOTP: null, forgotErrorOTP: null }
    case types.FORGOT_OTP_COMPLETED:
      return { ...state, forgotUserOTP: true }
    case types.FORGOT_OTP_FAILED:
      return { ...state, forgotErrorOTP: action.payload }

    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
