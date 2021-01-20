import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Topbar, Verify } from '../../../components'
import { Colors, Helpers } from '../../../theme'
import * as Navigation from '../../../navigation'
import { SECURITY_TYPE, RESET_STORE } from '../../../state/save/types'
import { saveOperations } from '../../../state/save'

const VerifyFinalization = () => {
  const { resultFinalization, resultVerifyOtpFinlization, dataFinalization, resultVerifyOtpFinlizationError } = useSelector((state) => state.save)
  const securityType = useMemo(() => {
    switch (resultFinalization?.securityType) {
      case SECURITY_TYPE.OTP:
        return 'OTP';
        case SECURITY_TYPE.SOFT_TOKEN:
          return 'Soft Token';
          case SECURITY_TYPE.FINGER:
            return 'Finger';
      default:
        return '';
    }
  }, [resultFinalization])

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const sendOtp = (pin) => {
    setLoading(true)
    dispatch(saveOperations.verifyOtpFinalization(resultFinalization.sessionId, pin, resultFinalization.tokenTransaction))
  }

  const navigateResult = (route, params) => {
    Navigation.navigate(route, { redoTransaction: 'SaveScreen', ...params })
  }

  useEffect(() => {
    if (resultVerifyOtpFinlization) {
      setLoading(false)
      Navigation.popToPop()
      navigateResult('SuccessFinalizationScreen', {
        content: I18n.t('product.exchange_success'),
        hideEmail: true
      })
    }
  }, [resultVerifyOtpFinlization])

  useEffect(() => {
    if (resultVerifyOtpFinlizationError) {
      setLoading(false)
      if (resultVerifyOtpFinlizationError?.status === '230') {
        return
      }
      Navigation.popToPop()
      navigateResult('Failed')
    }
  }, [resultVerifyOtpFinlizationError])

  useEffect(() => () => {
    dispatch({
      type: RESET_STORE,
    })
  }, [])

  const resend = () => {
    const { bnfAcc, category, fdAcc } = dataFinalization
    dispatch(saveOperations.createFinalization(bnfAcc, category, fdAcc))
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar
        title={securityType}
        isBottomSubLayout
        background={Colors.white}
      />
      <Verify
        data={resultFinalization}
        loading={loading}
        onComplete={sendOtp}
        onResend={resend}
      />
    </View>
  )
}

export default VerifyFinalization
