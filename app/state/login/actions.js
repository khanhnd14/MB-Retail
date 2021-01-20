import * as types from './types'
import { resourceHttp, storeService } from '../../services'

const rs = require('jsrsasign')

export const login = (body) => (dispatch) => {
  storeService.savePassword(body.password)
  dispatch({
    type: types.LOGIN,
    meta: {
      ...resourceHttp.sendSmsActive,
      body,
    },
  })
}

export const active = (body) => ({
  type: types.ACTIVE,
  meta: {
    ...resourceHttp.activeService,
    body,
  },
})

export const authUser = (body) => ({
  type: types.AUTH_USER,
  meta: {
    ...resourceHttp.login,
    body: {
      ...body,
      prepaid: true
    },
  },
})

export const authUserByPin = (body) => ({
  type: types.AUTH_USER,
  meta: {
    ...resourceHttp.loginByPin,
    body: {
      ...body,
      prepaid: true
    },
  },
})

export const authUserbyFP = (body) => (dispatch) => {
  storeService.getAuthBioKey().then((result) => {
    const times = new Date().getTime().toString()
    const sig = new rs.Signature({ alg: 'SHA1withRSA' })
    sig.init(result.privateKey)
    const hexV = sig.signString(times)
    const params = {
      ...body,
      userKey: result.userKey,
      dataEncoded: hexV,
      time: times,
      prepaid: true
    }
    dispatch({
      type: types.AUTH_USER,
      meta: {
        ...resourceHttp.loginByBio,
        body: params,
      },
    })
  })
}

export const verifyUser = (body) => ({
  type: types.VERIFY_USER,
  meta: {
    ...resourceHttp.login,
    body,
  },
})

export const forgot = (body) => ({
  type: types.FORGOT,
  meta: {
    ...resourceHttp.forgotPassOTP,
    body,
  },
})

export const sendOtpForgot = (body) => ({
  type: types.FORGOT_OTP,
  meta: {
    ...resourceHttp.forgotCompleteOTP,
    body,
  },
})
