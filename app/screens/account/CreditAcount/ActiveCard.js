import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Icon, Text } from '../../../components'
import { accountOperations } from '../../../state/account'
import { Colors, Metrics } from '../../../theme'
import { Utils } from '../../../utilities'
import * as Navigation from '../../../navigation'
import { RESET_CARD_ACTIVE_STATUS, SEND_OTP_ACTIVE_CARD_COMPLETED } from '../../../state/account/types'

const styles = StyleSheet.create({
  cardNotActive: {
    width: 317.33,
    height: 200,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrics.normal
  }
})

const ActiveCard = forwardRef(({ creditItem, isActiveCard }, ref) => {
  const { transactionAccountActiveCard, sendOtpActiveCard } = useSelector(state => state.account)
  const dispatch = useDispatch()

  const onActiveCard = () => {
    Utils.confirm(I18n.t('application.title_alert_notification'), I18n.t('account.card_payment.active_card_confirm'), () => {
      Utils.showLoading()
      dispatch(accountOperations.makeTransactionAccountActiveCard())
    })
  }

  useImperativeHandle(ref, () => ({

    onActiveCard

  }));

  useEffect(() => {
    if (transactionAccountActiveCard) {
      console.log('====================================');
      console.log(transactionAccountActiveCard);
      console.log('====================================');
      const body = {
        transaction: transactionAccountActiveCard?.message
      }
      dispatch(accountOperations.sendOTPActiveCard(body))
    }
  }, [transactionAccountActiveCard])

  useEffect(() => () => {
      dispatch([
        {
          type: RESET_CARD_ACTIVE_STATUS,
        },
      ])
    }, [])

  useEffect(() => {
    if (sendOtpActiveCard) {
      Utils.hideLoading()
      Navigation.push('ActiveOTPScreen', {
        creditItem
      })
    }
  }, [sendOtpActiveCard])

  if (isActiveCard) {
    return null
  }
  return (
    <TouchableOpacity
      style={styles.cardNotActive}
      onPress={onActiveCard}
    >
      <Icon name="icon-dv-the" size={40} color={Colors.white} />
      <Text style={{ color: Colors.white, fontSize: 14, fontWeight: 'bold' }}>{I18n.t('account.card_payment.active_card_confirm')}</Text>
    </TouchableOpacity>
  )
})
export default ActiveCard
