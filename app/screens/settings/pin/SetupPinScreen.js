/* eslint-disable no-use-before-define */
import React, { useState, useRef, useEffect, Fragment } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { PinCode, Topbar, Text } from '../../../components'
import { Colors, Helpers, Metrics } from '../../../theme'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import { settingOperations } from '../../../state/setting'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: Colors.textBlack,
  },
  skipButton: {
    marginBottom: Metrics.medium * 2,
    padding: Metrics.small,
  },
})

const SetupPinScreen = () => {
  const { activeCode } = useSelector((state) => state.user)
  const { setupPinComplete, setupPinError } = useSelector((state) => state.setting)

  const pinRef = useRef(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [pin, setPin] = useState('')
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (loading) {
      Utils.showToast(I18n.t('setting.setup_pin_success'))
      setLoading(false)
      Navigation.pop()
    }
  }, [setupPinComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      pinRef.current && pinRef.current.newAttempt()
    }
  }, [setupPinError])

  const complete = (val) => {
    setTimeout(() => {
      if (step === 0) {
        setPin(val)
        setStep(1)
        pinRef.current && pinRef.current.newAttempt()
      } else if (val === pin) {
        setLoading(true)
        dispatch(
          settingOperations.setupPinCode({
            activeCode,
            pinCode: pin,
            oldPinCode: '',
          })
        )
      } else {
        Utils.showToast(I18n.t('setting.pin_not_match'))
        pinRef.current &&
          pinRef.current.newAttempt().then(() => {
            setStep(0)
          })
      }
    }, 300)
  }

  const onSkip = () => {
    Navigation.pop()
  }

  const title =
    step === 0 ? I18n.t('setting.setup_pin_desc') : I18n.t('setting.setup_pin_confirm_desc')

  return (
    <Fragment>
      <Topbar
        title={I18n.t('setting.setup_pin_title')}
        isBottomSubLayout
        background={Colors.white}
      />
      <View style={[Helpers.fill, styles.container]}>
        <PinCode
          loading={loading}
          ref={pinRef}
          styleContainer={Helpers.fill}
          status="setup"
          sentenceTitle={title}
          endProcess={(val) => complete(val)}
        />
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.text}>{I18n.t('setting.setup_pin_later')}</Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  )
}

export default SetupPinScreen
