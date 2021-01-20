/* eslint-disable no-shadow */
import React, { Fragment, useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SwipeListView } from 'react-native-swipe-list-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from '../MsbIcon'
import { Metrics, Colors } from '../../theme'
import I18n from '../../translations'
import { productOperations } from '../../state/product'
import { BenefitItem, BenefitHiddenItem, TextInput } from '..';
import * as common from '../../utilities/common'
import * as Navigation from '../../navigation'
import ConfirmDelete from '../../screens/transfer/benefitmanager/ConfirmDelete';
import { Utils } from '../../utilities';

const styles = StyleSheet.create({
  containerItems: {
    width: '100%',
    height: Metrics.medium * 3,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.gray6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapLeftInfo: {
    maxWidth: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerButtonMore: {
    flexDirection: 'row',
  },
  wrapMoreButton: {
    flexDirection: 'row'
  },
  buttonEditor: {
    width: Metrics.medium * 2.3,
    height: Metrics.medium * 3,
    backgroundColor: Colors.edit,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Metrics.small
  },
  buttonDelete: {
    width: Metrics.medium * 2.3,
    height: Metrics.medium * 3,
    backgroundColor: Colors.primary2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotMore: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconAvatar: {
    backgroundColor: Colors.primary2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Metrics.medium * 1.5,
    height: Metrics.medium * 1.5,
    borderRadius: Metrics.medium * 1.5 * 2,
    marginRight: Metrics.normal,
    marginLeft: Metrics.small
  },
  iconItem: {
    color: Colors.white
  },
  more: {
    width: Metrics.small * 1.5,
    height: Metrics.medium * 1.5,
    padding: Metrics.tiny
  },
})

const HistoryListBillPayment = (props) => {
  const dispatch = useDispatch()
  const { data, typeModule } = props;
  const { servicesList, account, resultDeleteService } = useSelector(state => state.product)
  const [selectedItem, setSeletecItem] = useState(null)
  const [isDelete, setDelete] = useState(false)

  const mobileServiceList = typeModule === 'BP' ? React.useMemo(() => {
    const list = []
    servicesList.map((value, index) => {
      const subService = value.serviceList
      if (value.groupType === '3') {
        list.push({ serviceList: subService.filter((value, index) => value.serviceType === 'TV'), groupType: '3' })
        list.push({ serviceList: subService.filter((value, index) => value.serviceType === 'WC'), groupType: '3' })
        list.push({ serviceList: subService.filter((value, index) => value.serviceType === 'EL'), groupType: '3' })
        return list
      } if (value.groupType === '5') {
        list.push({ serviceList: subService.filter((value, index) => value.serviceType === 'BH' || value.serviceType === 'SU'), groupType: '5' })
        list.push({ serviceList: subService.filter((value, index) => value.serviceType === 'OH'), groupType: '5' })
        return list
      }
      list.push(value)
    });
    [list[1], list[5]] = [list[5], list[1]];
    [list[2], list[4]] = [list[4], list[2]];
    return list
  }, [servicesList]) : servicesList

  const [search, setSearch] = React.useState('');

  const history = useMemo(() => _.filter(data, (item) => {
    if (item.serviceName.toLowerCase().includes(search.trim().toLowerCase())) {
      return item
    } if (item.contractNo.toLowerCase().includes(search.trim().toLowerCase())) {
      return item
    }
  }), [search, data])

  console.log('item', history)

  const openRow = (data, rowMap) => {
    if (rowMap[data.index]) {
      rowMap[data.index].manuallySwipeRow(-150)
    }
  }

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  const onPressItem = ({ item }) => {
    const search = _.filter(mobileServiceList,
      {
        serviceList: [{ serviceId: Number(item.serviceId) }]
      }
    );
    const selectedService = _.filter(search[0].serviceList, (e) => e.serviceId === Number(item.serviceId))
    if (typeModule === 'BP') {
      const index = _.findIndex(mobileServiceList, (e) => e.groupType === search[0].groupType)
      const { service, icon, route } = common.getServicePayment(index)
      Navigation.push(route,
      {
        title: service,
        groupType: item.groupType,
        serviceList: search[0].serviceList,
        contractNo: item.beneficiaryAccountNo,
        selectedService: selectedService[0],
        payment: item.amount.toString()
      })
    } else if (typeModule === 'RG') {
      const rechargeService = common.getServiceRecharge(search[0].groupType)
      Navigation.push(rechargeService.route, {
        title: rechargeService.title,
        groupType: item.groupType,
        serviceList: search[0].serviceList,
        contractNo: item.beneficiaryAccountNo,
        selectedService: selectedService[0],
        amount: item.amount.toString(),
        lastAmount: item.lastAmount,
        pRolloutAccountNo: account[0].acctNo,
        transDate: item.transDate,
        isHistory: true
      })
    }
  }

  const onDelete = (item) => {
    const { serviceId, beneficiaryAccountNo } = selectedItem
    const body = {
      customerCode: beneficiaryAccountNo,
      serviceId
    }
    dispatch(productOperations.ignoreBill(body))
  }

  const clickItemDelete = (data, rowMap) => {
    const { item, index } = data
    closeRow(rowMap, index)
    setSeletecItem(item)
    setDelete(true)
  }

  React.useEffect(() => {
    dispatch(productOperations.getServiceList({ moduleType: typeModule }))
  }, [])

  React.useEffect(() => {
    dispatch(productOperations.getDataHistoryBillPayment(
      {
        moduleType: typeModule
      }
    ))
  }, [resultDeleteService])

  return (
    <Fragment>
      <View
        style={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: Metrics.tiny * 2,
      }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Metrics.normal * 0.85,
          paddingVertical: Metrics.normal * 1.2,
          marginVertical: 0,
          borderBottomColor: Colors.gray11,
          borderBottomWidth: 1,
        }}
        >
          <Icon name="icon-search" size={24} color={Colors.primary} />
          <TextInput
            placeholder={I18n.t('application.holder_search')}
            style={{ marginLeft: Metrics.normal, fontSize: 14, flex: 1 }}
            onChangeText={(val) => setSearch(val)}
          />
        </View>
        <View style={{
          width: '100%',
        }}
        >
          <SwipeListView
            disableRightSwipe
            style={{ height: Utils.getWindowHeight() / 2.5 }}
            data={history.map((item) => ({ beneficiaryAccountNo: item.contractNo, beneficiaryAlias: item.serviceName, serviceId: item.serviceId, paymentType: item ? item.paymentType : null, groupType: item.groupType, amount: item.amount, lastAmount: item.lastAmount }))}
            keyExtractor={(item, index) => `${index}`}
            renderItem={(data, rowMap) => (
              <BenefitItem
                image={(
                  <View style={styles.iconAvatar}>
                    <Icon name="icon-chuyenkhoan" styles={styles.iconItem} size={21} color={Colors.white} />
                  </View>
              )}
                onOpen={() => openRow(data, rowMap)}
                item={data.item}
                typeModule={typeModule}
                onPressItem={onPressItem}
                data={data}
              />
            )}
            renderHiddenItem={(data, rowMap) => (
              <BenefitHiddenItem
                data={data}
                onDelete={() => clickItemDelete(data, rowMap)}
                onTransfer={() => onPressItem(data)}
              />
            )}
            showsVerticalScrollIndicator={false}
            rightOpenValue={-150}
            previewRowKey="0"
            previewOpenValue={-40}
            previewOpenDelay={1000}
          />
        </View>
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
HistoryListBillPayment.defaultProps = {
  data: null
}
export default HistoryListBillPayment
