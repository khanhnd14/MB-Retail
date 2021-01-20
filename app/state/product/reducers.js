import * as types from './types'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import { appTypes } from '../application'

const initialState = {
  loading: false,
  otpLoading: false,
  servicesList: [],
  account: [],
  checkBill: undefined,
  checkPayBill: undefined,
  completedOtp: undefined,
  completedOtpRecharge: undefined,
  successOtpRecharge: undefined,
  errorOtpRecharge: '',
  errorSendOtpRecharge: '',
  errorCheckBill: '',
  errorCompletedOtp: '',
  dataHistoryBillPayment: undefined,
  benefitNameApiCard: undefined,
  dataQueryScheduleBill: undefined,
  dataQueryScheduleHistory: undefined,
  rechargeAmount: [
    { label: '10,000 VND', value: 10000 },
    { label: '20,000 VND', value: 20000 },
    { label: '50,000 VND', value: 50000 },
    { label: '100,000 VND', value: 100000 },
    { label: '200,000 VND', value: 200000 },
    { label: '300,000 VND', value: 300000 },
    { label: '500,000 VND', value: 500000 },
  ],
  serviceGameProvider: [
    { label: '@point Playpark-asiasoft', value: '502' },
    { label: '@point Tam Quoc Chi-asiasoft', value: '6' },
    { label: 'Bac - Fpto', value: '2' },
    { label: 'Mcash', value: '501' },
    { label: 'Oncash - Net2e', value: '3' },
    { label: 'Vcoin - Vtco', value: '4' },
    { label: 'Zingxu - Vinagame', value: '5' },
  ],
  serviceProvider: [
    { label: 'Vietnam mobile', value: 'VNM' },
    { label: 'Mobiphone', value: 'VMS' },
    { label: 'Vinaphone', value: 'VNP' },
    { label: 'Viettel', value: 'VTT' },
  ],
  rechargeLimit: [
    { label: '1 lần', value: 1 },
    { label: '2 lần', value: 2 },
    { label: '3 lần', value: 3 },
    { label: '4 lần', value: 4 },
  ],
  isNow: false,
  tranLimit: undefined,
  dateRechargeMobile: undefined,

  prepaidCardResult: null,
  prepaidCardError: null,
  resultDeleteService: null,
  errorDeleteService: null,

  makeTransactionResult: null,
  makeTransactionError: null,

  sendOtpBillingResult: null,
  sendOtpBillingError: null,

  deleteAutoBillingResult: null,
  deleteAutoBillingError: null,

}
export default function (state = initialState, action) {
  switch (action.type) {
    case types.GET_SERVICE_LIST_COMPLETED:
      return {
        ...state,
        servicesList: [...action.payload],
      }
    case types.GET_SERVICE_LIST_TC_COMPLETED:
      return {
        ...state,
        serviceProvider: [...action.payload],
      }
    case types.GET_ACCOUNT_COMPLETED:
      return {
        ...state,
        account: [...action.payload],
      }
    case types.GET_CHECK_BILL:
      return {
        ...state,
      }
    case types.GET_CHECK_BILL_COMPLETED:
      return {
        ...state,
        checkBill: [...action.payload],
        errorCheckBill: '',
        loading: false
      }
    case types.GET_CHECK_BILL_FAILED:
      return {
        ...state,
        checkBill: null,
        errorCheckBill: action.payload,
        loading: false
      }
    case types.CHECK_PAY_BILL:
      return {
        ...state,
        loading: true
      }
    case types.CHECK_PAY_BILL_COMPLETED:
      return {
        ...state,
        checkPayBill: { ...action.payload },
        loading: false
      }
    case types.CHECK_PAY_BILL_FAILED:
      return {
        ...state,
        loading: false
      }
    case types.SET_CHECK_BILL:
      return {
        ...state,
        checkBill: undefined,
        errorCheckBill: '',
      }
    case types.SEND_OTP:
      return {
        ...state,
        loading: true
      }
    case types.SEND_OTP_COMPLETED:
      return {
        ...state,
        completedOtp: { ...action.payload },
        loading: false
      }
    case types.SEND_OTP_FAILED:
      return {
        ...state,
        errorCompletedOtp: action.payload,
        loading: false
      }
    case types.SEND_OTP_RECHARGE:
      return {
        ...state,
        loading: true
      }
    case types.SEND_OTP_RECHARGE_COMPLETED:
      return {
        ...state,
        completedOtpRecharge: { ...action.payload },
        loading: false
      }
    case types.SEND_OTP_RECHARGE_FAILED:
      return {
        ...state,
        errorOtpRecharge: action.payload,
        loading: false
      }
    case types.COMPLETE_RECHARGE:
      return {
        ...state,
        loading: true
      }
    case types.COMPLETE_RECHARGE_FAILED:
      return {
        ...state,
        loading: false,
        errorSendOtpRecharge: action.payload
      }
    case types.COMPLETE_RECHARGE_COMPLETED:
      return {
        ...state,
        successOtpRecharge: { ...action.payload },
        loading: false
      }
    case types.SEND_OTP_PREPAID_CARD:
      return {
        ...state,
        loading: true
      }
    case types.SEND_OTP_PREPAID_CARD_FAILED:
      return {
        ...state,
        loading: false,
        prepaidCardError: action.payload
      }
    case types.SEND_OTP_PREPAID_CARD_COMPLETED:
      return {
        ...state,
        completedOtpRecharge: { ...action.payload },
        loading: false
      }
    case types.GET_DATA_HISTORY_BILL_PAYMENT:
      return {
        ...state,
      }
    case types.GET_DATA_HISTORY_BILL_PAYMENT_COMPLETED:
      return {
        ...state,
        dataHistoryBillPayment: { ...action.payload },
      }
    case types.GET_DATA_HISTORY_BILL_PAYMENT_FAILED:
      return {
        ...state,
        dataHistoryBillPayment: undefined
      }
    case types.DELETE_HISTORY_SERVICE:
      return {
        ...state,
      }
    case types.DELETE_HISTORY_SERVICE_COMPLETED:
      return {
        ...state,
        resultDeleteService: action.payload
      }
    case types.DELETE_HISTORY_SERVICE_FAILED:
      return {
        ...state,
        errorDeleteService: action.payload
      }
    case types.MAKE_TRANSACTION_BILLING:
      return {
        ...state,
        loading: true
      }
    case types.MAKE_TRANSACTION_BILLING_COMPLETED:
      return {
        ...state,
        loading: false,
        makeTransactionResult: action.payload
      }
    case types.MAKE_TRANSACTION_BILLING_FAILED:
      return {
        ...state,
        loading: false,
        makeTransactionError: action.payload
      }
    case types.SEND_OTP_BILLING:
      return {
        ...state,
      }
    case types.SEND_OTP_BILLING_COMPLETED:
      return {
        ...state,
        sendOtpBillingResult: action.payload
      }
    case types.SEND_OTP_BILLING_FAILED:
      return {
        ...state,
        sendOtpBillingError: action.payload
      }
    case types.DELETE_AUTO_BILLING:
      return {
        ...state,
      }
    case types.DELETE_AUTO_BILLING_COMPLETED:
      return {
        ...state,
        deleteAutoBillingResult: action.payload || true
      }
    case types.DELETE_AUTO_BILLING_FAILED:
      return {
        ...state,
        deleteAutoBillingError: action.payload
      }
    case types.SET_SEND_OTP:
      return {
        ...state,
        completedOtp: undefined,
      }
    case types.SET_SEND_OTP_RECHARGE:
      return {
        ...state,
        completedOtpRecharge: undefined,
        errorSendOtpRecharge: undefined
      }
    case types.SET_COMPLETE_RECHARGE:
      return {
        ...state,
        successOtpRecharge: undefined,
      }
    case types.SET_CHECK_PAY_BILL:
      return {
        ...state,
        checkPayBill: undefined,
        errorCheckBill: ''
      }
    case types.GET_BENEFIT_NAME_API_CARD:
      return {
        ...state,
        loading: true
      }
    case types.GET_BENEFIT_NAME_API_CARD_COMPLETED:
      return {
        ...state,
        benefitNameApiCard: action.payload,
        loading: false
      }
    case types.GET_BENEFIT_NAME_API_CARD_FAILED:
      return {
        ...state,
        loading: false
      }
    case types.GET_DATA_QUERY_SCHEDULE_BILL_COMPLETED:
      return {
        ...state,
        dataQueryScheduleBill: action.payload
      }
    case types.GET_DATA_QUERY_SCHEDULE_HISTORY_COMPLETED:
      return {
        ...state,
        dataQueryScheduleHistory: action.payload
      }
    case types.SET_IS_NOW:
      return {
        ...state,
        ...action.payload
      }
    case types.SET_SCHEDULE_RECHARGE:
      return { ...state, ...action.payload }
    case types.SET_PRODUCT:
      return {
        ...state,
        loading: false,
        otpLoading: false,
        checkBill: undefined,
        checkPayBill: undefined,
        completedOtp: undefined,
        completedOtpRecharge: undefined,
        successOtpRecharge: undefined,
        errorOtpRecharge: '',
        errorSendOtpRecharge: '',
        errorCheckBill: '',
        errorCompletedOtp: '',
        benefitNameApiCard: undefined,
        isNow: false,
        makeTransactionResult: null,
        makeTransactionError: null,

        sendOtpBillingResult: null,
        sendOtpBillingError: null,

        deleteAutoBillingResult: null,
        deleteAutoBillingError: null,
      }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
