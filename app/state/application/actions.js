import i18n from 'i18n-js'
import * as types from './types'
import { storeService, resourceHttp } from '../../services'
import { Utils } from '../../utilities'

export const introComplete = () => ({
  type: types.INTRO_COMPLETED,
})

export const tooltipComplete = () => ({
  type: types.TOOLTIP_COMPLETED,
})
export const logout = () => {
  Utils.hideLoading()
  // CacheService.saveLastTimeConnectiton('0');
  return ({
    type: types.LOGOUT,
    // meta: {
    //   ...resourceHttp.logout,
    // },
  })
}

export const reactive = () => (dispatch) => {
  dispatch({
    type: types.REACTIVE,
    // meta: {
    //   ...resourceHttp.logout,
    // },
  })
  storeService.clear()
}

export const countNotification = (body) => ({
  type: types.COUNT_NOTIFICATION,
  meta: {
    ...resourceHttp.countNotification,
    body,
  },
})

export const updateLanguage = (language) => (dispatch) => {
  i18n.locale = language
  dispatch({
    type: types.UPDATE_LANGUAGE,
    language
  })
}

export const updatePushId = (pushId) => (dispatch) => {
  dispatch({
    type: types.UPDATE_PUSHID,
    pushId
  })
}

export const updatePushIdServer = (body) => ({
  type: types.UPDATE_PUSH_SERVER,
  meta: {
    ...resourceHttp.commonUpdatePushId,
    body,
    
  }
})
