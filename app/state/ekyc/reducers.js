import * as types from './types'

const initialState = {
  dataOtpVerify: null,
  loading: false,
  errorOtpVerify: null,

  dataOtpVerified: null,
  errorOtpVerified: null,

  resultTsToken: null,
  errorTsToken: null,

  resultCheckID: null,
  errorCheckID: null,
  resultEkycSdk: null,
  errorEkycSdk: null,

  resultSaveLog: null,
  errorSaveLog: null,

  resultVerifyCustomer: null,
  errorVerifyCustomer: null,

  formAdditionInfo: null,
  resultAdditionInfo: null,
  errorAdditionInfo: null,

  resultCheckUsername: null,
  errorCheckUsername: null,

  resultDistrict: null,
  errorDistrict: null,

  resultSubBranch: null,
  errorSubBranch: null,
  choiceBranch: null,
  choiceCombo: null,

  formRegister: null,
  resultRegister: null,
  errorRegister: null,

  resultActiveKyc: null,
  errorActiveKyc: null,

  requestIdDetail: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.EKYC_SEND_OTP:
      return {
        ...state,
        loading: true,
      }
    case types.EKYC_SEND_OTP_COMPLETED:
      return {
        ...state,
        dataOtpVerify: action.payload,
        loading: false,
      }
    case types.EKYC_SEND_OTP_FAILED:
      return {
        ...state,
        errorOtpVerify: action.payload,
        loading: false,
      }
    case types.EKYC_VERIFY_OTP:
      return {
        ...state,
        loading: true,
      }
    case types.EKYC_VERIFY_OTP_COMPLETED:
      return {
        ...state,
        dataOtpVerified: action.payload,
        loading: false,
      }
    case types.EKYC_VERIFY_OTP_FAILED:
      return {
        ...state,
        errorOtpVerified: action.payload,
        loading: false,
      }
    case types.GET_TS_TOKEN_COMPLETED:
      return {
        ...state,
        resultTsToken: action.payload,
        loading: false,
      }
    case types.GET_TS_TOKEN_FAILED:
      return {
        ...state,
        errorTsToken: action.payload,
        loading: false,
      }
    case types.EKYC_CHECK_ID:
      return {
        ...state,
        loading: true,
      }
    case types.EKYC_CHECK_ID_COMPLETED:
      return {
        ...state,
        resultCheckID: action.payload,
        loading: false,
      }
    case types.EKYC_CHECK_ID_FAILED:
      return {
        ...state,
        errorCheckID: action.payload,
        loading: false,
      }
    case types.SAVE_LOG:
      return {
        ...state,
        errorEkycSdk: action.meta.body.errorCode,
        resultSaveLog: null,
      }
    case types.SAVE_LOG_COMPLETED:
      return {
        ...state,
        resultSaveLog: !action.meta.body.errorCode,
      }
    case types.SAVE_LOG_FAILED:
      return {
        ...state,
        errorSaveLog: false,
      }
    case types.EKYC_RESULT_SDK:
      return {
        ...state,
        resultEkycSdk: action.payload,
      }
    case types.VERIFY_CUSTOMER_INFO:
      return {
        ...state,
        loading: true,
      }
    case types.VERIFY_CUSTOMER_INFO_COMPLETED:
      return {
        ...state,
        resultVerifyCustomer: action.payload,
        loading: false,
      }
    case types.VERIFY_CUSTOMER_INFO_FAILED:
      return {
        ...state,
        errorVerifyCustomer: action.payload,
        loading: false,
      }
    case types.CHECK_USER_NAME:
      return {
        ...state,
        loading: true,
        resultCheckUsername: null,
        errorCheckUsername: null,
      }
    case types.CHECK_USER_NAME_COMPLETED:
      return {
        ...state,
        resultCheckUsername: action.payload || true,
        loading: false,
      }
    case types.CHECK_USER_NAME_FAILED:
      return {
        ...state,
        errorCheckUsername: action.payload || true,
        loading: false,
      }
    case types.RESET_CHECK_USERNAME:
      return {
        ...state,
        resultCheckUsername: null,
        errorCheckUsername: null,
      }
    case types.SAVE_ADDITION_INFO:
      console.log('====================================')
      console.log(action.payload)
      console.log('====================================')
      return {
        ...state,
        formAdditionInfo: action.meta.body,
        loading: true,
      }
    case types.SAVE_ADDITION_INFO_COMPLETED:
      return {
        ...state,
        resultAdditionInfo: action.payload,
        loading: false,
      }
    case types.SAVE_ADDITION_INFO_FAILED:
      return {
        ...state,
        errorAdditionInfo: action.payload,
        loading: false,
      }
    case types.GET_DISTRICT_COMPLETED:
      return {
        ...state,
        resultDistrict: action.payload,
        loading: false,
      }
    case types.GET_DISTRICT_FAILED:
      return {
        ...state,
        errorDistrict: action.payload,
        loading: false,
      }
    case types.GET_SUB_BRANCH_COMPLETED:
      return {
        ...state,
        resultSubBranch: action.payload,
        loading: false,
      }
    case types.GET_SUB_BRANCH_FAILED:
      return {
        ...state,
        errorSubBranch: action.payload,
        loading: false,
      }
    case types.CHOICE_BRANCH:
      return {
        ...state,
        choiceBranch: action.payload,
      }
    case types.CHOICE_COMBO:
      return {
        ...state,
        choiceCombo: action.payload,
      }
    case types.SEND_REGISTER:
      return {
        ...state,
        formRegister: action.meta.body,
        loading: true,
      }
    case types.SEND_REGISTER_COMPLETED:
      return {
        ...state,
        resultRegister: action.payload,
        loading: false,
      }
    case types.SEND_REGISTER_FAILED:
      return {
        ...state,
        errorRegister: action.payload,
        loading: false,
      }
    case types.ACTIVE_EKYC:
      return {
        ...state,
        loading: true,
      }
    case types.ACTIVE_EKYC_COMPLETED:
      return {
        ...state,
        resultActiveKyc: action.payload,
        loading: false,
      }
    case types.ACTIVE_EKYC_FAILED:
      return {
        ...state,
        errorActiveKyc: action.payload,
        loading: false,
      }
    case types.UPDATE_REQUEST_ID:
      return {
        ...state,
        requestIdDetail: action.payload,
      }
    case types.RE_ACTIVE:
      return initialState
    default:
      return state
  }
}
