import _ from 'lodash'
import * as types from './types'
import { appTypes } from '../application'

const initialState = {
  creationInfo: null,
  listTCType: null,
  getPaymentAccount: null,
  purposeList: null,
  sendOTPRegister: null,
  sendOTPRegisterError: null,
  sendOTPOnly:null,
  sendOTPOnlyError:null,
  completeRegister: null,
  completeRegisterError: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.COMPLETE_REGISTER_COMPLETED:
      return {
        ...state,
        completeRegister: action.payload,
        completeRegisterError: null
      }
    case types.COMPLETE_REGISTER_FAILED:
      return {
        ...state,
        completeRegister: null,
        completeRegisterError: action.payload
      }
    case types.SEND_OTP_ONLY_COMPLETED:
      return {
        ...state,
        sendOTPOnly: action.payload,
        sendOTPOnlyError: null
      }
    case types.SEND_OTP_ONLY_FAILED:
      return {
        ...state,
        sendOTPOnly: null,
        sendOTPOnlyError: action.payload
      }
    case types.SEND_OTP_REGISTER_COMPLETED:
      return {
        ...state,
        sendOTPRegister: action.payload,
        sendOTPRegisterError: null
      }
    case types.SEND_OTP_REGISTER_FAILED:
      return {
        ...state,
        sendOTPRegister: null,
        sendOTPRegisterError: action.payload
      }
    case types.CREATION_INFO_COMPLETED:
      return {
        ...state,
        creationInfo: action.payload
      }
    case types.LIST_TC_TYPE_COMPLETED:
      return {
        ...state,
        listTCType: action.payload
      }
    case types.GET_PAYMENT_ACCOUNT_COMPLETED:
      return {
        ...state,
        getPaymentAccount: action.payload
      }
    case types.PURPOSE_LIST_COMPLETED:
      return {
        ...state,
        purposeList: action.payload
      }
    case types.CREATION_INFO_FAILED:
      return {
        ...state,
        creationInfo: null
      }
    case types.LIST_TC_TYPE_FAILED:
      return {
        ...state,
        listTCType: null
      }
    case types.GET_PAYMENT_ACCOUNT_FAILED:
      return {
        ...state,
        getPaymentAccount: null
      }
    case types.PURPOSE_LIST_FAILED:
      return {
        ...state,
        purposeList: null
      }
    case appTypes.REACTIVE:
      return initialState
    case appTypes.COMPLETE_TRANSACTION:
        return initialState
    default:
      return state
  }
}
