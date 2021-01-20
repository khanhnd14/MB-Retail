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
