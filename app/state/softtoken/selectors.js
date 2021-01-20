import storeService from '../../services/storeService'
import { Utils } from '../../utilities'
import { Config } from '../../config'
import I18n from '../../translations'

const rs = require('jsrsasign')
const jsotp = require('jsotp')

let pinSTLocker = { count: 0, timeLock: 0 }

export async function getPinCode() {
  try {
    const softTokenKey = await storeService.getSoftTokenKey()
    const hexKey = rs.b64tohex(softTokenKey.pin)
    const keyObj = rs.KEYUTIL.getKey(softTokenKey.privateKey)
    const keydecode = rs.KJUR.crypto.Cipher.decrypt(hexKey, keyObj, 'RSA')
    console.log('getPinCode:', keydecode)

    return keydecode
  } catch (error) {
    return ''
  }
}

export async function getHOTP(tranId) {
  try {
    const softTokenKey = await storeService.getSoftTokenKey()

    const secretKeyEncoded = softTokenKey.secretKey
    const privateKeyST = softTokenKey.privateKey
    // giai ma sk
    const hexKey = rs.b64tohex(secretKeyEncoded)
    const keyObj = rs.KEYUTIL.getKey(privateKeyST)
    const keydecode = rs.KJUR.crypto.Cipher.decrypt(hexKey, keyObj, 'RSA')

    const hotp = jsotp.HOTP(keydecode, 8)
    return hotp.at(tranId)
  } catch (error) {
    return ''
  }
}

export async function getQROtp(qrString) {
  try {
    const softTokenKey = await storeService.getSoftTokenKey()

    const secretKeyEncoded = softTokenKey.secretKey
    const privateKeyST = softTokenKey.privateKey
    const qrdata = Utils.converIsoToJSON(qrString)
    // giai ma sk
    const hexKey = rs.b64tohex(secretKeyEncoded)
    const keyObj = rs.KEYUTIL.getKey(privateKeyST)
    const keydecode = rs.KJUR.crypto.Cipher.decrypt(hexKey, keyObj, 'RSA')
    const hotp = jsotp.HOTP(keydecode, 8)
    return hotp.at(qrdata.tranId)
  } catch (error) {
    return ''
  }
}

async function hesonhan() {
  const soLocker = await storeService.getSoftTokenLocker()
  if (soLocker) {
    pinSTLocker = JSON.parse(soLocker)
  }
  const countDif = pinSTLocker.count - Config.PINSTFailMaxCount
  if (countDif < 0) {
    return 0
  }
  const hsn = countDif === 0 ? 1 : countDif * 2
  return hsn
}

export async function isLocking() {
  const hsn = await hesonhan()
  const soLocker = await storeService.getSoftTokenLocker()
  if (soLocker) {
    pinSTLocker = JSON.parse(soLocker)
  }
  if (pinSTLocker.timeLock + Config.PINSTLockPeriod * hsn >= new Date().getTime()) {
    return true
  }
  return false
}
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000)
  var seconds = ((millis % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export async function comparePin(pin) {
  const pinC = await getPinCode()
  const soLocker = await storeService.getSoftTokenLocker()
  if (soLocker) {
    pinSTLocker = JSON.parse(soLocker)
  }
  const isLock = await isLocking()
  if (isLock) {
    const a = new Date().getTime() - pinSTLocker.timeLock
    const remain = (await hesonhan()) * Config.PINSTLockPeriod - a
    Utils.toast(`${I18n.t('softtoken.lock')} ${millisToMinutesAndSeconds(remain)}`)
    return false
  }

  if (pin === pinC) {
    pinSTLocker.count = 0
    pinSTLocker.timeLock = 0
    storeService.setSoftTokenLocker(pinSTLocker)
    return true
  }
  const { count } = pinSTLocker
  if (pinSTLocker.count >= Config.PINSTFailMaxCount) {
    pinSTLocker = {
      count: count + 1,
      timeLock: new Date().getTime(),
    }
    const hsn = await hesonhan()
    storeService.setSoftTokenLocker({
      count: count + 1,
      timeLock: new Date().getTime(),
    })
    Utils.toast(
      `${I18n.t('softtoken.lock')} ${millisToMinutesAndSeconds(hsn * Config.PINSTLockPeriod)}`
    )
    return false
  }
  storeService.setSoftTokenLocker({
    count: count + 1,
    timeLock: new Date().getTime(),
  })

  Utils.toast(I18n.t('softtoken.pin_not_match'))
  return false
}
