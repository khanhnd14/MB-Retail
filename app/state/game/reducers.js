import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  listWords: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_DATA_COMPLETED:
      return { ...state, listWords: action.payload }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
