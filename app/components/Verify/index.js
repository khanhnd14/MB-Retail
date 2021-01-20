/* eslint-disable no-use-before-define */
import React, { useState, useRef, useEffect, Fragment } from 'react'
import { View, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import TouchID from 'react-native-touch-id'
import Text from '../MsbText'
import Loader from '../Loader'
import CustomInput from '../ConfirmationCodeInput'
import PinCode from '../pincode/PinCode'
import { ApplicationStyles, Metrics, Helpers } from '../../theme'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import { softTokenSelectors } from '../../state/softtoken'
import { appSelectors } from '../../state/application'

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

const Verify = (props) => {
  const { loading, onComplete, onResend, data } = props
  const { securityType, tokenTransaction, qrString } = data || {}

  const pinRef = useRef(null)
  const [otp, setOtp] = useState('')
  const codeIp = useRef(null)

  useEffect(() => {
    if (securityType === 'FP') {
      TouchID.isSupported()
        .then(() => {
          onBioAuthen()
        })
        .catch(() => {})
    }
  }, [])

  // useEffect(() => {
  //   startListeningForOtp()
  //   return () => {
  //     RNOtpVerify.removeListener()
  //   }
  // }, [])

  // const startListeningForOtp = () => {
  //   RNOtpVerify.getOtp()
  //     .then(() => RNOtpVerify.addListener(otpHandler))
  //     .catch(() => {})
  // }

  // const otpHandler = (message) => {
  //   const code = /(\d{4})/g.exec(message)[1]
  //   setOtp(code)
  //   RNOtpVerify.removeListener()
  //   Keyboard.dismiss()
  // }

  const complete = (code) => {
    if (onComplete) {
      onComplete(code)
    }
    setTimeout(() => {
      setOtp('')
      codeIp && codeIp.current && codeIp.current.clear()
    }, 300)
  }

  const enterPin = (pin) => {
    setTimeout(() => {
      pinRef.current && pinRef.current.newAttempt()
      if (Utils.isStringEmpty(pin)) return
      softTokenSelectors.comparePin(pin).then((isPin) => {
        if (isPin) {
          softTokenSelectors.getQROtp(qrString).then((soCode) => {
            complete(soCode)
          })
        }
      })
    }, 300)
  }

  const onBioAuthen = () => {
    const optionalConfigObject = {
      title: 'Authentication Required', // Android
      color: '#e00606', // Android,
      fallbackLabel: '', // iOS (if empty, then label is hidden)
    }
    TouchID.authenticate('', optionalConfigObject)
      .then(() => {
        appSelectors.getBioCode(tokenTransaction).then((code) => {
          console.log('getBioCode:', code)

          complete(code)
        })
      })
      .catch(() => {})
  }

  const renderSoftToken = () => (
    <View style={Helpers.fill}>
      <PinCode
        loading={loading}
        ref={pinRef}
        styleContainer={Helpers.fill}
        status="enter"
        sentenceTitle={I18n.t('vefiry.input_so')}
        endProcess={(pin) => enterPin(pin)}
      />
    </View>
  )
  const renderOTP = () => {
    const desc = I18n.t('vefiry.input_otp')
    return (
      <Fragment>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[Helpers.fill, Helpers.crossCenter, ApplicationStyles.mainContainer]}>
            <Text style={[styles.title, Helpers.contentWidth]}>{desc}</Text>
            <View style={styles.input}>
              <CustomInput
                ref={codeIp}
                value={otp}
                onChange={setOtp}
                onComplete={(val) => complete(val)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Loader modalVisible={loading} />
      </Fragment>
    )
  }

  const renderFP = () => (
    <View style={[Helpers.fill, Helpers.center, ApplicationStyles.mainContainer]}>
      <Loader modalVisible={loading} />
    </View>
  )

  return (
    <View style={[Helpers.fill]}>
      {securityType === 'SO' && renderSoftToken()}
      {securityType === 'SM' && renderOTP()}
      {securityType === 'FP' && renderFP()}
    </View>
  )
}

Verify.defaultProps = {
  loading: false,
}

Verify.propTypes = {
  loading: PropTypes.bool,
  onComplete: PropTypes.func,
  onResend: PropTypes.func,
  data: PropTypes.object,
}
export default Verify
