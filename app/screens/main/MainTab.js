/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import EventEmitter from 'react-native-eventemitter'
import { Text, Icon } from '../../components'
import { Colors, Helpers, Metrics } from '../../theme'
import styles from './MainScreenStyle'
import I18n from '../../translations'
import { Config } from '../../config'

const MainTab = (props) => {
  const { state, navigation } = props

  useEffect(() => {
    eventBinding()
    return () => {
      unEventBinding()
    }
  }, [])
  const content = [
    { title: I18n.t('main.home'), icon: 'icon-home' },
    { title: I18n.t('main.account'), icon: 'icon-menu-account' },
    { title: I18n.t('main.product'), icon: 'icon-product' },
    { title: I18n.t('main.loyaty'), icon: 'icon-loyaty' },
    { title: I18n.t('main.setting'), icon: 'icon-setting' },
  ]

  const changeTab = (name) => {
      navigation.navigate(name)
  }

  const onHome = () => {
    navigation.navigate('HomeScreen')
  }

  const eventBinding = () => {
    EventEmitter.on(Config.EVENT_NAMES.user_home, onHome)
  }

  const unEventBinding = () => {
    EventEmitter.removeListener(Config.EVENT_NAMES.user_home, onHome)
  }

  return (
    <View style={[Helpers.row, styles.tabContainer]}>
      {state.routes.map((route, index) => {
        const options = content[index]
        const label = options.title
        const { icon } = options
        const isFocused = state.index === index
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          })

          if (!isFocused && !event.defaultPrevented) {
            changeTab(route.name)
          }
        }
        const styleTab = isFocused ? styles.tabFocus : styles.tabNormal
        const color = isFocused ? Colors.primary2 : '#999999'

        return (
          <TouchableOpacity
            key={`${index}`}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={[styles.tab]}
          >
            <View style={styleTab} />
            <Icon name={icon} size={28} style={{ color, padding: Metrics.small * 0.8 }} />
            <Text style={[isFocused ? styles.tabTitleFocus : styles.tabTitle, { color }]}>
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
export default MainTab
