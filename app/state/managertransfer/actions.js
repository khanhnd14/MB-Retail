import * as types from './types'
import { resourceHttp } from '../../services'

export const getHistoryTransfer = (body) => ({
  type: types.GET_HISTORY,
  meta: {
      ...resourceHttp.historyLoadHistory,
    body,
  },
})

export const deleteHistoryTransfer = (body) => ({
  type: types.DELETE_HISTORY,
  meta: {
      ...resourceHttp.historyDeleteHistory,
    body,
  },
})

export const getBeneficiary = (transType, smlType = '') => (dispatch) => {
  const body = {
    transType,
    smlType,
    type: 'Y',
  }
  dispatch({
    type: types.GET_BENEFICIARY,
    meta: {
      ...resourceHttp.getBeneficiary,
      body,
      transType,
    },
  })
}

export const addBenefit = (body) => ({
  type: types.SAVE_BENEFICIARY,
  meta: {
      ...resourceHttp.transferAddAlias,
    body,
  },
})

export const validateAddNewBenefit = (body) => ({
  type: types.VERIFY_ADD_BENEFICIARY,
  meta: {
      ...resourceHttp.beneficiaryValidateBeneficiary,
    body,
  },
})

export const addNewBenefit = (body) => ({
  type: types.ADD_BENEFICIARY,
  meta: {
      ...resourceHttp.beneficiaryInsertUpdateBeneficiary,
    body,
  },
})

export const deleteBenefit = (body) => ({
  type: types.DELETE_BENEFICIARY,
  meta: {
      ...resourceHttp.beneficiaryDeleteBeneficiary,
    body,
  },
})

export const reset = () => ({
  type: types.RESET,
})
