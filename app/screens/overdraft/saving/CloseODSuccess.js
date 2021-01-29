/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import _ from 'lodash'
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
    borderBottomColor: Colors.white,
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
  const { completeData, registedInfo, selectedData } = useSelector((state) => state.overdraft)
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
  const { data, listSaving } = selectedData || {}

  const closeTotalLimit = useMemo(() => {
    let total = 0
    odTier?.map((item, index) => {
      if (data[item.seqNo]) {
        total += item.drawLimit
      }
    })
    return total
  }, [data])

  const totalLimit = useMemo(() => {
    let total = 0
    odTier?.map((item, index) => {
      if (!data[item.seqNo]) {
        total += item.drawLimit
      }
    })
    return total
  }, [data])

  const totalSaving = useMemo(() => {
    let total = 0
    if (_.isEmpty(listSaving)) return 0
    Object.keys(listSaving)?.map((item, index) => {
      const itemSelect = listSaving[item]
      if (itemSelect) {
        const { receiptInfo } = itemSelect
        total += parseInt(
          receiptInfo.principal + receiptInfo.interestAmount - receiptInfo.penaltyAmount
        )
      }
    })
    return total
  }, [listSaving])

  const listItemSaving = useMemo(() => {
    const list = []
    if (_.isEmpty(listSaving)) return list
    Object.keys(listSaving)?.map((item, index) => {
      const itemSelect = listSaving[item]
      if (itemSelect) {
        list.push(itemSelect)
      }
    })
    return list
  }, [listSaving])

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
        <View style={[Helpers.fullWidth]}>
          {renderItemLimit('Tài khoản thấu chi', accountInString, false)}
          {renderItemLimit('Đóng hạn mức thấu chi', closeTotalLimit)}
          {renderItemLimit('Hạn mức thấu chi còn lại', totalLimit)}
          {!_.isEmpty(listItemSaving) && (
            <View style={[Helpers.fullWidth]}>
              <Text style={[styles.itemText, styles.itemTitle]}>Sổ tiết kiệm đã tất toán</Text>
              {listItemSaving.map((item, index) =>
                renderItemLimit(item.receiptInfo.receiptNoInString, item.principal)
              )}
              {renderItemLimit('Tổng số tiền tất toán', totalSaving, true, false)}
            </View>
          )}
        </View>
      </Success>
    </>
  )
}

export default CloseODSuccess
