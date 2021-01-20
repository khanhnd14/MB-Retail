import React, { useCallback, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { View, FlatList, RefreshControl, Animated, ActivityIndicator } from 'react-native'

function keyExtractor(item, index) {
  return item + index
}
const Row = React.memo(({ item, isFavorite, onPress, renderSubItem, index }) =>
  renderSubItem(isFavorite, item, index, onPress)
)

const renderItem = ({ item, index, favorites, setFavorite, renderSubItem }) => (
  <Row
    item={item}
    isFavorite={favorites.includes(item)}
    onPress={(item) => {
      setFavorite((favoriteItems) => {
        console.log('favoriteItems', favoriteItems)

        const isFavorite = favoriteItems.includes(item)

        if (isFavorite) {
          return favoriteItems.filter((title) => title !== item)
        }
        return [item]
      })
    }}
    renderSubItem={renderSubItem}
    index={index}
  />
)

const renderItemMultiSelect = ({ item, index, favorites, setFavorite, renderSubItem }) => (
  <Row
    item={item}
    isFavorite={favorites.includes(item)}
    onPress={(item) => {
      console.log('item', item)
      setFavorite((favoriteItems) => {
        const isFavorite = favoriteItems.includes(item)

        if (isFavorite) {
          return favoriteItems.filter((title) => title !== item)
        }
        if (item.id == 0) {
          return [item]
        }
        if (item.id !== 0) {
          return [item, ...favoriteItems.filter((e) => e.id !== 0)]
        }
      })
    }}
    renderSubItem={renderSubItem}
    index={index}
  />
)
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}
export default forwardRef(
  (
    {
      data,
      renderSubItem,
      style,
      horizontal,
      showsHorizontalScrollIndicator,
      showsVerticalScrollIndicator,
      ListHeaderComponent,
      onRefreshEvent,
      scrollEnabled,
      ListEmptyComponent,
      isMultiSelect,
      loadMore,
      onLoadMore,
      listFooterComponent,
      onScroll,
      noLoading,
      noRefresh,
      contentStyle,
    },
    ref
  ) => {
    const [favorites, setFavorite] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [] = useState(new Animated.Value(0))
    const [isLoadMore, setIsLoadMore] = useState(false)
    const flatList = useRef()

    useImperativeHandle(ref, () => ({
      scrollToEnd,
    }))

    const onRefresh = async () => {
      console.log('refresh')
      setRefreshing(true)
      if (noLoading) {
        setTimeout(() => setRefreshing(false), 100)
        onRefreshEvent && (await onRefreshEvent())
      } else {
        try {
          onRefreshEvent && (await onRefreshEvent())
        } catch (error) {
          setRefreshing(false)
        } finally {
          setRefreshing(false)
        }
      }
    }

    const renderItemCall = useCallback(
      ({ item, index }) => {
        if (isMultiSelect) {
          return renderItemMultiSelect({
            item,
            index,
            favorites,
            setFavorite,
            renderSubItem,
          })
        }
        return renderItem({
          item,
          index,
          favorites,
          setFavorite,
          renderSubItem,
        })
      },

      [favorites, data]
    )
    const renderLoading = () => <ActivityIndicator />
    const onMomentumScrollEnd = async ({ nativeEvent }) => {
      if (!loadMore) return
      if (isCloseToBottom(nativeEvent)) {
        console.log('reach to end list')
        setIsLoadMore(true)
        onLoadMore && (await onLoadMore())
        setTimeout(() => {
          setIsLoadMore(false)
        }, 0)
      }
    }

    const renderListFooterComponent = () => (
      <View>
        {listFooterComponent || null}
        {/* {isLoadMore ? (
      <View style={{ marginVertical: Metrics.normal }}>
        <ActivityIndicator />
      </View>
) : null} */}
      </View>
    )

    const onContentSizeChange = () => {
      if (isLoadMore) {
        flatList.current.scrollToEnd({ animated: true })
      }
    }

    const scrollToEnd = () => {
      flatList.current.scrollToEnd({ animated: true })
    }

    return (
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        horizontal={horizontal}
        refreshControl={
          !noRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        onScroll={onScroll}
        ref={flatList}
        onMomentumScrollEnd={onMomentumScrollEnd}
        extraData={favorites}
        ListFooterComponent={renderListFooterComponent}
        nestedScrollEnabled
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={style}
        style={contentStyle}
        data={data} // data is a constant values in the File scope.
        renderItem={refreshing ? renderLoading : renderItemCall}
        keyExtractor={keyExtractor}
        scrollEnabled={scrollEnabled}
        ListEmptyComponent={ListEmptyComponent}
        decelerationRate="fast"
        snapToEnd={false}
      />
    )
  }
)
