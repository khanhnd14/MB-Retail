/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, ConfirmButton, ConfirmItem } from '../../../components'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import { transferOperations } from '../../../state/transfer'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
  },
  contentContainer: {
    marginTop: Metrics.small,
    backgroundColor: Colors.white,
    width: '100%',
    paddingHorizontal: Metrics.small * 1.8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingBottom: Metrics.small,
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
  content: {
    fontWeight: 'normal',
  },
})

const TransferConfirm = ({ route }) => {
  const { fromAcc, fromAccName, amountInWord } = route.params
  const {
    transferConfirm,
    type,
    transferComplete,
    transferError,
    sendOtpOnlyComplete,
    sendOtpOnlyError,
  } = useSelector((state) => state.transfer)
  const {
    fee,
    availableBalance,
    tokenTransaction,
    lblAmount,
    lblBenefitAcc,
    lblBenefitBankName,
    lblBenefitBranchName,
    lblBenefitName,
    lblRemark,
    lblScheduleFromTime,
  } = transferConfirm || {}
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (loading && transferComplete) {
      setLoading(false)
      const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
      const params = { type, ...transferConfirm, ...transferComplete, redoTransaction }
      Navigation.popToPop()
      Navigation.push('TransferSuccess', params)
    }
  }, [transferComplete])

  useEffect(() => {
    if (loading && transferError) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
      const params = { type, ...transferConfirm, redoTransaction }
      Navigation.push('Failed', params)
    }
  }, [transferError])

  useEffect(() => {
    if (loading && sendOtpOnlyComplete) {
      const { isTrust, sessionId } = sendOtpOnlyComplete || {}
      if (isTrust) {
        const body = {
          tokenTransaction: sendOtpOnlyComplete.tokenTransaction,
          sessionId: sessionId || '0',
          otpInput: '',
        }
        dispatch(transferOperations.transfer(type, body))
      } else {
        setLoading(false)
        Navigation.replace('VerifyTransfer')
      }
    }
  }, [sendOtpOnlyComplete])

  useEffect(() => {
    if (loading && sendOtpOnlyError) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
      const params = { type, redoTransaction }
      Navigation.push('Failed', params)
    }
  }, [sendOtpOnlyError])

  const onConfirm = () => {
    // if (isTrust) {
    //   setLoading(true)
    //   const body = {
    //     tokenTransaction,
    //     sessionId: sessionId || '0',
    //     otpInput: '',
    //   }
    //   dispatch(transferOperations.transfer(type, body))
    // } else {
    setLoading(true)
    const body = {
      tokenTransaction,
    }
    dispatch(transferOperations.sendOtpOnly(body))
    // }
  }

  const getBenefitBank = () => {
    if (type !== 'Y' && type !== 'C') {
      if (type === 'N') {
        return 'MSB'
      }
      return lblBenefitBankName
    }
    if (type === 'Y') {
      return lblBenefitBranchName
    }
    return lblBenefitBankName
  }

  const benefitBank = getBenefitBank()

  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.title')} subTitle={I18n.t('transfer.title_confirm')} />
      <View style={Helpers.fillColCross}>
        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Helpers.fillColCross, styles.container]}>
            <ConfirmItem
              style={[{ borderBottomWidth: 0, paddingHorizontal: Metrics.small * 1.8 }]}
              title={I18n.t('transfer.rollout_account')}
              content={`${fromAcc} - ${fromAccName}`}
              subAmount={availableBalance}
            />
            <View style={styles.contentContainer}>
              <ConfirmItem
                title={I18n.t('transfer.benefit_account')}
                content={lblBenefitAcc}
                subContent={lblBenefitName}
              />
              {lblBenefitBankName && (
                <ConfirmItem title={I18n.t('transfer.benefit_bank')} content={lblBenefitBankName} />
              )}
              <ConfirmItem
                title={I18n.t('transfer.amount')}
                amount={lblAmount}
                subContent={amountInWord}
              />
              <ConfirmItem
                title={I18n.t('transfer.fee')}
                amount={fee}
                contentStyle={styles.content}
              />
              <ConfirmItem
                title={I18n.t('transfer.content')}
                content={lblRemark}
                contentStyle={styles.content}
              />
              <ConfirmItem
                style={{ borderBottomWidth: 0 }}
                title={I18n.t('transfer.time')}
                content={lblScheduleFromTime}
                contentStyle={styles.content}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ConfirmButton onPress={onConfirm} loading={loading} />
      </View>
    </Fragment>
  )
}
export default TransferConfirm
