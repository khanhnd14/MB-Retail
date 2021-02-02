import * as types from './types'
import * as appTypes from '../application/types'
import * as userTypes from '../user/types'

const initialState = {
  securityList: [],
  otpVerifyComplete: null,
  otpVerifyError: null,
  activeVerifyComplete: null,
  activeVerifyError: null,
  limitDataComplete: [],
  limitDataError: null,
  accountComplete: [],
  accountError: null,
  validLimitComplete: null,
  validLimitError: null,
  setLimitComplete: null,
  setLimitError: null,
  // changepass
  makeTransactionComplete: null,
  makeTransactionError: null,
  sendOtpComplete: null,
  sendOtpError: null,
  changePassComplete: null,
  changePassError: null,
  // setup pin
  setupPinComplete: null,
  setupPinError: null,
  // change securitytype
  changeSecurity: null,
  changeSecurityError: null,

  loadingOffSms: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_SEC_LIST_COMPLETED:
      return { ...state, securityList: action.payload }
    case types.SEND_OTP_VERIFY_COMPLETED:
      return { ...state, otpVerifyComplete: action.payload }
    case types.SEND_OTP_VERIFY_FAILED:
      return { ...state, otpVerifyError: action.payload }
    case types.ACTIVE_FP_VERIFY_COMPLETED:
      return {
        ...state,
        activeVerifyComplete: action.payload,
        otpVerifyComplete: null,
        otpVerifyError: null,
      }
    case types.ACTIVE_FP_VERIFY_FAILED:
      return {
        ...state,
        activeVerifyError: action.payload,
        otpVerifyComplete: null,
        otpVerifyError: null,
      }
    case types.GET_LIMIT_TRANSACTION_COMPLETED:
      return {
        ...state,
        limitDataComplete: action.payload,
      }
    case types.GET_LIMIT_TRANSACTION_FAILED:
      return {
        ...state,
        limitDataError: action.payload,
      }
    case types.GET_ACCOUNT_COMPLETED:
      return {
        ...state,
        accountComplete: action.payload,
      }
    case types.GET_ACCOUNT_FAILED:
      return {
        ...state,
        accountError: action.payload,
      }
    case types.SET_LIMIT_TRANSACTION_COMPLETED:
      return {
        ...state,
        setLimitComplete: {},
      }
    case types.VALID_LIMIT_TRANSACTION_COMPLETED:
      return {
        ...state,
        validLimitComplete: {},
      }
    case types.SET_LIMIT_TRANSACTION_FAILED:
      return {
        ...state,
        setLimitError: action.payload,
      }
    case types.VALID_LIMIT_TRANSACTION_FAILED:
      return {
        ...state,
        validLimitError: action.payload,
      }
    case types.MAKE_TRANSACTION_COMPLETED:
      return {
        ...state,
        makeTransactionComplete: action.payload,
      }
    case types.MAKE_TRANSACTION_FAILED:
      return {
        ...state,
        makeTransactionError: action.payload,
      }
    case types.SEND_OTP_COMPLETED:
      return {
        ...state,
        sendOtpComplete: action.payload,
      }
    case types.SEND_OTP_FAILED:
      return {
        ...state,
        sendOtpError: action.payload,
      }
    case types.CHANGE_PASS:
      return {
        ...state,
        changePassComplete: null,
        changePassError: null,
      }
    case types.CHANGE_PASS_COMPLETED:
      return {
        ...state,
        changePassComplete: true,
      }
    case types.CHANGE_PASS_FAILED:
      return {
        ...state,
        changePassError: action.payload,
      }
    case types.SETUP_PIN:
      return {
        ...state,
        setupPinComplete: null,
      }
    case types.SETUP_PIN_COMPLETED:
      return {
        ...state,
        setupPinComplete: true,
      }
    case types.SETUP_PIN_FAILED:
      return {
        ...state,
        setupPinError: action.payload,
      }
    case types.CHANGE_SECURITY_TYPE:
      return {
        ...state,
        changeSecurity: null,
        changeSecurityError: null,
        makeTransactionComplete: null,
        makeTransactionError: null,
        sendOtpComplete: null,
        sendOtpError: null,
      }
    case types.CHANGE_SECURITY_TYPE_COMPLETED:
      return {
        ...state,
        changeSecurity: true,
      }
    case types.CHANGE_SECURITY_TYPE_FAILED:
      return {
        ...state,
        changeSecurityError: action.payload,
      }
    case userTypes.CHANGE_NOTIFY_STATUS_COMPLETED:
      return {
        ...state,
        isOpenSMS: action.meta.body.isOn === true ? 'Y' : 'N',
        loadingOffSms: false,
      }
    case userTypes.CHANGE_NOTIFY_STATUS_FAILED:
      return {
        ...state,
        loadingOffSms: false,
      }
    case userTypes.CHANGE_NOTIFY_STATUS:
      return {
        ...state,
        loadingOffSms: true,
      }

    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
