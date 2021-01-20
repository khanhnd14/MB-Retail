import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Colors, Metrics } from '../../../theme'
import { Utils } from '../../../utilities'
import { accountOperations } from '../../../state/account'
import { Text } from '../../../components'

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    width: Utils.getWindowWidth() - Metrics.normal * 2,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal,
    paddingHorizontal: Metrics.normal,
    paddingBottom: Metrics.normal * 2
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray,
    paddingVertical: Metrics.small,

  },
  value: {
    color: Colors.primary2
  }
})

const RollBackPayment = ({ data, creditItem }) => {
  const { resultAmountStatus, errorAmountStatus } = useSelector(state => state.account)
  const dispatch = useDispatch()
  useEffect(() => {
    if (creditItem) {
      dispatch(accountOperations.getAmountStatus(creditItem.contractNumber))
    }
  }, [creditItem])

  useEffect(() => {
   if (resultAmountStatus) {
     (resultAmountStatus?.clientId && resultAmountStatus?.availablePoint) && dispatch(accountOperations.redeemGetUrl(resultAmountStatus?.clientId, resultAmountStatus?.availablePoint, resultAmountStatus?.contractName))
   }
  }, [resultAmountStatus])

  useEffect(() => {
    if (errorAmountStatus) {
      Utils.hideLoading()
    }
  }, [errorAmountStatus])
  return (
    <View style={styles.wrapper}>
      {
        data.map((value, index) => (
          <View style={styles.row}>
            <Text>{value.label}</Text>
            <Text style={styles.value}>{value.value}</Text>
          </View>
          ))
      }
    </View>
    )
}
export default RollBackPayment
