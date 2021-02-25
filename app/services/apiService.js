/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
import EventEmitter from 'react-native-eventemitter'
import { Config } from '../config'
import storeService from './storeService'
import * as loginTypes from '../state/login/types'
import * as softTokenTypes from '../state/softtoken/types'
import * as settingTypes from '../state/setting/types'
import { Utils } from '../utilities'
import I18n from '../translations'
import { fetch, fetchFormData } from './fetch'
import { CacheService } from './cache'

const apiService = ({ dispatch }) => (next) => (action) => {
  const result = Array.isArray(action) ? action.filter(Boolean).map(dispatch) : next(action)
  if (!action.meta) {
    return result
  }

  const { uri, method = 'POST', body, type, cacheOptions, id } = action.meta

  if (!uri) {
    throw new Error(`'path' not specified for async action ${action.type}`)
  }

  const url = `${Config.API_URL}${uri}.do`
  if (type === 'form-data') {
    return fetchFormData(url, method, body)
      .then((res) => handleResponse(res, action, next))
      .catch((err) => {
        handleErrors(err, action, next)
      })
  }

  // if (cacheOptions) {
  //   const cacheOps = { ...cacheOptions, id }
  //   CacheService.getCachedResult(body, cacheOps).then((cachedResult) => {
  //     console.log('cachedResult:', cachedResult)
  //     if (cachedResult && !cachedResult.expired) {
  //       console.log('cahessssssss');
  //       return handleResponse(cachedResult.data, action, next)
  //     }
  //     return fetch(url, method, body)
  //       .then((res) => handleResponse(res, action, next))
  //       .catch((err) => {
  //         handleErrors(err, action, next)
  //       })
  //   })
  // } else {
  return fetch(url, method, body)
    .then((res) => handleResponse(res, action, next))
    .catch((err) => {
      handleErrors(err, action, next)
    })
  // }
}

export default apiService

function handleErrors(err, action, next) {
  console.log('====================================')
  console.log(err)
  console.log('====================================')
  const status = err.response ? err.response.status : err.status
  const data = err.response ? err.response.data : err
  const { isAxiosError, code } = err || {}

  next({
    type: `${action.type}_FAILED`,
    payload: err,
    meta: action.meta,
  })
  setTimeout(() => {
    if (status >= 500) {
      err.message && !action.meta.hideError && Utils.toast(data.message)
    } else if (status == 401 || err?.httpStatus == 401) {
      EventEmitter.emit(Config.EVENT_NAMES.user_signout, err)
    } else if (!code || code !== 'ECONNABORTED') {
      if (data.message && !action.meta.hideError) {
        if (status == '406' || status == '424') {
          Utils.changeVerifySetting(data.message)
        } else {
          Utils.toast(data.message)
        }
      }
    }
  }, 500)
  return err
}

function handleResponse(data, action, next) {
  const res = action.meta.isGetFullResponse ? data : data.data
  // const { body, cacheOptions, id } = action.meta
  // if (cacheOptions) {
  //   const cacheOps = { ...cacheOptions, id }
  //   if (body.lang) delete body.lang
  //   if (body.tokenNo) delete body.tokenNo
  //   CacheService.cacheResult(data, body, cacheOps)
  // }
  if (loginTypes.AUTH_USER === action.type) {
    storeService.setTokenNo(res.tokenNo)
  } else if (settingTypes.CHANGE_PASS === action.type) {
    storeService.setTokenNo(res.tokenNo)
  } else if (loginTypes.ACTIVE === action.type) {
    storeService.setTokenNo(res.userInfo.tokenNo)
  } else if (loginTypes.VERIFY_USER === action.type) {
    storeService.setTokenNo(res.tokenNo)
  } else if (softTokenTypes.ACTIVE === action.type) {
    // private key verify
    storeService.saveSoftTokenKey(res)
  } else if (settingTypes.ACTIVE_FP_VERIFY === action.type) {
    storeService.saveFPVerifyKey(res)
  } else if (softTokenTypes.CHANGE_PIN === action.type) {
    storeService.getSoftTokenKey().then((result) => {
      storeService.saveSoftTokenKey({
        ...result,
        pin: res.pinCode,
      })
    })
    // private key fp login
  } else if (settingTypes.ACTIVE_FP_LOGIN === action.type) {
    storeService.setAuthBioKey(res)
  } else if (settingTypes.UPDATE_FP_LOGIN === action.type) {
    storeService.setAuthBioKey(res)
  } else if (settingTypes.SETUP_PIN === action.type) {
    storeService.savePinCode(action.meta.body.pinCode)
  }

  next({
    type: `${action.type}_COMPLETED`,
    payload: res,
    meta: action.meta,
  })

  return res
}
