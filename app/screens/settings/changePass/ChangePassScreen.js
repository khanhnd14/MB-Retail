/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../../theme'
import { Topbar, ConfirmButton, TextInput, Text } from '../../../components'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { settingOperations } from '../../../state/setting'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
  },
  desc: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: Metrics.medium,
    textAlign: 'center',
    marginHorizontal: Metrics.medium * 2,
  },
  rectangle: {
    height: Metrics.small * 30,
    width: Metrics.small * 30,
    marginTop: Metrics.small * 3.4,
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: 'transparent',
  },
  input: {
    ...Helpers.contentWidth,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: Metrics.tiny * 10,
    marginTop: Metrics.tiny,
    paddingHorizontal: Metrics.normal * 2,
  },
  inputText: {
    fontWeight: 'bold',
    flex: 1,
  },
  note: {

    color: Colors.textBlack,
    marginVertical: Metrics.normal * 2,
    marginHorizontal: Metrics.medium,
  },
  textHint: {
    color: Colors.primary2,
    fontSize: 12,
  },
})
const ChangePassScreen = () => {
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [isContinue, setContinue] = useState(false)
  const [textHint, setTextHint] = useState('')
  const dispatch = useDispatch()
  const { makeTransactionComplete, makeTransactionError, sendOtpComplete } = useSelector(
    (state) => state.setting
  )

  useEffect(() => {
    if (loading && makeTransactionComplete) {
      dispatch(
        settingOperations.sendOtpChangePass({
          transaction: makeTransactionComplete.message,
        })
      )
    }
  }, [makeTransactionComplete])

  useEffect(() => {
    if (loading && sendOtpComplete) {
      setLoading(false)
      Navigation.replace('ChangePassOTP', {
        oldPassword: oldPin,
        newPassword: confirmPin,
      })
    }
  }, [sendOtpComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [makeTransactionError])

  useEffect(() => {
    validForm()
  }, [newPin, confirmPin])

  const validForm = () => {
    if (confirmPin.trim() === '' || confirmPin.trim() === '' || oldPin.trim() === '') {
      setTextHint('')
      setContinue(false)
      return
    }
    const patt = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{6,32}$')
    const patt2 = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$')
    const res = patt.test(confirmPin) || patt2.test(confirmPin)
    if (!res) {
      setTextHint(I18n.t('setting.notValid'))
      setContinue(false)
      return
    }
    if (newPin !== confirmPin) {
      setTextHint(I18n.t('setting.pass_not_match'))
      setContinue(false)
    } else {
      setTextHint('')
      setContinue(true)
    }
  }

  const changePin = () => {
    if (newPin !== confirmPin) {
      return
    }
    if (confirmPin < 6 || oldPin < 6) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    if (
      confirmPin.indexOf('&lt;') >= 0 ||
      confirmPin.indexOf('<') >= 0 ||
      confirmPin.indexOf('"') >= 0 ||
      confirmPin.indexOf('>') >= 0 ||
      confirmPin.indexOf(';') >= 0
    ) {
      Utils.toast(I18n.t('setting.specialInvalid'))
      return
    }
    setLoading(true)
    dispatch(settingOperations.makeTransaction())
  }
  return (
    <Fragment>
      <Topbar title={I18n.t('setting.change_pass')} isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fillColCross, styles.container]}>
        <View style={Helpers.fillColCross}>
          <View style={[styles.input]}>
            <TextInput
              style={styles.inputText}
              autoCorrect={false}
              placeholderTextColor={Colors.primary2}
              placeholder={I18n.t('setting.curr_pass')}
              value={oldPin}
              onChangeText={(val) => setOldPin(val)}
              onSubmitEditing={() => {}}
              secureTextEntry
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[styles.input, { marginTop: Metrics.normal }]}>
            <TextInput
              style={styles.inputText}
              autoCorrect={false}
              placeholderTextColor={Colors.primary2}
              placeholder={I18n.t('setting.new_pass')}
              value={newPin}
              onChangeText={(val) => setNewPin(val)}
              secureTextEntry
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
            <TextInput
              style={styles.inputText}
              autoCorrect={false}
              secureTextEntry
              placeholderTextColor={Colors.primary2}
              placeholder={I18n.t('setting.confirm_pass')}
              value={confirmPin}
              onChangeText={(val) => setConfirmPin(val)}
              onSubmitEditing={() => {}}
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />
            <Text style={styles.textHint}>{textHint}</Text>
          </View>
          <Text style={styles.note}>{I18n.t('setting.desc_change_pass')}</Text>
        </View>
        <ConfirmButton
          color={isContinue ? Colors.primary2 : '#BDBDBD'}
          disabled={!isContinue}
          onPress={() => changePin()}
          text={I18n.t('action.action_update')}
          loading={loading}
        />
      </View>
    </Fragment>
  )
}

export default ChangePassScreen
