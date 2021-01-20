/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, ConfirmButton, ConfirmItem } from '../../../components'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'

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
})

const StockConfirm = ({ route }) => {
  const { fromAcc, fromAccName, amountInWord, stockCode } = route.params
  const { otpDataComplete } = useSelector((state) => state.stocktransfer)
  const {
    fee,
    availableBalance,
    isTrust,
    lblAmount,
    lblBenefitAcc,
    lblBenefitBankName,
    lblBenefitBranchName,
    lblBenefitName,
    lblFromAcc,
    lblRemark,
    lblScheduleEnd,
    lblScheduleFromTime,
    lblScheduleType,
    lblTransferDate,
    securityType,
  } = otpDataComplete || {}

  const onConfirm = () => {
    Navigation.push('StockOtp', { stockCode })
  }

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
                content={`${lblBenefitAcc} - ${lblBenefitName}`}
              />
              <ConfirmItem
                title={I18n.t('transfer.amount')}
                amount={lblAmount}
                subContent={amountInWord}
              />
              <ConfirmItem title={I18n.t('transfer.fee')} amount={fee} />
              <ConfirmItem
                title={I18n.t('transfer.content')}
                content={lblRemark}
                style={{ borderBottomWidth: 0 }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ConfirmButton onPress={onConfirm} />
      </View>
    </Fragment>
  )
}
export default StockConfirm
