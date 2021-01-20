import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Vibration, Keyboard, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { ActivityIndicator } from 'react-native-paper'
import * as Animatable from 'react-native-animatable'
import BackgroundTimer from 'react-native-background-timer';
import * as types from '../../state/ekyc/types'
import { Colors, Metrics, Images } from '../../theme'
import { ekycOperations } from '../../state/ekyc'
import CountDown from './CountDown'
import { Icon, ConfirmIcon, Text, TextInput } from '..'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  title: {
    color: Colors.black,
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: Metrics.medium * 4,
    lineHeight: Metrics.normal * 2,
    paddingVertical: Metrics.medium
  },
  digit: {
    // height: 30,
    width: Metrics.normal * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 30,
    textAlign: 'center',
    color: Colors.black,
  },
  underline: {
    width: Metrics.normal,
    height: 1,
    backgroundColor: Colors.gray12,
  },
  input: {
    color: Colors.gray,
    width: 0
  },
  action: {
    alignSelf: 'center',
    color: Colors.second,
    textDecorationLine: 'underline',
    paddingTop: Metrics.normal * 2
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Metrics.medium,
    marginHorizontal: Metrics.medium
  },
  error: {
    color: Colors.primary2,
    marginLeft: Metrics.normal
  },
  image: {
    width: Metrics.normal * 1.5,
    height: Metrics.normal * 1.5,
  },
})
let timeout

const OTP = forwardRef(({ numberPhone, onBack, resendCode, setNumberPhone, toastAlert }, ref) => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState('')
  const [expiredOtp, setExpiredOtp] = useState('')
  const [isShowVerify, setIsShowVerify] = useState(false)
  const [isResendCode, setIsResendCode] = useState(true)

  const [messageHideCountDownTime, setMessageHideCountDownTime] = useState(false)

  const refInput = useRef();
  const refCountDown = useRef();
  const { dataOtpVerify, errorOtpVerified, dataOtpVerified, resultTsToken, errorTsToken } = useSelector((state) => state.ekyc)
  const onChangePayment = (text) => {
    if (text.length <= 8) {
      setValue(text)
    }
  }

  const dispatch = useDispatch()

  const submit = () => {
    if (expiredOtp) {
      Vibration.vibrate(500, false)
      setValue('')
      return
    }
    setLoading(true)
    dispatch(ekycOperations.verifyOTP(dataOtpVerify?.sessionId, value, numberPhone))
  }

  const onFocus = () => {
    refInput.current && refInput.current.focus()
  }

  const onReinputPhone = () => {
    onBack()
    dispatch(ekycOperations.reset())
    refCountDown.current && refCountDown.current.clearCountDown()
    setNumberPhone('')
  }

  const onResendCode = () => {
    setValue('')
    setExpiredOtp('')
    setMessageHideCountDownTime('')
    setIsShowVerify(false)
    refCountDown.current && refCountDown.current.clearCountDown()
    refCountDown.current && refCountDown.current.onCountDown()
    resendCode()
  }

  const endCountDown = () => {
    Vibration.vibrate(500, false)
    setExpiredOtp(I18n.t('ekyc.expired_otp'))
    Keyboard.dismiss()
  }

  useImperativeHandle(ref, () => ({

    submit

  }));

  useEffect(() => {
    if (dataOtpVerified) {
      const { token } = dataOtpVerified
      setLoading(false)
      dispatch(ekycOperations.getTSToken(token))
    }
  }, [dataOtpVerified])

  useEffect(() => {
    if (errorOtpVerified) {
      Vibration.vibrate(500, false)
      setValue('')
      setLoading(false)
      setIsResendCode(false)
      BackgroundTimer.clearTimeout(timeout)

      timeout = BackgroundTimer.setTimeout(() => {
        dispatch({
          type: types.EKYC_VERIFY_OTP_FAILED,
          payload: null
        })
        setIsResendCode(true)
        setIsShowVerify(false)
        if (errorOtpVerified.status === '500') {
          refCountDown.current && refCountDown.current.clearCountDown()
          setMessageHideCountDownTime(errorOtpVerified.message)
        }
      }, 3000);
    }
  }, [errorOtpVerified])

  useEffect(() => {
    BackgroundTimer.setTimeout(() => {
      refInput.current && refInput.current.focus()
    }, 0);
  }, [])

  useEffect(() => {
    if (resultTsToken) {
      setLoading(false)
    }
  }, [resultTsToken])

  useEffect(() => {
    if (errorTsToken) {
      setLoading(false)
    }
  }, [errorTsToken])

  useEffect(() => {
    if (value.length === 8) {
      if (!messageHideCountDownTime) {
        setIsShowVerify(true)
        submit()
      } else {
        Vibration.vibrate(500, false)
        setValue('')
      }
    }
  }, [value])

  useEffect(() => {
    if (expiredOtp) {
      Vibration.vibrate(500, false)
    }
  }, [expiredOtp])

  // unmout
  useEffect(() => () => {
    refCountDown.current && refCountDown.current.clearCountDown()
  }, [])

  return (
    <View>
      <Text style={styles.title}>{I18n.t('ekyc.otp_title')}{' '}<Text>{Utils.encodeNumber(numberPhone)}</Text></Text>
      <TouchableWithoutFeedback onPress={onFocus}>
        <View
          style={{
          marginVertical: Metrics.small,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: Metrics.medium * 3,
          paddingTop: Metrics.medium * 2,
        }}
        >
          <View style={styles.digit}>
            <Text style={styles.number}>{value[0]}</Text>
            {!value[0] && <View style={styles.underline} />}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[1]}</Text>
            {!value[1] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[2]}</Text>
            {!value[2] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[3]}</Text>
            {!value[3] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[4]}</Text>
            {!value[4] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[5]}</Text>
            {!value[5] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[6]}</Text>
            {!value[6] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[7]}</Text>
            {!value[7] ? <View style={styles.underline} /> : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        placeholderTextColor={Colors.gray}
        onChangeText={onChangePayment}
        keyboardType="number-pad"
        ref={refInput}
        value={value}
      />
      {((expiredOtp || errorOtpVerified)) ? (
        <View style={styles.errorContainer}>
          <Animatable.View
            animation="jello"
            duration={2000}
            easing="ease-out"
            iterationCount="3"
            style={styles.badge}
          >
            {!expiredOtp && (
            <View style={styles.image}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={Images.ekyc_warning} />
            </View>
      )}
          </Animatable.View>
          <Text style={styles.error}>{expiredOtp || errorOtpVerified.message}</Text>
        </View>
      ) : isShowVerify && (
        <TouchableOpacity disabled={loading} onPress={submit} style={styles.errorContainer}>
          {loading ? <ActivityIndicator color={Colors.primary2} /> : <ConfirmIcon color={Colors.success} size={Metrics.normal * 2} />}
          {loading ? <Text style={styles.error}>{I18n.t('ekyc.otp_comfirm')}</Text> : <Text style={[styles.error, { color: Colors.success }]}>{I18n.t('ekyc.otp_comfirm')}</Text>}
        </TouchableOpacity>
      )}
      {!messageHideCountDownTime ? (!expiredOtp && !errorOtpVerified) && <Text style={[styles.title]}>{I18n.t('ekyc.request_resend')} <CountDown ref={refCountDown} endCountDown={endCountDown} /></Text>
      :
      (
        <View style={styles.errorContainer}>
          <Animatable.View
            animation="jello"
            duration={2000}
            easing="ease-out"
            iterationCount="3"
            style={styles.badge}
          >
            {!expiredOtp && (
            <View style={styles.image}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={Images.ekyc_warning} />
            </View>
            )}
          </Animatable.View>
          <Text style={styles.error}>{messageHideCountDownTime}</Text>
        </View>
      )
      }
      <Text
        onPress={(isResendCode) ? onResendCode : () => {
        Keyboard.dismiss()
        toastAlert(I18n.t('ekyc.wait_send_otp'), 2000)
      }}
        style={styles.action}
      >{I18n.t('ekyc.resend_code')}
      </Text>
      <TouchableOpacity onPress={onReinputPhone}>
        <Text style={styles.action}>{I18n.t('ekyc.reagain_phone')}</Text>
      </TouchableOpacity>

    </View>
  )
})
export default OTP
