/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../theme'
import { Topbar, ConfirmButton, TextInput, Text } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { softTokenOperations } from '../../state/softtoken'
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
    paddingHorizontal: Metrics.small,
  },
  inputText: {
    fontWeight: 'bold',
  },
  note: {

    color: Colors.textBlack,
    marginVertical: Metrics.normal * 2,
    marginLeft: Metrics.medium,
  },
})
const SoftTokenChangePin = () => {
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { activeCode } = useSelector((state) => state.user)
  const { changePinComplete, changePinError } = useSelector((state) => state.softtoken)

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Utils.showToast(I18n.t('softtoken.change_pin_succ'))
      Navigation.pop()
    }
  }, [changePinComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [changePinError])

  const changePin = () => {
    if (confirmPin < 4 || oldPin < 4) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    if (newPin !== confirmPin) {
      Utils.toast(I18n.t('softtoken.pin_not_match'))
      return
    }
    setLoading(true)
    dispatch(
      softTokenOperations.changePin({
        UDID: Utils.getUserDeviceID(),
        activeCode,
        newPIN: newPin,
        oldPIN: oldPin,
      })
    )
  }
  return (
    <Fragment>
      <Topbar title="SoftToken" isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fillColCross, styles.container]}>
        <View style={Helpers.fill}>
          <View style={[styles.input]}>
            <TextInput
              style={styles.inputText}
              autoCorrect={false}
              placeholderTextColor={Colors.primary2}
              placeholder={I18n.t('setting.curr_pin')}
              value={oldPin}
              onChangeText={(val) => setOldPin(val)}
              onSubmitEditing={() => {}}
              maxLength={4}
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
              placeholder={I18n.t('setting.new_pin')}
              value={newPin}
              onChangeText={(val) => setNewPin(val)}
              maxLength={4}
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
              placeholder={I18n.t('setting.confirm_pin')}
              value={confirmPin}
              onChangeText={(val) => setConfirmPin(val)}
              onSubmitEditing={() => {}}
              maxLength={4}
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.note}>{I18n.t('softtoken.desc_change_pin')}</Text>
        </View>
        <ConfirmButton onPress={() => changePin()} loading={loading} />
      </View>
    </Fragment>
  )
}

export default SoftTokenChangePin
