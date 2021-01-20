/* eslint-disable vars-on-top */
/* eslint-disable array-callback-return */
/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TouchableHighlight,
  SectionList,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../theme'
import { Topbar, Text, Icon, MessageList, MessageItem } from '../../components'
import * as Navigation from '../../navigation'
import { notificationOperations } from '../../state/notification'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
  },
  itemContainer: {
    borderRadius: 10,
    paddingHorizontal: Metrics.normal * 2,
    paddingVertical: Metrics.small,
    marginBottom: Metrics.small,
    backgroundColor: Colors.white,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.textBlack,
    marginBottom: Metrics.tiny,
  },
  itemContent: {
    fontSize: 12,
    marginVertical: Metrics.tiny,
    color: '#4F4F4F',
  },
  itemTime: {
    fontSize: 10,
    color: '#4F4F4F',
  },
  itemIcon: {
    width: Metrics.normal * 1.6,
    height: Metrics.normal * 1.6,
    borderRadius: Metrics.normal,
    backgroundColor: Colors.primary2,
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
    color: Colors.primary2,
  },
  labelUnSelect: {
    color: Colors.black,
  },
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
})

var pageNo = 1
var page = 1

const NotificationScreen = (props) => {
  const { data, dataError, listBalance, listBalanceError } = useSelector(
    (state) => state.notification
  )
  const { activeCode, timeCreateToken } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [loadingBalance, setLoadingBalance] = useState(true)
  const [isRefresh, setRefresh] = useState(false)
  const [isRefreshBalance, setRefreshBalance] = useState(false)
  const dispatch = useDispatch()
  const [tab, setTab] = useState(0)

  useEffect(() => {
    getData()
    getDataBalance()
  }, [])

  useEffect(() => {
    if (loading || isRefresh) {
      setLoading(false)
      setRefresh(false)
      const remoteData = props.route.params
      if (remoteData && remoteData.notification) {
        for (let i = 0; i < data.length; i++) {
          const notiData = data[i]
          if (notiData.title === remoteData.notification.payload.title) {
            Navigation.push('NotificationDetail', { notification: notiData })
          }
        }
      }
    }
  }, [data])

  useEffect(() => {
    if (loading || isRefresh) {
      setLoading(false)
      setRefresh(false)
    }
  }, [dataError])

  useEffect(() => {
    if (loadingBalance || isRefreshBalance) {
      setLoadingBalance(false)
      setRefreshBalance(false)
    }
  }, [listBalance])

  const dataBalance = useMemo(() => {
    var groupArrays = []
    if (!_.isEmpty(listBalance)) {
      const monthName = (item) => moment(item.createTime).format('DD/MM/YYYY')
      const result = _.groupBy(listBalance, monthName)
      Object.keys(result).map((item) => {
        groupArrays.push({
          date: item,
          data: result[item],
        })
      })
    }
    return groupArrays
  }, [listBalance])
  console.log('dataBalance:', dataBalance)

  useEffect(() => {
    if (loadingBalance || isRefreshBalance) {
      setLoadingBalance(false)
      setRefreshBalance(false)
    }
  }, [listBalanceError])

  const onRefresh = () => {
    setRefresh(true)
    getData()
  }

  const onRefreshBalance = () => {
    setRefreshBalance(true)
    getDataBalance()
  }

  const getData = () => {
    setLoading(true)
    pageNo = 1
    const body = {
      pageNo,
      activeCode,
      type: '',
      fromDate: '1970-01-01',
      toDate: Utils.toStringDate(new Date(timeCreateToken)),
    }
    dispatch(notificationOperations.getData(body))
  }

  const handleLoadMore = () => {
    if (!loading) {
      pageNo++
      const body = {
        pageNo,
        activeCode,
        type: '',
        fromDate: '1970-01-01',
        toDate: Utils.toStringDate(new Date(timeCreateToken)),
      }
      dispatch(notificationOperations.loadMore(body))
    }
  }

  const getDataBalance = () => {
    setLoadingBalance(false)
    page = 1
    const body = {
      page,
    }
    dispatch(notificationOperations.getDataBalance(body))
  }

  const handleLoadMoreBalance = () => {
    if (!loadingBalance) {
      page++
      const body = {
        page,
      }
      dispatch(notificationOperations.loadMoreBalance(body))
    }
  }

  const onDetail = (item) => {
    Navigation.push('NotificationDetail', { notification: item })
  }

  const changeTab = (t) => {
    setTab(t)
  }

  const renderSectionHeader = ({ section }) => {
    const isEmpty = _.isEmpty(section.data)
    const { date } = section
    return (
      <>{!isEmpty && <Text style={{ marginTop: Metrics.normal, fontSize: 12 }}> {date} </Text>}</>
    )
  }

  const renderBalance = () => {
    if (!loadingBalance && Utils.isArrayEmpty(listBalance)) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{I18n.t('application.message_empty_result')}</Text>
        </View>
      )
    }

    // return (
    //   <MessageList
    //     refreshControl={
    //       <RefreshControl refreshing={isRefreshBalance} onRefresh={onRefreshBalance} />
    //     }
    //     inverted
    //     onEndReached={handleLoadMoreBalance}
    //     onEndReachedThreshold={0.7}
    //     ListFooterComponent={() => <>{loadingBalance && <ActivityIndicator size="small" />}</>}
    //     data={listBalance || []}
    //     keyExtractor={(item) => item._id}
    //     renderItem={({ item }) => <MessageItem message={item} />}
    //   />
    // )
    return (
      <SectionList
        refreshControl={
          <RefreshControl refreshing={isRefreshBalance} onRefresh={onRefreshBalance} />
        }
        onEndReached={handleLoadMoreBalance}
        ListFooterComponent={() => <>{loadingBalance && <ActivityIndicator size="small" />}</>}
        styles={styles.list}
        sections={dataBalance}
        renderItem={({ item }) => <MessageItem message={item} />}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={renderSectionHeader}
        enableEmptySections
        keyExtractor={(item, index) => `${index}`}
        removeClippedSubviews={false}
        stickySectionHeadersEnabled={false}
      />
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[Helpers.rowCross, styles.itemContainer]}
      onPress={() => onDetail(item)}
    >
      <View style={[Helpers.center, styles.itemIcon]}>
        <Icon name="inbox" size={8} color={Colors.white} />
      </View>
      <View style={{ marginLeft: Metrics.small * 1.8 }}>
        <Text
          style={[styles.itemTitle, { fontWeight: item.status === 'NEWR' ? 'bold' : 'normal' }]}
        >
          {item.type}
        </Text>
        <Text numberOfLines={1} style={styles.itemTime}>
          {item.date} {item.time}
        </Text>
        <Text numberOfLines={1} style={styles.itemContent}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const allStyle = tab === 0 ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const saveStyle = tab === 1 ? styles.boxSelectTransfer : styles.boxUnselectTransfer
  const allTextStyle = tab === 0 ? styles.labelSelect : styles.labelUnSelect
  const saveTextStyle = tab === 1 ? styles.labelSelect : styles.labelUnSelect

  return (
    <Fragment>
      <Topbar title={I18n.t('notification.title')} background={Colors.white} />
      <View style={{ backgroundColor: Colors.white }}>
        <View style={styles.boxTypeTransfer}>
          <TouchableHighlight
            style={allStyle}
            onPress={() => changeTab(0)}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={allTextStyle}>{I18n.t('notification.tab_mess')}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={saveStyle}
            onPress={() => changeTab(1)}
            underlayColor="rgba(0, 0, 0, 0)"
          >
            <Text style={saveTextStyle}>{I18n.t('notification.tab_notification')}</Text>
          </TouchableHighlight>
        </View>
      </View>
      {loading && pageNo === 1 && (
        <View style={[Helpers.fillCenter, styles.container]}>
          <ActivityIndicator style={{ color: Colors.primary2, alignSelf: 'center' }} />
        </View>
      )}
      <View style={[Helpers.fill, styles.container]}>
        {!loading && tab === 1 && (
          <FlatList
            refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
            onEndReached={handleLoadMore}
          />
        )}
        {!loadingBalance && tab !== 1 && renderBalance()}
      </View>
    </Fragment>
  )
}
export default NotificationScreen
