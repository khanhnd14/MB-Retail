import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import { numberWithCommas } from '../../utilities/common'
import MsbRadio from '../MsbRadio'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingTop: Metrics.small,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
  },
  label: {
    color: Colors.textBlack,
    fontSize: 14,
  },
  amountDash: {
    color: Colors.primary,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  amountNumber: {
    color: Colors.gray1,
    fontSize: 14,
  },
  amountString: {
    color: Colors.gray2,
    fontSize: 14,
  },
})

const AmountPaymentMany = ({ amount, getAmount }) => {
  const [newAmount, setNewAmount] = useState([])

  useEffect(() => {
    const arr = amount.map((item) => ({
      ...item,
      checked: true,
    }))
    setNewAmount(arr)
  }, [amount])

  useEffect(() => {
    getAmount(newAmount)
  }, [newAmount])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('product.payment')}</Text>
      <View>
        <View>
          {newAmount.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: Metrics.small
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <MsbRadio
                  textStyle={{
                    paddingRight: Metrics.medium * 3,
                    marginLeft: Metrics.tiny * 2,
                  }}
                  text=""
                  checked={item.checked}
                  style={{ width: 30 }}
                  onPress={() => {
                    const arr = newAmount.map((el, idx) =>
                      index === idx
                        ? {
                            ...el,
                            checked: !item.checked,
                          }
                        : el
                    )
                    setNewAmount(arr)
                  }}
                />
                <Text style={styles.amountNumber}>
                  {`${index + 1 < 10 ? '0' : ''}${index + 1}`}
                </Text>
              </View>
              <Text style={styles.amountNumber}>{`${numberWithCommas(item.amount)} VND`}</Text>
            </View>
          ))}
          <View
            style={{
              borderBottomColor: Colors.gray5,
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: Metrics.small
            }}
          >
            <Text style={styles.amountNumber}>{I18n.t('product.total_payment')}</Text>
            <Text style={styles.amountNumber}>{`${numberWithCommas(_.sumBy(_.filter(newAmount, item => item.checked), 'amount'))} VND`}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
AmountPaymentMany.defaultProps = {
  discount: 0,
  groupType: null,
}
export default AmountPaymentMany
