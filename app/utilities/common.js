import _ from 'lodash'
import I18n from 'i18n-js'
import { Images } from '../theme'

const numberWithCommas = (x) =>
  x !== undefined && x !== null
    ? x
      .toString()
      .replace(/[a-zA-Z]/gi, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0'

const numberToCurrency = (x) => {
  const billion = 1000000000
  const million = 1000000
  const unit = (true) ? { million: 'Triệu', billion: 'Tỷ' } : { million: 'Million', billion: 'Billion' }
  let rs = ''
  if (x > billion) {
    rs = `${(parseInt(((x / billion) * 10).toString(), 10) / 10).toLocaleString('vi-VN')} ${unit.billion} VND`
  } else if (x > million) {
    rs = `${(parseInt(((x / million) * 10).toString(), 10) / 10).toLocaleString('vi-VN')} ${unit.million} VND`
  } else {
    rs = `${numberWithCommas(x)} VND`
  }
  return rs
}
// 102 => Một không hai
const EditThreeNumber = (number) => {
  const numberString = ['Không', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín']
  const numberLevel = ['', 'Mươi', 'Trăm']
  const array = Array.from(number.toString()).reverse()
  const listNumber = array.map(
    (val, index) => `${numberString[val]} ${numberLevel[index]}`
  )
  return listNumber
    .reverse()
    .join(' ')
    .replace('Không Mươi', 'Linh')
    .replace('Mươi Không', 'Mươi')
    .replace('Một Mươi', 'Mười')
    .replace('Mươi Không', 'Mươi')
    .replace('Mười Không', 'Mười')
    .replace('Mười Năm', 'Mười Lăm')
    .replace('Mươi Năm', 'Mươi Lăm')
    .replace('Mươi Bốn', 'Mươi Tư')
    .replace('Linh Bốn', 'Linh Tư')
    .replace('Linh Không', '')
}
// Xử lý all dãy số => chữ
const numberToVietnameseText = (number) => {
  const editNumber = numberWithCommas(number)
  if (true) {
    const level = ['', 'Nghìn', 'Triệu', 'Tỷ']
    const listNumber = editNumber.split(',').reverse()
    let i = 0
    const result = listNumber.map((val) => {
      i = i > 3 ? (i = 1) : i
      const kq = EditThreeNumber(val) + level[i]
      i += 1
      return kq
    })
    return `${result
      .reverse()
      .join(' ')
      .replace('Không Trăm Triệu', '')
      .replace('Không Trăm Nghìn', '')
      .replace('Không Trăm', '')}Đồng`
  }
  // hide language = 'en'
  // if (getLanguage() === 'en') {
  //   // American Numbering System
  //   const th = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Quattuordecillion', 'Quindecillion', 'Sexdecillion', 'Septendecillion', 'Octodecillion']
  //   const dg = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  //   const tn = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  //   const tw = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  //   const s = number.toString()
  //   const x = s.length
  //   const n = s.split('')
  //   let str = ''
  //   let sk = 0
  //   for (let i = 0; i < x; i++) {
  //     if ((x - i) % 3 === 2) { // Số  hàng chục (tn || tw)
  //       if (n[i] === '1') {
  //         str += `${tn[parseInt(n[i + 1], 10)]} `
  //         i++
  //         sk = 1
  //       } else if (n[i] !== '0') {
  //         str += `${tw[parseInt(n[i], 10) - 2]} `
  //         sk = 1
  //       }
  //     } else if (n[i] !== '0') { // Số hàng trăm và hàng đơn vị
  //       str += `${dg[parseInt(n[i], 10)]} `
  //       if ((x - i) % 3 === 0) str += 'Hundred '
  //       sk = 1
  //     }
  //     if ((x - i) % 3 === 1) { // nghìn, triệu, tỷ, nghìn tỷ, nghìn nghìn tỷ
  //       if (sk) str += `${th[(x - i - 1) / 3]} `
  //       sk = 0
  //     }
  //   }
  //   return `${str} Vietnamese Dong`
  // }
}
// check serviceId servicesList from phoneNumber
const phoneFormatNetwork = (phoneNum) => {
  const phone = phoneNum.replace('+84', '0').replace(/\s/g, '')
  if (
    phone
  ) {
    const patrn = /^(091|094|0123|0124|0125|0127|0129|088|081|082|083|084|085)[0-9]{7}$/;
    if (patrn.exec(phone)) return 'Vinaphone';
  }
  if (phone) {
    const patrn = /^(096|097|098|0162|0163|0164|0165|0166|0167|0168|0169|086|032|033|034|035|036|037|038|039)[0-9]{7}$/;
    if (patrn.exec(phone)) return 'Viettel';
  }
  if (phone) {
    const patrn = /^(090|093|0120|0121|0122|0126|0128|089|070|079|077|076|078)[0-9]{7}$/;
    if (patrn.exec(phone)) return 'Mobifone';
  }
  // EVN check o viettel
  // if (phType.toUpperCase() == "EVN") {
  // var patrn = /^096[0-9]{7}$/;
  // if (!patrn.exec(phoneNum))
  // return false
  // }
  if (phoneNum) {
    const patrn = /^(099|0199|059)[0-9]{7}$/;
    if (patrn.exec(phoneNum)) return 'Gmobile';
  }
  if (phoneNum) {
    const patrn = /^(092|0188|0186|056|058|052)[0-9]{7}$/;
    if (patrn.exec(phoneNum)) return 'Vietnamobile';
  }
  if (phoneNum) {
    const patrn = /^(0155|095)[0-9]{7}$/;
    if (patrn.exec(phoneNum)) return 'Sfone';
  }
  return '';
}
const networkOperatorCheck = (number) => {
  const mobifoneNetwork = /^(090|093|089|070|076|077|078|079)\w+$/
  const viettelNetwork = /^(032|033|034|035|036|037|038|039|096|097|098|086)\w+$/
  const vinaphoneNetwork = /^(088|091|094|081|082|083|084|085)\w+$/
  if (mobifoneNetwork.test(number)) return 'Mobifone'
  if (viettelNetwork.test(number)) return 'Viettel'
  if (vinaphoneNetwork.test(number)) return 'Vinaphone'
  return ''
}
// check serviceID recharge from phoneNumber
const networkOperatorCheckRecharge = (numberPhone) => {
  const mobifoneNetwork = /^(090|093|089|070|076|077|078|079)\w+$/
  const viettelNetwork = /^(032|033|034|035|036|037|038|039|096|097|098|086)\w+$/
  const vinaphoneNetwork = /^(088|091|094|081|082|083|084|085)\w+$/
  const gMobileNetwork = /^(099|059)\w+$/
  const vietnamMobileNetwork = /^(092|056|058)\w+$/
  if (mobifoneNetwork.test(numberPhone)) return '14'
  if (viettelNetwork.test(numberPhone)) return '18'
  if (vinaphoneNetwork.test(numberPhone)) return '20'
  if (gMobileNetwork.test(numberPhone)) return '27'
  if (vietnamMobileNetwork.test(numberPhone)) return '601'
  return ''
}
// check billCodeNetwork
const networkBillCodeRecharge = (numberPhone) => {
  const mobifoneNetwork = /^(090|093|089|070|076|077|078|079)\w+$/
  const viettelNetwork = /^(032|033|034|035|036|037|038|039|096|097|098|086)\w+$/
  const vinaphoneNetwork = /^(088|091|094|081|082|083|084|085)\w+$/
  const gMobileNetwork = /^(099|059)\w+$/
  const vietnamMobileNetwork = /^(092|056|058)\w+$/
  if (mobifoneNetwork.test(numberPhone)) return 'VMS'
  if (viettelNetwork.test(numberPhone)) return 'VTT'
  if (vinaphoneNetwork.test(numberPhone)) return 'VNP'
  if (gMobileNetwork.test(numberPhone)) return 'BEE'
  if (vietnamMobileNetwork.test(numberPhone)) return 'VNM'
  return ''
}
// validate phoneNumber
const checkPhoneNumber = (numberPhone) => {
  const regex = /(03|07|05|08|09|01[2|6|8|9])+([0-9]{8})\b/
  if (regex.test(numberPhone)) return true
  return false
}
const removedSpecialCharacterFromNumber = (string) => {
  var newString = ''
  string.toString().trim().split(',').forEach((char) => newString += char)
  return newString
}
const formatInputTextIsAmount = (textValue) => {
  textValue = textValue.toString().replace(/[^\d]/g, '')
  if (textValue === '0') {
    textValue = ''
  }
  if (textValue.length > 3) {
    let temp = ''
    let lengthString = textValue.length

    while (lengthString > 3) {
      temp = `,${textValue.substr(lengthString - 3, lengthString)}${temp}`
      textValue = textValue.substr(0, lengthString - 3)
      lengthString = textValue.length
    }
    temp = textValue.substr(0, lengthString) + temp
    textValue = temp
  }
  return textValue
}
const returnGroupTypeFromServiceId = (data, serviceID) => {
  let temp
  const a0 = _.filter(data, (item) => {
    const a = _.filter(item.serviceList, (item1) => item1.serviceId == serviceID)
    if (a.length !== 0) temp = a
    return a.length !== 0
  })
  temp[0].groupType = a0[0].groupType
  return temp[0]
}
const returnServiceTypeFromServiceId = (data, serviceID) => (_.filter(data, (item) => _.filter(item.serviceList, (item1) => item1.serviceId === serviceID)).serviceList).serviceType
const checkAutoPayment = (serviceId) => {
  switch (serviceId) {
    case 800008:
    case 800010:
    case 800007:
    case 130:
    case 131:
    case 23:
    case 800009:
    case 200124:
    case 13:
    case 100118:
    case 200125:
    case 100007:
    case 100011:
    case 11:
    case 24:
    case 134:
    case 100119:
    case 200126:
    case 100006:
    case 100005:
    case 19:
    case 21:
    case 135:
    case 100003:
    case 100004:
    case 100028:
    case 200119:
    case 200122:
    case 16:
    case 800013:
      return true
    default:
      return false
  }
}
const getServiceRecharge = (groupType) => {
  switch (groupType) {
    case '0':
      return { title: I18n.t('saving.cardMobile'), route: 'CardMobileScreen' };
    case '6':
      return { title: I18n.t('product.title_card_recharge'), route: 'RechargeCardScreen' };
    case '2':
      return { title: I18n.t('product.title_game_recharge'), route: 'BuyGameCardScreen' };
    case '3':
      return { title: I18n.t('saving.title_fee'), route: 'PayFeeScreen' };
    case '4':
      return { title: I18n.t('product.title_buy_card_recharge'), route: 'BuyCardRechargeScreen' };

    default:
      return ''
  }
}
const getServicePayment = (index) => {
    let service
    let icon = ''
    let route
    switch (index) {
      case 0:
        service = I18n.t('product.service_list.mobile_payment')
        icon = 'icon-didong'
        route = 'MobilePaymentInputScreen'
        break;
      case 1:
        service = I18n.t('product.service_list.electric')
        icon = 'dien'
        route = 'ElectricPayment'
        break;
      case 2:
        service = I18n.t('product.service_list.water')
        icon = 'nuoc'
        route = 'ElectricPayment'
        break;
      case 3:
        service = I18n.t('product.service_list.television')
        icon = 'truyenhinh'
        route = 'ElectricPayment'

        break;
      case 4:
        service = I18n.t('product.service_list.internet')
        icon = 'internet'
        route = 'ElectricPayment'
        break;
      case 5:
        service = I18n.t('product.service_list.fixed_mobile')
        icon = 'icon-dtcodinh'
        route = 'FixedMobilePayment'
        break;
      case 6:
        service = I18n.t('product.service_list.ticket')
        icon = 'icon-ve-tauxe'
        route = 'TicketForm'
        break;
      case 7:
        service = I18n.t('product.service_list.insurrance')
        icon = 'icon-baohiem'
        route = 'ElectricPayment'
        break
      case 8:
        service = I18n.t('product.service_list.fee')
        icon = 'hocphi'
        route = 'ElectricPayment'
      break;
      default:
        service = ''
        break;
    }
    return { service, icon, route }
}
const toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10)
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60

  return [hours, minutes, seconds]
      .map(v => v < 10 ? `0${v}` : v)
      .filter((v, i) => v !== '00' || i > 0)
      .join(':')
}

const getTypeService = (groupType) => {
  switch (groupType) {
    case '0': case '1':
      return I18n.t('employee.phoneNumber');
    case '3': case '5':
      return I18n.t('product.customer_code');
    default:
      return I18n.t('product.card_number');
  }
}

const getCardCredit = (cardType, cardCode) => {
  if (cardType === 'C') {
    switch (cardCode) {
      case 'VISA':
        return Images.visa_credit
      case 'MASTER':
        return Images.master_credit
      default:
        return Images.visa_credit
    }
  } else {
    switch (cardCode) {
      case 'VISA':
        return Images.visa_debit
      case 'MASTER':
        return Images.master_debit
      default:
        return Images.local_debit
    }
  }
}

const TRANS_TYPES = {
  N: 'CK nội bộ',
  O: 'Thanh toán thẻ tín dụng',
  Y: 'Chuyển tiền nhanh 24/7'
}
export {
  numberToCurrency,
  EditThreeNumber,
  numberToVietnameseText,
  numberWithCommas,
  networkOperatorCheck,
  networkOperatorCheckRecharge,
  networkBillCodeRecharge,
  checkPhoneNumber,
  removedSpecialCharacterFromNumber,
  formatInputTextIsAmount,
  returnGroupTypeFromServiceId,
  returnServiceTypeFromServiceId,
  phoneFormatNetwork,
  checkAutoPayment,
  getServiceRecharge,
  getServicePayment,
  toHHMMSS,
  getTypeService,
  getCardCredit,
  TRANS_TYPES
}
