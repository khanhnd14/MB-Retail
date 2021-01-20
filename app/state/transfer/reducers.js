import * as types from './types'
import * as appTypes from '../application/types'
import * as stockTypes from '../stocktransfer/types'
import * as saveTypes from '../save/types'
import * as productTypes from '../product/types'

const resetState = {
  benefitSelected: null,
  transferConfirm: null,
  toBenefitBank: null,
  toBenefitBranch: null,
  toBenefitName: '',
  sendOtpError: null,
  transDate: null,
  validatedDate: null,
  expiredDate: null,
  frqType: 'D',
  endType: 'L',
  frqLimit: 1,
  debitDate: 0,
  debitDateName: '',
  editSchedule: {
    validatedDate: null,
    expiredDate: null,
    frqType: 'D',
    endType: 'L',
    frqLimit: 1,
    debitDate: 0,
  },
  isNow: true,
  transferComplete: null,
  transferError: null,
  isScheduleDate: true, // lịch định kỳ 1 ngày
}
const initialState = {
  rolloutAcc: [],
  beneficiaryN: [],
  beneficiaryS: [],
  beneficiaryY: [],
  benefitSelected: null,
  transferConfirm: null,
  toBenefitBank: null,
  toBenefitBranch: null,
  toBenefitName: '',
  type: '',
  sendOtpError: null,
  listBank: [],
  listBankSML: [],
  listBranch: [],
  transDate: null,
  validatedDate: null,
  expiredDate: null,
  frqType: 'D',
  endType: 'L',
  frqLimit: 1,
  debitDate: 0,
  debitDateName: '',
  isNow: true,
  editSchedule: {
    validatedDate: null,
    expiredDate: null,
    frqType: 'D',
    endType: 'L',
    frqLimit: 1,
    debitDate: 0,
  },
  isScheduleDate: true, // lịch định kỳ 1 ngày
  transferComplete: null,
  transferError: null,
  benefitSelectedError: null,
  sendOtpOnlyComplete: null,
  sendOtpOnlyError: null,

  sendEmailComplete: null,
  sendEmailError: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.GET_ACC_COMPLETED:
      return { ...state, rolloutAcc: action.payload }
    case types.GET_BENEFICIARY_COMPLETED:
      if (action.meta.transType === 'N') {
        return { ...state, beneficiaryN: action.payload }
      }
      if (action.meta.transType === 'S') {
        return { ...state, beneficiaryS: action.payload }
      }
      if (action.meta.transType === 'Y') {
        return { ...state, beneficiaryY: action.payload }
      }
      return { ...state, beneficiaryN: action.payload }
    case types.GET_BANK_COMPLETED:
      if (action.meta.type === 'Y') {
        return { ...state, listBank: action.payload }
      }
      return { ...state, listBankSML: action.payload }
    case types.SELECT_BENEFIT_ACCNO:
      return {
        ...state,
        benefitSelected: action.payload,
        toBenefitBank: action.payload.beneficiaryBankId
          ? {
              bankNo: action.payload.beneficiaryBankId,
              bankName: action.payload.beneficiaryBankName,
            }
          : null,
        toBenefitBranch: action.payload.beneficiaryBranchNo
          ? {
              bankOrgName: action.payload.beneficiaryBranchName,
              bankOrgNo: action.payload.beneficiaryBranchNo,
            }
          : null,
      }
    case types.SELECT_BENEFIT_ACCNO_INTERBANK:
      return {
        ...state,
        benefitSelected: action.payload,
      }
    case types.GET_ACC_INTERBANK_COMPLETED:
      return {
        ...state,
        benefitSelected: {
          ...action.payload,
          beneficiaryAccountNo: action.meta.body.beneficiaryAccount,
        },
        toBenefitBank: {
          bankNo: action.payload.beneficiaryBankId,
          bankName: action.payload.beneficiaryBankName,
        },
        toBenefitBranch: {
          bankOrgName: action.payload.beneficiaryBranchName,
          bankOrgNo: action.payload.beneficiaryBranchNo,
        },
      }
    case types.GET_ACC_INTERNAL_COMPLETED:
      return {
        ...state,
        benefitSelected: {
          beneficiaryName: action.payload.name,
          beneficiaryAccountNo: action.meta.body.toBenefitAcc,
        },
      }
    case types.GET_ACC_INTERBANK_FAILED:
    case types.GET_ACC_INTERNAL_FAILED:
      return { ...state, benefitSelectedError: action.payload }
    case types.SEND_OTP_COMPLETED:
    case stockTypes.GET_OTP_TRANSFER_COMPLETED:
      return { ...state, transferConfirm: action.payload }
    case types.GET_BANK_BRANCH_COMPLETED:
      return { ...state, listBranch: action.payload }
    case types.SEND_OTP_FAILED:
      return { ...state, sendOtpError: action.payload }
    case types.SEND_OTP:
      return { ...state, type: action.meta.body.type }
    case types.SET_SCHEDULE_INFO:
      return { ...state, editSchedule: { ...state.editSchedule, ...action.payload } }
    case types.SET_SCHEDULE_TRANSFER:
      return { ...state, ...action.payload }
    case types.TRANSFER_COMPLETED:
      return { ...state, transferComplete: action.payload }
    case types.TRANSFER_FAILED:
      return { ...state, transferError: action.payload }
    case types.SELECT_BANK:
      return { ...state, toBenefitBank: action.payload }
    case types.SELECT_BRANCH:
      return { ...state, toBenefitBranch: action.payload }

    case types.SEND_EMAIL_COMPLETED:
    case saveTypes.SAVING_SEND_EMAIL_COMPLETED:
    case productTypes.PAYMENT_SEND_EMAIL_COMPLETED:
    case productTypes.RECHARGE_SEND_EMAIL_COMPLETED:
      return { ...state, sendEmailComplete: action.payload }

    case types.SEND_EMAIL_FAILED:
    case saveTypes.SAVING_SEND_EMAIL_FAILED:
    case productTypes.PAYMENT_SEND_EMAIL_FAILED:
    case productTypes.RECHARGE_SEND_EMAIL_FAILED:
      return { ...state, sendEmailError: action.payload }

    case types.SEND_OTP_ONLY_COMPLETED:
      return { ...state, sendOtpOnlyComplete: action.payload }
    case types.SEND_OTP_ONLY_FAILED:
      return { ...state, sendOtpOnlyError: action.payload }

    case appTypes.REACTIVE:
      return initialState
    case types.RESET_TRANSFER:
      return {
        ...state,
        ...resetState,
      }
    default:
      return state
  }
}
