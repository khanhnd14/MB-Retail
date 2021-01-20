/* eslint-disable no-continue */
/* eslint-disable no-useless-escape */
import _ from 'lodash'
import I18n from '../../translations'
import { Utils } from '../../utilities'

export function filterDatasource(text, listData) {
  const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1')
  const regex = new RegExp(safe, 'i')
  const filter = (row) => regex.test(row.beneficiaryAccountNo) || regex.test(row.beneficiaryAlias)
  const out = []
  for (const sectionID in listData) {
    if (!listData.hasOwnProperty(sectionID)) {
      continue
    }
    const data = listData[sectionID].data.filter(filter)
    out.push({
      data,
      category: listData[sectionID].category,
    })
  }
  return out
}
