import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import { Topbar, Verify } from '../../../components'
import { Colors, Helpers } from '../../../theme'
import { settingOperations, settingSelectors } from '../../../state/setting'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'

const ChangeVerifyTransaction = ({ route }) => {
  const {
    makeTransactionComplete,
    makeTransactionError,
    sendOtpComplete,
    changeSecurityError,
    changeSecurity,
  } = useSelector((state) => state.setting)

  const { type } = route.params
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingOtp, setLoadingOtp] = useState(false)

  useEffect(() => {
    setLoadingOtp(true)
    dispatch(settingOperations.makeTransaction())
  }, [])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.popToPop()
    }
  }, [changeSecurity])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [changeSecurityError])

  useEffect(() => {
    if (loadingOtp && makeTransactionComplete) {
      dispatch(
        settingOperations.sendOtpChangePass({
          transaction: makeTransactionComplete.message,
        })
      )
    }
  }, [makeTransactionComplete])

  useEffect(() => {
    if (loadingOtp && sendOtpComplete) {
      setLoadingOtp(false)
    }
  }, [sendOtpComplete])

  useEffect(() => {
    if (loading) {
      setLoadingOtp(false)
    }
  }, [makeTransactionError])

  function sendOtp(pin) {
    if (sendOtpComplete) {
      setLoading(true)
      const param = {
        securityType: type,
        sessionId: sendOtpComplete.sessionId,
        otp: pin,
      }
      dispatch(settingOperations.changeSecurityType(param))
    }
  }

  const resend = () => {
    setLoadingOtp(true)
    dispatch(settingOperations.makeTransaction())
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      {sendOtpComplete && (
        <Verify data={sendOtpComplete} loading={loading} onResend={resend} onComplete={sendOtp} />
      )}
      <Spinner visible={loadingOtp} />
    </View>
  )
}

export default ChangeVerifyTransaction
