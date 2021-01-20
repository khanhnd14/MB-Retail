/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, TouchableHighlight } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, AmountLabel } from '../../../components'
import * as Navigation from '../../../navigation'
import { historyTransferOperations } from '../../../state/managertransfer'
import I18n from '../../../translations'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.small,
    backgroundColor: Colors.mainBg,
  },
  boxTypeTransfer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.mainBg,
  },

  boxSelectTransfer: {
    flex: 1,
    paddingHorizontal: Metrics.medium,
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary2,
    paddingVertical: Metrics.small * 1.2,
    justifyContent: 'center',
  },
  boxUnselectTransfer: {
    flex: 1,
    paddingVertical: Metrics.small * 1.2,
    paddingHorizontal: Metrics.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderStyle: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.line,
    height: 5,
  },
  labelSelect: {
    fontWeight: 'bold',
    color: Colors.primary2,
  },
  labelUnSelect: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  row: {
    borderColor: '#bbbbbb',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small,
    borderRadius: 5,
    marginTop: Metrics.small,
    marginHorizontal: Metrics.small * 1.8,
  },
  labelStrong: {
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelSmall: {
    color: '#4F4F4F',
    marginTop: Metrics.small * 0.8,
  },
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
  empty: {
    textAlign: 'center',
  },
})
const ManagerTransfer = ({ route }) => {
  const dispatch = useDispatch()
  const { listHistory, deleteHistoryComplete } = useSelector((state) => state.managertransfer)
  const [type, setType] = useState('A')
  const [listData, setListData] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const param = {
      pageNo: page,
    }
    dispatch(historyTransferOperations.getHistoryTransfer(param))
  }, [deleteHistoryComplete])

  useEffect(() => {
    filterData(type)
  }, [listHistory])

  const filterData = (checktype) => {
    let data = []
    setType(checktype)
    if (Utils.isArrayEmpty(listHistory)) {
      return
    }
    if (checktype === 'A') {
      data = listHistory.sort((a, b) => b.createTime - a.createTime)
    } else if (checktype === 'O') {
      data = _.filter(listHistory, (his) => his.hisType === 'OV')
    } else if (checktype === 'H') {
      data = _.filter(listHistory, (his) => his.hisType === 'H')
    }
    setListData(data)
  }

  const detail = (item) => {
    Navigation.push('ManagerTransferDetail', { item })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[Helpers.rowCross, styles.row]}
      underlayColor="#ddd"
      onPress={() => detail(item)}
    >
      <View style={Helpers.fillCol}>
        <Text style={styles.labelStrong}>{item.beneficiaryName}</Text>
        {!Utils.isStringEmpty(item.pCreateTime) && (
          <Text style={styles.labelSmall}>
            {item.pCreateTime} {item.pCreateDate}
          </Text>
        )}
      </View>
      <AmountLabel style={styles.amount} value={item.amount} currency="VND" />
    </TouchableOpacity>
  )
  const allStyle = type === 'A' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const saveStyle = type === 'O' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const transferStyle = type === 'H' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const allTextStyle = type === 'A' ? styles.labelSelect : styles.labelUnSelect
  const saveTextStyle = type === 'O' ? styles.labelSelect : styles.labelUnSelect
  const transferTextStyle = type === 'H' ? styles.labelSelect : styles.labelUnSelect
  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.manager_transfer')} background={Colors.white} />
      <View style={{ backgroundColor: Colors.white }}>
        <View style={styles.boxTypeTransfer}>
          <TouchableHighlight
            style={allStyle}
            onPress={() => filterData('A')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={allTextStyle}>{I18n.t('transfer.all')}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={saveStyle}
            onPress={() => filterData('O')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={saveTextStyle}>{I18n.t('transfer.saving')}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={transferStyle}
            onPress={() => filterData('H')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={transferTextStyle}>{I18n.t('transfer.schedule_transfer')}</Text>
          </TouchableHighlight>
          <View style={styles.borderStyle} />
        </View>
      </View>

      <View style={[Helpers.fill, styles.container]}>
        {Utils.isArrayEmpty(listData) ? (
          <Text style={styles.empty}>{I18n.t('transfer.empty_transacion')}</Text>
        ) : (
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}`}
            removeClippedSubviews={false}
          />
        )}
      </View>
    </Fragment>
  )
}
export default ManagerTransfer
