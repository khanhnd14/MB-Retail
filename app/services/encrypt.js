import * as CryptoJS from 'crypto-js';

export default EncryptService = {

    aesEncrypt : (message, key) => {
        return CryptoJS.AES.encrypt(message, key).toString();
    },

    aesDecrypt : (encryptedMessage, key) => {
        // wrap in try catch block because sometime the invalid key cos' Malformed UTF-8 data error
        try {
            return CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
        } catch (error) {
            return "";
        }
    },

    md5 : (message) => {
        return CryptoJS.MD5(message).toString();
    }
}