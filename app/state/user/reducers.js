import * as loginTypes from '../login/types'
import * as appTypes from '../application/types'
import * as softTokenTypes from '../softtoken/types'
import * as settingTypes from '../setting/types'
import * as types from './types'

const initialState = {
  userName: '',
  securityTypeMB: appTypes.SECURITY_TYPE.OTP,
  loginSecurityType: appTypes.SECURITY_TYPE.PW, // PW,PIN,FP
  isOpenSMS: 'Y'
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER_INFO:
      return {
        ...state,
        ...action.payload
      }
    case types.GET_INFO_COMPLETED:
      return {
        ...state,
        ...action.payload,
      }
    case loginTypes.ACTIVE_COMPLETED:
      return {
        ...state,
        ...action.payload.userInfo,
        isPwdExpired: action.payload.isPwdExpired,
        activeCode: action.payload.activeCode,
        isOpenSMS: action.payload.isOpenSMS,
      }
    case loginTypes.LOGIN_COMPLETED:
      return {
        ...state,
        userName: action.meta.body.userName,
      }
    case loginTypes.AUTH_USER_COMPLETED:
      return {
        ...state,
        ...action.payload,
      }
    case softTokenTypes.ACTIVE_COMPLETED:
      return {
        ...state,
        securityTypeMB: appTypes.SECURITY_TYPE.SOFT_TOKEN,
      }
    case settingTypes.ACTIVE_FP_VERIFY_COMPLETED:
      return {
        ...state,
        securityTypeMB: appTypes.SECURITY_TYPE.FP,
      }
    case settingTypes.ACTIVE_FP_LOGIN_COMPLETED:
      return {
        ...state,
        loginSecurityType: appTypes.SECURITY_TYPE.FP,
      }
    case settingTypes.SETUP_PIN_COMPLETED:
      return {
        ...state,
        loginSecurityType: appTypes.SECURITY_TYPE.PIN,
      }
    case settingTypes.TURN_OFF_LOGIN_FP:
    case settingTypes.TURN_OFF_LOGIN_PIN:
      return {
        ...state,
        loginSecurityType: appTypes.SECURITY_TYPE.PW,
      }
    case settingTypes.TURN_ON_LOGIN_FP:
      return {
        ...state,
        loginSecurityType: appTypes.SECURITY_TYPE.FP,
      }
    case settingTypes.TURN_ON_LOGIN_PIN:
      return {
        ...state,
        loginSecurityType: appTypes.SECURITY_TYPE.PIN,
      }
    case settingTypes.CHANGE_SECURITY_TYPE_COMPLETED:
      return {
        ...state,
        securityTypeMB: action.meta.body.securityType,
      }
      case types.CHANGE_NOTIFY_STATUS_COMPLETED:
        return {
          ...state,
          isOpenSMS: action.meta.body.isOn === true ? 'Y' : 'N',
        }
    case appTypes.REACTIVE:
      return initialState
    default:
      return state
  }
}
