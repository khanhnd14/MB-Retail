/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { Helpers, Colors, Metrics } from '../../theme'
import { Topbar, ConfirmButton, Text } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { softTokenSelectors } from '../../state/softtoken'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
  },
  desc: {
    marginVertical: Metrics.medium,
    color: Colors.textBlack
  },
  otp: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.textBlack
  }
})
const SoftTokenGenOTP = ({ route }) => {
  const { tranId } = route.params
  const [hotp, setHotp] = useState('')

  useEffect(() => {
    softTokenSelectors.getHOTP(tranId).then((otp) => {
      setHotp(otp)
    })
  }, [])

  const switchTransaction = () => {
    Navigation.replace('SoftTokenScanQr')
  }
  return (
    <Fragment>
      <Topbar title="SoftToken OTP" isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fillColCross, styles.container]}>
        <View style={Helpers.fillColCross}>
          <Text style={styles.desc}>{`${I18n.t('softtoken.OTPDesc')}${tranId}`}</Text>
          <Text style={styles.otp}>{hotp}</Text>
        </View>

        <ConfirmButton onPress={() => switchTransaction()} text={I18n.t('softtoken.AnotherTranID')} />
      </View>
    </Fragment>
  )
}

export default SoftTokenGenOTP
