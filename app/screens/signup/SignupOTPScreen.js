import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native'
import { Button, Text, CustomInput, Topbar } from '../../components'
import { ApplicationStyles, Colors, Helpers, Metrics } from '../../theme'
import I18n from '../../translations'

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginTop: Metrics.small * 3,
  },
  resendContainer: {
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
  },
  input: {
    marginBottom: Metrics.small,
    marginTop: Metrics.medium,
  },
})

const SignupOTPScreen = () => {
  const [otp, setOtp] = useState('')
  const codeIp = useRef(null)

  useEffect(() => {}, [])

  const sendOtp = () => {
    setOtp()
  }

  const resend = () => {}

  return (
    <View style={Helpers.fill}>
      <Topbar title="Xác nhận" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[Helpers.fill, Helpers.crossCenter]}>
          <Text style={[styles.title, Helpers.contentWidth]}>Nhập mã OTP</Text>
          <View style={styles.input}>
            <CustomInput ref={codeIp} value={otp} onChange={sendOtp} onComplete={sendOtp} />
          </View>
          <View style={styles.resendContainer}>
            <Text style={{ color: Colors.gray, fontSize: 12 }}>
              {I18n.t('signup.otp_text_resend')}
            </Text>
            <TouchableOpacity onPress={resend} style={{ marginLeft: 6 }}>
              <Text style={{ color: Colors.primary, fontSize: 12 }}>
                {I18n.t('signup.otp_action_resend')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={ApplicationStyles.confirmContainer}>
        <Button
          onPress={sendOtp}
          style={[Helpers.contentWidth, ApplicationStyles.btnPrimary]}
          colors={Colors.buttonPrimary}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {I18n.t('action.action_continue').toUpperCase()}
          </Text>
        </Button>
      </View>
    </View>
  )
}

export default SignupOTPScreen
