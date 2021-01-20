import React, { useMemo } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Utils } from '../../../utilities'
import { Colors, Metrics } from '../../../theme'
import { Text } from '../../../components'
import * as Navigation from '../../../navigation'

const styles = StyleSheet.create({
  viewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.gray9,
    paddingHorizontal: 5,
  },
  titleItem: { fontWeight: '500', fontFamily: 'Helvetica' },
  textContent: { fontFamily: 'Helvetica', maxWidth: Metrics.medium * 11 },
  textAmount: {
    fontFamily: 'Helvetica',
    fontWeight: '600',
  },
  viewContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
})

export default () => {
  const { historyCreditCard } = useSelector((state) => state.account)
  const onNavigateDetail = ({ exchange }) => {
    Navigation.push('ExchangeDetailScreen', {
      amount: exchange.transAmount,
      remark: exchange.transDetails,
      currencyCode: exchange.currencyCode,
      transferDate: exchange.transferDate,
      tranType: exchange.transType === '+' ? 'Ghi có' : 'Ghi nợ'
    })
  }
  const renderItemAcout = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => onNavigateDetail(item)}
      key={index}
      style={styles.viewItem}
    >
      <Text style={styles.titleItem}>{item.time}</Text>
      <View style={styles.viewContent}>
        <Text style={styles.textContent}>{item?.content}</Text>
        <Text
          style={{
            ...styles.textAmount,
            color: item.type === '+' ? Colors.amountPlus : Colors.amountMinus,
          }}
        >{`${item.type}${Utils.formatAmountText(item.amount)} ${''}`}
        </Text>
      </View>
    </TouchableOpacity>
    )
  const history = useMemo(() => _.map(_.reverse(historyCreditCard).reverse(), (num) => ({
    time: `${num.transferDate} ${num.transferTime}`,
    content: num.transDetails || '',
    type: num.transType,
    amount: num.transAmount,
    exchange: num
  })), [historyCreditCard])

  return (
    <>
      {history.length !== 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{
            height: !(Utils.getWindowHeight() > 800) ? Utils.getWindowHeight() / 3 : Utils.getWindowHeight() / 2,
            backgroundColor: Colors.white,
            paddingHorizontal: Metrics.small,
          }}
          keyExtractor={(item, index) => index.toString()}
          data={history}
          renderItem={renderItemAcout}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>{I18n.t('product.empty_history')}</Text>
      )}
    </>
  )
}
