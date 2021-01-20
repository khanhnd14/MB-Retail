import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import _ from 'lodash'
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
  detail: { fontWeight: 'bold', fontSize: 14, color: Colors.white, textAlign: 'center' },
})
const BuyingCardSuccess = (props) => {
  const { content } = props.route.params
  const { successOtpRecharge } = useSelector((state) => state.product)
  const stringCode =
    successOtpRecharge.data instanceof Object
      ? successOtpRecharge.data.data
      : successOtpRecharge.data
      console.log('BuyingCardSuccess props:', successOtpRecharge);

  return (
    <>
      <Success
        showButton={false}
        {...props}
        redoTransaction="RechargeScreen"
        message={content}
        messReward={successOtpRecharge.data instanceof Object ? successOtpRecharge.data?.messReward : null}
      >
        {successOtpRecharge.data && !_.isEmpty(stringCode) && (
          <>
            <View style={styles.detailContent}>
              <Text style={styles.detail}>{I18n.t('product.recharge_service.card_number')}</Text>
              <Text selectable style={styles.detail}>
                {stringCode.split(',')[0]}
              </Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detail}>{I18n.t('product.recharge_service.card_seri')}</Text>
              <Text selectable style={styles.detail}>
                {stringCode.split(',')[1]}
              </Text>
            </View>
          </>
        )}
      </Success>
    </>
  )
}

export default BuyingCardSuccess
