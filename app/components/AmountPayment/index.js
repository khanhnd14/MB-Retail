import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { numberWithCommas, numberToVietnameseText } from '../../utilities/common'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.textBlack,
    fontSize: 16,
  },
  amountDash: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  amountNumber: {
    color: Colors.gray1,
    fontSize: 16,
    marginTop: Metrics.small * 0.1,
  },
  amountString: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
})

const AmountPayment = ({ amount, height }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Số tiờn</Text>
    <View
      style={{
          marginTop: Metrics.small,
          height: height || 80,
        }}
    >
      <View>
        {amount === 0 ? null : (
          <>
            <Text style={styles.amountNumber}>{`${numberWithCommas(amount)} VND`}</Text>
            <Text style={styles.amountString}>{`${numberToVietnameseText(amount)}`}</Text>
          </>
            )}
      </View>
    </View>
  </View>
  )
AmountPayment.defaultProps = {
  discount: 0,
  groupType: null,

}
export default AmountPayment
