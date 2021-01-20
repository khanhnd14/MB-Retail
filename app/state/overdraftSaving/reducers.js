import _ from 'lodash'
import * as types from './types'
import { appTypes } from '../application'

const initialState = {
  creationInfo: null,
  listTCType:null,
  getPaymentAccount:null,
  purposeList:null,
  sendOTPRegister:null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SEND_OTP_REGISTER_COMPLETED:
      return {
        ...state,
        sendOTPRegister: action.payload
      }
    case types.SEND_OTP_REGISTER_FAILED:
      return {
        ...state,
        sendOTPRegister: action.payload
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
    default:
      return state
  }
}
