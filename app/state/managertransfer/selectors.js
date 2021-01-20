// tìm kiếm bank
export function filterBenefits(text, listBenefit) {
  try {
    const safe = String(text || '').replace(/([.*^$+?!(){}\[\]\/\\])/g, '\\$1')
    const regex = new RegExp(safe, 'i')
    const filter = (row) => regex.test(row.beneficiaryAlias) || regex.test(row.beneficiaryAccountNo)
    return listBenefit.filter(filter)
  } catch (error) {
    return []
  }
}
