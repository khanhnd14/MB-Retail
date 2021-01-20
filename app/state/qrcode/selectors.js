import storeService from '../../services/storeService'
import { Utils } from '../../utilities'

const rs = require('jsrsasign')
const jsotp = require('jsotp');

export async function getPinCode() {
  try {
    const softTokenKey = await storeService.getSoftTokenKey()
    const hexKey = rs.b64tohex(softTokenKey.pin)
    const keyObj = rs.KEYUTIL.getKey(softTokenKey.privateKey)
    const keydecode = rs.KJUR.crypto.Cipher.decrypt(hexKey, keyObj, 'RSA')
    console.log('getPinCode:', keydecode);

    return keydecode
  } catch (error) {
    return ''
  }
}

export async function getHOTP(tranId) {
  try {
    const softTokenKey = await storeService.getSoftTokenKey()

    const secretKeyEncoded = softTokenKey.secretKey;
    const privateKeyST = softTokenKey.privateKey;
    // giai ma sk
    const hexKey = rs.b64tohex(secretKeyEncoded);
    const keyObj = rs.KEYUTIL.getKey(privateKeyST);
    const keydecode = rs.KJUR.crypto.Cipher.decrypt(hexKey, keyObj, 'RSA');

    const hotp = jsotp.HOTP(keydecode, 8);
    return hotp.at(tranId);
  } catch (error) {
    return ''
  }
}

export async function getQROtp(qrString) {
  try {
    const softTokenKey = await storeService.getSoftTokenKey()

    const secretKeyEncoded = softTokenKey.secretKey;
    const privateKeyST = softTokenKey.privateKey;
    const qrdata = Utils.converIsoToJSON(qrString);
    // giai ma sk
    const hexKey = rs.b64tohex(secretKeyEncoded);
    const keyObj = rs.KEYUTIL.getKey(privateKeyST);
    const keydecode = rs.KJUR.crypto.Cipher.decrypt(hexKey, keyObj, 'RSA');
    const hotp = jsotp.HOTP(keydecode, 8);
    return hotp.at(qrdata.tranId);
  } catch (error) {
    return ''
  }
}
