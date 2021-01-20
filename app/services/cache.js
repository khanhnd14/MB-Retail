/* eslint-disable no-param-reassign */
/* eslint-disable radix */
import _ from 'lodash'
import AsyncStorage from '@react-native-community/async-storage'
import { settingSelectors } from '../state/setting'

const cacheProvider = AsyncStorage

const getHash = (params, cacheOptions) =>
  // prefix by resource id to clear later (when we want to manually clear cache)
  cacheOptions.id + settingSelectors.md5(cacheOptions.id + JSON.stringify(params))

const CacheService = {
  saveItem: (key, value) => {
    cacheProvider.setItem(key, value)
  },
  removeItem: (key) => {
    cacheProvider.removeItem(key)
  },
  saveLastTimeConnectiton(value) {
    cacheProvider.setItem('lastFetchingTime', value)
  },

  getCachedResult: (params, cacheOptions) => {
    console.log('params:', params);
    console.log('getHash(params, cacheOptions):', getHash(params, cacheOptions));
    return new Promise((resolve, reject) => {
      cacheProvider
        .getItem(getHash(params, cacheOptions))
        .then((result) => {
          if (!result) {
            resolve(null)
          } else {
            result = JSON.parse(result)
            result.expired = parseInt(result.expiredTime) <= new Date().getTime()
            resolve(result)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
},

  getItem: (key) =>
    new Promise((resolve, reject) => {
      cacheProvider
        .getItem(key)
        .then((result) => {
          if (!result) {
            resolve('')
          } else {
            resolve(result)
          }
        })
        .catch((error) => {
          reject(error)
        })
    }),

  /**
   * @params object result - http response data
   * @params object params
   * @params object cacheOptions
   */
  cacheResult: (result, params, cacheOptions) => {
    if (!result) return
    const data = {
      data: result
    }
    data.cachedTime = new Date().getTime()
    if (cacheOptions.interval) {
      data.expiredTime = data.cachedTime + cacheOptions.interval * 1000
    } else {
      // never ever get expired :v
      data.expiredTime = data.cachedTime + 60 * 1000 * 60 * 24 * 365
    }
    console.log('params:', params);
    console.log('getHash(params, cacheOptions):', getHash(params, cacheOptions));
    console.log('JSON.stringify(result)', JSON.stringify(data));
    cacheProvider.setItem(getHash(params, cacheOptions), JSON.stringify(data))
  },

  clearCache: (resourceIds) => {
    if (!_.isArray(resourceIds)) {
      resourceIds = [resourceIds]
    }
    return new Promise((resolve, reject) => {
      cacheProvider.getAllKeys((error, keys) => {
        if (error) {
          resolve()
          return
        }
        const foundKeys = []
        keys.forEach((key) => {
          resourceIds.forEach((id) => {
            if (_.startsWith(key, id)) {
              foundKeys.push(key)
            }
          })
        })
        if (!foundKeys.length) {
          resolve()
        } else {
          cacheProvider
            .multiRemove(foundKeys)
            .then(() => {
              resolve()
            })
            .catch(() => {
              resolve()
            })
        }
      })
    })
  },
}
export { CacheService }
