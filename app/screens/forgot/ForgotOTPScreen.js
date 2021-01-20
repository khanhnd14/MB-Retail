import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Text, CustomInput, Topbar, ConfirmButton } from '../../components'
import { ApplicationStyles, Colors, Metrics, Helpers } from '../../theme'
import { loginOperations } from '../../state/login'
import I18n from '../../translations'
import * as Navigation from '../../navigation'
import { Utils } from '../../utilities'
import { settingOperations } from '../../state/setting'
import { appTypes } from '../../state/application'

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: Metrics.small * 3,
  },
  resendContainer: {
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
  },
  input: {
    marginBottom: Metrics.small,
    marginTop: Metrics.small * 3.6,
  },
})

const ForgotOTPScreen = () => {
  const { forgotUserOTP, forgotErrorOTP, forgotUser } = useSelector((state) => state.login)
  const { sessionId, tokenTransaction } = forgotUser || {}
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const [otp, setOtp] = useState('')
  const codeIp = useRef(null)

  useEffect(() => {
    if (loading && forgotUserOTP) {
      setLoading(false)
      Utils.toast(I18n.t('forgot.check_inbox'))
      setTimeout(() => {
        Navigation.popToPop()
      }, 500)
    }
  }, [forgotUserOTP])

  useEffect(() => {
    if (forgotErrorOTP && loading) {
      setLoading(false)
      codeIp && codeIp.current && codeIp.current.clear()
      if (forgotErrorOTP.status !== '230') {
        Navigation.pop()
        const params = {}
        Navigation.push('Failed', params)
      }
    }
  }, [forgotErrorOTP])

  const sendOtp = () => {
    setLoading(true)
    dispatch(
      loginOperations.sendOtpForgot({
        otpInput: otp,
        sessionId,
        tokenTransaction,
      })
    )
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('forgot.title')} isBottomSubLayout background={Colors.white} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[Helpers.fill, Helpers.crossCenter, ApplicationStyles.mainContainer]}>
          <Text style={[styles.title, Helpers.contentWidth]}>{I18n.t('forgot.otp')}</Text>
          <View style={styles.input}>
            <CustomInput ref={codeIp} value={otp} onChange={setOtp} onComplete={sendOtp} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <ConfirmButton loading={loading} />
    </View>
  )
}

export default ForgotOTPScreen
