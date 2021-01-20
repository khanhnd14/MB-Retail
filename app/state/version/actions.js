import * as types from './types'
import { resourceHttp } from '../../services'

export const getData = (body) => ({
  type: types.GET_DATA,
  meta: {
    ...resourceHttp.checkAppVersion,
    body,
  },
})
