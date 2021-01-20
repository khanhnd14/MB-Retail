import * as types from './types'

const initialState = {
  exchangeRateList: [],
}

export default function(state = initialState, action) {
  // console.log('action.payload', action.payload);
  switch (action.type) {
    case types.GET_EXCHANGE_RATE:
      return { ...state, exchangeRateList: action.payload }
    default:
      return state
  }
}
