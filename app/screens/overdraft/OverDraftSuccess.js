/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Colors, Metrics } from '../../theme'
import { Text, Success, AmountLabel, ConfirmButton } from '../../components'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: {
    // fontWeight: 'bold',
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1,
  },
  detailRight: {
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1,
    textAlign: 'right',
  },
})

const OverDraftSuccess = (props) => {
  const { completeData } = useSelector((state) => state.overdraftstaff)
  const { params } = props.route
  console.log('props OverDraftSuccess:', props)
  const { expireDate, odLimitAmount, interestRate, overDrafAccount } = completeData || {}

  return (
    <>
      <Success
        {...props}
        {...params}
        showButton={false}
        textButton={I18n.t('overdraft.btn_end')}
      >
        <View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('overdraft.number_account')}</Text>
            <Text style={styles.detailRight}>{overDrafAccount}</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('overdraft.max_limit_over')}</Text>
            <AmountLabel style={styles.detailRight} value={odLimitAmount} currency="VND" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('overdraft.interest_rate')}</Text>
            <Text style={styles.detailRight}>{`${interestRate}%/${I18n.t('overdraft.year')}`}</Text>
          </View>
          <View style={[styles.detailContent, { borderBottomWidth: 0 }]}>
            <Text style={styles.detail}>{I18n.t('overdraft.dua_date')}</Text>
            <Text style={styles.detailRight}>{(Utils.toStringServerDate(expireDate))}</Text>
          </View>
        </View>

      </Success>

    </>
  )
}

export default OverDraftSuccess
