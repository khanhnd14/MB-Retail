import React from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import { Text } from '..'

const styles = StyleSheet.create({
  viewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Metrics.tiny * 2,
    borderBottomWidth: 1,
    borderColor: Colors.gray9,
    paddingHorizontal: 5,
  },
  textContent: { fontFamily: 'Helvetica', color: Colors.gray1 },
  textAmount: {
    fontFamily: 'Helvetica',
    color: Colors.amountMinus,
  },
})

const DetailAccount = ({ item }) => {
  console.log('item', item);
  const data = [
    {
      label: I18n.t('saving.current_cash'),
      content: `${Utils.formatAmountText(item.currentCashValue)} ${item.currencyCode}`
    },
    {
      label: I18n.t('saving.original_balance'),
      content: `${Utils.formatAmountText(item.originalBalance)} ${item.currencyCode}`
    },
    {
      label: I18n.t('saving.opening_date'),
      content: Utils.toStringServerDate(new Date(item.openingDate))
    },
    {
      label: I18n.t('saving.settlement_date'),
      content: Utils.toStringServerDate(new Date(item.settlementDate))
    },
    {
      label: I18n.t('saving.interest_amount'),
      content: `${Utils.formatAmountText(item.interestAmount)} ${item.currencyCode}`
    },
    {
      label: I18n.t('saving.penalty_amount'),
      content: `${Utils.formatAmountText(item.penaltyAmount)} ${item.currencyCode}`
    },
    {
      label: I18n.t('saving.term'),
      content: `${item.term} ${I18n.t('saving.month')}`
    },
    {
      label: I18n.t('saving.interest_rate'),
      content: `${(item.interestRate * 100).toFixed(2)} % / ${I18n.t('saving.year')}`
    }
  ]
  return (
    <>
      {
        data.map((value, index) => (
          <View key={index} style={styles.viewContent}>
            <Text style={styles.textContent}>{value.label}</Text>
            <Text style={styles.textAmount}>
              {value.content}
            </Text>
          </View>
        ))
      }

    </>
  )
}

export default DetailAccount
