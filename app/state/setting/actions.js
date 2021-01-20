import * as types from './types'
import { resourceHttp, storeService } from '../../services'

export const querySecurityList = () => ({
  type: types.GET_SEC_LIST,
  meta: {
    ...resourceHttp.querySecurityList,
  },
})

export const sendOtpVerify = () => ({
  type: types.SEND_OTP_VERIFY,
  meta: {
    ...resourceHttp.requestFingerTransaction,
  },
})
export const activeFPVerify = (params) => ({
  type: types.ACTIVE_FP_VERIFY,
  meta: {
    ...resourceHttp.registerFingerTransaction,
    body: params,
  },
})

export const getLimitTransaction = (params) => ({
  type: types.GET_LIMIT_TRANSACTION,
  meta: {
    ...resourceHttp.getLimitTransaction,
    body: params,
  },
})

export const getAccounts = (params) => ({
  type: types.GET_ACCOUNT,
  meta: {
    ...resourceHttp.accountList,
    body: params,
  },
})

export const setDefaultAccount = (params) => ({
  type: types.SET_DEFAULT_ACCOUNT,
  meta: {
    ...resourceHttp.setMasterAccount,
    body: params,
  },
})

export const validLimitTransaction = (params) => ({
  type: types.VALID_LIMIT_TRANSACTION,
  meta: {
    ...resourceHttp.validateLimitTransaction,
    body: params,
  },
})

export const setLimitTransaction = (params) => ({
  type: types.SET_LIMIT_TRANSACTION,
  meta: {
    ...resourceHttp.setLimitTransaction,
    body: params,
  },
})

export const makeTransaction = () => ({
  type: types.MAKE_TRANSACTION,
  meta: {
    ...resourceHttp.makerTransaction,
  },
})

export const sendOtpChangePass = (params) => ({
  type: types.SEND_OTP,
  meta: {
    ...resourceHttp.sendOTP,
    body: params,
  },
})

export const changePass = (params) => ({
  type: types.CHANGE_PASS,
  meta: {
    ...resourceHttp.changePassword,
    body: params,
  },
})

export const getPrivateKeyFP = () => ({
  type: types.ACTIVE_FP_LOGIN,
  meta: {
    ...resourceHttp.getPrivateKeyFingerprint,
  },
})

export const updatePrivateKeyFP = (body) => ({
  type: types.UPDATE_FP_LOGIN,
  meta: {
    ...resourceHttp.getPrivateKeyFingerprint,
    body,
  }
})

export const setupPinCode = (body) => (dispatch) => {
  dispatch({
    type: types.SETUP_PIN,
    meta: {
      ...resourceHttp.setPinCode,
      body,
    },
  })
}

export const turnOnLoginFP = () => ({
  type: types.TURN_ON_LOGIN_FP,
})

export const turnOffLoginFP = () => ({
  type: types.TURN_OFF_LOGIN_FP,
})

export const turnOnLoginPin = () => ({
  type: types.TURN_ON_LOGIN_PIN,
})

export const turnOffLoginPin = () => ({
  type: types.TURN_OFF_LOGIN_PIN,
})

export const changeSecurityType = (body) => ({
  type: types.CHANGE_SECURITY_TYPE,
  meta: {
    ...resourceHttp.completeSecurityType,
    body,
  },
})

export const reset = () => ({
  type: types.RESET,
})
