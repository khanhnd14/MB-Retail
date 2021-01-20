import * as types from './types'

const initialState = {
  versionComplete: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_DATA:
      return {
        versionComplete: null,
      }
    case types.GET_DATA_COMPLETED:
      return {
        ...state,
        versionComplete: action.payload,
      }

    default:
      return state
  }
}
