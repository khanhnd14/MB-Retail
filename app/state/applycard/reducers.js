import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  registerComplete: null,
  registerError: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REGISTER_COMPLETED:
      return { ...state, registerComplete: true }
      case types.REGISTER_FAILED:
        return { ...state, registerError: action.payload }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
