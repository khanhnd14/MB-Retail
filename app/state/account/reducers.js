import * as types from './types'
import * as saveTypes from '../save/types'
import { appTypes } from '../application'

const initialState = {
  accountPayment: [],
  accountCredit: [],
  cardList: [],
  cardListFull: [],
  cardChangeComplete: null,
  cardChangeError: null,
  transactionAccount: null,
  transAccountComplete: null,
  sendOtpActiveCard: null,
  completeActiveCard: null,
  errorActiveCard: null,
  accountSave: [],
  loadingHistoryExchange: false,
  historyExchange: [],
  historySearch: [],
  errorGetAccount: null,
  totalPaidAmount: null,
  loading: false,
  currentAccountSelected: null,
  inputAmountPay: null,
  currentContractNumber: null,
  cardPrePayApi: null,
  payApiCompleted: null,
  payApiFailed: null,
  dataCheckCardName: null,
  errorCheckCardName: null,
  historyCreditCard: [],
  historyCreditCardError: null,
  resultInvestigation: null,
  errorInvestigation: null,

  caSaDetailResult: null,
  caSaDetailError: null,

  resultAmountStatus: null,
  errorAmountStatus: null,

  resultRedeemGetUrl: null,
  errorRedeemGetUrl: null,

  transactionAccountActiveCard: null,

}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.GET_ACCOUNT_COMPLETED:
      return {
        ...state,
        accountPayment: action.payload.filter((acc) => acc.acctType === 'CA' || acc.acctType === 'SA'),
        accountCredit: action.payload.filter((acc) => acc.acctType === 'LN'),
      }
    case types.GET_ACCOUNT_FAILED:
      return {
        ...state,
        errorGetAccount: action.payload,
      }
    case types.GET_LIST_SAVE_ACCOUNT_COMPLETED:
      return {
        ...state,
        accountSave: action.payload
      }
    case saveTypes.GET_LIST_SAVE_ACCOUNT_COMPLETED:
      return {
        ...state,
        accountSave: action.payload
      }
    case types.GET_CARD:
      return {
        ...state,
        loading: true
      }
    case types.GET_CARD_COMPLETED:
      return {
        ...state,
        loading: false,
        cardList: action.payload
      }
    case types.GET_CARD_FULL_COMPLETED:
      return {
        ...state,
        loading: false,
        cardListFull: action.payload
      }
      case types.GET_CARD_FULL_FAILED:
        return {
          ...state,
          loading: false,
        }
    case types.CARD_CHANGE_STATUS_COMPLETED:
      return {
        ...state,
        cardChangeComplete: true
      }
    case types.CARD_CHANGE_STATUS_FAILED:
      return {
        ...state,
        cardChangeError: true
      }
    case types.RESET_CARD_CHANGE_STATUS:
      return {
        ...state,
        cardChangeComplete: null,
        cardChangeError: null
      }
    case types.MAKE_TRANSACTION_ACCOUNT_COMPLETED:
      return {
        ...state,
        transactionAccount: action.payload
      }
    case types.MAKE_TRANSACTION_ACCOUNT_ACTIVE_CARD_COMPLETED:
      return {
        ...state,
        transactionAccountActiveCard: action.payload
      }
    case types.SEND_OTP_COMPLETED:
      return {
        ...state,
        transAccountComplete: action.payload
      }
    case types.SEND_OTP_ACTIVE_CARD_COMPLETED:
      return {
        ...state,
        sendOtpActiveCard: action.payload
      }
    case types.CHANGE_STATUS_ACTIVE_CARD_COMPLETED:
      return {
        ...state,
        completeActiveCard: action.payload || true
      }
    case types.CHANGE_STATUS_ACTIVE_CARD_FAILED:
      return {
        ...state,
        errorActiveCard: action.payload
      }
      case types.RESET_CARD_ACTIVE_STATUS:
        return {
          ...state,
          transactionAccount: null,
          transactionAccountActiveCard: null,
          transAccountComplete: null,
          sendOtpActiveCard: null,
          completeActiveCard: null,
          errorActiveCard: null,
        }
    case types.GET_CARD_FAILED:
      return {
        ...state,
        loading: false,
        errorGetAccount: action.payload
      }
    case types.HISTORY_BY_ACCOUNT:
      return {
        ...state,
        loadingHistoryExchange: true,
        historyExchange: [],
      }
    case types.HISTORY_BY_ACCOUNT_COMPLETED:
      return {
        ...state,
        loadingHistoryExchange: false,
        historyExchange: action.payload.history,
        historySearch: action.payload.history
      }
    case types.HISTORY_BY_ACCOUNT_FAILED:
      return {
        ...state,
        loadingHistoryExchange: false,
        historyExchange: [],
        historySearch: []
      }
    case types.GET_CONTRACT_BALANCE_COMPLETED:
      return {
        ...state,
        totalPaidAmount: action.payload
      }
    case types.CARD_PRE_PAY_API:
      return {
        ...state,
        loading: true
      }
    case types.CARD_PRE_PAY_API_COMPLETED:
      return {
        ...state,
        loading: false,
        cardPrePayApi: action.payload
      }
    case types.CARD_PRE_PAY_API_FAILED:
      return {
        ...state,
        loading: false
      }
    case types.SET_ACCOUNT_CARD:
      return {
        ...state,
        totalPaidAmount: null,
        loading: false,
        payApiCompleted: null,
        payApiFailed: null,
        cardPrePayApi: null,
        currentContractNumber: null,
        dataCheckCardName: null,
        errorCheckCardName: null,
        transactionAccountActiveCard: null,
      }
    case types.PASSED_CARD_CURRENT_ACCOUNT_SELECT:
      return {
        ...state,
        currentAccountSelected: action.payload
      }
    case types.PASSED_CARD_CURRENT_CONTRACT_NUMBER:
      return {
        ...state,
        currentContractNumber: action.payload
      }
    case types.PASSED_CARD_INPUT_AMOUNT_PAY:
      return {
        ...state,
        inputAmountPay: action.payload
      }
    case types.CARD_PAY_API:
      return {
        ...state,
        loading: true
      }
    case types.CARD_PAY_API_FAILED:
      return {
        ...state,
        loading: false,
        payApiFailed: action.payload
      }
    case types.CARD_PAY_API_COMPLETED:
      return {
        ...state,
        loading: false,
        payApiCompleted: true
      }
    case types.CHECK_CARD_NAME:
      return {
        ...state,
        loading: true
      }
    case types.CHECK_CARD_NAME_FAILED:
      return {
        ...state,
        loading: false,
        errorCheckCardName: action.payload
      }
    case types.CHECK_CARD_NAME_COMPLETED:
      return {
        ...state,
        loading: false,
        errorCheckCardName: null,
        dataCheckCardName: action.payload
      }
    case types.ADVANCED_SEARCH:
      return {
        ...state,
        loadingHistoryExchange: true
      }
    case types.ADVANCED_SEARCH_COMPLETED:
      return {
        ...state,
        loadingHistoryExchange: false,
        historySearch: action.payload.history
      }
    case types.ADVANCED_SEARCH_FAILED:
      return {
        ...state,
        loadingHistoryExchange: false,
      }
    case types.GET_HISTORY_CREDIT_CARD:
      return {
        ...state,
        loading: true,
      }
    case types.GET_HISTORY_CREDIT_CARD_COMPLETED:
      return {
        ...state,
        loading: false,
        historyCreditCard: action.payload.history
      }
    case types.GET_HISTORY_CREDIT_CARD_FAILED:
      return {
        ...state,
        loading: false,
        historyCreditCard: [],
        historyCreditCardError: action.payload
      }
    case types.ACCOUNT_INVESTIGATION_COMPLETED:
      return {
        ...state,
        resultInvestigation: 1
      }
    case types.ACCOUNT_INVESTIGATION_FAILED:
      return {
        ...state,
        errorInvestigation: 1
      }
    case types.RESET_ACCOUNT_INVESTIGATION: {
      return {
        ...state,
        resultInvestigation: null,
        errorInvestigation: null
      }
    }
    case types.GET_CA_SA_DETAIL:
      return {
        ...state,
      }
    case types.GET_CA_SA_DETAIL_COMPLETED:
      return {
        ...state,
        caSaDetailResult: action.payload
      }
    case types.GET_CA_SA_DETAIL_FAILED:
      return {
        ...state,
        caSaDetailError: action.payload
      }
    case types.GET_AMOUNT_STATUS_COMPLETED:
      return {
        ...state,
        resultAmountStatus: action.payload,
      }
    case types.GET_AMOUNT_STATUS_FAILED:
      return {
        ...state,
        errorAmountStatus: action.payload
      }
    case types.REDEEM_GET_URL_COMPLETED:
      return {
        ...state,
        resultRedeemGetUrl: action.payload,
      }
    case types.REDEEM_GET_URL_FAILED:
      return {
        ...state,
        errorRedeemGetUrl: action.payload
      }
    case appTypes.REACTIVE:
      return initialState
      case types.RESET_STORE: {
      return {
        ...initialState
      }
    }
    default:
      return state
  }
}
