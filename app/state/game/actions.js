import * as types from './types'
import { resourceHttp } from '../../services'

export const getData = () => ({
  type: types.GET_DATA,
  meta: {
    ...resourceHttp.wordGameList,
  },
})
