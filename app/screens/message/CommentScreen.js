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
  LayoutAnimation,
  SectionList,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import ActionButton from 'react-native-action-button'
import { Helpers, Metrics, Colors } from '../../theme'
import { Topbar, Text, Icon, MessageList, MessageItem } from '../../components'
import * as Navigation from '../../navigation'
import { messageOperations } from '../../state/message'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.small * 1.8,
    paddingVertical: Metrics.small,
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
    fontSize: 12,
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
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
})

var pageNo = 1

const CommentScreen = (props) => {
  const [visibleButton, showButton] = useState(true)
  const { data, dataError } = useSelector((state) => state.message)
  const { activeCode, timeCreateToken } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [isRefresh, setRefresh] = useState(false)
  const [listViewOffset, setOffset] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (loading || isRefresh) {
      setLoading(false)
      setRefresh(false)
    }
  }, [data])

  useEffect(() => {
    if (loading || isRefresh) {
      setLoading(false)
      setRefresh(false)
    }
  }, [dataError])

  const onRefresh = () => {
    setRefresh(true)
    getData()
  }

  const getData = () => {
    setLoading(true)
    pageNo = 1
    const body = {
      type: '',
      notType: 'CH',
      pageNo,
    }
    dispatch(messageOperations.getData(body))
  }

  const handleLoadMore = () => {
    if (!loading) {
      pageNo++
      const body = {
        type: '',
        notType: 'CH',
        pageNo,
      }
      dispatch(messageOperations.loadMore(body))
    }
  }

  const onDetail = (item) => {
    Navigation.push('MessageDetail', { notification: item })
  }

  const onAdd = () => {
    Navigation.push('SendComment')
  }
  const _onScroll = (event) => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
    }
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = currentOffset > 0 && currentOffset > listViewOffset ? 'down' : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== visibleButton) {
      LayoutAnimation.configureNext(CustomLayoutLinear)
      showButton(isActionButtonVisible)
    }
    // Update your scroll position
    setOffset(currentOffset)
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
          style={[styles.itemTitle, { fontWeight: item.codeStatus === 'NEWR' ? 'bold' : 'normal' }]}
        >
          {item.status}
        </Text>
        <Text numberOfLines={1} style={styles.itemTime}>
          {item.strDate} {item.strTime}
        </Text>
        <Text numberOfLines={1} style={styles.itemContent}>
          {item.content}
        </Text>
        <Text style={styles.itemContent}>
          {_.isEmpty(item.acceptContent)
            ? I18n.t('investigate.notReply')
            : I18n.t('investigate.replyed')}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <Fragment>
      <Topbar title={I18n.t('investigate.title2')} background={Colors.white} />
      {loading && pageNo === 1 && (
        <View style={[Helpers.fillCenter, styles.container]}>
          <ActivityIndicator style={{ color: Colors.primary2, alignSelf: 'center' }} />
        </View>
      )}
      <View style={[Helpers.fill, styles.container]}>
        {!loading && (
          <FlatList
            refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.3}
            onEndReached={handleLoadMore}
            onScroll={_onScroll}
          />
        )}
      </View>
      {visibleButton && <ActionButton buttonColor={Colors.primary2} onPress={onAdd} />}
    </Fragment>
  )
}
export default CommentScreen
