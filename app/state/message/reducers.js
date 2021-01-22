/* eslint-disable no-case-declarations */
import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  data: null,
  dataError: null,
  dataDetail: null,
  delet: null,
  deletError: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_DATA_COMPLETED:
      return { ...state, data: action.payload.listMessage }
    case types.GET_DATA_FAILED:
      return { ...state, dataError: action.payload }
    case types.DELETE:
      return { ...state, delet: null, deletError: null }
    case types.DELETE_COMPLETED:
      const { messageId } = action.meta.body
      const { data } = state
      return {
        ...state,
        data: data.filter((el) => el.messageId !== messageId),
        delet: true
      }
    case types.DELETE_FAILED:
      return { ...state, deletError: action.payload }
    case types.GET_DETAIL_COMPLETED:
      return { ...state, dataDetail: action.payload }
    case types.LOADMORE_COMPLETED:
      const result = [...state.data, ...action.payload.listMessage]
      return { ...state, data: result }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
