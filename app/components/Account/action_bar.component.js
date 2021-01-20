import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList, Platform } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'
import { Utils } from '../../utilities'
import { Colors, Metrics } from '../../theme'
import { Icon, Text } from '..'

const styles = StyleSheet.create({
  container: {
    width: Utils.getWindowWidth(),
    backgroundColor: Colors.primary2,
    alignSelf: 'center',
    borderTopRightRadius: Metrics.normal * 1.5,
    borderTopLeftRadius: Metrics.normal * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // zIndex: 2,
  },
  textTitle: {
    color: Colors.white,
    fontSize: 12,
  },
})

const ActionBarPaymentAcount = ({ data, onAction, loading, hideLeft, hideRight }) => {
  const flatListRef = useRef(null)
  const [offset, setOffset] = useState(0)
  const [animatedOpacityLeft] = useState(new Animated.Value(0))
  const [animatedOpacityRight] = useState(new Animated.Value(0))
  useEffect(() => {
    if (loading) {
      Utils.showLoading()
    } else {
      Utils.hideLoading()
    }
  }, [loading])

  const _renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={{
        width: Utils.getWindowWidth() / 4.7,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: Metrics.small
      }}
      onPress={
        onAction &&
        (() => {
          if (!item.disable) {
            onAction(item)
          }
        })
      }
      activeOpacity={item.disable ? 1 : 0}
    >
      <Icon name={item.icon} color={item.disable ? Colors.gray10 : Colors.white} size={40} />
      <Text
        numberOfLines={1}
        style={[styles.textTitle, { color: item.disable ? Colors.gray10 : Colors.white }]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  )

  const onScrollLeft = () => {
    flatListRef && flatListRef.current?.scrollToOffset({ offset: offset - Utils.getWindowWidth() / 10, animated: true })
    setOffset(offset - Utils.getWindowWidth() / 10)
  }

  const onScrollRight = () => {
    console.log('====================================');
    console.log(flatListRef);
    console.log('====================================');
    flatListRef && flatListRef.current?.scrollToOffset({ offset: offset + Utils.getWindowWidth() / 10, animated: true })
    setOffset(offset + Utils.getWindowWidth() / 10)
  }

  const onScroll = ({ nativeEvent }) => {
    const scrollPosition = nativeEvent.contentOffset.x
    if (scrollPosition < 10 && Platform.OS === 'ios') {
      Animated.timing(animatedOpacityLeft, {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }).start(() => {})
    }

    if (scrollPosition > 10 && Platform.OS === 'ios') {
      Animated.timing(animatedOpacityLeft, {
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }).start(() => {})
    }

    if (scrollPosition > 248 && Platform.OS === 'ios') {
      Animated.timing(animatedOpacityRight, {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }).start(() => {})
    }

    if (scrollPosition < 248 && Platform.OS === 'ios') {
      Animated.timing(animatedOpacityRight, {
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }).start(() => {})
    }
  }

  const onScrollEndDrag = ({ nativeEvent }) => {
    console.log('====================================');
    console.log(nativeEvent);
    console.log('====================================');
    setOffset(nativeEvent.contentOffset.x)
  }

  useEffect(() => {
    Platform.OS === 'ios' && Animated.timing(animatedOpacityLeft, {
      toValue: 1,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start(() => {})
  }, [])
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: Utils.getWindowWidth() / 10,
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: Metrics.normal,
          opacity: animatedOpacityLeft.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }}
      >
        {!hideLeft && data.length > 4 && (
          <TouchableOpacity onPress={onScrollLeft}>
            <Icon name="icon-back" color={Colors.white} size={Metrics.normal * 1.5} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {data.length > 4 ? (
        <FlatList
          style={{
            flex: 1,
          }}
          // scrollEnabled={false}
          ref={flatListRef}
          data={data}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScrollEndDrag={onScrollEndDrag}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={{ flexDirection: 'row' }}>
          {data.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: Utils.getWindowWidth() / 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={
                onAction &&
                (() => {
                  if (!value.disable) {
                    onAction(value)
                  }
                })
              }
              activeOpacity={0}
            >
              <Icon
                name={value.icon}
                color={value.disable ? Colors.gray10 : Colors.white}
                size={40}
              />
              <Text
                numberOfLines={1}
                style={[styles.textTitle, { color: value.disable ? Colors.gray10 : Colors.white }]}
              >
                {value.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Animated.View
        style={{
          width: Utils.getWindowWidth() / 10,
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: Metrics.normal,
          opacity: animatedOpacityRight.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
        }}
      >
        {!hideRight && data.length > 4 && (
          <TouchableOpacity onPress={onScrollRight}>
            <Icon name="icon-detail" color={Colors.white} size={Metrics.normal * 1.5} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  )
}
export default ActionBarPaymentAcount
