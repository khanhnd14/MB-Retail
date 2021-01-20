import * as CryptoJS from 'crypto-js';

export function md5(message) {
  return CryptoJS.MD5(message).toString();
}

export function aesEncrypt(message, key) {
  return CryptoJS.AES.encrypt(message, key).toString();
}
export function aesDecrypt(encryptedMessage, key) {
  try {
    return CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return '';
  }
}
