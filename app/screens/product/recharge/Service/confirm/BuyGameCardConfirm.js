import React, { useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderTop, Topbar, Icon, ConfirmButton, Text, ConfirmItem } from '../../../../../components'
import I18n from '../../../../../translations'
import { Colors, Helpers, Metrics } from '../../../../../theme'
import { numberWithCommas } from '../../../../../utilities/common'
import styles from './style'
import { Utils } from '../../../../../utilities'
import * as Navigation from '../../../../../navigation'
import { productOperations } from '../../../../../state/product'
import * as types from '../../../../../state/product/types'

const BuyGameCardConfirm = ({ route }) => {
  const { pRolloutAccountNo, title, serviceName, contractNo, amount, tranDate } = route.params
  const {
    serviceId,
    tranLimit,
    isSchedule,
    billCode,
    selectedService
  } = route.params
  const account = useSelector((state) => state.product.account)
  const { loading, completedOtpRecharge } = useSelector((state) => state.product)
  const accountSelect = account.filter((item) => pRolloutAccountNo === item.acctNo)[0]
  const dispatch = useDispatch()
  const { sessionId, tokenTransaction } = completedOtpRecharge || {}

  const reset = () => {
    dispatch(productOperations.setProduct())
  }

  const onSubmit = () => {
    const body = {
      serviceId,
      contractNo,
      tranDate,
      tranLimit,
      isSchedule,
      pRolloutAccountNo,
      amount,
    }
    if (selectedService.category) {
      body.billCode = selectedService.category
    }
    dispatch(productOperations.sendOTPRecharge(body))
  }

  useEffect(() => () => {
    dispatch({
      type: types.SET_SEND_OTP_RECHARGE
    })
  }, [])

    React.useEffect(() => {
      if (completedOtpRecharge) {
        const { isTrust } = completedOtpRecharge
        if (!isTrust) {
          Navigation.push('RechargeOTPScreen', {
            success: 'BuyingCardSuccess',
            tokenTransaction,
            typeService: '3',
            onSwitchTransaction: reset,
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

  return (
    <View style={styles.bodyContainer}>
      <Topbar subTitle={title} title={I18n.t('product.recharge')} />

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
              title={I18n.t('product.title_supplier')}
              content={serviceName}
            />
            <ConfirmItem
              title={I18n.t('product.customer_code')}
              content={contractNo}
            />
            <ConfirmItem
              title={I18n.t('transfer.amount')}
              content={`${numberWithCommas(amount)} VND`}
            />
            <ConfirmItem
              title={I18n.t('transfer.time')}
              content={tranDate}
            />
          </View>
        </View>

      </ScrollView>

      <ConfirmButton onPress={onSubmit} loading={loading} style={styles.buttonConfirm} />
    </View>
  )
}

export default BuyGameCardConfirm
