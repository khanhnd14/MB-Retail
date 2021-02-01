/* eslint-disable no-undef */
import { sha256 } from 'js-sha256';
import axios from 'axios'
import _ from 'lodash'
import DeviceInfo from 'react-native-device-info'
import * as types from './types'
import { resourceHttp } from '../../services'
import { Utils } from '../../utilities'
import * as loginTypes from '../login/types'
import { Config } from '../../config'

export const sendOTPVerify = (mobile, deviceId = Utils.getUserDeviceID(), clientTime = new Date().getTime()) => (dispatch) => {
  const requestId = sha256(`${mobile}${deviceId}${'MSB'}${clientTime}`);
  const body = {
    mobile,
    deviceId,
    clientTime,
    requestId,
    version: DeviceInfo.getVersion(),
    osName: Platform.OS
  };

  dispatch({
    type: types.EKYC_SEND_OTP,
    meta: {
      ...resourceHttp.sendOTPVerify,
      body
    },
  })
}

export const verifyOTP = (sessionId, otpInput, mobile) => (dispatch) => {
  const body = {
    sessionId,
    otpInput,
    mobile,
  };
  dispatch({
    type: types.EKYC_VERIFY_OTP,
    meta: {
      ...resourceHttp.verifyOTP,
      body
    },
  })
}

export const checkID = (idNumber, token, idType = 'vn.cmnd_old') => (dispatch) => {
  const body = {
    idNumber,
    idType,
    token,
  };
  dispatch({
    type: types.EKYC_CHECK_ID,
    meta: {
      ...resourceHttp.checkID,
      body
    },
  })
}

export const saveLogError = (token, errorCode, errorDesc, phoneNumber, logContent) => (dispatch) => {
  const body = {
    token,
    errorCode,
    errorDesc,
    logContent,
    phoneNumber
  };
  dispatch({
    type: types.SAVE_LOG,
    meta: {
      ...resourceHttp.saveLog,
      body
    },
  })
}

export const getResultEkycSdk = (payload) => (dispatch) => {
  dispatch({
    type: types.EKYC_RESULT_SDK,
    payload
  })
}

export const getTSToken = (token) => (dispatch) => {
  const body = {
    token
  };
  dispatch({
    type: types.GET_TS_TOKEN,
    meta: {
      ...resourceHttp.getTSToken,
      body
    },
  })
}

export const checkUsername = (username, token) => (dispatch) => {
  const body = {
    username,
    token
  };
  dispatch({
    type: types.CHECK_USER_NAME,
    meta: {
      ...resourceHttp.checkUserName,
      body
    },
  })
}

export const reset = () => (dispatch) => {
  dispatch([
    {
      type: types.EKYC_SEND_OTP_COMPLETED,
      payload: null
    },
    {
      type: types.EKYC_VERIFY_OTP_COMPLETED,
      payload: null
    },
    {
      type: types.EKYC_VERIFY_OTP_FAILED,
      payload: null
    }
  ])
}

export const verifyCustomerInfo = (params) => (dispatch) => {
  console.log('====================================');
  console.log(params);
  console.log('====================================');

  const body = _.pickBy(params, _.identity);
  console.log('====================================');
  console.log('after', body);
  console.log('====================================');

  const formData = new FormData();
  const keys = _.keys(body);
  keys.forEach((e) => {
    formData.append(e, body[e])
  })

  const config = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 100000,
  }
  dispatch({
    type: types.VERIFY_CUSTOMER_INFO,
  })
  axios.post(`${Config.API_URL}ekyc/verifyCustomerInfo.do`, formData, config).then(response => {
    console.log(response.data)
    const { status } = response.data
    if (status === '200') {
      dispatch({
        type: types.VERIFY_CUSTOMER_INFO_COMPLETED,
        payload: response.data
      })
    } else {
      dispatch({
        type: types.VERIFY_CUSTOMER_INFO_FAILED,
        payload: response.data
      })
    }
  }).catch((err) => {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
    dispatch({
      type: types.VERIFY_CUSTOMER_INFO_FAILED,
      payload: err
    })
  })
}

export const saveAdditionInfo = (token, email, currentAddress, incomeBracketCode) => (dispatch) => {
  const body = {
    token,
    email,
    currentAddress,
    incomeBracketCode
  };
  dispatch({
    type: types.SAVE_ADDITION_INFO,
    meta: {
      ...resourceHttp.saveAdditionInfo,
      body
    },
  })
}

export const getDistrict = (token, cityCode) => (dispatch) => {
  const body = {
    token,
    cityCode,
  };
  dispatch({
    type: types.GET_DISTRICT,
    meta: {
      ...resourceHttp.getDistrict,
      body
    },
  })
}

export const resetchoicedBranch = () => (dispatch) => {
  dispatch([{
    type: types.GET_DISTRICT_COMPLETED,
    payload: null
  }, {
    type: types.GET_DISTRICT_FAILED,
    payload: null
  }, {
    type: types.GET_SUB_BRANCH_FAILED,
    payload: null
  }, {
    type: types.GET_SUB_BRANCH_COMPLETED,
    payload: null
  }])
}

export const getSubBranch = (token, idDistrict) => (dispatch) => {
  const body = {
    token,
    idDistrict,
  };
  dispatch({
    type: types.GET_SUB_BRANCH,
    meta: {
      ...resourceHttp.getSubbranch,
      body
    },
  })
}

export const choiceBranch = (branch) => (dispatch) => {
  dispatch({
    type: types.CHOICE_BRANCH,
    payload: branch
  })
}

export const choiceCombo = (combo) => (dispatch) => {
  dispatch({
    type: types.CHOICE_COMBO,
    payload: combo
  })
}

export const sendRegister = (params) => (dispatch) => {
  const body = _.pickBy(params, _.identity);
  console.log(body);
  let values = ''
  Object.keys(body)
    .sort()
    .forEach((key) => {
      values += body[key] === null ? '' : body[key]
    })
  const cs = sha256(`${values}${Config.quangxyz}`)
  body.cs = cs
  dispatch({
    type: types.SEND_REGISTER,
    meta: {
      ...resourceHttp.sendRegister,
      body
    },
  })
}

export const saveReferralCode = (token, refCode, idRetry) => (dispatch) => {
  const body = {
    token,
    refCode,
    idRetry
  };
  dispatch({
    type: types.SAVE_REFERRAL_CODE,
    meta: {
      ...resourceHttp.saveReferralCode,
      body
    },
  })
}

export const activeEKYC = (token, userName, password, deviceId) => (dispatch) => {
  const body = {
    token,
    userName,
    password,
    deviceId
  };
  dispatch({
    type: types.ACTIVE_EKYC,
    meta: {
      ...resourceHttp.activeEKYC,
      body
    },
  })
}
export const saveActiveUser = (activeUser) => (dispatch) => {
  dispatch({
    type: loginTypes.ACTIVE_COMPLETED,
    payload: activeUser
  })
}

export const updateRequestId = (requestId) => (dispatch) => {
  dispatch({
    type: types.UPDATE_REQUEST_ID,
    payload: requestId
  })
}

export const reActive = () => (dispatch) => {
  dispatch({
    type: types.RE_ACTIVE,
  })
}
