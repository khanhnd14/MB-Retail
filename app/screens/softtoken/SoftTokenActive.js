/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, ApplicationStyles, Metrics } from '../../theme'
import { Text, ConfirmButton } from '../../components'
import { softTokenOperations } from '../../state/softtoken'
import { Utils } from '../../utilities'
import I18n from '../../translations'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  container: {
    padding: Metrics.small,
  },
  desc: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: Metrics.medium,
  },
  btnContinue: {
    padding: 12,
    ...Helpers.contentWidth,
    marginVertical: Metrics.normal,
  },
})
const SoftTokenActive = () => {
  const dispatch = useDispatch()
  const { info, otpComplete, otpError } = useSelector((state) => state.softtoken)
  const { message } = info || {}
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // if (Utils.isStringEmpty(status)) {
    //   getInfo()
    // }
  }, [])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.replace('SoftTokenOTP')
    }
  }, [otpComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [otpError])

  const getInfo = () => {
    const param = {
      activeCode: user.activeCode,
    }
    dispatch(softTokenOperations.getSoftTokenInfo(param))
  }

  const onActive = () => {
    setLoading(true)
    const body = {
      activeCode: user.activeCode,
      UUID: Utils.getUserDeviceID(),
    }
    dispatch(softTokenOperations.sendOtpSoftToken(body))
  }

  const renderNotRegister = () => (
    <Text style={styles.desc}>{I18n.t('softtoken.desc_notregister')}</Text>
  )

  const renderReActive = () => (
    <Text style={styles.desc}>{message || I18n.t('softtoken.desc_reactiveMSG')}</Text>
  )

  const renderActive = () => <Text style={styles.desc}>{message || I18n.t('softtoken.desc_activation')}</Text>

  const content = info
    ? (info.peekData.action !== 'none')
      ? renderActive()
      : renderReActive()
    : renderNotRegister()
  return (
    <View style={[Helpers.fillColCross, ApplicationStyles.mainContainer, styles.container]}>
      <View style={Helpers.fill}>{content}</View>
      {info && info.peekData?.action !== 'none' && <ConfirmButton onPress={onActive} loading={loading} />}
    </View>
  )
}

export default SoftTokenActive
