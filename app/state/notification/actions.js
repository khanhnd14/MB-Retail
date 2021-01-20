import * as types from './types'
import { resourceHttp } from '../../services'

export const getData = (body) => ({
  type: types.GET_DATA,
  meta: {
    ...resourceHttp.getNotification,
    body,
  },
})

export const loadMore = (body) => ({
  type: types.LOADMORE,
  meta: {
    ...resourceHttp.getNotification,
    body,
  },
})

export const getDetail = (body) => ({
  type: types.GET_DETAIL,
  meta: {
    ...resourceHttp.getNotificationDetail,
    body,
  },
})
export const readNotification = (body) => ({
  type: types.READ,
  meta: {
    ...resourceHttp.readNotification,
    body,
  },
})

export const getDataAdvance = (body) => ({
  type: types.GET_DATA_ADVANCE,
  meta: {
    ...resourceHttp.getNotificationAdvance,
    body,
  },
})

export const getDataBalance = (body) => ({
  type: types.GET_DATA_BALANCE,
  meta: {
    ...resourceHttp.notifyFireBase,
    body,
  },
})

export const loadMoreBalance = (body) => ({
  type: types.GET_DATA_BALANCE_LOADMORE,
  meta: {
    ...resourceHttp.notifyFireBase,
    body,
  },
})
