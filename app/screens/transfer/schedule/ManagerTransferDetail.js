/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, ConfirmButton, AmountLabel } from '../../../components'
import * as Navigation from '../../../navigation'
import { historyTransferOperations } from '../../../state/managertransfer'
import I18n from '../../../translations'
import { Utils } from '../../../utilities'
import ConfirmDelete from './ConfirmDelete'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.small,
  },
  element: {
    paddingVertical: Metrics.small * 1.3,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
  },
  content: {
    color: '#4F4F4F',
    fontSize: 16,
    marginTop: Metrics.small,
  },
})
const ManagerTransferDetail = ({ route }) => {
  const { item } = route.params
  const dispatch = useDispatch()
  const { listHistory, deleteHistoryComplete, deleteHistoryError } = useSelector(
    (state) => state.managertransfer
  )
  const [type, setType] = useState('A')
  const [loading, setLoading] = useState(false)
  const [isDelete, setDelete] = useState(false)
  const [listData, setListData] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const param = {
      pageNo: page,
    }
    dispatch(historyTransferOperations.getHistoryTransfer(param))
  }, [])

  useEffect(() => {
    if (loading) {
      Navigation.pop()
    }
  }, [deleteHistoryComplete, deleteHistoryError])

  useEffect(() => {
    filterData(type)
  }, [listHistory])

  const deleteHistory = () => {
    setLoading(true)
    dispatch(
      historyTransferOperations.deleteHistoryTransfer({
        tranSn: item.tranSn,
        hisType: item.hisType,
      })
    )
  }

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

  return (
    <Fragment>
      <Topbar
        title={I18n.t('transfer.manager_transfer')}
        subTitle={I18n.t('transfer.manager_transfer_detail')}
      />
      <View style={Helpers.fill}>
        <View style={[styles.container]}>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.from_account')}</Text>
            <Text style={styles.content}>
              {item.rolloutAccountName} - {item.rolloutAccountNo}
            </Text>
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.benefit_account')}</Text>
            <Text style={styles.content}>
              {item.beneficiaryName} - {item.beneficiaryAccountNo}
            </Text>
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
            <AmountLabel style={styles.content} value={item.amount} currency="VND" />
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.time')}</Text>
          </View>
          <View style={[styles.element, Helpers.rowCross]}>
            <View style={Helpers.fill}>
              <Text style={[styles.title, { color: Colors.textBlack }]}>
                {I18n.t('transfer.start_date')}
              </Text>
              <Text style={styles.content}>{item.detailScheduleFrom}</Text>
            </View>
            <View style={[Helpers.fill, Helpers.crossEnd]}>
              <Text style={[styles.title, { color: Colors.textBlack }]}>
                {I18n.t('transfer.to_date')}
              </Text>
              <Text style={styles.content}>{item.detailScheduleEnd}</Text>
            </View>
          </View>
          <View style={[styles.element, { borderBottomWidth: 0 }]}>
            <Text style={styles.title}>{I18n.t('transfer.frequency_transfer')}</Text>
            <Text style={styles.content}>{item.detailScheduleType}</Text>
          </View>
        </View>
      </View>
      <ConfirmButton
        text={I18n.t('action.action_delete')}
        onPress={() => setDelete(true)}
        loading={loading}
      />
      <ConfirmDelete
        visible={isDelete}
        handleModal={() => setDelete(false)}
        onConfirm={deleteHistory}
      />
    </Fragment>
  )
}
export default ManagerTransferDetail
