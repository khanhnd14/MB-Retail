import * as types from './types'

const initialState = {
  lstBranch: [],
  selectedBranch: {},
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_BRANCH_AGENCY:
      return { ...state, lstBranch: state.lstBranch.concat(action.payload) }
    case types.CLEAR_BANK:
      return { ...state, lstBranch: action.payload }
    case types.SELECT_BRANCH:
      return { ...state, selectedBranch: action.payload }
    default:
      return state
  }
}
