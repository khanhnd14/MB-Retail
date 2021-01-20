/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { TouchableOpacity, View, StyleSheet, TouchableHighlight, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import {
  Topbar,
  Text,
  AmountLabel,
  Icon,
  AmountSuggest,
  TextInput,
  Radio,
  ConfirmButton,
  NoteSheet,
} from '../../../components'
import { transferOperations, transferSelectors } from '../../../state/transfer'
import { Utils } from '../../../utilities'
import I18n from '../../../translations'
import AccountSheet from '../common/AccountSheet'
import * as Navigation from '../../../navigation'
import Note from '../../../components/SaveMoney/Note'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
  },
  element: {
    ...Helpers.rowCross,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
  },
  content: {
    color: Colors.textBlack,
    paddingVertical: Metrics.tiny / 2,
  },
  contentBold: {
    color: Colors.textBlack,

    paddingVertical: Metrics.tiny,
  },
  contentAmount: {
    color: Colors.text,
    paddingVertical: Metrics.tiny / 2,
  },
  line: {
    backgroundColor: Colors.line,
    height: 1,
  },
  formAmount: {
    fontSize: 12,
    paddingVertical: 4,
    color: Colors.gray1,
  },
  btnContinue: {
    padding: 12,
    ...Helpers.contentWidth,
    marginVertical: Metrics.normal,
  },
  boxTypeTransfer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.line,
  },
  boxSelectTransfer: {
    flex: 1,
    paddingVertical: Metrics.small * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary2,
    justifyContent: 'center',
  },
  boxUnselectTransfer: {
    flex: 1,
    paddingVertical: Metrics.small * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderStyle: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.line,
    height: 5,
  },
  labelSelect: {
    color: Colors.primary2,
  },
  labelUnSelect: {
    color: Colors.black,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.medium,
    width: '100%',
    marginTop: Metrics.small,
    marginHorizontal: Metrics.small,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input: {
    paddingTop: Metrics.small,
  },
})

const InterbankTransfer = ({ route }) => {
  const transType = route ? route.params.transType : 'A'
  const {
    benefitSelected,
    rolloutAcc,
    transferConfirm,
    sendOtpError,
    listBank,
    listBankSML,
    isNow,
    toBenefitBank,
    toBenefitBranch,
    debitDate,
    frqType,
    endType,
    frqLimit,
    transDate,
    validatedDate,
    expiredDate,
  } = useSelector((state) => state.transfer)
  const { timeCreateToken } = useSelector((state) => state.user)
  const [fromAcc, setFromAcc] = useState('')
  const [fromAccName, setFromAccName] = useState('')
  const [fromAccAmount, setFromAccAmount] = useState(0)
  const [amount, setAmount] = useState(0)
  const [amountInWord, setAmoutInWord] = useState(null)
  const [content, setContent] = useState('')
  const [accountName, setAccountName] = useState('')
  const [isContinue, setContinue] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState(transType || 'A')
  const [selectedAcc, setSelectedAcc] = useState(null)

  const sheetAcc = useRef(null)
  const sheetNote = useRef(null)
  // const sheetBank = useRef(null)
  // const sheetBranch = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    getData()
    return () => dispatch(transferOperations.reset())
  }, [])

  useEffect(() => {
    initData()
  }, [rolloutAcc])

  useEffect(() => {
    formValidate()
  }, [benefitSelected, amount, rolloutAcc])

  useEffect(() => {
    if (benefitSelected) {
      setAccountName(benefitSelected.beneficiaryName)
    }
  }, [benefitSelected])

  useEffect(() => {
    setLoading(false)
  }, [sendOtpError])

  useEffect(() => {
    if (!Utils.isArrayEmpty(listBank)) {
      transferSelectors.formatBanks(listBank)
    }
  }, [listBank])

  useEffect(() => {
    if (!Utils.isArrayEmpty(listBankSML)) {
      transferSelectors.formatBanks(listBankSML)
    }
  }, [listBankSML])

  useEffect(() => {
    if (transferConfirm) {
      setLoading(false)
      Navigation.push('TransferConfirm', {
        fromAcc,
        fromAccName,
        amountInWord,
      })
    }
  }, [transferConfirm])

  const getData = () => {
    dispatch(transferOperations.getBeneficiary('S'))
    dispatch(transferOperations.getBeneficiary('Y'))
    dispatch(transferOperations.getRolloutAcc())
    dispatch(transferOperations.getListBank('A'))
  }

  const onAmoutChange = (amount) => {
    setAmount(amount.replace(/,/g, ''))
    setAmoutInWord(transferSelectors.amountToWord(amount))
  }

  const onSelectAccount = (defaultAccount) => {
    if (defaultAccount) {
      setFromAcc(defaultAccount.acctNo)
      setFromAccName(defaultAccount.alias)
      setFromAccAmount(defaultAccount.availableBalance)
      setSelectedAcc(defaultAccount)
    }
  }

  const initData = () => {
    if (rolloutAcc) {
      const defaultAccount = rolloutAcc[0]
      if (defaultAccount) {
        setFromAcc(defaultAccount.acctNo)
        setFromAccName(defaultAccount.alias)
        setFromAccAmount(defaultAccount.availableBalance)
        setSelectedAcc(defaultAccount)
      }
    }
  }

  const formValidate = () => {
    if (fromAcc) {
      if (type === 'Y') {
        if (toBenefitBranch && toBenefitBank) {
          setContinue(amount > 0)
        }
      } else {
        setContinue(amount > 0)
      }
    }
  }

  const transferTypeChange = (type) => {
    setType(type)
    onReset()
    dispatch(transferOperations.reset())
    if (type === 'Y' && Utils.isArrayEmpty(listBank)) {
      dispatch(transferOperations.getListBank(type))
    }
  }

  const onReset = () => {
    setAmount(0)
    setContent('')
    setAccountName('')
    setAmoutInWord(null)
  }

  const onSchedule = () => {
    Navigation.push('ScheduleTransfer')
  }

  const setNow = () => {
    dispatch(transferOperations.setScheduleTransfer({ isNow: true }))
  }

  const onConfirm = () => {
    if (isContinue && benefitSelected) {
      setLoading(true)
      const currDate = new Date(timeCreateToken)
      const tDate = Utils.toStringDate(transDate || currDate)
      const vDate = validatedDate == null ? tDate : Utils.toStringDate(validatedDate)
      const eDate = expiredDate == null ? tDate : Utils.toStringDate(expiredDate)
      const toBenefitName = benefitSelected ? benefitSelected.beneficiaryName : ''
      const body = {
        type,
        fromAcc,
        amount,
        purpose: Utils.clean_vietnamese(content),
        toBenefitAcc: benefitSelected.beneficiaryAccountNo,
        toBenefitName,
        toBenefitBranchId: toBenefitBranch.bankOrgNo,
        toBenefitBankId: toBenefitBank.bankNo,
        toBenefitBankName: toBenefitBank.bankName,
        toBenefitBranchName: toBenefitBranch.bankOrgName,
        isNow,
        transDate: tDate,
        validatedDate: vDate,
        expiredDate: eDate,
        frqType: frqType || '',
        endType: endType || '',
        frqLimit: frqLimit || '',
        debitDate: debitDate || '',
      }
      dispatch(transferOperations.sendOtp(body))
    } else {
      Utils.toast(I18n.t('application.input_empty'))
    }
  }

  const selectAcc = () => {
    sheetAcc.current && sheetAcc.current.show()
  }

  const showNote = () => {
    sheetNote.current && sheetNote.current.show()
  }

  const selectBenefitAcc = () => {
    Navigation.push('BenefitInterbank', { selectedAcc: fromAcc, type })
  }

  const beneficiaryAccountNo = benefitSelected ? benefitSelected.beneficiaryAccountNo : ''
  const beneficiaryName = benefitSelected ? benefitSelected.beneficiaryName : null
  const beneficiaryBankName = toBenefitBank ? toBenefitBank.bankName : null
  const beneficiaryBranchName = toBenefitBranch ? toBenefitBranch.bankOrgName : ''
  const quickStyle = type === 'A' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const normalStyle = type === 'Y' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const cardStyle = type === 'C' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const quickTextStyle = type === 'A' ? styles.labelSelect : styles.labelUnSelect
  const normalTextStyle = type === 'Y' ? styles.labelSelect : styles.labelUnSelect
  const cardTextStyle = type === 'C' ? styles.labelSelect : styles.labelUnSelect
  const textBenefitAccountNo =
    beneficiaryAccountNo ||
    (type === 'C' ? I18n.t('transfer.holder_card') : I18n.t('transfer.holder_account'))
  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.title')} subTitle={I18n.t('transfer.interbank_transfer')} />
      <View style={[Helpers.fillColCross, { backgroundColor: Colors.mainBg }]}>
        <View style={styles.boxTypeTransfer}>
          {/* Chuyển nhanh */}
          <TouchableHighlight
            style={quickStyle}
            onPress={() => transferTypeChange('A')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={quickTextStyle}>{I18n.t('transfer.transfer_acct')}</Text>
          </TouchableHighlight>
          {/* Chuyển qua thẻ */}
          <TouchableHighlight
            style={cardStyle}
            onPress={() => transferTypeChange('C')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={cardTextStyle}>{I18n.t('transfer.transfer_card')}</Text>
          </TouchableHighlight>
          {/* Chuyển thường */}
          <TouchableHighlight
            style={normalStyle}
            onPress={() => transferTypeChange('Y')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={normalTextStyle}>{I18n.t('transfer.transfer_interbank')}</Text>
          </TouchableHighlight>
          <View style={styles.borderStyle} />
        </View>
        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Helpers.fillColCross, styles.container]}>
            <TouchableOpacity
              onPress={selectAcc}
              style={[styles.element, { paddingHorizontal: Metrics.medium }]}
            >
              <View style={Helpers.fill}>
                <Text style={styles.title}>{I18n.t('transfer.rollout_account')}</Text>
                {selectedAcc ? (
                  <Text style={[styles.contentBold, { fontWeight: 'bold' }]}>
                    {`${selectedAcc.accountInString}-${fromAccName}`}
                  </Text>
                ) : (
                  <Text style={styles.content}>{I18n.t('transfer.holder_account')}</Text>
                )}
                <AmountLabel style={styles.contentAmount} value={fromAccAmount} currency="VND" />
              </View>
              <Icon name="icon-detail" size={20} color={Colors.check} />
            </TouchableOpacity>
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={selectBenefitAcc} style={[styles.element]}>
                <View style={Helpers.fill}>
                  <Text style={styles.title}>
                    {type === 'C'
                      ? I18n.t('transfer.benefit_card')
                      : I18n.t('transfer.benefit_account')}
                  </Text>
                  <Text
                    style={[
                      styles.contentBold,
                      { color: beneficiaryAccountNo ? Colors.textBlack : '#828282' },
                      { fontWeight: beneficiaryAccountNo ? 'bold' : 'normal' },
                    ]}
                  >
                    {textBenefitAccountNo}
                  </Text>
                  {!Utils.isStringEmpty(beneficiaryName) && (
                    <Text style={styles.contentAmount}>{beneficiaryName}</Text>
                  )}
                  {!Utils.isStringEmpty(beneficiaryBankName) && (
                    <Text style={styles.contentAmount}>{beneficiaryBankName}</Text>
                  )}
                </View>
                <Icon name="icon-detail" size={20} color={Colors.check} />
              </TouchableOpacity>
              <View style={[styles.element]}>
                <View style={Helpers.fill}>
                  <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>

                  <AmountSuggest
                    max={selectedAcc?.availableBalance}
                    amount={amount}
                    placeholder={I18n.t('transfer.holder_amount')}
                    placeholderTextColor="#828282"
                    onChange={onAmoutChange}
                    style={[styles.contentBold, { fontWeight: amount ? 'bold' : 'normal' }]}
                  />

                  {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}
                </View>
              </View>
              <View style={[styles.element]}>
                <View style={[Helpers.fill]}>
                  <Text style={styles.title}>{I18n.t('transfer.content')}</Text>
                  <TextInput
                    style={styles.input}
                    value={content}
                    placeholder={I18n.t('transfer.holder_content')}
                    onChangeText={(val) => setContent(val)}
                    placeholderTextColor="#828282"
                    returnKeyType="done"
                    multiline
                    onSubmitEditing={() => {
                      Keyboard.dismiss()
                    }}
                    maxLength={150}
                  />
                </View>
              </View>
              {type === 'Y' && (
                <View style={[styles.element]}>
                  <View style={Helpers.fill}>
                    <Text style={styles.title}>{I18n.t('transfer.time')}</Text>
                    <View style={[Helpers.rowCenter, { marginTop: Metrics.small * 0.8 }]}>
                      <Radio
                        textStyle={{ marginRight: Metrics.medium * 3 }}
                        text={I18n.t('transfer.trans_now')}
                        checked={isNow}
                        onPress={() => setNow()}
                      />
                      <Radio
                        text={I18n.t('transfer.schedule')}
                        checked={!isNow}
                        onPress={onSchedule}
                      />
                    </View>
                  </View>
                </View>
              )}
              <Note onPress={showNote} />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ConfirmButton onPress={onConfirm} loading={loading} />
      </View>
      <AccountSheet
        ref={sheetAcc}
        data={rolloutAcc}
        defaultValue={fromAcc}
        onSelect={onSelectAccount}
      />
      <NoteSheet
        text={
          type === 'Y' ? I18n.t('transfer.note_interbank') : I18n.t('transfer.note_quick_transfer')
        }
        ref={sheetNote}
      />
    </Fragment>
  )
}
export default InterbankTransfer
