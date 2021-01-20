import * as types from './types'
import { resourceHttp } from '../../services'

export const getSoftTokenInfo = (params) => ({
  type: types.GET_INFO,
  meta: {
    ...resourceHttp.getSofTokenInfo,
    body: params,
  },
})

export const sendOtpSoftToken = (params) => ({
  type: types.SEND_OTP,
  meta: {
    ...resourceHttp.sendOtpSoftToken,
    body: params,
  },
})

export const activeSoftToken = (params) => ({
  type: types.ACTIVE,
  meta: {
    ...resourceHttp.activeSoftToken,
    body: params,
  },
})

export const changePin = (params) => ({
  type: types.CHANGE_PIN,
  meta: {
    ...resourceHttp.changePinSoftToken,
    body: params,
  },
})

export const parseQrData = (params) => ({
  type: types.PARSE_QRCODE,
  meta: {
    ...resourceHttp.parseQrData,
    body: params,
  },
})

export const checkPromotioncode = (params) => ({
  type: types.CHECK_PROMOTION_CODE,
  meta: {
    ...resourceHttp.checkPromotioncode,
    body: params,
  },
})

export const sendOTPQrCode = (params) => ({
  type: types.QRCODE_SEND_OTP,
  meta: {
    ...resourceHttp.sendOTPRecharge,
    body: params,
  },
})

export const completeQrcodeRecharge = (params) => ({
  type: types.COMPLETE_QR_RECHARGE,
  meta: {
    ...resourceHttp.completeRecharge,
    body: params,
  },
})

export const reset = () => ({
  type: types.RESET,
})
