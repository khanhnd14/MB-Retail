import React, { useEffect } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderTop, Topbar, SelectAccount, Icon, ConfirmButton, Text, ConfirmItem } from '../../../../../components'
import I18n from '../../../../../translations'
import { Colors, Helpers, Metrics } from '../../../../../theme'
import { numberWithCommas } from '../../../../../utilities/common'
import styles from './style'
import { Utils } from '../../../../../utilities'
import { productOperations } from '../../../../../state/product'
import * as Navigation from '../../../../../navigation'
import * as types from '../../../../../state/product/types'

const RechargeCardConfirm = ({ route }) => {
  const { title, pRolloutAccountNo, cardCode, amount, tranDate } = route.params
  const {
    serviceId,
    from,
    toCard
  } = route.params
  const account = useSelector((state) => state.product.account)
  const { loading, completedOtpRecharge } = useSelector((state) => state.product)
  const accountSelect = account.filter((item) => pRolloutAccountNo === item.acctNo)[0]
  const dispatch = useDispatch()

  const reset = () => {
    dispatch(productOperations.setProduct())
  }

  const onSubmit = () => {
    const body = {
      serviceId,
      amount,
      tranDate,
      from: pRolloutAccountNo,
      toCard: cardCode
    }
    dispatch(productOperations.setOtpPrepaidCard(body))
  }

  useEffect(() => () => {
    dispatch({
      type: types.SET_SEND_OTP_RECHARGE
    })
  }, [])

    useEffect(() => {
      console.log('completedOtpRecharge:', completedOtpRecharge);
      if (completedOtpRecharge) {
        const { isTrust } = completedOtpRecharge
        if (!isTrust) {
          Navigation.push('RechargeOTPScreen', {
            success: 'BuyingCardSuccess',
            typeService: '4',
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
              title={I18n.t('infomation.phone')}
              content={cardCode}
            />
            <ConfirmItem
              title={I18n.t('product.title_card_denominations')}
              content={`${numberWithCommas(amount)} VND`}
            />

            <ConfirmItem
              title={I18n.t('transfer.time')}
              content={tranDate}
              style={{ borderBottomWidth: 0 }}
            />
          </View>
        </View>

      </ScrollView>

      <ConfirmButton onPress={onSubmit} loading={loading} style={styles.buttonConfirm} />
    </View>
  )
}

export default RechargeCardConfirm
