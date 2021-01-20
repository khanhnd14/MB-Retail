import React, { useState, useMemo, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import I18n from 'i18n-js'
import { set } from 'react-native-reanimated'
import { Metrics, Colors } from '../../theme'
import { Icon, Text } from '../../components'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Metrics.normal
  },
  qrCode: {
    alignItems: 'center',
    flex: 1
  },
  textQrCode: {
    fontWeight: 'bold',
    paddingTop: Metrics.tiny
  }
})

const QrcodeOptions = ({ setIndexTab, index }) => {
  const [tabFocus, setTabFocus] = useState(0)
  const color1 = useMemo(() => tabFocus === 0 ? Colors.primary2 : Colors.gray8, [tabFocus])
  const color2 = useMemo(() => tabFocus === 1 ? Colors.primary2 : Colors.gray8, [tabFocus])
  const color3 = useMemo(() => tabFocus === 2 ? Colors.primary2 : Colors.gray8, [tabFocus])

  const onPressTab = (tab) => {
    setTabFocus(tab)
    setIndexTab(tab)
  }

  useEffect(() => {
    setTabFocus(index)
  }, [index])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onPressTab(0)}
        style={styles.qrCode}
      >
        <Icon name="icon-qr" size={Metrics.normal * 2} color={Colors.primary2} style={{ color: color1 }} />
        <Text style={[styles.textQrCode, { color: color1 }]}>{I18n.t('qrcode.scan')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPressTab(1)} style={styles.qrCode}>
        <Icon name="icon-qr" size={Metrics.normal * 2} color={Colors.primary2} style={{ color: color2 }} />
        <Text style={[styles.textQrCode, { color: color2 }]}>{I18n.t('qrcode.scan_picture')}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => onPressTab(2)} style={styles.qrCode}>
        <Icon name="icon-qr" size={Metrics.normal * 2} color={Colors.primary2} style={{ color: color3 }} />
        <Text style={[styles.textQrCode, { color: color3 }]}>{I18n.t('qrcode.history')}</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default QrcodeOptions
