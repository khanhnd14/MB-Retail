import * as types from './types'
import { resourceHttp } from '../../services'

export const getListStock = () => ({
  type: types.GET_LIST_STOCK,
  meta: {
    ...resourceHttp.bankGetListStock,
  },
})

export const getBenefit = (body) => ({
  type: types.GET_BENEFIT_STOCK,
  meta: {
    ...resourceHttp.transferGetBenefitStock,
    body
  },
})

export const getOtpTransfer = (body) => ({
  type: types.GET_OTP_TRANSFER,
  meta: {
    ...resourceHttp.transferSendOTPStock,
    body
  },
})

export const transfer = (body) => ({
  type: types.TRANSFER,
  meta: {
    ...resourceHttp.transferCompleleStock,
    body,
  },
})
export const reset = () => ({
  type: types.RESET,
})
