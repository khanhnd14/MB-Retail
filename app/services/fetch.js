/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import axios from 'axios'
import qs from 'qs'
import storeService from './storeService'
import I18n from '../translations'

const networkRequestTimeout = 60000; // 40s
// axios.defaults.timeout = 100000
export const fetch = async (url, method, body = {}, timeoutForRequest = networkRequestTimeout) => {
  body.lang = I18n.locale === 'en' ? 'en_US' : 'vi_VN'
  const tokenNo = await storeService.getTokenNo()
  if (tokenNo) {
    body.tokenNo = tokenNo
  }
  const configAxiso = {
    url,
    method,
    headers: requestHeaders(),
    data: method !== 'GET' ? qs.stringify(body) : body,
    timeout: timeoutForRequest,
    // withCredentials: false, // default
  }

  return axios(configAxiso).then((res) => parseStatus(res.status, res.data))
}

export const fetchFormData = async (url, method, body, timeoutForRequest = networkRequestTimeout) => {
  body.append('lang', I18n.locale === 'en' ? 'en_US' : 'vi_VN')
  const tokenNo = await storeService.getTokenNo()
  if (tokenNo) {
    body.append('tokenNo', tokenNo)
  }
  const configAxiso = {
    url,
    method,
    headers: requestHeadersFormData(),
    data: body,
    timeout: timeoutForRequest,
    withCredentials: false, // default
  }

  return axios(configAxiso)
    .then((res) => {
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      return parseStatus(res.status, res.data)
    })
    // .catch((e) => parseErrors(e.response))
}

function parseStatus(status, res) {
  console.log('==================parseStatus==================')
  console.log(res)
  console.log('====================================')
  return new Promise((resolve, reject) => {
    if (status >= 200 && status < 300) {
      const apiStatus = res.status
      const { message, data } = res
      if (apiStatus == 200 || apiStatus == 202) {
        if (apiStatus == 202) {
          // chạy batch
          return resolve({ data: { status: apiStatus, message, data } })
        }
        if (res.peekData) {
          return resolve({
            ...res,
            data: res.data instanceof Object ? {
              messReward: res.peekData,
              ...res.data,
            } : {
              messReward: res.peekData,
              data: res.data,
            },
          })
        }
        return resolve(res)
      }
      if (apiStatus >= 400 && apiStatus <= 500) {
        // parsing http response object
        if (apiStatus == 401 || apiStatus == 404 || apiStatus == 500 || apiStatus == 408 || apiStatus == 406 || apiStatus == 424) {
          // time out
          return reject({ httpStatus: status, status: apiStatus, message, data })
        }
        return resolve(res)
      }
      if (res.status == '230' || res.status == '201') {
        // otp không chính xác
        return reject({ status: apiStatus, message })
      }
      return reject({ status: apiStatus, message })
    }
    return reject({ status, data })
  })
}

function requestHeaders() {
  return {
    'Content-Type': 'application/x-www-form-urlencoded;',
  }
}

function requestHeadersFormData() {
  return {
    'Content-Type': 'multipart/form-data',
  }
}
