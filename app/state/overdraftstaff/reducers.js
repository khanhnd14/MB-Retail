import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  initData: null,
  initError: null,
  prepareData: null,
  prepareError: null,
  completeData: null,
  completeError: null,
  selectedData: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SELECTED_DATA:
      return {
        ...state,
        selectedData: action.payload,
      }

    case types.INIT_COMPLETED:
      return {
        ...state,
        initData: action.payload,
      }
    case types.INIT_FAILED:
      return {
        ...state,
        initError: action.payload,
      }
    case types.PREPARE_COMPLETED:
      return {
        ...state,
        prepareData: action.payload,
      }
    case types.PREPARE_FAILED:
      return {
        ...state,
        prepareError: action.payload,
      }
    case types.REGISTER:
      return {
        ...state,
        completeData: null,
        completeError: null,
      }
    case types.REGISTER_COMPLETED:
      return {
        ...state,
        completeData: action.payload,
      }
    case types.REGISTER_FAILED:
      return {
        ...state,
        completeError: action.payload,
      }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
