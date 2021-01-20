import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Topbar, Verify } from '../../../components'
import { Helpers, Colors } from '../../../theme'
import { productOperations } from '../../../state/product'
import * as Navigation from '../../../navigation'

const RechargeOTPScreen = ({ route }) => {
  const completedOtpRecharge = useSelector((state) => state.product.completedOtpRecharge)
  const { successOtpRecharge, errorSendOtpRecharge, loading } = useSelector(
    (state) => state.product
  )
  const { sessionId, tokenTransaction } = completedOtpRecharge || {}
  const { typeService } = route.params
  const dispatch = useDispatch()

  function sendOtp(pin) {
    const body = {
      tokenTransaction,
      sessionId: sessionId || '0',
      otpInput: pin,
    }
    if (typeService === '4') {
      dispatch(productOperations.completePrepaidCardAPI(body))
      return
    }
    dispatch(productOperations.completeRecharge(body))
  }
  React.useEffect(() => {
    if (successOtpRecharge) {
      Navigation.popToPop()
      Navigation.push(route.params.success, {
        ...route.params,
        redoTransaction: 'RechargeScreen',
        content: I18n.t('product.exchange_success'),
        typeModule: 'RG',
        tokenTransaction,
        ...successOtpRecharge.data
      })
    }
  }, [successOtpRecharge])

  useEffect(() => {
    if (errorSendOtpRecharge) {
      if (errorSendOtpRecharge.status !== '230') {
        Navigation.popToPop()
        Navigation.push('Failed', { ...route.params, redoTransaction: 'RechargeScreen' })
      }
    }
  }, [errorSendOtpRecharge])

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify data={completedOtpRecharge} loading={loading} onComplete={sendOtp} />
    </View>
  )
}

export default RechargeOTPScreen
