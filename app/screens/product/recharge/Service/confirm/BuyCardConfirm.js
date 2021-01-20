import React, { useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { HeaderTop, Topbar, Icon, ConfirmButton, Text, ConfirmItem } from '../../../../../components'
import I18n from '../../../../../translations'
import { Colors, Helpers, Metrics } from '../../../../../theme'
import { numberWithCommas } from '../../../../../utilities/common'
import styles from './style'
import * as Navigation from '../../../../../navigation'
import { productOperations } from '../../../../../state/product'
import * as types from '../../../../../state/product/types'
import { Utils } from '../../../../../utilities'

const BuyCardConfirm = ({ route }) => {
  const { pRolloutAccountNo, title, category, amount, selectedService, email, mobile, service, phoneCard, rolloutAccountNo } = route.params
  const account = useSelector((state) => state.product.account)
  const { loading, completedOtpRecharge } = useSelector((state) => state.product)
  const accountSelect = account.filter((item) => pRolloutAccountNo === item.acctNo)[0]
  const dispatch = useDispatch()

  const reset = () => {
    dispatch(productOperations.setProduct())
  }

  const onSubmit = () => {
    let body = {
      serviceId: service,
      contractNo: selectedService.serviceName,
      amount: phoneCard.value,
      tranDate: Utils.toStringServerDate(new Date()),
      isSchedule: false,
      rolloutAccountNo,
      category,
      cardName: phoneCard.label,
      rechargeCardEmail: email,
      rechargeCardSms: mobile,
    }

    body = _.pickBy(body, _.identity);
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
          onSwitchTransaction: reset
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
              title={I18n.t('product.title_card_type')}
              content={category}
            />
            <ConfirmItem
              title={I18n.t('product.title_card_denominations')}
              content={amount}
            />
            {email && (
            <ConfirmItem
              title={I18n.t('infomation.email')}
              content={email}
            />
)}
            {mobile && (
            <ConfirmItem
              title={I18n.t('infomation.phone')}
              content={mobile}
            />
)}
          </View>
        </View>

      </ScrollView>

      <ConfirmButton onPress={onSubmit} loading={loading} style={styles.buttonConfirm} />
    </View>
  )
}

export default BuyCardConfirm
