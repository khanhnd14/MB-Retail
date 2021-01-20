/* eslint-disable no-continue */
/* eslint-disable no-useless-escape */
import _ from 'lodash'
import I18n from '../../translations'
import { Utils } from '../../utilities'

export function filterDatasource(text, listBeneficiary) {
  const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1')
  const regex = new RegExp(safe, 'i')
  const filter = (row) => regex.test(row.beneficiaryAccountNo) || regex.test(row.beneficiaryAlias)
  const out = []
  for (const sectionID in listBeneficiary) {
    if (!listBeneficiary.hasOwnProperty(sectionID)) {
      continue
    }
    const data = listBeneficiary[sectionID].data.filter(filter)
    out.push({
      data,
      category: listBeneficiary[sectionID].category,
    })
  }
  return out
}

export function amountToWord(amount) {
  let aWord = ''
  if (amount.length > 0) {
    if (I18n.locale === 'en') {
      aWord = Utils.capitalizeFirstLetter(
        `${Utils.toEnglishCash(amount)
          .toLowerCase()
          .trim()} dong`
      )
    } else {
      aWord = Utils.capitalizeFirstLetter(
        `${Utils.toVietNameseCash(amount)
          .toLowerCase()
          .trim()} đồng`
      )
    }
  } else {
    aWord = ' '
  }
  return aWord
}

// format lại danh sách tài khoàn thụ hưởng
export function getBeneficiaryInternal(defaultAcc, lstBnfDefault) {
  const listOwn = _.filter(lstBnfDefault, (acc) => acc.type === 'O')
  const listHis = _.filter(lstBnfDefault, (acc) => acc.type === 'H')
  const lstTrust = _.filter(lstBnfDefault, (acc) => acc.type === 'T')
  const listNotTrust = _.filter(lstBnfDefault, (acc) => acc.type === 'N')

  if (listOwn.length > 0) {
    for (let i = 0; i < listOwn.length; i++) {
      if (listOwn[i].beneficiaryAccountNo === defaultAcc) {
        listOwn.splice(i, 1)
        break
      }
    }
  }

  const data = {
    bnfOwn: {
      category: I18n.t('transfer.bnfOwn'),
      data: listOwn,
    },
    bnfTrust: {
      category: I18n.t('transfer.bnfTrust'),
      data: lstTrust,
    },
    bnfNotTrust: {
      category: I18n.t('transfer.bnfNotTrust'),
      data: listNotTrust,
    },
    bnfHis: {
      category: I18n.t('transfer.bnfHis'),
      data: listHis,
    },
  }
  return data
}

// format lại danh sách bank
export function formatBanks(result) {
  try {
    const listbank = result.sort((a, b) => {
      const x = a.bankName.substring(0, 1).toLowerCase()
      const y = b.bankName.substring(0, 1).toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0
    })
    return listbank
  } catch (error) {
    return []
  }
}

// format lại danh sách branch
export function formatBranch(result) {
  try {
    const listbank = result.sort((a, b) => {
      const indexA = a.bankOrgName.indexOf(' ')
      const indexB = b.bankOrgName.indexOf(' ')
      const charA = a.bankOrgName.substring(indexA + 1, indexA + 2).toUpperCase()
      const charB = b.bankOrgName.substring(indexB + 1, indexB + 2).toUpperCase()

      const x = charA.toLowerCase()
      const y = charB.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0
    })
    return listbank
  } catch (error) {
    return []
  }
}
// tìm kiếm bank
export function filterBanks(text, listBank) {
  try {
    const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1')
    const regex = new RegExp(safe, 'i')
    const filter = (row) => regex.test(row.bankName)
    return listBank.filter(filter)
  } catch (error) {
    return []
  }
}

// tìm kiếm bank
export function filterBankBranch(text, listBank) {
  try {
    const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1')
    const regex = new RegExp(safe, 'i')
    const filter = (row) => regex.test(row.bankOrgName)
    return listBank.filter(filter)
  } catch (error) {
    return []
  }
}

export function getLoopText(type) {
  switch (type) {
    case 'D':
      return I18n.t('transfer.daily')
    case 'W':
      return I18n.t('transfer.weekly')
    case 'M':
      return I18n.t('transfer.monthly')
    default:
      return I18n.t('transfer.daily')
  }
}
/* EndType - E : Có thời hạn , C :Số lần , L : Vô thời hạn */
export function getEndText(endType, frqLimit, expriedDate) {
  switch (endType) {
    case 'E':
      return `${Utils.toStringServerDate(expriedDate)}`
    case 'C':
      return `${I18n.t('transfer.endTypeC')} ${frqLimit}`
    case 'L':
      return I18n.t('transfer.never_end')
    default:
      return ''
  }
}
