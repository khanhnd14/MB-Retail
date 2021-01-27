export default {
  login: {
    id: 'authByPassword',
    uri: 'login/authByPassword',
  },
  loginByBio: {
    id: 'loginByBio',
    uri: 'fingerprint/login2',
  },
  loginByPin: {
    id: 'loginByPin',
    uri: 'login/authByPincode',
  },
  setPinCode: {
    id: 'setPinCode',
    uri: 'login/setPinCode',
  },
  sendSmsActive: {
    id: 'sendSmsActive',
    uri: 'register/sendSmsActive',
  },
  activeService: {
    id: 'activeService',
    uri: 'register/activeService',
  },
  getCustomerInfo: {
    id: 'getCustomerInfo',
    uri: 'setting/getPersonalInfo',
    cache: false,
    cacheOptions: {
      interval: 3600, // re-fetch after "interval" seconds
    },
  },
  setCustomerInfo: {
    id: 'setPersonalInfo',
    uri: 'setting/setPersonalInfo',
  },
  getSofTokenInfo: {
    id: 'getSofTokenInfo',
    uri: 'softToken/getInfo',
    isGetFullResponse: true,
  },
  sendOtpSoftToken: {
    id: 'sendOtpSoftToken',
    uri: 'softToken/sendOTPActive',
  },
  activeSoftToken: {
    id: 'activeSoftToken',
    uri: 'softToken/active',
  },
  changePinSoftToken: {
    id: 'changePinSoftToken',
    uri: 'softToken/changePIN',
  },
  querySecurityList: {
    id: 'querySecurityList',
    uri: 'softToken/querySecurityList',
  },
  requestFingerTransaction: {
    id: 'requestFingerTransaciton',
    uri: 'fingerprint/requestFingerTransaciton',
  },
  registerFingerTransaction: {
    id: 'registerFingerTransaction',
    uri: 'fingerprint/registerFingerTransaciton',
  },
  countNotification: {
    id: 'countNotification',
    uri: 'setting/countNotice',
    hideError: true
  },
  changeAliasAccount: {
    id: 'changeAliasAccount',
    uri: 'account/setAliasName',
  },
  changPasscode: {
    id: 'changPasscode',
    uri: 'setting/changePasscodeByMB',
  },
  sendOTP: {
    id: 'sendOTP',
    uri: 'common/sendOTP',
  },
  checkHasPasscode: {
    id: 'checkHasPasscode',
    uri: 'setting/checkPasscode',
  },
  verifyPincode: {
    id: 'verifyPincode',
    uri: 'login/verifyPinCode',
  },
  makerTransaction: {
    id: 'makerTransaction',
    uri: 'common/makerTransaction',
    isGetFullResponse: true,
  },
  createPasscode: {
    id: 'createPasscode',
    uri: 'setting/changePasscode',
  },
  getOldPinCode: {
    id: 'getOldPinCode',
    uri: 'login/resetPincode',
  },
  getRedeemHistory: {
    id: 'getRedeemHistory',
    uri: 'loyalty/history',
    cache: true,
    cacheOptions: {
      interval: 300000, // re-fetch after "interval" seconds
    },
  },
  getLoyaltyInfo: {
    id: 'getLoyaltyInfo',
    uri: 'loyalty/getInfo',
    cache: true,
    cacheOptions: {
      interval: 300000, // re-fetch after "interval" seconds
    },
  },
  sendMessage: {
    id: 'sendMessage',
    uri: 'account/addInvestigation',
    type: 'form-data'
  },
  getServiceSupport: {
    id: 'getServiceSupport',
    uri: 'message/getService',
    cache: true,
    cacheOptions: {
      interval: 30000000, // re-fetch after "interval" seconds
    },
  },
  getMessage: {
    id: 'getMessage',
    uri: 'message/get',
    cache: false,
    cacheOptions: {
      interval: 600, // re-fetch after "interval" seconds
    },
  },
  deleteMessage: {
    id: 'deleteMessage',
    uri: 'message/delete',
  },
  readNotification: {
    id: 'readNotification',
    uri: 'notification/read',
  },
  deleteNotification: {
    id: 'deleteNotification',
    uri: 'notification/delete',
  },
  getNotification: {
    id: 'getNotification',
    uri: 'notification/get',
  },
  getNotificationAdvance: {
    id: 'getNotificationAdvance',
    uri: 'notification/advanceNew',
    hideError: true
  },
  getNotificationDetail: {
    id: 'getNotificationDetail',
    uri: 'notification/detail',
  },
  addNotification: {
    id: 'addNotification',
    uri: 'notification/add',
  },
  validateLimitTransaction: {
    id: 'validateLimitTransaction',
    uri: 'limit/validateLimitTransaction',
  },
  setLimitTransaction: {
    id: 'setLimitTransaction',
    uri: 'limit/setLimitTransaction',
  },
  getLimitTransaction: {
    id: 'getLimitTransaction',
    uri: 'limit/getLimitTransaction',
  },
  freezeService: {
    id: 'freezeService',
    uri: 'setting/freezing',
  },
  registerLoan: {
    id: 'registerLoan',
    uri: 'card/registerLoan',
  },
  checkExistUsername: {
    id: 'checkExistUsername',
    uri: 'setting/checkUserName',
  },
  applyCard: {
    id: 'applyCard',
    uri: 'card/registerCC',
  },
  changePassword: {
    id: 'changePassword',
    uri: 'setting/changePassword',
    isGetFullResponse: true,
  },
  setMasterAccount: {
    id: 'setMasterAccount',
    uri: 'account/setIsMaster',
  },
  accountList: {
    id: 'accountList',
    uri: 'account/list',
    cache: true,
    cacheOptions: {
      interval: 1, // re-fetch after "interval" seconds
    },
  },
  createSettlementOnline: {
    id: 'createSettlementOnline',
    uri: 'transfer/createSettlementOnline',
    cache: true,
    cacheOptions: {
      interval: 1, // re-fetch after "interval" seconds
    },
  },
  completeSettlementOnline: {
    id: 'completeSettlementOnline',
    uri: 'transfer/completeSettlementOnline',
    cache: true,
    cacheOptions: {
      interval: 1, // re-fetch after "interval" seconds
    },
  },
  validatePaymentCard: {
    id: 'validatePaymentCard',
    uri: 'card/prePay',
    isGetFullResponse: true,
  },
  payCreditCard: {
    id: 'payCreditCard',
    uri: 'card/pay',
  },
  checkCardName: {
    id: 'checkCardName',
    uri: 'card/checkCardName',
    cache: true,
    cacheOptions: {
      interval: 100000,
    },
  },
  fastMenu: {
    id: 'fastMenu',
    uri: 'setting/getFastMenu',
    cache: true,
    cacheOptions: {
      interval: 300000,
    },
  },
  cardList: {
    id: 'cardList',
    uri: 'card/list',
    cache: false,
    cacheOptions: {
      interval: 30000,
    },
  },
  fdAccountList: {
    id: 'fdAccountList',
    uri: 'account/listFDAcc',
    cache: true,
    cacheOptions: {
      interval: 5,
    },
  },
  getBeneficiary: {
    id: 'getBeneficiary',
    uri: 'bank/getBeneficary',
    cache: true,
    cacheOptions: {
      interval: 600,
    },
  },

  queryServiceList: {
    id: 'queryServiceList',
    uri: 'billpayment/queryServiceList',
    cache: false,
    cacheOptions: {
      interval: 30000,
    },
  },
  getBillAlias: {
    id: 'getBillAlias',
    uri: 'billpayment/getBillAlias',
    cache: true,
    cacheOptions: {
      interval: 600,
    },
  },
  getTodayBill: {
    id: 'getTodayBill',
    uri: 'billpayment/getTodayBill',
    cache: false,
    cacheOptions: {
      interval: 600,
    },
  },
  queryScheduleHistory: {
    id: 'queryScheduleHistory',
    uri: 'billpayment/queryScheduleHistory',
    cache: true,
    cacheOptions: {
      interval: 300,
    },
  },
  sendOTPRecharge: {
    id: 'sendOTPRecharge',
    uri: 'billpayment/sendOTPRecharge',
  },
  completeRecharge: {
    id: 'completeRecharge',
    uri: 'billpayment/completeRecharge',
    isGetFullResponse: true,
  },
  completePrepaidCardAPI: {
    id: 'completePrepaidCardAPI',
    uri: 'prepaidcard/completePrepaidCardAPI',
    isGetFullResponse: true,
  },
  queryHistoryBill: {
    id: 'queryHistoryBill',
    uri: 'billpayment/queryHistoryBill',
  },
  checkBill: {
    id: 'checkBill',
    uri: 'billpayment/checkBill',
  },
  paymentHistory: {
    id: 'paymentHistory',
    uri: 'history/byAccount',
    cache: true,
    cacheOptions: {
      interval: 15,
    },
  },
  payBill: {
    id: 'payBill',
    uri: 'billpayment/payBill',
  },
  completePayBill: {
    id: 'completePayBill',
    uri: 'billpayment/completePayBill',
  },
  shareEmailPayment: {
    id: 'shareEmailPayment',
    uri: 'billpayment/shareEmail',
  },
  queryScheduleBill: {
    id: 'queryScheduleBill',
    uri: 'billpayment/queryScheduleBill',
  },
  deleteScheduleBill: {
    id: 'deleteScheduleBill',
    uri: 'billpayment/deleteScheduleBill',
  },
  ignoreBill: {
    id: 'ignoreBill',
    uri: 'billpayment/ignoreBill',
  },

  cardHistory: {
    id: 'cardHistory',
    uri: 'card/historyAPI',
    cache: false,
    cacheOptions: {
      interval: 30000,
    },
  },
  caSaDetail: {
    id: 'caSaDetail',
    uri: 'account/CASADetail',
    cache: true,
    cacheOptions: {
      interval: 30000,
    },
  },
  transfersendOTP: {
    id: 'transfer/sendOTP',
    uri: 'transfer/sendOTP',
  },
  accountActionLinks: {
    id: 'accountActionLinks',
    uri: 'account/getLinkFormAcc',
    cache: true,
    cacheOptions: {
      interval: 30000,
    },
  },
  exChangeRate: {
    id: 'exChangeRate',
    uri: 'utils/exchangeRate',
    cache: true,
    cacheOptions: {
      interval: 2000,
    },
    isSkipSaveTime: true,
  },
  transferComplele: {
    id: 'transfer/complele',
    uri: 'transfer/complele',
  },
  transferCompleleSML: {
    id: 'transfer/compleleSML',
    uri: 'transfer/compleleSML',
  },
  bankGetListBank: {
    id: 'bank/getListBank',
    uri: 'bank/getListBank',
    cache: true,
    cacheOptions: {
      interval: 600000,
    },
  },
  bankGetListBankSML: {
    id: 'bank/getListBankSML',
    uri: 'bank/getListBankSML',
    cache: true,
    cacheOptions: {
      interval: 60000,
    },
  },
  bankGetListBankBranch: {
    id: 'bank/getListBankBranch',
    uri: 'bank/getListBankBranch',
    cache: true,
    cacheOptions: {
      interval: 300000,
    },
  },
  accountGetBenefitSML: {
    id: 'account/getBenefitSML',
    uri: 'account/getBenefitSML',
  },
  adsWidget: {
    id: 'adsWidget',
    uri: 'adv/getAdsWidget',
    cache: true,
    cacheOptions: {
      interval: 60000,
    },
    isSkipSaveTime: true,
  },
  transferSendMail: {
    id: 'transfer/sendMail',
    uri: 'transfer/sendMail',
  },
  transferSendMailSavingMB: {
    id: 'transfer/sendMailSavingMB',
    uri: 'transfer/sendMailSavingMB',
  },
  transferAddAlias: {
    id: 'transfer/addAlias',
    uri: 'transfer/addAlias',
  },
  savingLoadProductType: {
    // --> chi tiet tung san pham
    id: 'saving/loadProductType',
    uri: 'saving/loadProductType',
  },
  savingLoadOVAcc: {
    id: 'saving/loadOVAcc',
    uri: 'saving/loadOVAcc',
  },
  savingCreateSavingOnline: {
    id: 'saving/createSavingOnline',
    uri: 'saving/createSavingOnline',
  },
  savingCreateCAtoFD: {
    id: 'saving/createCAtoFD',
    uri: 'saving/createCAtoFD',
  },
  checkHoliday: {
    id: 'saving/checkHoliday',
    uri: 'saving/checkHoliday',
  },
  savingCompleteCAtoFD: {
    id: 'saving/completeCAtoFD',
    uri: 'saving/completeCAtoFD',
  },
  savingCompleteCAtoFDSchedule: {
    id: 'saving/completeCAtoFDSchedule',
    uri: 'saving/completeCAtoFDSchedule',
  },
  savingCompleteSavingOnline: {
    id: 'saving/completeSavingOnline',
    uri: 'saving/completeSavingOnline',
  },
  savingGetListCategory: {
    id: 'saving/getListCategory',
    uri: 'saving/getListCategory',
  },
  bankGetListStock: {
    id: 'bank/getListStock',
    uri: 'bank/getListStock',
    cache: true,
    cacheOptions: {
      interval: 90000,
    },
    isSkipSaveTime: true,
  },
  transferGetBenefitStock: {
    id: 'transfer/getBenefitStock',
    uri: 'transfer/getBenefitStock',
  },
  transferSendOTPStock: {
    id: 'transfer/sendOTPStock',
    uri: 'transfer/sendOTPStock',
  },
  transferCompleleStock: {
    id: 'transfer/compleleStock',
    uri: 'transfer/compleleStock',
  },
  historyLoadHistory: {
    id: 'history/loadHistory',
    uri: 'history/loadHistory',
  },
  historyDeleteHistory: {
    id: 'history/deleteHistory',
    uri: 'history/deleteHistory',
  },
  historyLoadTransferHisDetail: {
    id: 'history/loadTransferHisDetail',
    uri: 'history/loadTransferHisDetail',
  },
  historyLoadOVHisDetail: {
    id: 'history/loadOVHisDetail',
    uri: 'history/loadOVHisDetail',
  },
  historyLoadHistoryByPage: {
    id: 'history/loadHistoryByPage',
    uri: 'history/loadHistoryByPage',
  },
  bankGetBeneficary: {
    id: 'bank/getBeneficary',
    uri: 'bank/getBeneficary',
  },
  accountGetBenefitName: {
    id: 'account/getBenefitName',
    uri: 'account/getBenefitName',
  },
  beneficiaryValidateBeneficiary: {
    id: 'beneficiary/validateBeneficiary',
    uri: 'beneficiary/validateBeneficiary',
  },
  beneficiaryInsertUpdateBeneficiary: {
    id: 'beneficiary/insertUpdateBeneficiary',
    uri: 'beneficiary/insertUpdateBeneficiary',
  },
  beneficiaryDeleteBeneficiary: {
    id: 'beneficiary/deleteBeneficiary',
    uri: 'beneficiary/deleteBeneficiary',
  },
  cardFull: {
    id: 'card/full',
    uri: 'card/full',
  },
  cardChangeStatus: {
    id: 'card/changeStatus',
    uri: 'card/changeStatus',
    hideError: true
  },
  cardLoadLimit: {
    id: 'card/loadLimit',
    uri: 'card/loadLimit',
    cache: false,
  },
  cardChangeLimit: {
    id: 'card/changeLimit',
    uri: 'card/changeLimit',
  },
  uploadProfilePicture: {
    id: 'upload/profilePicture',
    uri: 'upload/profilePicture',
    type: 'form-data',
    isGetFullResponse: true,
  },
  registerForgotPass: {
    id: 'register/forgotPass',
    uri: 'register/forgotPass',
  },
  registerForgotPassMB: {
    id: 'register/forgotPassMB',
    uri: 'register/forgotPassMB',
  },
  registerForgotComplete: {
    id: 'register/forgotComplete',
    uri: 'register/forgotComplete',
  },
  historyByAccount: {
    id: 'history/byAccount',
    uri: 'history/byAccount',
    cache: true,
    cacheOptions: {
      interval: 15,
    },
  },
  getMarker: {
    id: 'getMarker',
    uri: 'utils/getMarker2',
    cache: true,
    cacheOptions: {
      interval: 86400,
    },
  },
  getInfo: {
    id: 'getInfo',
    uri: 'loyalty/getInfo',
  },
  parseQrData: {
    id: 'parseQrData',
    uri: 'qrCode/read',
  },
  commonUpdatePushId: {
    id: 'common/updatePushId',
    uri: 'common/updatePushId',
  },
  queryRedeemHist: {
    id: 'queryRedeemHist',
    uri: 'loyalty/queryRedeemHist',
    cache: true,
    cacheOptions: {
      interval: 30000,
    },
    isGetFullResponse: true,
  },

  queryPlanByCustomer: {
    id: 'queryPlanByCustomer',
    uri: 'loyalty/queryPlanByCustomer',
    isGetFullResponse: true,
  },
  queryPlanEnrollment: {
    id: 'queryPlanEnrollment',
    uri: 'loyalty/queryPlanEnrollment',
    isGetFullResponse: true,
  },
  loyaltyRegisterHist: {
    id: 'loyaltyRegisterHist',
    uri: 'loyalty/loyaltyRegisterHist',
    isGetFullResponse: true,
    cache: false,
  },
  queryServiceListTC: {
    id: 'queryServiceListTC',
    uri: 'rechargecard/queryServiceList',
    cache: true,
    cacheOptions: {
      interval: 30000,
    },
  },
  getCertType: {
    id: 'getCertType',
    uri: 'register/loadCertType',
    cache: true,
    cacheOptions: {
      interval: 300000,
    },
  },
  registerPrepaidCard: {
    id: 'registerPrepaidCard',
    uri: 'prepaidcard/register/userRegister',
    cache: false,
  },
  getHistoryPrepiadCard: {
    id: 'getHistoryPrepiadCard',
    uri: 'prepaidcard/getHistoryTransactions',
    cache: true,
    cacheOptions: {
      interval: 3,
    },
  },
  checkInfoRegisterPrepaid: {
    id: 'checkInfoRegisterPrepaid',
    uri: 'prepaidcard/register/checkInfo',
    cache: false,
  },
  loadProductRate: {
    id: 'loadProductRate',
    uri: 'saving/loadProductRate',
  },
  getShareCodeByUser: {
    id: 'getShareCodeByUser',
    uri: 'prepaidcard/getShareCodeByUser',
    cache: true,
    cacheOptions: {
      interval: 300000,
    },
  },
  queryOfferList: {
    id: 'queryOfferList',
    uri: 'offer/queryOfferList',
    cache: false,
  },
  offerList: {
    id: 'offer-list',
    uri: 'account/offer-account-list',
    cache: false,
  },
  queryRegisterDate: {
    id: 'queryRegisterDate',
    uri: 'offer/queryRegisterDate',
    cache: false,
  },
  historyOffer: {
    id: 'historyOffer',
    uri: 'offer/historyOffer',
    cache: false,
  },
  cancelOffer: {
    id: 'cancelOffer',
    uri: 'offer/cancelOffer',
    cache: false,
  },
  registerOffer: {
    id: 'registerOffer',
    uri: 'offer/registerOffer',
    cache: false,
  },
  shopOnline: {
    id: 'shopOnline',
    uri: 'shopOnline',
    cache: false,
  },
  queryServiceListVoucher: {
    id: 'queryServiceListVoucher',
    uri: 'evoucher/queryServiceList',
    cache: false,
  },
  checkPromotioncode: {
    id: 'checkPromotioncode',
    uri: 'discount/checkPromotioncode',
    cache: false,
  },
  amountStatus: {
    id: 'amountStatus',
    uri: 'loyalty/amountStatus',
  },
  cashBackHistory: {
    id: 'cashBackHistory',
    uri: 'loyalty/cashBackHistory',
  },
  reddemGiftHistory: {
    id: 'reddemGiftHistory',
    uri: 'loyalty/reddemGiftHistory',
  },
  redeemGetUrl: {
    id: 'redeemGetUrl',
    uri: 'urbox/getUrl',
  },
  getContractBalance: {
    id: 'getContractBalance',
    uri: 'card/getContractBalance',
  },
  prePayAPI: {
    id: 'prePayAPI',
    uri: 'card/prePayAPI',
  },
  payAPI: {
    id: 'payAPI',
    uri: 'card/payAPI',
  },
  getBenefitNameApiCard: {
    id: 'getBenefitNameApiCard',
    uri: 'rechargecard/account/getBenefitNameApi',
  },
  sendOTPPrepaidCard: {
    id: 'sendOTPPrepaidCard',
    uri: 'prepaidcard/sendOTPPrepaidCard',
  },
  sendOTPVerify: {
    id: 'sendOTPVerify',
    uri: 'ekyc/sendOTPVerify',
  },
  verifyOTP: {
    id: 'verifyOTP',
    uri: 'ekyc/verifyOTP',
    hideError: true
  },
  getTSToken: {
    id: 'getTSToken',
    uri: 'ekyc/getTSToken',
  },
  checkID: {
    id: 'checkID',
    uri: 'ekyc/checkID',
  },
  verifyCustomerInfo: {
    id: 'verifyCustomerInfo',
    uri: 'ekyc/verifyCustomerInfo',
  },
  saveAdditionInfo: {
    id: 'saveAdditionInfo',
    uri: 'ekyc/saveAdditionInfo',
  },
  saveLog: {
    id: 'saveLog',
    uri: 'ekyc/saveLog',
  },
  checkUserName: {
    id: 'checkUserName',
    uri: 'ekyc/checkUserName',
    hideError: true
  },
  getDistrict: {
    id: 'getDistrict',
    uri: 'ekyc/getDistrict',
  },
  getSubbranch: {
    id: 'getSubbranch',
    uri: 'ekyc/getSubbranch',
  },
  sendRegister: {
    id: 'sendRegister',
    uri: 'ekyc/sendRegister',
    hideError: true
  },
  saveReferralCode: {
    id: 'saveReferralCode',
    uri: 'ekyc/saveReferralCode',
  },
  activeEKYC: {
    id: 'activeEKYC',
    uri: 'ekyc/activeEKYC',
  },
  employeeGetInfo: {
    id: 'employeeGetInfo',
    uri: 'employee/getInfo',
  },
  employeeRegister: {
    id: 'employeeRegister',
    uri: 'employee/register',
  },
  employeeCompleteRegister: {
    id: 'employeeCompleteRegister',
    uri: 'employee/completeRegister',
  },
  employeeGetBalance: {
    id: 'employeeGetBalance',
    uri: 'employee/getBalance',
  },
  employeeTransfer: {
    id: 'employeeTransfer',
    uri: 'employee/sendOTPTransfer',
  },
  employeeDeregister: {
    id: 'employeeDeregister',
    uri: 'employee/deregister',
  },
  getPrivateKeyFingerprint: {
    id: 'getPrivateKeyFingerprint',
    uri: 'fingerprint/getPrivateKeyFingerprint',
  },
  forgotPassOTP: {
    id: 'forgotPassOTP',
    uri: 'register/forgotPassOTP',
  },
  forgotCompleteOTP: {
    id: 'forgotCompleteOTP',
    uri: 'register/forgotCompleteOTP',
  },
  completeSecurityType: {
    id: 'completeSecurityType',
    uri: 'softToken/completeSecurityType',
  },
  wordGameList: {
    id: 'wordGameList',
    uri: 'game/wordGameList',
  },
  sendOTPOnly: {
    id: 'sendOTPOnly',
    uri: 'common/sendOTPOnly',
  },
  logout: {
    id: 'logout',
    uri: 'login/logout',
  },
  checkAppVersion: {
    id: 'checkAppVersion',
    uri: 'common/checkAppVersion',
    hideError: true
  },
  notifyFireBase: {
    id: 'notifyFireBase',
    uri: 'notifyFireBase/view',
  },
  overdraftInit: {
    id: 'overdraftInit',
    uri: 'overdraftStaff/overdraftInit',
    hideError: true
  },
  overdraftPrepareRegister: {
    id: 'prepareRegister',
    uri: 'overdraftStaff/prepareRegister',
  },
  overdraftStaffComplete: {
    id: 'notifyFireBase',
    uri: 'overdraftStaff/completeRegister',
  },
  changeNotficationStatus: {
    id: 'changeNotficationStatus',
    uri: 'notification/changeNotficationStatus',
  },
  creditCardInit: {
    id: 'creditCardInit',
    uri: 'credit/creditCardInit',
  },
  creditCardListInfo: {
    id: 'creditCardListInfo',
    uri: 'credit/creditCardListInfo',
  },
  creditCardGetDistrict: {
    id: 'creditCardGetDistrict',
    uri: 'credit/getDistrict',
  },
  creditCardGetSubbranch: {
    id: 'creditCardGetDistrict',
    uri: 'credit/getSubbranch',
  },
  creditCardPrepare: {
    id: 'creditCardPrepare',
    uri: 'credit/creditCardPrepare',
  },
  creditCardComplete: {
    id: 'creditCardComplete',
    uri: 'credit/creditCardComplete',
  },
  // overdraft saving
  creationInfo: {
    id: 'creationInfo',
    uri: 'overdraft/creationInfo',
    cache: true,
    cacheOptions: { interval: 1 },
    hideError: true
  },
  listTCType: {
    id: 'listTCType',
    uri: 'overDraft/listTCType',
    cache: true,
    cacheOptions: { interval: 1 },
  },
  getPaymentAccount: {
    id: 'getPaymentAccount',
    uri: 'overdraft/getPaymentAccount',
    cache: true,
    cacheOptions: { interval: 1 },
  },
  purposeList: {
    id: 'purposeList',
    uri: 'overdraft/purposeList',
    cache: true,
    cacheOptions: { interval: 1 },
  },
  overdraftSendOTPRegister: {
    id: 'overdraftSendOTPRegister',
    uri: 'overdraft/sendOTPRegister',
    cache: true,
    cacheOptions: { interval: 1 },
  },
  overdraftCompleteRegister: {
    id: 'overdraftCompleteRegister',
    uri: 'overdraft/completeRegister',
    cache: true,
    cacheOptions: { interval: 1 },
    isGetFullResponse: true,
  },
}
