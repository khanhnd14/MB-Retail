import * as types from './types'
import { resourceHttp } from '../../services'

export const getInfo = () => ({
  type: types.GET_INFO,
  meta: {
    ...resourceHttp.employeeGetInfo,
    body: {
      newMB: true,
    },
  },
})

export const sendOtp = (params) => ({
  type: types.SEND_OTP,
  meta: {
    ...resourceHttp.employeeRegister,
    body: params,
  },
})

export const completeRegister = (params) => ({
  type: types.ACTIVE,
  meta: {
    ...resourceHttp.employeeCompleteRegister,
    body: params,
  },
})

export const getBalance = (params) => ({
  type: types.GET_BALANCE,
  meta: {
    ...resourceHttp.employeeGetBalance,
    body: params,
  },
})

export const transfer = (params) => ({
  type: types.TRANSFER,
  meta: {
    ...resourceHttp.employeeTransfer,
    body: { ...params, newMB: true },
  },
})

export const deregister = () => ({
  type: types.DEREGISTER,
  meta: {
    ...resourceHttp.employeeDeregister,
  },
})

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
