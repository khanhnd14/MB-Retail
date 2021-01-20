import * as types from './types'
import { resourceHttp } from '../../services'

export const getExchangeRate = () => ({
  type: types.GET_EXCHANGE_RATE,
  meta: {
    ...resourceHttp.exChangeRate,
    body: {
      newMB: true,
    },
  },
})
export const saveExchangeRates = (payload) => ({
  type: types.GET_EXCHANGE_RATE,
  payload,
})

export const getAllExchangeRate = () => async (dispatch) => {
  try {
    const res = await dispatch(getExchangeRate())
    if (res) {
      console.log('res.getAllExchangeRate', res)
      dispatch(saveExchangeRates(res))
    }
    return true
  } catch (error) {
    return false
  }
}
