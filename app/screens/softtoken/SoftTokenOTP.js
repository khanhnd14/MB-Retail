import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import { Text, CustomInput, Topbar, PinCode } from '../../components'
import { Colors, Metrics, Helpers } from '../../theme'
import { softTokenOperations } from '../../state/softtoken'
import I18n from '../../translations'
import * as Navigation from '../../navigation'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Metrics.medium * 4,
  },
  resendContainer: {
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
  },
  input: {
    marginBottom: Metrics.small,
    marginTop: Metrics.medium * 2,
  },
})

const SoftTokenOTP = () => {
  const activeCode = useSelector((state) => state.user.activeCode)
  const dispatch = useDispatch()
  const { otpComplete, activeComplete, activeError } = useSelector((state) => state.softtoken)
  const { otherUuid, tranId } = otpComplete || {}
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const codeIp = useRef(null)
  const pinRef = useRef(null)

  useEffect(() => {
    if (loading) {
      Utils.hideLoading()
      setLoading(false)
      Utils.showToast(I18n.t('softtoken.activeSuccessMsg'))
      dispatch(softTokenOperations.getSoftTokenInfo({
        activeCode,
      }))
      Navigation.popToPop()
    }
  }, [activeComplete])

  useEffect(() => {
    if (loading) {
      Utils.hideLoading()
      setLoading(false)
      pinRef.current && pinRef.current.newAttempt()
      codeIp && codeIp.current && codeIp.current.clear()
      setOtp('')
    }
  }, [activeError])

  const enterPin = (pin) => {
    setLoading(true)
    DeviceInfo.getDeviceName().then((deviceName) => {
      const params = {
        UUID: Utils.getUserDeviceID(),
        deviceName,
        tranId,
        activeCode,
        pinSoftToken: pin,
      }
      dispatch(softTokenOperations.activeSoftToken(params))
    })
  }

  const sendOtp = () => {
    setLoading(true)
    Utils.showLoading()
    DeviceInfo.getDeviceName().then((deviceName) => {
      const params = {
        UUID: Utils.getUserDeviceID(),
        deviceName,
        tranId,
        activeCode,
        otpInput: otp
      }
      dispatch(softTokenOperations.activeSoftToken(params))
    })
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[Helpers.fill, Helpers.crossCenter]}>
          {otherUuid ? (
            <PinCode
              ref={pinRef}
              styleContainer={Helpers.fill}
              status="enter"
              sentenceTitle={I18n.t('softtoken.PINSTPlaceHolder')}
              endProcess={(pin) => enterPin(pin)}
            />
          ) : (
            <View style={Helpers.crossCenter}>
              <Text style={[styles.title, Helpers.contentWidth]}>{I18n.t('softtoken.inputOTP')}</Text>
              <View style={styles.input}>
                <CustomInput
                  ref={codeIp}
                  length={8}
                  value={otp}
                  onChange={setOtp}
                  onComplete={() => sendOtp()}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default SoftTokenOTP
