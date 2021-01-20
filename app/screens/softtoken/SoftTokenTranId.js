/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../theme'
import { Topbar, ConfirmButton, TextInput } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'

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
})
const SoftTokenTranId = () => {
  const [tranId, setTranId] = useState('')

  const enterQr = () => {
    Navigation.replace('SoftTokenScanQr')
  }

  const showHOTP = () => {
    if (tranId.length === 6) {
      Navigation.replace('SoftTokenGenOTP', { tranId })
    }
  }
  return (
    <Fragment>
      <Topbar title={I18n.t('softtoken.tranid')} isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fillColCross, styles.container]}>
        <View style={Helpers.fill}>
          <View style={[styles.input]}>
            <TextInput
              style={styles.inputText}
              autoCorrect={false}
              autoFocus
              placeholderTextColor={Colors.primary2}
              placeholder={I18n.t('softtoken.tranid')}
              value={tranId}
              keyboardType="numeric"
              onChangeText={(val) => setTranId(val)}
              onSubmitEditing={() => {}}
              maxLength={6}
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <ConfirmButton
          style={{ paddingBottom: Metrics.tiny }}
          text={I18n.t('softtoken.qrscan')}
          onPress={() => enterQr()}
        />
        <ConfirmButton onPress={() => showHOTP()} />
      </View>
    </Fragment>
  )
}

export default SoftTokenTranId
