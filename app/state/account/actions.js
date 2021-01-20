/* eslint-disable no-undef */
import _ from 'lodash'
import moment from 'moment'
import * as types from './types'
import { resourceHttp } from '../../services'
import { Utils } from '../../utilities'

export const getAcountList = () => (dispatch) => {
  dispatch({
    type: types.GET_ACCOUNT,
    meta: {
      ...resourceHttp.accountList,
      body: {
        acctType: "'CA','LN','SA','PPC'",
        status: "'ACTV','DORM','MATU'",
      },
    },
  })
}

export const getCardList = () => (dispatch) => {
  dispatch({
    type: types.GET_CARD,
    meta: {
      ...resourceHttp.cardList,
    },
  })
}

export const getCardListFull = () => (dispatch) => {
  dispatch({
    type: types.GET_CARD_FULL,
    meta: {
      ...resourceHttp.cardFull,
    },
  })
}

export const cardChangeStatus = (body) => (dispatch) => {
  dispatch({
    type: types.CARD_CHANGE_STATUS,
    meta: {
      ...resourceHttp.cardChangeStatus,
      body
    },
  })
}

export const makeTransactionAccount = () => ({
  type: types.MAKE_TRANSACTION_ACCOUNT,
  meta: {
    ...resourceHttp.makerTransaction,
  },
})

export const makeTransactionAccountActiveCard = () => ({
  type: types.MAKE_TRANSACTION_ACCOUNT_ACTIVE_CARD,
  meta: {
    ...resourceHttp.makerTransaction,
  },
})

export const sendOTPActiveCard = (body) => ({
  type: types.SEND_OTP_ACTIVE_CARD,
  meta: {
    ...resourceHttp.sendOTP,
    body
  },
})

export const changeStatusActiveCard = (body) => ({
  type: types.CHANGE_STATUS_ACTIVE_CARD,
  meta: {
    ...resourceHttp.cardChangeStatus,
    body
  },
})

export const sendOtp = (body) => ({
  type: types.SEND_OTP,
  meta: {
    ...resourceHttp.sendOTP,
    body,
  },
})

export const getListSaveAcount = () => (dispatch) => {
  dispatch({
    type: types.GET_LIST_SAVE_ACCOUNT,
    meta: {
      ...resourceHttp.fdAccountList,
    },
  })
}

export const historyByAccount = (transType, fromDate, toDate, fromAmount, toAmount, acctNo, page, queryType) => (dispatch) => {
  let body = {
    transType,
    fromDate,
    toDate,
    fromAmount: `${fromAmount}`,
    toAmount,
    acctNo,
    page,
    queryType
  }
  console.log(body);

  body = _.pickBy(body, _.identity);
  console.log(body);

  dispatch({
    type: types.HISTORY_BY_ACCOUNT,
    meta: {
      ...resourceHttp.historyByAccount,
      body
    }
  })
}

export const historyByLoanAccount = (acctNo, queryType) => (dispatch) => {
  const body = {
    acctNo,
    queryType
  }

  dispatch({
    type: types.HISTORY_BY_ACCOUNT,
    meta: {
      ...resourceHttp.historyByAccount,
      body
    }
  })
}

export const createSettlementOnline = (fdAcc, category, bnfAcc) => (dispatch) => {
  dispatch({
    type: types.HISTORY_BY_ACCOUNT,
    meta: {
      ...resourceHttp.historyByAccount,
      body: {
        fdAcc,
        category,
        bnfAcc,
        isFullSettle: false
      }
    },
  })
}
export const getContractBalance = (contractNumber) => (dispatch) => {
  dispatch({
    type: types.GET_CONTRACT_BALANCE,
    meta: {
      ...resourceHttp.getContractBalance,
      body: {
        contractNumber,
      }
    }
  })
}
export const sendCardPrePayAPI = (body) => (dispatch) => {
  dispatch({
    type: types.CARD_PRE_PAY_API,
    meta: {
      ...resourceHttp.prePayAPI,
      body
    }
  })
}
export const sendCardPayAPI = (body) => (dispatch) => {
  dispatch({
    type: types.CARD_PAY_API,
    meta: {
      ...resourceHttp.payAPI,
      body
    }
  })
}
export const setAccountCard = () => (dispatch) => {
  dispatch({
    type: types.SET_ACCOUNT_CARD,
  })
}
export const passedCardCurrentAccountSelect = (val) => (dispatch) => {
  dispatch({
    type: types.PASSED_CARD_CURRENT_ACCOUNT_SELECT,
    payload: val
  })
}
export const passedCardCurrentContractNumber = (val) => (dispatch) => {
  dispatch({
    type: types.PASSED_CARD_CURRENT_CONTRACT_NUMBER,
    payload: val
  })
}
export const passedCardInputAmountPay = (val) => (dispatch) => {
  dispatch({
    type: types.PASSED_CARD_INPUT_AMOUNT_PAY,
    payload: val
  })
}

export const checkCardName = (body) => (dispatch) => {
  dispatch({
    type: types.CHECK_CARD_NAME,
    meta: {
      ...resourceHttp.checkCardName,
      body
    }
  })
}

export const getCardHistory = (contractNoEncode, toDate = Utils.toStringDate(new Date()), fromDate = moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'), page = 1) => (dispatch) => {
  const body = {
    toDate,
    fromDate,
    contractNoEncode,
    page
  }
  dispatch({
    type: types.GET_HISTORY_CREDIT_CARD,
    meta: {
      ...resourceHttp.cardHistory,
      body
    }
  })
}

export const onAdvancedSearch = (transType, fromDate, toDate, fromAmount, toAmount, acctNo, page, queryType) => (dispatch) => {
  let body = {
    transType,
    fromDate,
    toDate,
    fromAmount: `${fromAmount}`,
    toAmount,
    acctNo,
    page,
    queryType
  }
  console.log(body);

  body = _.pickBy(body, _.identity);
  console.log(body);

  dispatch({
    type: types.ADVANCED_SEARCH,
    meta: {
      ...resourceHttp.historyByAccount,
      body
    }
  })
}

export const onSubmitExchange = (content, serviceType = 'CH', title = 'Tra soát giao dịch') => (dispatch) => {
  const body = new FormData()
  body.append('content', content)
  body.append('serviceType', serviceType)
  body.append('title', title)
  console.log(body);

  dispatch({
    type: types.ACCOUNT_INVESTIGATION,
    meta: {
      ...resourceHttp.sendMessage,
      body
    }
  })
}

export const getAmountStatus = (cardNumber) => (dispatch) => {
  const body = {
    cardNumber
  }
  console.log(body);

  dispatch({
    type: types.GET_AMOUNT_STATUS,
    meta: {
      ...resourceHttp.amountStatus,
      body
    }
  })
}

export const redeemGetUrl = (customerId, point, customerName) => (dispatch) => {
  const body = {
    customerId,
    point,
    customerName
  }
  console.log(body);

  dispatch({
    type: types.REDEEM_GET_URL,
    meta: {
      ...resourceHttp.redeemGetUrl,
      body
    }
  })
}

export const getCaSaDetail = (accNo) => (dispatch) => {
  const body = {
    accNo
  }
  console.log(body);

  dispatch({
    type: types.GET_CA_SA_DETAIL,
    meta: {
      ...resourceHttp.caSaDetail,
      body
    }
  })
}
