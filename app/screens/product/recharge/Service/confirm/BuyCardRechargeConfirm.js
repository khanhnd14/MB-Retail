import React, { useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderTop, Topbar, Icon, ConfirmButton, Text, ConfirmItem } from '../../../../../components'
import I18n from '../../../../../translations'
import { Colors, Helpers, Metrics } from '../../../../../theme'
import { numberWithCommas } from '../../../../../utilities/common'
import styles from './style'
import * as Navigation from '../../../../../navigation'
import { productOperations } from '../../../../../state/product'
import * as types from '../../../../../state/product/types'
import { Utils } from '../../../../../utilities'

const BuyCardRechargeConfirm = ({ route }) => {
  const { pRolloutAccountNo, title, amount, lastAmount, transDate, contractNo, selectedService, isHistory } = route.params
  const {
    serviceId,
    tranDate,
    tranLimit,
    isSchedule,
    rolloutAccountNo,
    billCode,

  } = route.params
  const account = useSelector((state) => state.product.account)
  const {
    loading,
    completedOtpRecharge,
    errorSendOtpRecharge,
    successOtpRecharge
  } = useSelector((state) => state.product)
  const accountSelect = account.filter((item) => pRolloutAccountNo === item.acctNo)[0]
  const dispatch = useDispatch()

  const reset = () => {
    dispatch(productOperations.setProduct())
  }

  const onSubmit = () => {
      // nếu số điện thoại này đã từng nạp trước đây rồi thì complete luôn
      if (completedOtpRecharge?.isTrust) {
        const body = {
          tokenTransaction: completedOtpRecharge.tokenTransaction,
          sessionId: '',
          otpInput: '',
          saveFast: ''
        }
        dispatch(productOperations.completeRecharge(body))
      } else {
        const body = {
          serviceId,
          contractNo,
          amount,
          tranDate,
          tranLimit,
          isSchedule,
          rolloutAccountNo,
          billCode,
        }
        dispatch(productOperations.sendOTPRecharge(body))
      }
  }

  const onLeftPress = () => {
    Navigation.pop()
    dispatch({
      type: types.SET_SEND_OTP_RECHARGE
    })
  }

    React.useEffect(() => {
      if (completedOtpRecharge) {
        const { isTrust } = completedOtpRecharge
        if (!isTrust) {
          Navigation.push('RechargeOTPScreen', {
            amount,
            customerInfo: contractNo,
            titleServices: title,
            success: 'SuccessScreen',
            onSwitchTransaction: reset,
            hideSaveInfo: true,
            typeService: '0',
            tokenTransaction: completedOtpRecharge.tokenTransaction
          })
        } else {
          const body = {
            tokenTransaction: completedOtpRecharge.tokenTransaction,
            sessionId: '',
            otpInput: '',
            saveFast: ''
          }
          dispatch(productOperations.completeRecharge(body))
        }
      }
    }, [completedOtpRecharge])

  React.useEffect(() => {
      // nếu số điện thoại này đã từng nạp trước đây rồi thì mới đi sang fail
      if (completedOtpRecharge?.isTrust) {
        if (errorSendOtpRecharge) {
          Navigation.popToPop()
          Navigation.push('Failed', {
            ...route.params,
            redoTransaction: 'RechargeScreen',
            onSwitchTransaction: reset
          })
        }
      }
  }, [errorSendOtpRecharge])

  React.useEffect(() => {
    // nếu số điện thoại này đã từng nạp trước đây rồi thì mới đi sang success
    if (completedOtpRecharge?.isTrust) {
      if (successOtpRecharge) {
        Navigation.popToPop()
        Navigation.push('SuccessScreen', {
          ...route.params,
          redoTransaction: 'RechargeScreen',
          customerInfo: contractNo,
          titleServices: title,
          hideSaveInfo: true,
          content: I18n.t('product.exchange_success'),
          typeModule: 'RG',
          tokenTransaction: successOtpRecharge?.data?.tokenTransaction,
          typeService: '0',
          onSwitchTransaction: reset,
          ...successOtpRecharge.data
        })
      }
    }
  }, [successOtpRecharge])

  return (
    <View style={styles.bodyContainer}>
      <Topbar onLeftPress={onLeftPress} subTitle={title} title={I18n.t('product.recharge')} />
      <ScrollView>

        <View style={[Helpers.fillColCross, { paddingHorizontal: Metrics.small * 1.8 }]}>
          <ConfirmItem
            style={[{ borderBottomWidth: 0, paddingHorizontal: Metrics.small * 1.8 }]}
            title={I18n.t('transfer.rollout_account')}
            content={`${accountSelect ? accountSelect.accountInString : ''} - ${accountSelect ? accountSelect.alias : ''}`}
            subContent={`${numberWithCommas(accountSelect ? accountSelect.availableBalance : '')} VND`}
            contentStyle={styles.contentValue}
          />
          <View style={styles.contentContainer}>
            <ConfirmItem
              title={I18n.t('infomation.phone')}
              content={contractNo}
            />
            <ConfirmItem
              title={I18n.t('product.title_card_type')}
              content={selectedService.serviceName}
            />
            <ConfirmItem
              title={I18n.t('product.title_card_denominations')}
              content={`${numberWithCommas(amount)} VND`}
            />
            {lastAmount && (
            <ConfirmItem
              title={I18n.t('product.payment_amount')}
              content={lastAmount}
            />
            )}
            <ConfirmItem
              title={I18n.t('transfer.time')}
              content={Utils.toStringServerDate(transDate)}
              style={{ borderBottomWidth: 0 }}
            />
          </View>

        </View>

      </ScrollView>
      <ConfirmButton onPress={onSubmit} loading={loading} style={styles.buttonConfirm} />
    </View>
  )
}

export default BuyCardRechargeConfirm
