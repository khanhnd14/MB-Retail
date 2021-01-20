/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { TouchableOpacity, View, StyleSheet, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import {
  Topbar,
  Text,
  AmountLabel,
  Icon,
  AmountInputText,
  TextInput,
  Radio,
  ConfirmButton,
  NoteSheet,
  AmountSuggest,
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
    fontWeight: 'bold',
    color: Colors.primary2,
    paddingVertical: Metrics.tiny / 2,
  },
  content: {
    color: Colors.textBlack,
    paddingVertical: Metrics.tiny / 2,
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
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
    color: Colors.gray1,
  },
  btnContinue: {
    padding: 12,
    ...Helpers.contentWidth,
    marginVertical: Metrics.normal,
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

const InternalTransfer = () => {
  const {
    benefitSelected,
    rolloutAcc,
    transferConfirm,
    sendOtpError,
    validatedDate,
    expiredDate,
    transDate,
    debitDate,
    frqLimit,
    endType,
    frqType,
    isNow,
  } = useSelector((state) => state.transfer)
  const { timeCreateToken } = useSelector((state) => state.user)

  const [fromAcc, setFromAcc] = useState('')
  const [fromAccName, setFromAccName] = useState('')
  const [fromAccAmount, setFromAccAmount] = useState(0)
  const [selectedAcc, setSelectedAcc] = useState(null)

  const [amount, setAmount] = useState('')
  const [amountInWord, setAmoutInWord] = useState(null)
  const [content, setContent] = useState('')
  const [isContinue, setContinue] = useState(false)
  const [loading, setLoading] = useState(false)

  const sheetAcc = useRef(null)
  const sheetNote = useRef(null)

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
    setLoading(false)
  }, [sendOtpError])

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
    dispatch(transferOperations.getBeneficiary('N'))
    dispatch(transferOperations.getRolloutAcc())
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
    if (fromAcc && benefitSelected) {
      setContinue(amount > 0)
    }
  }

  const onSchedule = () => {
    Navigation.push('ScheduleTransfer')
  }

  const setNow = () => {
    dispatch(transferOperations.setScheduleTransfer({ isNow: true }))
  }

  const onConfirm = () => {
    if (isContinue) {
      setLoading(true)
      const currDate = new Date(timeCreateToken)
      const tDate = Utils.toStringDate(transDate || currDate)

      const vDate = validatedDate == null ? tDate : Utils.toStringDate(validatedDate)
      const eDate = expiredDate == null ? tDate : Utils.toStringDate(expiredDate)
      const body = {
        type: 'N',
        fromAcc,
        amount,
        purpose: Utils.clean_vietnamese(content),
        toBenefitAcc: benefitSelected.beneficiaryAccountNo,
        toBenefitName: benefitSelected.beneficiaryName,
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
    Navigation.push('BenefitScreen', { selectedAcc: fromAcc })
  }

  const beneficiaryAccountNo = benefitSelected ? benefitSelected.beneficiaryAccountNo : ''
  const beneficiaryName = benefitSelected ? benefitSelected.beneficiaryName : null
  const textBenefitAccountNo = beneficiaryAccountNo || I18n.t('transfer.holder_account')
  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.title')} subTitle={I18n.t('transfer.internal_transfer')} />
      <View style={[Helpers.fillColCross, { backgroundColor: Colors.mainBg }]}>
        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Helpers.fillColCross, styles.container]}>
            <TouchableOpacity
              style={[styles.element, { paddingHorizontal: Metrics.medium, borderBottomWidth: 0 }]}
              onPress={selectAcc}
            >
              <View style={Helpers.fill}>
                <Text style={styles.title}>{I18n.t('transfer.rollout_account')}</Text>
                {selectedAcc ? (
                  <Text style={styles.contentBold}>
                    {`${selectedAcc.accountInString} - ${fromAccName}`}
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
                  <Text style={styles.title}>{I18n.t('transfer.benefit_account')}</Text>
                  <Text
                    style={[
                      styles.contentBold,
                      { color: beneficiaryAccountNo ? Colors.textBlack : '#828282' },
                      { fontWeight: beneficiaryAccountNo ? 'bold' : 'normal' },
                    ]}
                  >
                    {textBenefitAccountNo}
                  </Text>
                  {/* <Text style={styles.contentBold}>{beneficiaryAccountNo}</Text> */}
                  {beneficiaryName && <Text style={styles.contentAmount}>{beneficiaryName}</Text>}
                </View>
                <Icon name="icon-detail" size={20} color={Colors.check} />
              </TouchableOpacity>
              <View style={[styles.element]}>
                <View style={Helpers.fill}>
                  <Text style={[styles.title]}>{I18n.t('transfer.amount')}</Text>
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
                <View style={Helpers.fill}>
                  <Text style={styles.title}>{I18n.t('transfer.content')}</Text>
                  <TextInput
                    value={content}
                    style={styles.input}
                    placeholder={I18n.t('transfer.holder_content')}
                    onChangeText={(val) => setContent(val)}
                    returnKeyType="done"
                    placeholderTextColor="#828282"
                    multiline
                    onSubmitEditing={() => {
                      Keyboard.dismiss()
                    }}
                    maxLength={150}
                  />
                </View>
              </View>
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
      <NoteSheet text={I18n.t('transfer.note_internal')} ref={sheetNote} />
    </Fragment>
  )
}
export default InternalTransfer
