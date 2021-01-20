import * as types from './types'
import { resourceHttp } from '../../services'

export const init = (body) => ({
  type: types.INIT,
  meta: {
    ...resourceHttp.creditCardInit,
    body
  },
})

export const prepareRegister = (body) => ({
  type: types.PREPARE,
  meta: {
    ...resourceHttp.creditCardPrepare,
    body,
  },
})

export const completeRegister = (body) => ({
  type: types.REGISTER,
  meta: {
    ...resourceHttp.creditCardComplete,
    body,
  },
})

export const getDistrict = (body) => ({
  type: types.GET_DISTRICT,
  meta: {
    ...resourceHttp.creditCardGetDistrict,
    body,
  },
})

export const getSubBranch = (body) => ({
  type: types.GET_SUB_BRANCH,
  meta: {
    ...resourceHttp.creditCardGetSubbranch,
    body,
  },
})

export const getListInfo = (body) => ({
  type: types.GET_LIST_INFO,
  meta: {
    ...resourceHttp.creditCardListInfo,
    body,
  },
})

export const selectBranch = (item) => ({
  type: types.SELECT_BRANCH,
  payload: item,
})
