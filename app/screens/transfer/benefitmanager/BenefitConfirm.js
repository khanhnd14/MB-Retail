/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, ConfirmButton, ConfirmItem } from '../../../components'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import { historyTransferOperations } from '../../../state/managertransfer'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
  },
  contentContainer: {
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

const BenefitConfirm = ({ route }) => {
  const {
    transType,
    accNo,
    accName,
    accAlias,
    bankNo,
    branchName,
    isTrust,
    benefId,
    certificateNo,
    bankName,
    title,
  } = route.params
  const { verifyAddBenefit, addNewBenefit, addNewBenefitError } = useSelector(
    (state) => state.managertransfer
  )
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = 'ManagerBenefit'
      const params = { transType, redoTransaction }
      Navigation.push('Failed', params)
    }
  }, [addNewBenefitError])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      const redoTransaction = 'ManagerBenefit'
      const params = { transType, redoTransaction }
      Navigation.popToPop()
      Navigation.push('AddBenefitSuccess', params)
    }
  }, [addNewBenefit])

  const onConfirm = () => {
    setLoading(true)
    const param = {
      transType,
      accNo,
      accName,
      accAlias,
      bankNo,
      branchName,
      isTrust,
      benefId,
      certificateNo,
      sessionId: '0',
      otpInput: '',
      tokenTransaction: verifyAddBenefit.tokenTransaction,
    }
    dispatch(historyTransferOperations.addNewBenefit(param))
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.add_benefit')} subTitle={title} />
      <View style={Helpers.fillColCross}>
        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Helpers.fillColCross, styles.container]}>
            <View style={styles.contentContainer}>
              <ConfirmItem title={I18n.t('transfer.alias')} content={accAlias} />
              <ConfirmItem title={transType === 'C' ? I18n.t('transfer.benefit_card') : I18n.t('transfer.benefit_account')} content={accNo} />
              <ConfirmItem title={I18n.t('transfer.benefit_name')} content={accName} />
              {(transType === 'Y' || transType === 'A') && (
                <ConfirmItem title={I18n.t('transfer.benefit_bank')} content={bankName} />
              )}
              {transType === 'Y' && (
                <ConfirmItem title={I18n.t('transfer.benefit_branch')} content={branchName} />
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ConfirmButton onPress={onConfirm} loading={loading} />
      </View>
    </Fragment>
  )
}
export default BenefitConfirm
