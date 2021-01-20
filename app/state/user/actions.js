import * as types from './types'
import { resourceHttp } from '../../services'

export const addUser = () => ({
  type: types.ADD,
})

export const removeUser = () => ({
  type: types.REMOVE,
})

export const getInfoUser = () => ({
  type: types.GET_INFO,
  meta: {
    ...resourceHttp.getCustomerInfo,
  },
})

export const updateUser = (body) => ({
  type: types.UPDATE_INFO,
  meta: {
    ...resourceHttp.setCustomerInfo,
    body,
  },
})

export const setUserInfo = (userInfo) => (dispatch) => {
  dispatch({
    type: types.SET_USER_INFO,
    payload: userInfo
  })
}

export const changeNotifyStatus = (body) => ({
  type: types.CHANGE_NOTIFY_STATUS,
  meta: {
    ...resourceHttp.changeNotficationStatus,
    body,
  },
})
