import React, { useState, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Helpers, Colors, Metrics } from '../../theme'
import { PinCode, Text } from '../../components'
import { softTokenSelectors } from '../../state/softtoken'
import { Utils } from '../../utilities'
import * as Navigation from '../../navigation'
import I18n from '../../translations'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
  },
  textChange: {
    fontSize: 16,
    color: Colors.textBlack,
    marginBottom: Metrics.small * 10,
  },
})

const SoftTokenVerify = () => {
  const [pinCode, setPin] = useState('')
  const pinRef = useRef(null)

  const enterPin = (pin) => {
    setTimeout(() => {
      pinRef.current && pinRef.current.newAttempt()
      if (Utils.isStringEmpty(pin)) return
      setPin(pin)
      softTokenSelectors.comparePin(pin).then((isPin) => {
        if (isPin) {
          Navigation.replace('SoftTokenScanQr')
        }
      })
    }, 300)
  }

  const changePin = () => {
    Navigation.push('SoftTokenChangePin')
  }

  return (
    <View style={[Helpers.fillColCross, styles.container]}>
      <View style={Helpers.fillColCross}>
        <PinCode
          ref={pinRef}
          styleContainer={Helpers.fill}
          status="enter"
          sentenceTitle={I18n.t('softtoken.PINSTPlaceHolder')}
          endProcess={(pin) => enterPin(pin)}
        />
        <TouchableOpacity onPress={() => changePin()}>
          <Text style={styles.textChange}>{I18n.t('softtoken.change_pin')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SoftTokenVerify
