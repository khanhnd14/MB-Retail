import * as types from './types'
import { resourceHttp } from '../../services'




export const completeTransaction = () => (dispatch) => {
  dispatch({
    type: types.COMPLETE_TRANSACTION
  })
}

export const sendOtpOnly = (body) => (dispatch) => {
  dispatch({
    type: types.SEND_OTP_ONLY,
    meta: {
      ...resourceHttp.sendOTPOnly,
      body
    },
  })
}

export const completeRegister = (body) => (dispatch) => {
  dispatch({
    type: types.COMPLETE_REGISTER,
    meta: {
      ...resourceHttp.overdraftCompleteRegister,
      body
    },
  })
}

export const sendOTPRegister = (body) => (dispatch) => {
  dispatch({
    type: types.SEND_OTP_REGISTER,
    meta: {
      ...resourceHttp.overdraftSendOTPRegister,
      body
      // fdList,rolloutAcctNo,effectiveDate,expireDate,purpose
    },
  })
}

export const creationInfo = () => (dispatch) => {
  dispatch({
    type: types.CREATION_INFO,
    meta: {
      ...resourceHttp.creationInfo
    },
  })
}

export const listTCType = () => (dispatch) => {
  dispatch({
    type: types.LIST_TC_TYPE,
    meta: {
      ...resourceHttp.listTCType
    },
  })
}

export const getPaymentAccount = () => (dispatch) => {
  dispatch({
    type: types.GET_PAYMENT_ACCOUNT,
    meta: {
      ...resourceHttp.getPaymentAccount
    },
  })
}

export const purposeList = () => (dispatch) => {
  dispatch({
    type: types.PURPOSE_LIST,
    meta: {
      ...resourceHttp.purposeList
    },
  })
}
//====== old ======
export const getAcount = () => (dispatch) => {
  dispatch({
    type: types.GET_ACCOUNT,
    meta: {
      ...resourceHttp.accountList,
      body: {
        acctType: "'CA'",
        currencyCode: 'VND',
      },
    },
  })
}

export const getListSaveAcount = () => (dispatch) => {
  dispatch({
    type: types.GET_LIST_SAVE_ACCOUNT,
    meta: {
      ...resourceHttp.fdAccountList,
    },
  })
}

export const loadRate = (productCode, payment) => (dispatch) => {
  dispatch({
    type: types.GET_SAVING_RATE,
    meta: {
      ...resourceHttp.loadProductRate,
      body: {
        productType: productCode,
        amount: payment
      },
    },
  })
}

export const getProductType = () => (dispatch) => {
  dispatch({
    type: types.GET_PRODUCT_TYPE,
    meta: {
      ...resourceHttp.savingLoadProductType,
    },
  })
}

export const getCategory = () => (dispatch) => {
  dispatch({
    type: types.GET_CATEGORY,
    meta: {
      ...resourceHttp.savingGetListCategory,
    },
  })
}

export const createSavingOnline = (category, productType, fromAcc, amount, ddAccount, startedTime, expiredTime, renewMatter = 'Y', isSavingOffer = false, freqCode = 'D') => (dispatch) => {
  const body = {
    category,
    productType,
    fromAcc,
    amount,
    renewMatter,
    isSavingOffer,
    freqCode,
    ddAccount,
    startedTime,
    expiredTime
  };
  console.log('====================================');
  console.log('body', body);
  console.log('====================================');
  dispatch({
    type: types.CREATE_SAVING,
    meta: {
      ...resourceHttp.savingCreateSavingOnline,
      body,
    },
  })
}

export const createFinalization = (fdAcc, category, bnfAcc) => (dispatch) => {
  dispatch({
    type: types.SAVE_DATA_FINALIZATION,
    payload: {
      fdAcc,
      category,
      bnfAcc
    }
  })
  dispatch({
    type: types.CREATE_FINALIZATION,
    meta: {
      ...resourceHttp.createSettlementOnline,
      body: {
        fdAcc,
        category,
        bnfAcc,
        isFullSettle: false
      }
    },
  })
}

export const verifyOtpFinalization = (sessionId, otpInput, tokenTransaction) => (dispatch) => {
  dispatch({
    type: types.VERIFY_OTP_FINALIZATION,
    meta: {
      ...resourceHttp.completeSettlementOnline,
      body: {
        tokenTransaction,
        sessionId,
        otpInput,
      }
    },
  })
}

export const changeAliasName = (accNo, alias) => (dispatch) => {
  const body = {
    accNo,
    alias
  }
  dispatch({
    type: types.SAVE_CHANGE_ALIAS_NAME,
    meta: {
      ...resourceHttp.changeAliasAccount,
      body
    },
  })
}

export const completeSavingOnline = (tokenTransaction, category, productType, renewMatter) => (dispatch) => {
  const body = {
    tokenTransaction,
    category,
    productType,
    renewMatter
  }
  dispatch({
    type: types.COMPLETE_SAVING_ONLINE,
    meta: {
      ...resourceHttp.savingCompleteSavingOnline,
      body
    },
  })
}

export const savingSendEmail = (savingType, email, tokenTransaction) => (dispatch) => {
  const body = {
    tokenTransaction,
    email,
    savingType,
  }
  dispatch({
    type: types.SAVING_SEND_EMAIL,
    meta: {
      ...resourceHttp.transferSendMailSavingMB,
      body
    },
  })
}

export const savingCreateCAtoFD = (body) => (dispatch) => {
  dispatch({
    type: types.SAVING_CREATE_CA_FD,
    meta: {
      ...resourceHttp.savingCreateCAtoFD,
      body
    },
  })
}

export const savingCompleteCAtoFD = (body) => (dispatch) => {
  dispatch({
    type: types.SAVING_COMPLETE_CA_FD,
    meta: {
      ...resourceHttp.savingCompleteCAtoFD,
      body
    },
  })
}

export const checkHoliday = () => (dispatch) => {
  dispatch({
    type: types.CHECK_HOLIDAY,
    meta: {
      ...resourceHttp.checkHoliday,
    },
  })
}

export const dispatchSchedule = (form) => (dispatch) => {
  dispatch({
    type: types.DISPATCH_SCHEDULE,
    payload: form
  })
}

export const reset = () => (dispatch) => {
  dispatch({
    type: types.RESET_STORE
  })
}
