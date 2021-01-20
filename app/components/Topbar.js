/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native'
import PropTypes from 'prop-types'
import EventEmitter from 'react-native-eventemitter'
import MsbIcon from './MsbIcon'
import Text from './MsbText'
import { Colors, Images, Helpers, Metrics } from '../theme'
import * as Navigation from '../navigation'
import { Config } from '../config'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: Metrics.normal,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary2,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  subContainer: {
    paddingVertical: Metrics.small,
    paddingHorizontal: Metrics.small,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.primary2,
  },
  statusBar: {
    height: Metrics.STATUSBAR_HEIGHT,
    backgroundColor: Colors.transparent,
  },
})

const Topbar = (props) => {
  const renderRightContent = () => {
    const { rightIcon, rightText, onRightPress } = props
    return (
      <TouchableOpacity
        style={{ paddingHorizontal: Metrics.medium, paddingVertical: Metrics.small }}
        onPress={() => {
          if (rightIcon && onRightPress) {
            onRightPress()
            if (rightIcon === 'icon-home') {
              EventEmitter.emit(Config.EVENT_NAMES.user_home)
            }
          }
        }}
      >
        {rightIcon && <MsbIcon name={rightIcon} size={26} color={Colors.textBlack} />}
        {rightText && <Text style={{ fontSize: 15 }}>{rightText}</Text>}
        {!rightIcon && !rightText && <MsbIcon name="icon-back" size={24} style={{ opacity: 0 }} />}
      </TouchableOpacity>
    )
  }
  const renderLeftContent = () => {
    const { leftText, onLeftPress, leftIconColor, leftIcon, onBack } = props
    return (
      <TouchableOpacity
        style={{ paddingHorizontal: Metrics.medium + Metrics.tiny, paddingVertical: Metrics.small }}
        onPress={() => {
          if (onBack) {
            onBack()
            return
          }
          if (onLeftPress) {
            onLeftPress()
          }
        }}
      >
        {leftIcon && <MsbIcon name={leftIcon} size={22} color={leftIconColor} />}
        {leftText && <Text style={{ fontSize: 15 }}>{leftText}</Text>}
        {!leftIcon && !leftText && <MsbIcon name="icon-back" size={24} style={{ opacity: 0 }} />}
      </TouchableOpacity>
    )
  }
  const renderTitle = () => {
    const { title = '' } = props
    return <Text numberOfLines={1} style={{ ...styles.title }}>{title}</Text>
  }
  const renderLogo = () => {
    const { logo } = props
    return (
      <Image
        resizeMode="contain"
        source={logo}
        style={[{ width: 150, alignSelf: 'center', height: 50 }]}
      />
    )
  }
  const {
    barStyle,
    style,
    isLogo,
    subTitle,
    background,
    isBottomSubLayout,
    disableLeftIcon,
    disableRightIcon,
  } = props
  return (
    <View style={[Helpers.fullWidth, { backgroundColor: background }]}>
      <View style={styles.statusBar}>
        <StatusBar translucent backgroundColor="transparent" barStyle={barStyle} />
      </View>
      <View style={[styles.container, style]}>
        {!disableLeftIcon ? renderLeftContent() : <View style={{ width: Metrics.medium * 2.5, height: Metrics.medium * 2.5 }} />}
        <View style={{ flex: 1 }}>{isLogo ? renderLogo() : renderTitle()}</View>
        {!disableRightIcon ? renderRightContent() : null}
      </View>
      {subTitle && (
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      )}
      {isBottomSubLayout && (
        <View style={[styles.subContainer, { backgroundColor: Colors.mainBg }]}>
          <Text style={styles.subTitle} />
        </View>
      )}
    </View>
  )
}

Topbar.defaultProps = {
  title: null,
  subTitle: null,
  leftText: null,
  rightText: null,
  rightIcon: 'icon-home',
  leftIcon: 'icon-back',
  logo: Images.logo,
  isLogo: false,
  barStyle: 'dark-content',
  leftIconColor: '#333333',
  onLeftPress: () => Navigation.pop(),
  onRightPress: () => Navigation.popToPop(),
  background: Colors.white,
  isBottomSubLayout: false,
}

Topbar.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  rightIcon: PropTypes.string,
  leftIcon: PropTypes.string,
  onRightPress: PropTypes.func,
  onLeftPress: PropTypes.func,
  logo: PropTypes.any,
  isLogo: PropTypes.bool,
  barStyle: PropTypes.oneOf(['light-content', 'dark-content']),
  leftIconColor: PropTypes.string,
  background: PropTypes.string,
  isBottomSubLayout: PropTypes.bool,
}
export default Topbar
