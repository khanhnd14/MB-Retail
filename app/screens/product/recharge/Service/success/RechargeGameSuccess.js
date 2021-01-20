import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Success, Text } from '../../../../../components'
import { Colors, Metrics } from '../../../../../theme'

const styles = StyleSheet.create({
    detailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: { fontWeight: 'bold', fontSize: 14, color: Colors.white, textAlign: 'center' }

})
const RechargeGameSuccess = (props) => {
  const { content } = props.route.params
  const { successOtpRecharge } = useSelector((state) => state.product)

  return (
    <>
      <Success showButton={false} {...props} redoTransaction="redoTransaction" message={content}>
        <View style={styles.detailContent}>
          <Text style={styles.detail}>{I18n.t('recharge_service.card_number')}</Text>
          {/* <Text style={styles.detail}>{successOtpRecharge.data.split(',')[0]}</Text> */}
        </View>
        <View style={styles.detailContent}>
          <Text style={styles.detail}>{I18n.t('recharge_service.card_seri')}</Text>
          {/* <Text style={styles.detail}>{successOtpRecharge.data.split(',')[1]}</Text> */}
        </View>

      </Success>
    </>
    )
}

export default RechargeGameSuccess
