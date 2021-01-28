/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Colors, Metrics, Helpers } from '../../../theme'
import { Text, Success, AmountLabel, ConfirmButton } from '../../../components'
import I18n from '../../../translations'
import { Utils } from '../../../utilities'

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
  },
  detailRight: {
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1,
    textAlign: 'right',
  },
  itemView: {
    paddingVertical: Utils.getRatioDimension(9),
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    color: Colors.white,
  },
  itemTitle: {
    marginTop: Utils.getRatioDimension(50),
    marginBottom: Metrics.small,
    fontWeight: '600',
    fontSize: 16,
  },
})

const CloseODSuccess = (props) => {
  const { completeData, registedInfo } = useSelector((state) => state.overdraft)
  const { params } = props.route
  const { message } = completeData || {}
  const { odAccount, odTier } = registedInfo || {}
  const {
    accountInString,
    acctNo,
    overdraftLimit,
    accruedExcesssInt,
    accruedInterestOverdraf,
    holdAmount,
    interestRate,
  } = odAccount || {}

  const renderItemLimit = (title, value, isAmount = true, isBorder = true) => (
    <View style={[styles.itemView]}>
      <Text style={[styles.itemText, { fontWeight: '600' }]}>{title}</Text>
      <Text style={styles.itemText}>{isAmount ? `${Utils.displayAmount(value)} VND` : value}</Text>
    </View>
  )

  return (
    <>
      <Success
        {...props}
        {...params}
        showButton={false}
        textButton={I18n.t('overdraft.btn_end')}
        message={message}
      >
        {/* <View style={[Helpers.fullWidth]}>
          {renderItemLimit('Tài khoản thấu chi', accountInString, false)}
          {renderItemLimit('Đóng hạn mức thấu chi', 100000000)}
          {renderItemLimit('Hạn mức thấu chi còn lại', 0)}
          <Text style={[styles.itemText, styles.itemTitle]}>
            Sổ tiết kiệm đã tất toán
          </Text>
          {renderItemLimit('030-20-18-542381-3', 100000000)}
          {renderItemLimit('030-20-18-542381-3', 100000000)}
          {renderItemLimit('030-20-18-542381-3', 100000000)}
          {renderItemLimit('Tổng số tiền tất toán', 100000000)}
        </View> */}
      </Success>
    </>
  )
}

export default CloseODSuccess
