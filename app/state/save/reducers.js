import _ from 'lodash'
import * as types from './types'
import * as accountTypes from '../account/types'

const initialState = {
  terms: [
  ],
  account: [],
  categories: [],
  rate: 0,
  loadingRate: false,
  savingResult: undefined,
  errorSavingResult: undefined,
  savingOnlineAccounts: [],
  savingLocalizeAccounts: [],
  loadingCreateSaving: false,

  dataFinalization: undefined,
  resultFinalization: undefined,
  loadingFinlization: false,

  resultVerifyOtpFinlization: undefined,
  resultVerifyOtpFinlizationError: undefined,
  resultChangeAliasName: types.RESULT_TYPE.INIT,

  resultCompleteSaving: undefined,
  errorCompleteSaving: undefined,

  resultCheckHoliday: undefined,
  errorCheckHoliday: undefined,

  resultCreateCAtoFD: undefined,
  errorCreateCAtoFD: undefined,

  resultCompleteCAtoFD: undefined,
  errorCompleteCAtoFD: undefined,

  schedule: null

}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_ACCOUNT_COMPLETED:
      return {
        ...state,
        account: [...action.payload]
      }
    case types.GET_PRODUCT_TYPE_COMPLETED:
      return {
        ...state,
        terms: [...action.payload.data]
      }
    case types.GET_CATEGORY_COMPLETED:
      return {
        ...state,
        categories: [...action.payload]
      }
      case types.GET_SAVING_RATE:
        return {
          ...state,
          loadingRate: true
        }
      case types.GET_SAVING_RATE_COMPLETED:
        return {
          ...state,
          rate: action.payload.rate,
          loadingRate: false
        }
      case types.GET_SAVING_RATE_FAILED:
        return {
          ...state,
          errorSavingResult: action.payload,
          loadingRate: false
        }
      case types.CREATE_SAVING:
        return {
          ...state,
          loadingCreateSaving: true
        }
      case types.CREATE_SAVING_COMPLETED:
        return {
          ...state,
          savingResult: action.payload,
          loadingCreateSaving: false
        }
      case types.CREATE_SAVING_FAILED:
      return {
        ...state,
        errorSavingResult: action.payload,
        loadingCreateSaving: false
      }
      case types.GET_LIST_SAVE_ACCOUNT:
        return {
          ...state,
          loadingCreateSaving: true
        }
      case types.GET_LIST_SAVE_ACCOUNT_COMPLETED:
      case accountTypes.GET_LIST_SAVE_ACCOUNT_COMPLETED: {
        const savingLocalizeAccounts = action.payload.filter((acc) => acc.category === 'TQ')
        return {
          ...state,
          savingOnlineAccounts: _.difference(action.payload, savingLocalizeAccounts),
          savingLocalizeAccounts,
          loadingCreateSaving: false
        }
      }
      case types.GET_LIST_SAVE_ACCOUNT_FAILED: {
        return {
          ...state,
          errorSavingResult: action.payload,
          loadingCreateSaving: false
        }
      }
      case types.CREATE_FINALIZATION:
        return {
          ...state,
          loadingFinlization: true
        }
      case types.SAVE_DATA_FINALIZATION:
        return {
          ...state,
          dataFinalization: action.payload,
        }
      case types.CREATE_FINALIZATION_COMPLETED:
        return {
          ...state,
          resultFinalization: action.payload,
          loadingFinlization: false
        }
      case types.CREATE_FINALIZATION_FAILED:
        return {
          ...state,
          loadingFinlization: false,
          errorSavingResult: action.payload,
        }
      case types.VERIFY_OTP_FINALIZATION_COMPLETED:
      return {
        ...state,
        resultVerifyOtpFinlization: action.payload,
      }
      case types.VERIFY_OTP_FINALIZATION_FAILED:
      return {
        ...state,
        resultVerifyOtpFinlizationError: action.payload,
      }
      case types.SAVE_CHANGE_ALIAS_NAME_COMPLETED:
      return {
        ...state,
        resultChangeAliasName: types.RESULT_TYPE.SUCCESS,
      }
      case types.SAVE_CHANGE_ALIAS_NAME_FAILED:
        return {
          ...state,
          resultChangeAliasName: types.RESULT_TYPE.FAIL,
        }
      case types.COMPLETE_SAVING_ONLINE:
        return {
          ...state,
          loadingCreateSaving: true
        }
      case types.COMPLETE_SAVING_ONLINE_COMPLETED:
        return {
          ...state,
          resultCompleteSaving: action.payload,
          loadingCreateSaving: false
        }
      case types.COMPLETE_SAVING_ONLINE_FAILED:
        return {
          ...state,
          errorCompleteSaving: action.payload,
          loadingCreateSaving: false
        }
        case types.CHECK_HOLIDAY:
        return {
          ...state,
          resultCheckHoliday: undefined,
          errorCheckHoliday: undefined,
        }
      case types.CHECK_HOLIDAY_COMPLETED:
        return {
          ...state,
          resultCheckHoliday: true
        }
      case types.CHECK_HOLIDAY_FAILED:
        return {
          ...state,
          errorCheckHoliday: true,
        }
      case types.RESET_HOLIDAY:
        return {
          ...state,
          resultCheckHoliday: undefined,
          errorCheckHoliday: undefined,
        }
      case types.SAVING_CREATE_CA_FD_COMPLETED:
        return {
          ...state,
          resultCreateCAtoFD: action.payload
        }
      case types.SAVING_CREATE_CA_FD_FAILED:
        return {
          ...state,
          errorCreateCAtoFD: action.payload,
        }
      case types.RESET_CA_FD_FAILED:
        return {
          ...state,
          errorCreateCAtoFD: undefined,
          resultCreateCAtoFD: undefined
        }
      case types.SAVING_COMPLETE_CA_FD_COMPLETED:
        return {
          ...state,
          resultCompleteCAtoFD: true,
        }
      case types.SAVING_COMPLETE_CA_FD_FAILED:
        return {
          ...state,
          errorCompleteCAtoFD: true,
        }
      case types.DISPATCH_SCHEDULE:
        return {
          ...state,
          schedule: action.payload
        }

      case types.RESET_STORE:
        return {
          ...state,
          rate: 0,
          errorSavingResult: undefined,
          loadingRate: false,
          savingResult: undefined,
          resultFinalization: undefined,
          resultVerifyOtpFinlization: undefined,
          resultChangeAliasName: types.RESULT_TYPE.INIT,
          resultCompleteSaving: undefined,
          errorCompleteSaving: undefined,
          resultCheckHoliday: undefined,
          errorCheckHoliday: undefined,
          errorCreateCAtoFD: undefined,
          resultCreateCAtoFD: undefined,
          resultCompleteCAtoFD: undefined,
          errorCompleteCAtoFD: undefined
        }

    default:
      return state
  }
}
