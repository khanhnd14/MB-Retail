import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Text, CustomInput, Topbar, ConfirmButton } from '../../../components'
import { ApplicationStyles, Colors, Metrics, Helpers } from '../../../theme'
import { settingOperations } from '../../../state/setting'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Metrics.small * 5,
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

const SettingVerifyOTP = () => {
  const dispatch = useDispatch()
  const { otpVerifyComplete, activeVerifyError, activeVerifyComplete } = useSelector((state) => state.setting)
  const { tranId } = otpVerifyComplete || {}
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const codeIp = useRef(null)

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Utils.hideLoading()
      Navigation.pop()
    }
  }, [activeVerifyComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Utils.hideLoading()
      codeIp && codeIp.current && codeIp.current.clear()
    }
  }, [activeVerifyError])

  const sendOtp = () => {
    setLoading(true)
    Utils.showLoading()
    const params = { tranId, otpInput: otp }
    dispatch(settingOperations.activeFPVerify(params))
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title="OTP" isBottomSubLayout background={Colors.white} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[Helpers.fill, Helpers.crossCenter, ApplicationStyles.mainContainer]}>
          <Text style={[styles.title, Helpers.contentWidth]}>{I18n.t('softtoken.inputOTP')}</Text>
          <View style={styles.input}>
            <CustomInput
              ref={codeIp}
              value={otp}
              onChange={setOtp}
              onComplete={() => sendOtp()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* <ConfirmButton loading={loading} /> */}
    </View>
  )
}

export default SettingVerifyOTP
