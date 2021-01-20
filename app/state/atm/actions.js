import * as types from './types'
import { resourceHttp } from '../../services'

export const getBranchAgency = (body) => ({
  type: types.GET_BRANCH_AGENCY,
  meta: {
    ...resourceHttp.getMarker,
    body,
  },
})

export const saveBranchAgency = (payload) => ({
  type: types.GET_BRANCH_AGENCY,
  payload,
})

export const clearBank = (payload) => ({
  type: types.CLEAR_BANK,
  payload,
})

export const selectBranch = (payload) => ({
  type: types.SELECT_BRANCH,
  payload,
})

export const getAllBranchesAgencies = (param) => async (dispatch) => {
  try {
    const res = await dispatch(getBranchAgency(param))
    if (res) {
      console.log('res.getAllBranchesAgencies', res)
      dispatch(saveBranchAgency(res))
    }
    return true
  } catch (error) {
    return false
  }
}
