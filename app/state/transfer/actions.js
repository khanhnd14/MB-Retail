/* eslint-disable no-param-reassign */
import { sha256 } from 'js-sha256'
import * as types from './types'
import { resourceHttp } from '../../services'
import { Config } from '../../config'

export const getRolloutAcc = () => (dispatch) => {
  const body = {
    acctType: "'CA','SA'",
    currencyCode: 'VND',
  }
  dispatch({
    type: types.GET_ACC,
    meta: {
      ...resourceHttp.accountList,
      body,
    },
  })
}

export const getBeneficiary = (transType) => (dispatch) => {
  const body = {
    transType,
  }
  dispatch({
    type: types.GET_BENEFICIARY,
    meta: {
      ...resourceHttp.getBeneficiary,
      body,
      transType,
    },
  })
}

export const selectBenefitAcc = (account) => ({
  type: types.SELECT_BENEFIT_ACCNO,
  payload: account,
})

export const selectBenefitAccInterbank = (account) => ({
  type: types.SELECT_BENEFIT_ACCNO_INTERBANK,
  payload: account,
})
export const selectBank = (bank) => ({
  type: types.SELECT_BANK,
  payload: bank,
})

export const selectBranch = (bank) => ({
  type: types.SELECT_BRANCH,
  payload: bank,
})

export const sendOtp = (body) => (dispatch) => {
  body.notSendOTP = true
    // CK 247
    let values = ''
    Object.keys(body)
      .sort()
      .forEach((key) => {
        values += body[key] === null ? '' : body[key]
      })
    const cs = sha256(`${values}${Config.quangxyz}`)
    body.cs = cs

  dispatch({
    type: types.SEND_OTP,
    meta: {
      ...resourceHttp.transfersendOTP,
      body,
    },
  })
}

export const sendOtpOnly = (body) => ({
  type: types.SEND_OTP_ONLY,
  meta: {
    ...resourceHttp.sendOTPOnly,
    body,
  },
})

export const transfer = (type, body) => (dispatch) => {
  // CK 247
  if (type === 'A') {
    let values = ''
    Object.keys(body)
      .sort()
      .forEach((key) => {
        values += body[key] === null ? '' : body[key]
      })
    const cs = sha256(`${values}${Config.quangxyz}`)
    body.cs = cs
  }

  dispatch({
    type: types.TRANSFER,
    meta: {
      ...(type === 'Y' || type === 'N'
        ? resourceHttp.transferComplele
        : resourceHttp.transferCompleleSML),
      body,
    },
  })
}

export const getListBank = (type) => ({
  type: types.GET_BANK,
  meta: {
    ...(type === 'Y' ? resourceHttp.bankGetListBank : resourceHttp.bankGetListBankSML),
    type,
  },
})

export const getListBankBranch = (body) => ({
  type: types.GET_BANK_BRANCH,
  meta: {
    ...resourceHttp.bankGetListBankBranch,
    body,
  },
})

export const getAccInterbank = (body) => ({
  type: types.GET_ACC_INTERBANK,
  meta: {
    ...resourceHttp.accountGetBenefitSML,
    body,
  },
})

export const getAccInternal = (body) => ({
  type: types.GET_ACC_INTERNAL,
  meta: {
    ...resourceHttp.accountGetBenefitName,
    body,
  },
})

export const setSchedule = (payload) => ({
  type: types.SET_SCHEDULE_INFO,
  payload,
})

export const setScheduleTransfer = (payload) => ({
  type: types.SET_SCHEDULE_TRANSFER,
  payload,
})

export const sendEmail = (body) => ({
  type: types.SEND_EMAIL,
  meta: {
    ...resourceHttp.transferSendMail,
    body,
  },
})

export const reset = () => ({
  type: types.RESET_TRANSFER,
})
