/* eslint-disable no-empty */
/* eslint-disable radix */
/* eslint-disable vars-on-top */
/* eslint-disable no-bitwise */
import {
  Alert,
  Dimensions,
  Platform,
  PixelRatio,
  Linking,
  Image,
  ToastAndroid,
  AlertIOS,
} from 'react-native'
// import LocalizedStrings from 'react-native-localization'
import EventEmitter from 'react-native-eventemitter'
import _ from 'lodash'
import moment from 'moment'
import DeviceInfo from 'react-native-device-info'
import * as Keychain from 'react-native-keychain'
import JailMonkey from 'jail-monkey'
import ShortcutBadge from 'react-native-shortcut-badge';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import RNBadgerAndroid from 'react-native-badger-android';
import I18n from '../translations'
import { Config } from '../config'

const mangso = ['Không', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín']
const arrEn1 = new Array('', ' thousand', ' million', ' billion')
const arrEn2 = new Array(
  'zero',
  'ten',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety'
)
const arrEn3 = new Array(
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
)
const arrEn4 = new Array(
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen'
)
const _pointEn = 'point'
const demension = -1
const upper = -1

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// iphone 11 promax
const wscale = SCREEN_WIDTH / 414
const hscale = SCREEN_HEIGHT / 896

export default {
  toStringDate(date) {
    return moment(date).format('YYYY-MM-DD')
  },
  toStringServerDate(date) {
    return moment(date).format('DD/MM/YYYY')
  },
  toDateObject(ddmmyyyy) {
    var date1 = ddmmyyyy.split('/')
    var newDate = `${date1[1]}/${date1[0]}/${date1[2]}`

    var date = new Date(newDate)
    console.log(date)
    return date
  },
  getTomorrow() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  },
  isTablet() {
    return DeviceInfo.isTablet()
  },
  // Sửa tránh hacker
  async isDate() {
    const bool = await DeviceInfo.isEmulator()
    const isJailBreak = await JailMonkey.isJailBroken()
    return bool || isJailBreak
  },
  getRatioDimension(dimension) {
    const newSize = dimension * wscale
    if (Platform.OS === 'ios') {
      if (DeviceInfo.isTablet()) {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 6
      }
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
    if (DeviceInfo.isTablet()) {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 6
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  },
  getSize(oldSize) {
    const newSize = oldSize * wscale
    if (Platform.OS === 'ios') {
      if (DeviceInfo.isTablet()) {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 5
      }
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 1
    }
    if (DeviceInfo.isTablet()) {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 5
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 1
  },
  getFontSize(oldFontSize) {
    const newSize = oldFontSize * wscale
    if (Platform.OS === 'ios') {
      if (DeviceInfo.isTablet()) {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 7
      }
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 1
    }
    if (DeviceInfo.isTablet()) {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 7
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 1
  },
  alert: (title, message, onOk) => {
    setTimeout(() =>
      Alert.alert(title, message, [{ text: I18n.t('action.action_cancel'), onPress: onOk }])
    )
  },
  extractHostname(url) {
    let hostname
    // find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2]
    } else {
      hostname = url.split('/')[0]
    }

    // find & remove port number
    hostname = hostname.split(':')[0]
    // find & remove "?"
    hostname = hostname.split('?')[0]

    return hostname
  },
  clearFormatAmount(amountFormatText) {
    if (_.isEmpty(amountFormatText)) return ''
    if (_.isNumber(amountFormatText)) return amountFormatText
    return amountFormatText?.replace(/,/g, '')
  },
  encodeNumber(str) {
    const str1 = str.slice(0, 3)
    const str2 = str.slice(6, str.length)
    return `${str1}xxx${str2}`
  },
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },
  getEmailRegex() {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // return /[a-z0-9._-]{2,64}@[a-z0-9.-]+\.[a-z]{2,4}/g
  },
  getUsernameRegex() {
    return /^[a-zA-Z0-9@.]{6,30}$/
  },
  getPasswordRegex() {
    return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
  },
  confirm: (title, message, onOk) =>
    Alert.alert(title, message, [
      { text: I18n.t('action.action_done'), onPress: () => onOk() },
      { text: I18n.t('action.action_cancel'), onPress: () => {} },
    ]),
  padding: (number) => {
    if (parseInt(number) < 10) {
      return `0${number}`
    }
    return number
  },
  formatStringDate(yyyymmdd) {
    if (!yyyymmdd) {
      return ''
    }
    const temp = yyyymmdd.split('-')
    return [temp[2], temp[1], temp[0]].join('/')
  },
  displayAmount(textValue) {
    textValue += ''
    const indexDot = textValue.indexOf('.')
    let thapphan = ''

    if (indexDot > 0) {
      thapphan = textValue.substr(indexDot)
      textValue = textValue.substr(0, indexDot)
    }
    textValue = textValue.replace(/[^\d]/g, '')
    if (textValue.length > 3) {
      let temp = ''
      let lengthString = textValue.length
      if (textValue == '') {
        textValue = '0'
      }
      while (lengthString > 3) {
        temp = `,${textValue.substr(lengthString - 3, lengthString)}${temp}`
        textValue = textValue.substr(0, lengthString - 3)
        lengthString = textValue.length
      }
      temp = textValue.substr(0, lengthString) + temp
      textValue = temp
    }
    return textValue + thapphan
  },

  formatAmountForeign(textValue) {
    textValue += ''
    textValue = textValue.replace(/[^\d]/g, '')
    if (textValue.length == 2 && textValue.indexOf('0') == 0) {
      textValue = textValue.replace('0', '')
    }
    if (textValue.length > 3) {
      let temp = ''
      let lengthString = textValue.length
      if (textValue == '') {
        textValue = '0'
      }
      while (lengthString > 3) {
        temp = `,${textValue.substr(lengthString - 3, lengthString)}${temp}`
        textValue = textValue.substr(0, lengthString - 3)
        lengthString = textValue.length
      }
      temp = textValue.substr(0, lengthString) + temp
      textValue = temp
    }
    return textValue
  },
  formatAmountText(text) {
    if (!text) {
      return 0
    }
    if (typeof text === 'string') {
      text = this.clearFormatAmount(text)
    }
    const number = `${text}`.split('.')
    if (number.length > 1) {
      if (text >= 0) {
        return `${this.formatAmountForeign(number[0])}.${number[1]}`
      }
      return `-${this.formatAmountForeign(number[0])}.${number[1]}`
    }
    if (text >= 0) {
      return this.formatAmountForeign(number[0])
    }
    return `-${this.formatAmountForeign(number[0])}`
  },
  numberWithCommas(x) {
    if (x) {
      const parts = x.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    }
  },
  apiUrl: (uri) => `${AppConfigs.API_ROOT_ENDPOINT}${uri}.do`,
  apiUrlNews: (uri) => `${AppConfigs.API_NEWS_SERVER}${uri}`,
  /**
   * convert object to query param string
   */
  params: (data) => {
    const body = []
    for (const i in data) {
      body.push(`${i}=${encodeURIComponent(data[i])}`)
    }
    return body.join('&')
  },

  flattenMenu: (groupMenu) => {
    let menu = []
    for (const moduleData of groupMenu) {
      if (moduleData.listSubMenu) {
        menu = menu.concat(moduleData.listSubMenu)
      }
    }
    return menu
  },

  getCurrentRouteId(nav) {
    return nav.getCurrentRoutes().pop().id
  },

  // createLanguageDictionary(enDic, viDic) {
  //   let lang = new LocalizedStrings({
  //     en: enDic,
  //     vi: viDic,
  //   })
  //   if (VARIABLES.lang) {
  //     lang.setLanguage(VARIABLES.lang)
  //   }
  //   VARIABLES.arrayLang.push(lang)
  //   return lang
  // },

  getWindowWidth() {
    return Dimensions.get('window').width
  },

  getWindowHeight() {
    return Dimensions.get('window').height
  },

  getScreenHeight() {
    return Dimensions.get('window').height - this.getRatioDimension(VARIABLES.header_height) - 20
  },

  toast: (mess) => {
    // Alert.alert(mess)
    const param = { message: mess }
    EventEmitter.emit(Config.EVENT_NAMES.user_alert_mess, param)
  },
  changeVerifySetting: (mess) => {
    const param = { message: mess }
    EventEmitter.emit(Config.EVENT_NAMES.user_alert_change_softtoken, param)
  },
  showToast: (message) => {
    EventEmitter.emit(Config.EVENT_NAMES.user_toast, { message })
  },
  showError(value) {
    const param = { message: value }
    EventEmitter.emit(Config.EVENT_NAMES.user_alert_mess, param)
  },
  objectToFormData(data) {
    const form = new FormData()
    for (const key in data) {
      form.append(key, data[key])
    }
    return form
  },

  amountFormat(value) {
    return this.formatAmountText(value)
  },

  cleanVietnamese(elem) {
    if (elem) {
      elem.val(clean_vietnamese(elem.val()))
    } else {
      $('.clean-vietnamese').each(function() {
        $(this).on('blur', function() {
          $(this).val(
            clean_vietnamese(
              $(this)
                .val()
                .normalize('NFC')
            )
          )
        })
      })
    }
  },

  clean_vietnamese(tiengviet) {
    if (!tiengviet) {
      return ''
    }
    const mang = new Array()
    const tiengvietReplace = new Array(
      'A',
      'D',
      'E',
      'I',
      'O',
      'U',
      'Y',
      'a',
      'd',
      'e',
      'i',
      'o',
      'u',
      'y',
      ' '
    )

    mang[0] = new Array('À', 'Á', 'Ả', 'Ã', 'Ạ', 'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'Ắ', 'Ằ', 'Ă', 'Ặ')
    mang[1] = new Array('Đ')
    mang[2] = new Array('È', 'É', 'Ẻ', 'Ẽ', 'Ẹ', 'Ê', 'Ề', 'Ế', 'Ể', 'Ễ', 'Ệ')
    mang[3] = new Array('Ì', 'Í', 'Ỉ', 'Ĩ', 'Ị')
    mang[4] = new Array(
      'Ò',
      'Ó',
      'Ỏ',
      'Õ',
      'Ọ',
      'Ô',
      'Ồ',
      'Ố',
      'Ổ',
      'Ỗ',
      'Ộ',
      'Ơ',
      'Ờ',
      'Ớ',
      'Ở',
      'Ỡ',
      'Ợ'
    )
    mang[5] = new Array('Ù', 'Ú', 'Ủ', 'Ũ', 'Ụ', 'Ư', 'Ừ', 'Ứ', 'Ử', 'Ữ', 'Ự')
    mang[6] = new Array('Ỳ', 'Ý', 'Ỷ', 'Ỹ', 'Ỵ')

    mang[7] = new Array('à', 'á', 'ả', 'ã', 'ạ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'ắ', 'ằ', 'ă', 'ặ')
    mang[8] = new Array('đ')
    mang[9] = new Array('è', 'é', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ề', 'ế', 'ể', 'ễ', 'ệ')
    mang[10] = new Array('ì', 'í', 'ỉ', 'ĩ', 'ị')
    mang[11] = new Array(
      'ò',
      'ó',
      'ỏ',
      'õ',
      'ọ',
      'ô',
      'ồ',
      'ố',
      'ổ',
      'ỗ',
      'ộ',
      'ơ',
      'ờ',
      'ớ',
      'ở',
      'ỡ',
      'ợ'
    )
    mang[12] = new Array('ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự')
    mang[13] = new Array('ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ')
    mang[14] = new Array('\r', '\n')

    for (i = 0; i <= mang.length - 1; i++) {
      for (i1 = 0; i1 <= mang[i].length - 1; i1++) {
        do {
          var old_text = tiengviet
          tiengviet = tiengviet.replace(mang[i][i1], tiengvietReplace[i])
        } while (old_text != tiengviet)
      }
    }
    return this.ConvertBR(tiengviet)
  },

  ConvertBR(input) {
    let output = ''
    for (let i = 0; i < input.length; i++) {
      if (input.charCodeAt(i) == 13 && input.charCodeAt(i + 1) == 10) {
        i++
        output += '.'
      } else {
        output += input.charAt(i)
      }
    }
    output = output.replace(/;/g, '.')
    return output.replace(/[#`~^*|]/g, '')
  },

  capitalizeFirstLetter(string) {
    if (string.length > 1) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
    return string
  },

  dochangchuc(so, daydu) {
    let chuoi = ''
    const chuc = Math.floor(so / 10)
    const donvi = so % 10
    if (chuc > 1) {
      chuoi = ` ${mangso[chuc]} Mươi `
      if (donvi == 1) {
        chuoi += ' Mốt'
      }
    } else if (chuc == 1) {
      chuoi = ' Mười'
      if (donvi == 1) {
        chuoi += ' Một'
      }
    } else if (daydu && donvi > 0) {
      chuoi = ' Lẻ'
    }
    if (donvi == 5) {
      if (chuc == 0) {
        chuoi += ' năm'
      } else {
        chuoi += ' lăm'
      }
    } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
      chuoi += ` ${mangso[donvi]}`
    }
    return chuoi
  },
  docblock(so, daydu) {
    let chuoi = ''
    const tram = Math.floor(so / 100)
    so %= 100
    if (daydu || tram > 0) {
      chuoi = ` ${mangso[tram]} Trăm`
      chuoi += this.dochangchuc(so, true)
    } else {
      chuoi = this.dochangchuc(so, false)
    }
    return chuoi
  },
  dochangtrieu(so, daydu) {
    let chuoi = ''
    const trieu = Math.floor(so / 1000000)
    so %= 1000000
    if (trieu > 0) {
      chuoi = `${this.docblock(trieu, daydu)} Triệu`
      daydu = true
    }
    const nghin = Math.floor(so / 1000)
    so %= 1000
    if (nghin > 0) {
      chuoi += `${this.docblock(nghin, daydu)} Nghìn`
      daydu = true
    }
    if (so > 0) {
      chuoi += this.docblock(so, daydu)
    }
    return chuoi
  },
  docso(so) {
    if (so == 0) return ' Không'
    let chuoi = ''
    let hauto = ''
    do {
      ty = so % 1000000000
      so = Math.floor(so / 1000000000)
      if (so > 0) {
        chuoi = this.dochangtrieu(ty, true) + hauto + chuoi
      } else {
        chuoi = this.dochangtrieu(ty, false) + hauto + chuoi
      }
      hauto = ' Tỷ'
    } while (so > 0)
    return chuoi
  },

  toVietNameseCash(so) {
    if (so == null || so == '') {
      return ''
    }
    so = so.toString().replace(/[^0-9.]/g, '')
    if (so == 0 || so == '') return ''
    let chuoi = ''
    let hauto = ''
    do {
      const ty = so % 1000000000
      so = Math.floor(so / 1000000000)
      if (so > 0) {
        chuoi = this.dochangtrieu(ty, true) + hauto + chuoi
      } else {
        chuoi = this.dochangtrieu(ty, false) + hauto + chuoi
      }
      hauto = ' tỷ'
    } while (so > 0)
    return chuoi
  },

  checkNumber(sAmount) {
    const amtExp = /^([0-9,.])*$/
    return amtExp.test(sAmount)
  },
  /*
   * So tien bang chu tieng anh
   *
   * */

  English(num) {
    let strRet = ''
    if (num.length == 3 && num.substr(0, 3) != '000') {
      if (num.substr(0, 1) != '0') {
        strRet += `${arrEn3[num.substr(0, 1)]} hundred`
        if (num.substr(1, 2) != '00') strRet += ' and '
      }
      num = num.substring(1)
    }
    if (num.length == 2) {
      if (num.substr(0, 1) == '0') {
        num = num.substring(1)
      } else if (num.substr(0, 1) == '1') {
        strRet += arrEn4[num.substr(1, 2)]
      } else {
        strRet += arrEn2[num.substr(0, 1)]
        if (num.substr(1, 1) != '0') strRet += '-'
        num = num.substring(1)
      }
    }
    if (num.length == 1 && num.substr(0, 1) != '0') {
      strRet += arrEn3[num.substr(0, 1)]
    }
    return strRet
  },

  toEnglishCash(sAmount) {
    if (sAmount == null || sAmount.length == 0 || !this.checkNumber(sAmount)) return ''
    const amtLen = sAmount.length
    for (var i = amtLen - 1; i >= 0; i--) {
      if (sAmount[i] == ',') {
        let amtTmp = sAmount.substring(0, i)
        if (sAmount.length > i) amtTmp += sAmount.substring(i + 1, sAmount.length)
        sAmount = amtTmp
      }
    }
    const roundAmount = sAmount.toString()
    let decimalAmount = ''
    let strRet = ''
    let num3 = ''
    // Round
    const len = roundAmount.length
    const cols = Math.ceil(len / 3)
    const first = len - cols * 3
    for (var i = first, j = 0; i < len; i += 3) {
      ++j
      if (i >= 0) num3 = roundAmount.substring(i, i + 3)
      else num3 = roundAmount.substring(0, first + 3)
      var strEng = this.English(num3)
      if (strEng != '') {
        if (strRet != '') strRet += ','
        strRet += strEng + arrEn1[cols - j]
      }
    }
    // Decimal
    if (decimalAmount != '') {
      let dcRet = ''
      while (decimalAmount != '' && decimalAmount[decimalAmount.length - 1] == '0') {
        decimalAmount = decimalAmount.substring(0, decimalAmount.length - 1)
      }
      for (i = 0; i < decimalAmount.length; i++) {
        var strEng = ''
        if (decimalAmount[i] == '0') {
          strEng = arrEn3[0]
        } else {
          strEng = this.English(decimalAmount[i])
        }

        if (strEng != '') {
          dcRet += ` ${strEng}`
        }
      }
      if (dcRet != '') {
        if (strRet == '') strRet = arrEn3[0]
        strRet += ` ${_pointEn}`
        strRet += dcRet
      }
    }
    return strRet
  },
  getFontBold() {
    if (!VARIABLES.fontBold) {
      if (Platform.OS === 'ios') {
        VARIABLES.fontBold = 'HelveticaNeue-Medium'
      } else if (Platform.Version >= 21) {
        VARIABLES.fontBold = 'sans-serif'
      } else VARIABLES.fontBold = 'SANS-SERIF'
    }
    return VARIABLES.fontBold
  },
  getFontFamily() {
    return 'Calibri-Regular'
  },
  isIphoneX() {
    const dimen = Dimensions.get('window')

    return (
      // This has to be iOS duh
      Platform.OS === 'ios' &&
      // Accounting for the height in either orientation
      (dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)
    )
  },
  formatCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length != 16) {
      return cardNumber
    }
    return `${cardNumber.substr(0, 4)} ${cardNumber.substr(4, 4)} ${cardNumber.substr(
      8,
      4
    )} ${cardNumber.substr(12)}`
  },

  setGenericPassword(username, password, service) {
    return Keychain.setGenericPassword(username, password, service)
  },

  getGenericPassword(service) {
    return Keychain.getGenericPassword(service)
  },

  resetGenericPassword(service) {
    if (service) {
      return Keychain.resetGenericPassword(service)
    }
    return Keychain.resetGenericPassword()
  },

  bioError(error) {
    console.log('error:', error.name);
    if (!error) {
      return
    }
    if (Platform.OS === 'ios') {
      if (error.name === 'LAErrorUserCancel') {
        return
      }
      if (error.name === 'RCTTouchIDNotSupported') {
        Alert.alert(I18n.t('bioCode.error'), I18n.t('bioCode.notPermit'), [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
          {
            text: I18n.t('bioCode.setting'),
            onPress: () => Linking.openURL('app-settings:'),
            style: 'cancel',
          },
        ])
      } else if (error.message) {
        Alert.alert(error.message)
      } else {
        Alert.alert(I18n.t('bioCode.authenfail'))
      }
    } else if (I18n.t(`bioCode.${error.code}`)) {
      Alert.alert(I18n.t('bioCode.error'), I18n.t(`bioCode.${error.code}`))
    } else if (error.message) {
      Alert.alert(error.message)
    } else {
      Alert.alert(I18n.t('bioCode.error'), I18n.t('bioCode.notPermit'))
    }
  },
  openUrl(link) {
    Linking.openURL(link)
  },
  isArrayEmpty(arr) {
    if (arr == null) return true
    if (typeof arr !== 'undefined' && arr.length > 0) {
      return false
    }
    return true
  },
  converIsoToJSON(data) {
    const mapData = {}
    while (data.length > 0) {
      const tagKey = data.substring(0, 2)
      const tagLenght = data.substring(2, 4)
      const dataTag = data.substring(4, 4 + parseInt(tagLenght))
      if (dataTag.length > 0) {
        if (tagKey == '00') {
          mapData.userId = dataTag
        }
        if (tagKey == '01') {
          mapData.amount = dataTag
        }
        if (tagKey == '02') {
          mapData.tranId = dataTag
        }
      }
      data = data.substring(4 + parseInt(tagLenght))
    }
    return mapData
  },

  async saveKeyChain(key, value) {
    try {
      // const key = pKey.toLowerCase()
      const data = await Keychain.getGenericPassword()
      let json = {}
      if (data) {
        json = JSON.parse(data.password)
      }
      json[key] = JSON.stringify(value)
      return (storeFlag = await Keychain.setGenericPassword('username', JSON.stringify(json)))
    } catch (error) {
      console.log('saveKeyChain', error)
    }
  },

  async getKeyChain(key) {
    // const key = pKey.toLowerCase()
    let result = null
    const data = await Keychain.getGenericPassword()
    // debugger

    if (data) {
      const json = JSON.parse(data.password)
      result = json[key]
    }
    if (result) {
      result = JSON.parse(result)
    }
    return result
  },

  async deleteKeyChain(key) {
    // const key = pKey.toLowerCase()
    const data = await Keychain.getGenericPassword()
    let json = {}
    if (data) {
      json = JSON.parse(data.password)
    }
    delete json[key]
    return (storeFlag = await Keychain.setGenericPassword('username', JSON.stringify(json)))
  },

  deleteAllKeyChain() {
    return Keychain.resetGenericPassword()
  },
  groupBy(xs, key) {
    if (!xs) return {}
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  },
  amountSuggestion(amount, minAmountSuggest, maxAmountSuggest) {
    var listArray = []
    const suggestCount = 4
    const maxValue = maxAmountSuggest
    const minValue = minAmountSuggest
    const amountValue = amount
    try {
      if (
        amountValue.length == 0 ||
        (amountValue.length == 1 && amountValue == '0') ||
        amountValue.length > 4
      ) {
        return listArray
      }

      var listArray = []
      const tempCount = 5 - amountValue.length
      let zero = ''
      for (var i = 0; i < tempCount; i++) {
        zero += '0'
      }
      let duple = '0'

      if (amountValue.indexOf('0') == amountValue.length - 1) {
        zero += '0'
        if (parseFloat(maxValue) > 9999999) {
          duple = '00'
        }
        if (parseFloat(maxValue) > 99999999) {
          duple = '000'
        }
      }
      if (amountValue.indexOf('00') == 1) {
        zero += '00'
        if (parseFloat(maxValue) > 9999999) {
          duple = '00'
        }
        if (parseFloat(maxValue) > 99999999) {
          duple = '000'
        }
      }

      var amount
      var i = 0
      while (i < suggestCount) {
        amount = amountValue + zero
        if (maxValue != null) {
          if (parseFloat(amount) > parseFloat(maxValue)) {
            if (duple.length > 1 && parseFloat(amount) / 10 < parseFloat(maxValue)) {
              listArray.push(amount.substring(0, amount.length - 1))
            }
            break
          }
        }
        if (minValue != null && parseFloat(amount) >= parseFloat(minValue)) {
          listArray.push(amount)
          i++
        }
        zero += duple
      }
      if (amountValue.length == 3 && `${maxValue}`.indexOf(amountValue) == 0) {
        listArray[listArray.length - 1] = `${maxValue}`
      }
    } catch (error) {}

    return listArray
  },

  getUserDeviceID() {
    return DeviceInfo.getUniqueId()
  },
  getUnicode(str) {
    const item = str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
    return item
  },
  getImageParams(source) {
    const { width } = Image.resolveAssetSource(source)
    const { height } = Image.resolveAssetSource(source)
    const aspectRatio = width / height
    return { width, height, aspectRatio }
  },
  getCurrencyFormat(currency) {
    return currency ? currency.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') : ''
  },
  getAmountString(amount) {
    const ChuSo = ['không ', 'một ', 'hai ', 'ba ', 'bốn ', 'năm ', 'sáu ', 'bảy ', 'tám ', 'chín ']
    const Tien = ['', 'nghìn ', 'triệu ', 'tỷ ', 'nghìn tỷ ', 'triệu tỷ ']
    const DocSo3ChuSo = (baso) => {
      var tram
      var chuc
      var donvi
      var KetQua = ''
      tram = parseInt(baso / 100, 10)
      chuc = parseInt((baso % 100) / 10, 10)
      donvi = baso % 10
      if (tram === 0 && chuc === 0 && donvi === 0) return ''
      if (tram !== 0) {
        KetQua += `${ChuSo[tram]} trăm`
        if (chuc === 0 && donvi !== 0) KetQua += 'linh '
      }
      if (chuc !== 0 && chuc !== 1) {
        KetQua += `${ChuSo[chuc]} mươi `
        if (chuc === 0 && donvi !== 0) KetQua += 'linh '
      }
      if (chuc === 1) KetQua += 'mười '
      switch (donvi) {
        case 1:
          if (chuc !== 0 && chuc !== 1) {
            KetQua += 'mốt '
          } else {
            KetQua += ChuSo[donvi]
          }
          break
        case 5:
          if (chuc === 0) {
            KetQua += ChuSo[donvi]
          } else {
            KetQua += 'lăm '
          }
          break
        default:
          if (donvi !== 0) {
            KetQua += ChuSo[donvi]
          }
          break
      }
      return KetQua
    }

    const DocTienBangChu = (SoTien) => {
      var lan = 0
      var i = 0
      var so = 0
      var KetQua = ''
      var tmp = ''
      var ViTri = []
      if (SoTien < 0) return 'Số tiền âm !'
      if (SoTien === 0) return 'Không đồng !'
      if (SoTien > 0) {
        so = SoTien
      } else {
        so = -SoTien
      }
      if (SoTien > 8999999999999999) {
        // SoTien = 0;
        return 'Số quá lớn! '
      }
      ViTri[5] = Math.floor(so / 1000000000000000)
      if (isNaN(ViTri[5])) {
        ViTri[5] = '0'
      }
      so -= parseFloat(ViTri[5].toString()) * 1000000000000000
      ViTri[4] = Math.floor(so / 1000000000000)
      if (isNaN(ViTri[4])) {
        ViTri[4] = '0'
      }
      so -= parseFloat(ViTri[4].toString()) * 1000000000000
      ViTri[3] = Math.floor(so / 1000000000)
      if (isNaN(ViTri[3])) {
        ViTri[3] = '0'
      }
      so -= parseFloat(ViTri[3].toString()) * 1000000000
      ViTri[2] = parseInt(so / 1000000, 10)
      if (isNaN(ViTri[2])) {
        ViTri[2] = '0'
      }
      ViTri[1] = parseInt((so % 1000000) / 1000, 10)
      if (isNaN(ViTri[1])) {
        ViTri[1] = '0'
      }
      ViTri[0] = parseInt(so % 1000, 10)
      if (isNaN(ViTri[0])) {
        ViTri[0] = '0'
      }
      if (ViTri[5] > 0) {
        lan = 5
      } else if (ViTri[4] > 0) {
        lan = 4
      } else if (ViTri[3] > 0) {
        lan = 3
      } else if (ViTri[2] > 0) {
        lan = 2
      } else if (ViTri[1] > 0) {
        lan = 1
      } else {
        lan = 0
      }
      for (i = lan; i >= 0; i--) {
        tmp = DocSo3ChuSo(ViTri[i])
        KetQua += tmp
        if (ViTri[i] > 0) KetQua += Tien[i]
        // if ((i > 0) && (tmp.length > 0)) KetQua += ',';// && (!string.IsNullOrEmpty(tmp))
      }
      if (KetQua.substring(KetQua.length - 1) === ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1)
      }
      KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2)
      return KetQua // .substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    }

    return DocTienBangChu(amount)
  },
  isStringEmpty(str) {
    return !str || str.length === 0
  },
  showLoading() {
    EventEmitter.emit(Config.EVENT_NAMES.user_loading, { isLoading: true })
  },
  hideLoading() {
    EventEmitter.emit(Config.EVENT_NAMES.user_loading, { isLoading: false })
  },
  // xorString
  compS(text, key) {
    var result = '';
    for (var i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  },
  setBadge(count1) {
    try {
        const count = parseInt(count1);
        if (!isNaN(count)) {
            AsyncStorage.setItem('badgeCount', `${count}`);
            // set Badge
            if (Platform.OS === 'ios') {
                PushNotificationIOS.setApplicationIconBadgeNumber(count);
            } else {
                ShortcutBadge.setCount(count);
                // RNBadgerAndroid.setBadge(count)
            }
        }
    } catch (error) {
    }
},
}
