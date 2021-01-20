import React, { useMemo, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import _ from 'underscore'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Utils } from '../../../utilities'
import { Colors, Metrics, Helpers } from '../../../theme'
import * as Navigation from '../../../navigation'
import { accountOperations } from '../../../state/account'
import { Text } from '../../../components'

const styles = StyleSheet.create({
  viewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.gray9,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleItem: { fontWeight: '500', fontFamily: 'Helvetica' },
  viewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1
  },
  textContent: {
    fontFamily: 'Helvetica',
    maxWidth: Metrics.medium * 10,
  },
  textAmount: {
    fontFamily: 'Helvetica',
  },
})

export default React.memo((props) => {
  const { historySearch, loadingHistoryExchange } = useSelector((state) => state.account)
  const { getHistory } = props
  const [refreshing, setRefreshing] = useState(false)

  const history = useMemo(
    () =>
      _.map(historySearch, (num) => ({
        time: `${num.transferDate}`,
        content: num.remark,
        type: num.dcSign === 'C' ? '+' : '-',
        amount: num.amount,
        item: num,
        currencyCode: num.currencyCode,
      })),
    [historySearch]
  )

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  const onMomentumScrollEnd = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      console.log('====================================')
      console.log('render 11')
      console.log('====================================')
      // const callback = accountOperations.onAdvancedSearch
      // getHistory(callback, 2)
    }
  }

  const onNavigateDetail = ({ item }) => {
    Navigation.push('ExchangeDetailScreen', item)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    const callback = accountOperations.historyByAccount
    getHistory(callback, 1)
  }

  useEffect(() => {
    setRefreshing(false)
  }, [historySearch])

  useEffect(() => {
    if (!loadingHistoryExchange) {
      Utils.hideLoading()
    }
  }, [loadingHistoryExchange])

  const renderItemAcout = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => onNavigateDetail(item)}
      key={index}
      style={[styles.viewItem, { borderBottomWidth: index === history.length - 1 ? 0 : 1 }]}
    >
      <View style={[Helpers.fill, { flexDirection: 'row' }]}>
        <View>
          <Text style={styles.titleItem}>{item.time}</Text>
          <Text style={styles.textContent}>{item.content}</Text>
        </View>
        <View style={styles.viewContent}>
          <Text
            style={{
              ...styles.textAmount,
              color: item.type === '+' ? Colors.amountPlus : Colors.amountMinus,
            }}
          >{`${item.type}${Utils.formatAmountText(item.amount)} ${item.currencyCode || ''}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
  return (
    <>
      {history.length !== 0 ? (
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          style={{
          height: !(Utils.getWindowHeight() > 800) ? Utils.getWindowHeight() / 3 : Utils.getWindowHeight() / 2,
          backgroundColor: Colors.white,
          borderBottomRightRadius: Metrics.normal,
          borderBottomLeftRadius: Metrics.normal,
          paddingHorizontal: Metrics.small
        }}
          keyExtractor={(item, index) => index.toString()}
          data={history}
          renderItem={renderItemAcout}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>{I18n.t('product.empty_history')}</Text>
      )}
    </>
  )
})
