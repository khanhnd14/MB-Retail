import * as types from './types'
import * as loginTypes from '../login/types'
import * as userTypes from '../user/types'
import * as notiTypes from '../notification/types'

const resetState = {
  showIntro: false, // Lưu trạng thái show intro
  showTooltip: false, // Lưu trạng thái show intro
  isLogin: false, // Lưu trạng thái user đã active
  isTimeout: false, // user đã hết session chưa,
  countNotification: 0,
  isUpdatePushId: false,
  isUpdateFireBaseId: false,
  fireBaseToken: null
}
const initialState = {
  showIntro: true, // Lưu trạng thái show intro
  showTooltip: true, // Lưu trạng thái show intro
  isLogin: false, // Lưu trạng thái user đã active
  isTimeout: false, // user đã hết session chưa,
  countNotification: 0,
  language: types.LANGUAGE_CODE.VI,
  pushId: null,
  isUpdatePushId: false,
  isUpdateFireBaseId: false,
  fireBaseToken: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.INTRO_COMPLETED:
      return {
        ...state,
        showIntro: false,
      }
    case types.UPDATE_PUSH_SERVER_COMPLETED:
      return {
        ...state,
        isUpdatePushId: true,
        isUpdateFireBaseId: true,
        // isFirebaseNotEmpty: false
        fireBaseToken: action.meta.body.fireBaseToken ?? null
      }
    case types.TOOLTIP_COMPLETED:
      return {
        ...state,
        showTooltip: false,
      }
    case types.LOGOUT:
      return {
        ...state,
        isTimeout: true,
      }
    case loginTypes.ACTIVE_COMPLETED:
      return {
        ...state,
        isTimeout: false,
        isLogin: true,
        isUpdatePushId: true,
        isUpdateFireBaseId: true
      }
    case loginTypes.AUTH_USER_COMPLETED:
      return {
        ...state,
        isTimeout: false,
      }
    case types.COUNT_NOTIFICATION_COMPLETED:
      return {
        ...state,
        countNotification: action.payload.count,
      }
    case types.UPDATE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      }
    case notiTypes.READ_COMPLETED:
      return {
        ...state,
        countNotification: state.countNotification - 1,
      }
    case types.REACTIVE:
      return {
        ...state,
        ...resetState,
        showIntro: false,
        isUpdatePushId: false,
        isUpdateFireBaseId: false,
        fireBaseToken: null      
      }
    case types.UPDATE_PUSHID:
      return {
        ...state,
        pushId: action.pushId,
      }
    case userTypes.SET_USER_INFO:
      return {
        ...state,
        isLogin: true,
        showIntro: false,
        showTooltip: false,
        isUpdatePushId: false,
        isUpdateFireBaseId: false
      }
    default:
      return state
  }
}
