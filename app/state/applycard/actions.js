import * as types from './types'
import { resourceHttp } from '../../services'

export const register = (body) => ({
  type: types.REGISTER,
  meta: {
    ...resourceHttp.applyCard,
    body
  },
})
