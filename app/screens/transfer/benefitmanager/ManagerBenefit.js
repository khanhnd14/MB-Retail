/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, TouchableHighlight, Image, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Helpers, Metrics, Colors, Images } from '../../../theme'
import { Topbar, Text, BenefitHiddenItem, BenefitItem, SearchInput } from '../../../components'
import * as Navigation from '../../../navigation'
import { transferOperations } from '../../../state/transfer'
import { historyTransferOperations, historyTransferSelectors } from '../../../state/managertransfer'
import I18n from '../../../translations'
import ConfirmDelete from './ConfirmDelete'

const styles = StyleSheet.create({
  container: {
    paddingTop: Metrics.small,
    backgroundColor: Colors.mainBg,
  },
  boxTypeTransfer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Metrics.small * 5.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.mainBg,
  },

  boxSelectTransfer: {
    flex: 1,
    paddingHorizontal: Metrics.small * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 2,
    height: Metrics.small * 5.4,
    borderBottomColor: Colors.primary2,
    paddingVertical: Metrics.small * 0.8,
    justifyContent: 'center',
  },
  boxUnselectTransfer: {
    flex: 1,
    paddingVertical: Metrics.small * 0.8,
    paddingHorizontal: Metrics.medium,
    flexDirection: 'row',
    height: Metrics.small * 5.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderStyle: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.line,
    height: 5,
  },
  labelSelect: {
    color: Colors.primary2,
    flex: 1,
    textAlign: 'center',
  },
  labelUnSelect: {
    color: Colors.black,
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
  },
  addContainer: {
    padding: Metrics.small * 1.2,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    alignItems: 'center',
  },
})
var timeOut
const ManagerBenefit = () => {
  const dispatch = useDispatch()
  const [type, setType] = useState('N')
  const [listData, setListData] = useState([])
  const [listFilter, setFilterData] = useState([])
  const { beneficiaryS, beneficiaryN, beneficiaryY, deleteBenefit } = useSelector(
    (state) => state.managertransfer
  )
  const [textSearch, setTextSearch] = useState('')
  const [isDelete, setDelete] = useState(false)
  const [selectedItem, setSeletecItem] = useState(null)

  useEffect(() => {
    getData()
    return () => dispatch(historyTransferOperations.reset())
  }, [deleteBenefit])

  useEffect(() => {
    filterData(type)
  }, [beneficiaryN])

  const getData = () => {
    dispatch(historyTransferOperations.getBeneficiary('N'))
    dispatch(historyTransferOperations.getBeneficiary('Y'))
    dispatch(historyTransferOperations.getBeneficiary('S'))
    dispatch(transferOperations.getListBank('Y'))
    dispatch(transferOperations.getListBank('N'))
  }

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey)
  }
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  const openRow = (data, rowMap) => {
    if (rowMap[data.index]) {
      rowMap[data.index].manuallySwipeRow(-150)
    }
  }

  const clickItemTransfer = (data, rowMap) => {
    const { item, index } = data
    closeRow(rowMap, index)
    dispatch(transferOperations.selectBenefitAcc(item))
    if (item.isInterBank === 'N') {
      Navigation.push('InternalTransfer')
    } else {
      Navigation.push('InterbankTransfer', { transType: type })
    }
  }

  const clickItemDelete = (data, rowMap) => {
    const { item, index } = data
    closeRow(rowMap, index)
    setSeletecItem(item)
    setDelete(true)
  }

  const onDelete = (item) => {
    dispatch(
      historyTransferOperations.deleteBenefit({
        benefId: item.benefId,
      })
    )
  }

  const addBenefit = () => {
    Navigation.push('AddBenefit', {
      type,
    })
  }

  const filterData = (checktype) => {
    let data = []
    setType(checktype)
    if (checktype === 'N') {
      data = beneficiaryN
    } else if (checktype === 'Y') {
      data = beneficiaryY
    } else if (checktype === 'A') {
      data = _.filter(beneficiaryS, (acc) => acc.beneficiaryBankAddress !== 'cardType')
    } else if (checktype === 'C') {
      data = _.filter(beneficiaryS, (acc) => acc.beneficiaryBankAddress === 'cardType')
    }
    setListData(data)
    setFilterData(data)
  }
  const search = (val) => {
    setTextSearch(val)
    if (timeOut) {
      clearTimeout(timeOut)
    }
    timeOut = setTimeout(() => {
      const data = historyTransferSelectors.filterBenefits(val, listData)
      setFilterData(data)
    }, 300)
  }

  const allStyle = type === 'N' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const saveStyle = type === 'Y' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const transferStyle = type === 'C' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const quickStyle = type === 'A' ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const allTextStyle = type === 'N' ? styles.labelSelect : styles.labelUnSelect
  const saveTextStyle = type === 'Y' ? styles.labelSelect : styles.labelUnSelect
  const transferTextStyle = type === 'C' ? styles.labelSelect : styles.labelUnSelect
  const quickTextStyle = type === 'A' ? styles.labelSelect : styles.labelUnSelect
  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.manager_benefit')} background={Colors.white} />

      <View style={{ backgroundColor: Colors.white }}>
        <View style={styles.boxTypeTransfer}>
          <TouchableHighlight
            style={allStyle}
            onPress={() => filterData('N')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={allTextStyle} numberOfLines={2}>
              MSB
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={quickStyle}
            onPress={() => filterData('A')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={quickTextStyle}>{I18n.t('transfer.interbank_247')}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={saveStyle}
            onPress={() => filterData('Y')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={saveTextStyle}>{I18n.t('transfer.interbank_normal')}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={transferStyle}
            onPress={() => filterData('C')}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={transferTextStyle}>{I18n.t('transfer.interbank_card')}</Text>
          </TouchableHighlight>
          <View style={styles.borderStyle} />
        </View>
      </View>
      <View style={[Helpers.fill, styles.contentContainer]}>
        {/* <TouchableOpacity style={styles.addContainer} onPress={() => addBenefit()}>
          <Image resizeMode="contain" source={Images.add} style={{ width: 35, height: 35 }} />
          <Text style={{ marginLeft: 20, fontWeight: 'bold' }}>
            {I18n.t('transfer.add_benefit_detail')}
          </Text>
        </TouchableOpacity> */}
        <SearchInput value={textSearch} onChangeText={search} onSubmitEditing={() => {}} />
        <SwipeListView
          showsVerticalScrollIndicator={false}
          data={listFilter}
          keyExtractor={(item, index) => `${index}`}
          renderItem={(data, rowMap) => (
            <BenefitItem onOpen={() => openRow(data, rowMap)} item={data.item} showIcon={false} />
          )}
          renderHiddenItem={(data, rowMap) => (
            <BenefitHiddenItem
              data={data}
              onDelete={() => clickItemDelete(data, rowMap)}
              onTransfer={() => clickItemTransfer(data, rowMap)}
            />
          )}
          rightOpenValue={-150}
          previewRowKey="0"
          previewOpenValue={-40}
          previewOpenDelay={1000}
          onRowDidOpen={onRowDidOpen}
        />
      </View>
      <ConfirmDelete
        data={selectedItem}
        visible={isDelete}
        handleModal={() => setDelete(false)}
        onConfirm={(item) => onDelete(item)}
      />
    </Fragment>
  )
}
export default ManagerBenefit
