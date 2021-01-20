import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import { Utils } from '../../../utilities'
import styles from '../style'

const ItemExchangeDetail = ({ item }) => (
  <View style={styles.contentContainer}>
    <View style={styles.childWidth}>
      <Text style={styles.detailStyleBold}>{item?.currencyCode}</Text>
    </View>
    <View style={styles.childWidth}>
      <Text style={styles.detailStyle}>{Utils.formatAmountText(item?.ccyBuyRate)}</Text>
    </View>
    <View style={styles.childWidth}>
      <Text style={styles.detailStyle}>{Utils.formatAmountText(item?.ccySellRate)}</Text>
    </View>
  </View>
  )

export default ItemExchangeDetail
