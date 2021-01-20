import storeService from '../../services/storeService'

const rs = require('jsrsasign')

export async function getBioCode(tokenTransaction) {
  try {
    const softTokenKey = await storeService.getFPVerifyKey()
    const sig = new rs.Signature({ alg: 'SHA1withRSA' })
    sig.init(softTokenKey.privateKey)
    let hexV = ''
    console.log('tokenTransaction:', tokenTransaction);

    if (!tokenTransaction) {
      const times = new Date().getTime().toString()
      hexV = sig.signString(times)
      hexV = `${times}|${hexV}`
    } else {
      hexV = sig.signString(tokenTransaction)
    }
    console.log('getBioCode selector:', hexV)
    return hexV
  } catch (error) {
    console.log('getBioCode error:', error)

    return ''
  }
}
