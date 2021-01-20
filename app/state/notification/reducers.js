/* eslint-disable no-case-declarations */
import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  data: null,
  dataError: null,
  dataDetail: null,
  dataAdvance: null,
  listBalance: null,
  listBalanceError: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_DATA_COMPLETED:
      return { ...state, data: action.payload.notifications }
    case types.GET_DATA_FAILED:
      return { ...state, dataError: action.payload }
    case types.GET_DETAIL_COMPLETED:
      return { ...state, dataDetail: action.payload }
    case types.LOADMORE_COMPLETED:
      const result = [...state.data, ...action.payload.notifications]
      return { ...state, data: result }
    case types.GET_DATA_ADVANCE:
      return { ...state, dataAdvance: null }
    case types.GET_DATA_ADVANCE_COMPLETED:
      return { ...state, dataAdvance: action.payload }
    case types.READ_COMPLETED:
      const { messageId } = action.meta.body
      const { data } = state
      return {
        ...state,
        data: data.map((item, index) => {
          if (messageId !== item.messageId) {
            return item
          }
          return {
            ...item,
            status: 'READ',
          }
        }),
      }

    case types.GET_DATA_BALANCE_COMPLETED:
      return { ...state, listBalance: action.payload }
    case types.GET_DATA_BALANCE_FAILED:
      return { ...state, listBalanceError: action.payload }
    case types.GET_DATA_BALANCE_LOADMORE_COMPLETED:
      const resultBl = [...state.listBalance, ...action.payload]
      return { ...state, listBalance: resultBl }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
