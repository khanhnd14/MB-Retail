import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Text, CustomInput, Topbar, Loader } from '../../components'
import { ApplicationStyles, Colors, Metrics, Helpers } from '../../theme'
import { loginOperations } from '../../state/login'
import I18n from '../../translations'
import * as Navigation from '../../navigation'
import { Utils } from '../../utilities'
import { storeService } from '../../services'

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
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

const LoginOTPScreen = () => {
  // const { pushId } = useSelector((state) => state.application)
  const { tranId, deviceID, isPasswordStrong, activeUser, activeUserError } = useSelector(
    (state) => state.login
  )
  const { loginCount, isPwdExpired } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const codeIp = useRef(null)

  useEffect(() => {
    if (loading && activeUser) {
      setLoading(false)
      Navigation.popToPop()
      if (loginCount === 0 || isPwdExpired || isPasswordStrong === 'W') {
        Navigation.replace('FirstChangePass', {
          loginCount,
          isPwdExpired,
          isPasswordStrong,
        })
      } else {
        Navigation.replace('MainScreen')
        Navigation.push('SetupPinScreen')
      }
    }
  }, [activeUser])

  useEffect(() => {
    if (loading && activeUserError) {
      setLoading(false)
      Navigation.pop()
    }
  }, [activeUserError])

  const sendOtp = async () => {
    setLoading(true)
    const pushId = await storeService.getPushId()
    const fireBaseToken = await storeService.getFireBaseId()
    dispatch(
      loginOperations.active({
        otpInput: otp,
        tranId,
        uiid: deviceID,
        playID: pushId,
        fireBaseToken
      })
    )
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar
        title={I18n.t('active_login.title')}
        rightIcon={null}
        isBottomSubLayout
        background={Colors.white}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[Helpers.fill, Helpers.crossCenter, ApplicationStyles.mainContainer]}>
          <Text style={[styles.title, Helpers.contentWidth]}>{I18n.t('active_login.desc')}</Text>
          <View style={styles.input}>
            <CustomInput
              ref={codeIp}
              value={otp}
              onChange={setOtp}
              onComplete={sendOtp}
              length={8}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* <ConfirmButton loading={loading} /> */}
      <Loader modalVisible={loading} />
    </View>
  )
}

export default LoginOTPScreen
