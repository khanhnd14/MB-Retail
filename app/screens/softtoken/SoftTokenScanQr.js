/* eslint-disable no-use-before-define */
import React, { Fragment } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { Helpers, Colors, Metrics } from '../../theme'
import { Topbar, Text, QRCodeScanner, ConfirmButton } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
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
    marginTop: Platform.OS === 'android' ? Metrics.normal * 5 : Metrics.small * 3.4,
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: 'transparent',
  },
})
const SoftTokenScanQr = () => {
  const enterTransaction = () => {
    Navigation.replace('SoftTokenTranId')
  }
  const onBarCodeRead = (e) => {
    const { tranId } = Utils.converIsoToJSON(e.data);
    Navigation.replace('SoftTokenGenOTP', { tranId })
  }
  return (
    <Fragment>
      <Topbar title={I18n.t('softtoken.qrscan')} isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fillColCross, styles.container]}>
        <Text style={styles.desc}>{I18n.t('softtoken.desc_qr')}</Text>
        <QRCodeScanner cameraStyle={styles.rectangle} onRead={(e) => onBarCodeRead(e)} fadeIn />
        <ConfirmButton text={I18n.t('softtoken.tranid')} onPress={() => enterTransaction()} />
      </View>
    </Fragment>
)
}

export default SoftTokenScanQr
