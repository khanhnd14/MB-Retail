import * as types from './types'
import { resourceHttp } from '../../services'

export const getData = (body) => ({
  type: types.GET_DATA,
  meta: {
    ...resourceHttp.getMessage,
    body,
  },
})

export const loadMore = (body) => ({
  type: types.LOADMORE,
  meta: {
    ...resourceHttp.getMessage,
    body,
  },
})

export const getDetail = () => ({
  type: types.GET_DETAIL,
  meta: {
    ...resourceHttp.getServiceSupport,
  },
})
export const deleteMess = (body) => ({
  type: types.DELETE,
  meta: {
    ...resourceHttp.deleteMessage,
    body,
  },
})
export const comment = (body) => ({
  type: types.COMMENT,
  meta: {
    ...resourceHttp.sendMessage,
    body,
  },
})
