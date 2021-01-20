import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Icon, Text } from '../../../components'
import { accountOperations } from '../../../state/account'
import { Colors, Images, Metrics } from '../../../theme'
import { Utils } from '../../../utilities'
import * as Navigation from '../../../navigation'
import { RESET_CARD_ACTIVE_STATUS } from '../../../state/account/types'

const styles = StyleSheet.create({
  cardNotActive: {
    width: 317.33,
    height: 200,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrics.normal
  },
  icon: {
    width: Utils.getRatioDimension(50),
    height: Utils.getRatioDimension(50)
  }
})

const LockCard = forwardRef(({ creditItem, isLockedCard }, ref) => {
  if (!isLockedCard) {
    return null
  }
  return (
    <TouchableOpacity
      style={styles.cardNotActive}
    >
      <Image source={Images.pin_the} style={styles.icon} />
      <Text style={{ color: Colors.white, fontSize: 14, fontWeight: 'bold' }}>{I18n.t('account.card_payment.locking_card')}</Text>
    </TouchableOpacity>
  )
})
export default LockCard
