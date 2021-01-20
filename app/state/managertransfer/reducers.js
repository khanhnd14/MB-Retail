import * as types from './types'
import * as appTypes from '../application/types'

const initialState = {
  listHistory: [],
  deleteHistoryComplete: null,
  deleteHistoryError: null,
  beneficiaryN: [],
  beneficiaryS: [],
  beneficiaryY: [],
  addBenefit: null,
  addBenefitEror: null,
  deleteBenefit: null,

  verifyAddBenefit: null,
  verifyAddBenefitError: null,
  addNewBenefit: null,
  addNewBenefitEror: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_BENEFICIARY_COMPLETED:
      if (action.meta.transType === 'N') {
        return { ...state, beneficiaryN: action.payload }
      }
      if (action.meta.transType === 'S') {
        return { ...state, beneficiaryS: action.payload }
      }
      if (action.meta.transType === 'Y') {
        return { ...state, beneficiaryY: action.payload }
      }
      return { ...state, beneficiaryN: action.payload }
    case types.GET_HISTORY_COMPLETED:
      return { ...state, listHistory: action.payload }
    case types.DELETE_HISTORY_COMPLETED:
      return { ...state, deleteHistoryComplete: {} }
    case types.DELETE_HISTORY_FAILED:
      return { ...state, deleteHistoryError: action.payload }
    case types.SAVE_BENEFICIARY_COMPLETED:
      return { ...state, addBenefit: action.payload }
    case types.SAVE_BENEFICIARY_FAILED:
      return { ...state, addBenefitEror: action.payload }
    case types.DELETE_BENEFICIARY_COMPLETED:
      return { ...state, deleteBenefit: action.meta.body.benefId }

    case types.VERIFY_ADD_BENEFICIARY_COMPLETED:
      return { ...state, verifyAddBenefit: action.payload }
    case types.VERIFY_ADD_BENEFICIARY_FAILED:
      return { ...state, verifyAddBenefitError: action.payload }
    case types.ADD_BENEFICIARY_COMPLETED:
      return { ...state, addNewBenefit: true }
    case types.ADD_BENEFICIARY_FAILED:
      return { ...state, addNewBenefitEror: action.payload }
    case types.RESET:
      return initialState
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
