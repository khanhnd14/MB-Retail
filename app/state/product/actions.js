/* eslint-disable no-param-reassign */
import * as types from './types'
import { resourceHttp } from '../../services'

export const getServiceList = (body) => (dispatch) => {
  dispatch({
    type: types.GET_SERVICE_LIST,
    meta: {
      ...resourceHttp.queryServiceList,
      body
    },
  })
}
export const queryServiceListTC = () => (dispatch) => {
  dispatch({
    type: types.GET_SERVICE_LIST_TC,
    meta: {
      ...resourceHttp.queryServiceListTC,
    },
  })
}

export const getBillAlias = () => (dispatch) => {
  dispatch({
    type: types.GET_BILL_ALIAS,
    meta: {
      ...resourceHttp.getBillAlias,
      body: {},
    },
  })
}

export const getAccount = () => (dispatch) => {
  dispatch({
    type: types.GET_ACCOUNT,
    meta: {
      ...resourceHttp.accountList,
      body: {
        acctType: "'CA','SA'",
        status: "'ACTV','DORM','MATU'",
      },
    },
  })
}

export const getCheckBill = (pContactNo, idService) => (dispatch) => {
  dispatch({
    type: types.GET_CHECK_BILL,
    meta: {
      ...resourceHttp.checkBill,
      body: {
        serviceId: idService,
        contactNo: pContactNo,
      }
    }
  })
}

export const checkPayBill = (body) => (dispatch) => {
  dispatch({
    type: types.CHECK_PAY_BILL,
    meta: {
      ...resourceHttp.payBill,
      body
    }
  })
}
export const setCheckBill = () => (dispatch) => {
  dispatch({
    type: types.SET_CHECK_BILL
  })
}
export const sendOtp = (body) => (dispatch) => {
  dispatch({
    type: types.SEND_OTP,
    meta: {
      ...resourceHttp.completePayBill,
      body,
    }
  })
}
export const sendOTPRecharge = (body) => (dispatch) => {
  dispatch({
    type: types.SEND_OTP_RECHARGE,
    meta: {
      ...resourceHttp.sendOTPRecharge,
      body
    }
  })
}
export const completeRecharge = (body) => (dispatch) => {
  dispatch({
    type: types.COMPLETE_RECHARGE,
    meta: {
      ...resourceHttp.completeRecharge,
      body
    }
  })
}
export const completePrepaidCardAPI = (body) => (dispatch) => {
  dispatch({
    type: types.COMPLETE_RECHARGE,
    meta: {
      ...resourceHttp.completePrepaidCardAPI,
      body
    }
  })
}

export const setSendOtp = () => (dispatch) => {
  dispatch({
    type: types.SET_SEND_OTP
  })
}
export const setSendOtpRecharge = () => (dispatch) => {
  dispatch({
    type: types.SET_SEND_OTP_RECHARGE
  })
}
export const setCompleteRecharge = () => (dispatch) => {
  dispatch({
    type: types.SET_COMPLETE_RECHARGE
  })
}
export const setCheckPayBill = () => (dispatch) => {
  dispatch({
    type: types.SET_CHECK_PAY_BILL
  })
}
export const getDataHistoryBillPayment = (body) => (dispatch) => {
  dispatch({
    type: types.GET_DATA_HISTORY_BILL_PAYMENT,
    meta: {
      ...resourceHttp.getTodayBill,
      body
    }
  })
}

export const getBenefitNameApiCard = (body) => (dispatch) => {
  dispatch({
    type: types.GET_BENEFIT_NAME_API_CARD,
    meta: {
      ...resourceHttp.getBenefitNameApiCard,
      body
    }
  })
}
export const setOtpPrepaidCard = (body) => (dispatch) => {
  dispatch({
    type: types.SEND_OTP_PREPAID_CARD,
    meta: {
      ...resourceHttp.sendOTPPrepaidCard,
      body
    }
  })
}
export const setProduct = () => (dispatch) => {
  dispatch({
    type: types.SET_PRODUCT
  })
}
export const getDataQueryScheduleBill = (body) => (dispatch) => {
  dispatch({
    type: types.GET_DATA_QUERY_SCHEDULE_BILL,
    meta: {
      ...resourceHttp.queryScheduleBill,
      body
    }
  })
}
export const getDataQueryScheduleHistory = (body) => (dispatch) => {
  dispatch({
    type: types.GET_DATA_QUERY_SCHEDULE_HISTORY,
    meta: {
      ...resourceHttp.queryScheduleHistory,
      body: {
        scheduleId: 219762

      }
    }
  })
}
export const ignoreBill = (body) => (dispatch) => {
  dispatch({
    type: types.DELETE_HISTORY_SERVICE,
    meta: {
      ...resourceHttp.ignoreBill,
      body
    }
  })
}
export const setIsNow = (payload) => (dispatch) => {
  dispatch({
    type: types.SET_IS_NOW,
    payload
  })
}

export const setScheduleRecharge = (payload) => ({
  type: types.SET_SCHEDULE_RECHARGE,
  payload,
})

export const paymentSendEmail = (body) => (dispatch) => {
  body.transType = 'billing'
  dispatch({
    type: types.PAYMENT_SEND_EMAIL,
    meta: {
      ...resourceHttp.shareEmailPayment,
      body
    }
  })
}

export const rechargeSendEmail = (body) => (dispatch) => {
  body.transType = 'topup'
  dispatch({
    type: types.RECHARGE_SEND_EMAIL,
    meta: {
      ...resourceHttp.shareEmailPayment,
      body
    }
  })
}

export const makeTransactionBilling = () => ({
  type: types.MAKE_TRANSACTION_BILLING,
  meta: {
    ...resourceHttp.makerTransaction,
  },
})

export const sendOtpBilling = (body) => ({
  type: types.SEND_OTP_BILLING,
  meta: {
    ...resourceHttp.sendOTP,
    body,
  },
})

export const deleteScheduleBill = (body) => ({
  type: types.DELETE_AUTO_BILLING,
  meta: {
    ...resourceHttp.deleteScheduleBill,
    body,
  },
})
