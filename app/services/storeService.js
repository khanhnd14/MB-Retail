/* eslint-disable no-empty */
/* eslint-disable radix */
import AsyncStorage from '@react-native-community/async-storage'
import { Utils } from '../utilities'
import { settingSelectors } from '../state/setting'

const SESSION_TIME = 'SESSION_TIME_RETAIL'
const TOKEN_NO = 'TOKEN_NO_RETAIL'
const PRIVATE_KEY = 'PRIVATE_KEY_RETAIL'
const SECRECT_KEY = 'SECRECT_KEY_RETAIL'
const PASSWORD_KEY = 'PASSWORD_KEY_RETAIL'
const BIOMETRIC_AUTHEN = 'BIOMETRIC_AUTHEN_RETAIL'
const SOFTTOKEN_KEY = 'SOFTTOKEN_KEY_RETAIL'
const BIOMETRIC_VERIFY_KEY = 'BIOMETRIC_VERIFY_KEY_RETAIL'
const PIN_KEY = 'PIN_KEY_RETAIL'
const SOFTTOKEN_LOCKER_KEY = 'SOFTTOKEN_LOCKER_KEY'
const PUSH_ID_KEY = 'PUSH_ID_KEY'
const FIREBASE_ID_KEY = 'FIREBASE_ID_KEY'

const cache = {}
var listModule = {} // danh sách module được phân quyền

export default {
  async migrate() {
    try {
      const migrateDone = await AsyncStorage.getItem('migrateDone')
      if (!migrateDone) {
        // lay user
        let loggedInUser = await AsyncStorage.getItem('loggedInUser')
        let securityTypeMB = ''
        if (loggedInUser) {
          loggedInUser = JSON.parse(loggedInUser)
          securityTypeMB = loggedInUser.securityTypeMB
          this.setTokenNo(loggedInUser.tokenNo)
        }
        // login bang phuong thuc gi
        let loginSecurityType = await AsyncStorage.getItem('loginSecurityType')
        const fingerPrintKeySet = await Utils.getKeyChain('fingerPrintKeySet')
        await this.setAuthBioKey(fingerPrintKeySet)
        await this.saveFPVerifyKey(fingerPrintKeySet)
        const softtoken = await Utils.getKeyChain('SOFT_TOKEN_KEYSET')
        await this.saveSoftTokenKey(softtoken)

        // lay pinCode
        const pinCodeEncrypted = await AsyncStorage.getItem('pinCode')

        if (pinCodeEncrypted) {
          const keyPrivate = Math.random().toString(36) + Math.random().toString(36)
          const pin = settingSelectors.aesDecrypt(pinCodeEncrypted, keyPrivate)
          this.savePinCode(pin)
          // co pin ma loginSecurityType != null thi moi set la pin
          // con khong null thi la loginSecurityType
          if (!loginSecurityType) {
            loginSecurityType = 'PIN'
          }
        }

        const activeCode = await AsyncStorage.getItem('activeCode')
        const userName = await AsyncStorage.getItem('username')

        // set migrate done
        await AsyncStorage.setItem('migrateDone', 'true')

        return { ...loggedInUser, loginSecurityType, securityTypeMB, activeCode, userName }
      }
      return null
    } catch (error) {
      return null
    }
  },
  setPushId(id) {
    AsyncStorage.setItem(PUSH_ID_KEY, id)
  },
  getPushId() {
    return AsyncStorage.getItem(PUSH_ID_KEY)
  },
  setFireBaseId(id) {
    AsyncStorage.setItem(FIREBASE_ID_KEY, id)
  },
  getFireBaseId() {
    return AsyncStorage.getItem(FIREBASE_ID_KEY)
  },
  setSoftTokenLocker(locker) {
    AsyncStorage.setItem(SOFTTOKEN_LOCKER_KEY, JSON.stringify(locker))
  },
  getSoftTokenLocker() {
    return AsyncStorage.getItem(SOFTTOKEN_LOCKER_KEY)
  },

  setTokenNo(tokenNo) {
    // try {
    //   await Utils.saveKeyChain(TOKEN_NO, tokenNo)
    // } catch (e) {}
    AsyncStorage.setItem(TOKEN_NO, tokenNo)
  },
  getTokenNo() {
    return AsyncStorage.getItem(TOKEN_NO)
    // try {
    //   const tokenStorage = await AsyncStorage.getItem(TOKEN_NO)
    //   const tokenKeychain = await Utils.getKeyChain(TOKEN_NO)
    //   if (tokenKeychain) {
    //     return tokenKeychain
    //   }
    //   if (tokenStorage) {
    //     return tokenStorage
    //   }
    //   return null
    // } catch (error) {
    //   return null
    // }
  },
  async setAuthBioKey(key) {
    try {
      await Utils.saveKeyChain(BIOMETRIC_AUTHEN, key)
    } catch (e) {}
  },
  getAuthBioKey() {
    try {
      return Utils.getKeyChain(BIOMETRIC_AUTHEN)
    } catch (error) {
      return null
    }
  },
  setSessionTime() {
    const time = new Date().getTime().toString()
    AsyncStorage.setItem(SESSION_TIME, time)
  },
  // Thời gian user đã ẩn app
  getSessionTime() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(SESSION_TIME)
        .then((time) => {
          if (time) {
            const ssTime = new Date().getTime() - parseInt(time)
            resolve(ssTime / 60000)
          } else {
            resolve(-1)
          }
          resolve(time ? parseInt(time) / 60000 : -1)
        })
        .catch(() => {
          reject(-1)
        })
        .finally(() => {
          AsyncStorage.removeItem(SESSION_TIME)
        })
    })
  },
  savePassword(key) {
    try {
      Utils.saveKeyChain(PASSWORD_KEY, key)
    } catch (e) {}
  },
  getPassword() {
    try {
      return Utils.getKeyChain(PASSWORD_KEY)
    } catch (error) {
      return null
    }
  },
  savePrivateKey(key) {
    try {
      Utils.saveKeyChain(PRIVATE_KEY, key)
    } catch (e) {
      return e
    }
  },
  getPrivateKey() {
    try {
      Utils.getKeyChain(PRIVATE_KEY)
    } catch (error) {
      return null
    }
  },
  saveSecrectKey(key) {
    try {
      Utils.saveKeyChain(SECRECT_KEY, key)
    } catch (e) {
      return e
    }
  },
  getSecrectKey() {
    try {
      return Utils.getKeyChain(SECRECT_KEY)
    } catch (error) {
      return null
    }
  },
  async saveSoftTokenKey(key) {
    try {
      await Utils.saveKeyChain(SOFTTOKEN_KEY, key)
    } catch (e) {}
  },
  getSoftTokenKey() {
    try {
      return Utils.getKeyChain(SOFTTOKEN_KEY)
    } catch (error) {
      return null
    }
  },
  async saveFPVerifyKey(key) {
    try {
      await Utils.saveKeyChain(BIOMETRIC_VERIFY_KEY, key)
    } catch (e) {}
  },
  getFPVerifyKey() {
    try {
      return Utils.getKeyChain(BIOMETRIC_VERIFY_KEY)
    } catch (error) {
      return null
    }
  },
  async savePinCode(key) {
    try {
      await Utils.saveKeyChain(PIN_KEY, key)
    } catch (e) {}
  },
  getPinCode() {
    try {
      return Utils.getKeyChain(PIN_KEY)
    } catch (error) {
      return null
    }
  },
  setListModule(user) {
    try {
      const { menu } = user || {}
      if (menu) {
        listModule = {}
      }
      menu?.map((item) => {
        const { listSubMenu } = item
        listSubMenu?.map((subitem) => {
          const { moduleId } = subitem
          const obj = { [moduleId]: subitem }
          listModule = { ...listModule, ...obj }
          return item
        })
        return item
      })
    } catch (error) {}
    return listModule
  },
  getListModule() {
    return listModule
  },
  clear() {
    AsyncStorage.removeItem(TOKEN_NO)
    // AsyncStorage.setItem(PASSWORD_KEY)
    Utils.deleteAllKeyChain()
  },
  clearCache(key) {
    this.cache[key] = null
  },
  cache,
}
