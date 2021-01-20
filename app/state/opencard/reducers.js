import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  listData: null,
  listError: null,
  initData: null,
  initError: null,
  prepareData: null,
  prepareError: null,
  completeData: null,
  completeError: null,
  selectedData: null,
  listDistrict: [],
  listBranch: [],
  branch: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_LIST_INFO_COMPLETED:
      return {
        ...state,
        listData: action.payload,
      }
    case types.SELECT_BRANCH:
      return {
        ...state,
        branch: action.payload,
      }
    case types.GET_SUB_BRANCH_COMPLETED:
      return {
        ...state,
        listBranch: action.payload,
      }
    case types.GET_DISTRICT_COMPLETED:
      return {
        ...state,
        listDistrict: action.payload,
        listBranch: [],
      }
    case types.GET_LIST_INFO_FAILED:
      return {
        ...state,
        listError: action.payload,
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
    case types.INIT:
      return {
        ...state,
        branch: null,
      }
    case appTypes.REACTIVE:
    case types.GET_LIST_INFO:
      return initialState
    default:
      return state
  }
}
