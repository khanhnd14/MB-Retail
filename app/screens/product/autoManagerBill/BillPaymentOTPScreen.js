import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Helpers, Colors } from '../../../theme'
import { productOperations } from '../../../state/product'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import * as productTypes from '../../../state/product/types'

const AutoPaymentOTPScreen = ({ route }) => {
  const {
    sendOtpBillingResult,
    deleteAutoBillingResult,
    deleteAutoBillingError
  } = useSelector((state) => state.product)
  const { items, routes } = route.params

  const { sessionId, transaction } = sendOtpBillingResult || {}
  const dispatch = useDispatch()

  function sendOtp(otp) {
    const body = {
      tranSn: items.tranSn,
      sessionId: sessionId || '0',
      otpInput: otp,
    }
    dispatch(productOperations.deleteScheduleBill(body))
  }
  React.useEffect(() => {
    if (deleteAutoBillingResult) {
      Navigation.popToPop()
      // Navigation.push('SuccessScreen', {
      //   ...route.params,
      //   tokenTransaction,
      //   hideSaveInfo: true,
      //   typeModule: 'BP'
      // })
      Navigation.push('SuccessScreen', {
        ...route.params,
      })
    }
  }, [deleteAutoBillingResult])

  React.useEffect(() => {
    if (deleteAutoBillingError) {
      if (deleteAutoBillingError.status === '230') {
        return
      }
      Navigation.popToPop()
      Navigation.push('FailedScreen')
    }
  }, [deleteAutoBillingError])

  useEffect(() => () => {
      dispatch([
        {
          type: productTypes.MAKE_TRANSACTION_BILLING_COMPLETED,
          payload: null
        },
        {
          type: productTypes.MAKE_TRANSACTION_BILLING_FAILED,
          payload: null
        },
        {
          type: productTypes.SEND_OTP_BILLING_COMPLETED,
          payload: null
        },
        {
          type: productTypes.SEND_OTP_BILLING_FAILED,
          payload: null
        }
      ])
    }, [])

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify data={sendOtpBillingResult} onComplete={sendOtp} />
    </View>
  )
}

export default AutoPaymentOTPScreen
