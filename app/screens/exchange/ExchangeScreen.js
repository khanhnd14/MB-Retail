import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Text, Topbar } from '../../components'
import { exchangeRateOperations } from '../../state/exchangeRate'
import i18n from '../../translations'
import { Utils } from '../../utilities'
import ItemExchangeDetail from './component/ItemExchangeDetail'
import styles from './style'

const ATMScreen = () => {
  const dispatch = useDispatch()
  const { exchangeRateList } = useSelector((state) => state.exchangeRate)

  useEffect(() => {
    if (exchangeRateList) {
      Utils.hideLoading()
    }
  }, [exchangeRateList])

  useEffect(() => {
    Utils.showLoading()
    dispatch(exchangeRateOperations.getAllExchangeRate())
  }, [])
  return (
    <>
      <Topbar title={i18n.t('product.exchange_rate.title')} />
      <View style={styles.mainBody}>
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
              <View style={styles.contentContainer}>
                <View style={styles.childWidth}>
                  <Text style={styles.titleStyle}>{i18n.t('product.exchange_rate.currency')}</Text>
                </View>
                <View style={styles.childWidth}>
                  <Text style={styles.titleStyle}>{i18n.t('product.exchange_rate.bid')}</Text>
                </View>
                <View style={styles.childWidth}>
                  <Text style={styles.titleStyle}>{i18n.t('product.exchange_rate.ask')}</Text>
                </View>
              </View>
              {exchangeRateList?.map((item, index) => (
                <ItemExchangeDetail key={index} {...{ item }} />
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </>
  )
}

export default ATMScreen
