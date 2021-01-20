import * as types from './types'
import { resourceHttp } from '../../services'

export const init = () => ({
  type: types.INIT,
  meta: {
    ...resourceHttp.overdraftInit,
  },
})

export const prepareRegister = (body) => ({
  type: types.PREPARE,
  meta: {
    ...resourceHttp.overdraftPrepareRegister,
    body,
  },
})

export const completeRegister = (body) => ({
  type: types.REGISTER,
  meta: {
    ...resourceHttp.overdraftStaffComplete,
    body,
  },
})

export const selectedData = (body) => ({
  type: types.SELECTED_DATA,
  payload: body
})
