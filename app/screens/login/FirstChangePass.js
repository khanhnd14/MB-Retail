/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../theme'
import { Topbar, ConfirmButton, TextInput, Text } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { settingOperations } from '../../state/setting'
import { Utils } from '../../utilities'

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
  },
  note: {

    color: Colors.textBlack,
    marginHorizontal: Metrics.medium,
    ...Helpers.contentWidth,
  },
  title: {
    color: Colors.textBlack,
    marginBottom: Metrics.small,
    marginHorizontal: Metrics.medium,
  },
})
const FirstChangePass = ({ route }) => {
  const { isPwdExpired, isPasswordStrong } = route.params
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { activeCode } = useSelector((state) => state.user)
  const { changePassComplete, changePassError } = useSelector((state) => state.setting)

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.replace('MainScreen')
      setTimeout(() => {
        Navigation.push('SetupPinScreen')
      }, 300)
    }
  }, [changePassComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [changePassError])

  const changePass = () => {
    if (confirmPin < 6 || oldPin < 6) {
      Utils.toast('Vui lòng nhập đủ thông tin')
      return
    }
    const patt = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{6,32}$')
    const patt2 = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$')
    const res = patt.test(confirmPin) || patt2.test(confirmPin)
    if (!res) {
      Utils.toast(I18n.t('setting.notValid'))
      return
    }
    if (newPin !== confirmPin) {
      Utils.toast('Mật khẩu không khớp')
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
    dispatch(
      settingOperations.changePass({
        oldPassword: oldPin,
        newPassword: newPin,
        otp: '1',
        sessionId: '0',
        uiid: Utils.getUserDeviceID(),
        activeCode,
        isFirst: true,
      })
    )
  }

  const textTitle =
    isPasswordStrong === 'W'
      ? I18n.t('setting.warnpwdweakChange')
      : isPwdExpired
      ? I18n.t('setting.pwdExpire')
      : I18n.t('setting.notePassword')

  return (
    <Fragment>
      <Topbar
        title={I18n.t('setting.change_pass')}
        rightIcon={null}
        leftIcon={null}
        onLeftPress={null}
        isBottomSubLayout
        background={Colors.white}
      />
      <View style={[Helpers.fillColCross, styles.container]}>
        <View style={Helpers.fillColCross}>
          {/* <Text style={styles.title}>{textTitle}</Text> */}
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
          <View style={[styles.input]}>
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
          </View>
          <Text style={[styles.note, { marginTop: Metrics.normal * 2 }]}>
            {I18n.t('setting.pwdNote')}
          </Text>
          <Text style={[styles.note]}>{I18n.t('setting.pwdNote2')}</Text>
        </View>
        <ConfirmButton
          onPress={() => changePass()}
          text={I18n.t('action.action_update')}
          loading={loading}
        />
      </View>
    </Fragment>
  )
}

export default FirstChangePass
