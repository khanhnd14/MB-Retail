/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  ViewPropTypes,
  StyleSheet,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Easing,
  ScrollView,
  Linking,
} from 'react-native'
import PropTypes from 'prop-types'
import HTML from 'react-native-render-html'
import { Helpers, Colors, Images, Metrics } from '../../theme'
import { Text, Icon } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const gutter = Metrics.small

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 150,
    top: 0,
    borderRadius: gutter * 6,
    backgroundColor: '#fff',
    padding: 4,
    elevation: 2,
    borderWidth: 0,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.2,
    marginTop: gutter * 6,
  },
  image: {
    height: 32,
    width: 32,
  },
  inner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 5,
  },
  header: {
    width: gutter * 6,
    height: gutter * 6,
    borderRadius: gutter * 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    zIndex: 100,
  },
  contentContainer: {
    zIndex: 150,
    alignItems: 'center',
    position: 'relative',
  },
  innerContent: {
    paddingTop: gutter * 1.5,
    marginTop: gutter * 10.5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    width: Utils.getWindowWidth() * 0.8,
    alignItems: 'center',
  },
  bodyContainer: {
    marginTop: gutter,
    justifyContent: 'flex-end',
    width: Utils.getWindowWidth() * 0.8,
    height: Utils.getWindowHeight() * 0.35,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: Utils.getRatioDimension(10)
  },
  subTitle: {
    padding: gutter,
    fontSize: 14,
  },
  timer: {
    fontSize: 12,
    width: Utils.getWindowWidth() * 0.7,
  },
  containerButton: {
    ...Helpers.rowCross,
    paddingBottom: Metrics.medium * 1.5,
    paddingTop: Metrics.medium,
  },
  buttonLeft: {
    borderRadius: 38,
    alignSelf: 'center',
    backgroundColor: Colors.primary2,
    paddingVertical: Metrics.small * 0.7,
    marginHorizontal: Metrics.normal,
    width: gutter * 12
  },
  buttonRight: {
    borderRadius: 38,
    alignSelf: 'center',
    backgroundColor: Colors.primary2,
    paddingVertical: Metrics.small * 0.7,
    marginHorizontal: Metrics.normal,
    width: gutter * 12

  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRightText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  voucherCode: {
    marginTop: gutter,
    paddingVertical: gutter,
    paddingHorizontal: gutter * 2,
    borderColor: Colors.gray1,
    borderWidth: 1,
    backgroundColor: Colors.gray7,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 14,
  },
})
class HomeNotification extends React.Component {
  state = {
    show: false,
  }

  slideAnimation = new Animated.Value(0)

  componentDidMount() {
    this.props.show && this.show()
  }

  componentDidUpdate(_prevProps, _prevState) {
    if (this.props.show !== this.state.show) {
      return this[this.props.show ? 'show' : 'hide']()
    }
  }

  /**
   * @description get animation interpolation
   * @return { Array }
   */
  get interpolationTranslate() {
    const move = this.slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Utils.getWindowHeight(), Utils.getWindowHeight() / -5],
    })

    return [{ translateY: move }]
  }

  /**
   * @description show modal
   * @return { Void }
   */
  show = () => {
    this._runAnimationAsync()
    this.setState({ show: true })
  }

  /**
   * @description hide modal
   * @return { Void }
   */
  hide = async () => {
    await this._runAnimationAsync()
    this.setState({ show: false })
  }

  /**
   * @description run slide animation to show action sheet contetn
   * @param { Boolean } show - Show / Hide content
   * @return { Promise }
   */
  _runAnimationAsync = () =>
    new Promise((resolve) => {
      const options = {
        toValue: this.state.show ? 0 : 1,
        duration: this.props.slideAnimationDuration,
        useNativeDriver: true,
        animation: Easing.in,
      }

      Animated.timing(this.slideAnimation, options).start(resolve)
    })

  /**
   * @description callback after press in the overlay
   * @return { Void }
   */
  handleOnClose = () => {
    this.props.onRequestClose && this.props.onRequestClose()
  }

  handleOnDetail = () => {
    this.props.onRequestDetail && this.props.onRequestDetail()
  }

  PopupHeader = () => {
    const { type, headerInnerStyles, opacity } = this.props
    const icon =
      type === 'ME' ? 'icon-email' : type === 'PC' ? 'account_doiqua' : 'account_doiqua' // News
    return (
      <Animated.View
        style={[styles.container, headerInnerStyles || {}, opacity ? { opacity } : {}]}
      >
        <View style={[styles.header, styles.headerInnerStyles, { backgroundColor: '#ffffff' }]}>
          <Icon name={icon} color={Colors.primary2} size={33} />
        </View>
      </Animated.View>
    )
  }

  render() {
    const {
      item,
      type,
      headerInnerStyles,
      opacity,
      overlayStyle,
      show,
      slideAnimationDuration,
    } = this.props
    const { notiType, voucherCode, createTime, content, htmlContent } = item || {}
    let htmlcont = htmlContent
    if (htmlcont) {
      htmlcont = htmlcont.replace('<img', '<img style="width:100%;"')
    }
    const title =
      notiType === 'ME'
        ? I18n.t('notification.notification_title_me')
        : notiType === 'PC'
        ? I18n.t('notification.notification_title_pc')
        : I18n.t('notification.notification_title_pr')
    const buttonText = I18n.t('notification.action_notification_detail')
    const closeText = I18n.t('notification.action_notification_close')

    return (
      <Modal
        transparent
        animationType="fade"
        visible={this.state.show}
        onRequestClose={this.handleOnClose}
      >
        <View style={[styles.inner]}>
          <TouchableWithoutFeedback onPress={this.handleOnClose}>
            <View style={[styles.overlay, overlayStyle]} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.contentContainer,
              {
                transform: this.interpolationTranslate,
              },
            ]}
          >
            {this.PopupHeader()}
            <View style={styles.innerContent}>
              <Text style={styles.text}>{title}</Text>
              {voucherCode && (
                <Text style={styles.voucherCode} selectable>
                  {voucherCode}
                </Text>
              )}
              <View style={styles.bodyContainer}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.subTitle} ellipsizeMode="tail" numberOfLines={2}>
                      {content}
                    </Text>
                    <Text style={styles.timer}>{Utils.toStringServerDate(createTime)}</Text>
                    <View>
                      {htmlcont && (
                        <HTML
                          onLinkPress={(event, href) => {
                            Linking.openURL(href)
                          }}
                          ignoredStyles={['font-family', 'text-align']}
                          allowFontScaling={false}
                          baseFontStyle={{
                            fontSize: Utils.getRatioDimension(14),
                            marginHorizontal: Metrics.normal
                          }}
                          containerStyle={{
                            marginHorizontal: Metrics.normal
                          }}
                          html={htmlcont}
                          staticContentMaxWidth={100}
                          contentWidth={Utils.getWindowWidth() * 0.8 - Metrics.medium}
                        />
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={styles.containerButton}>
                <TouchableOpacity
                  style={[styles.buttonLeft, { backgroundColor: '#BDBDBD' }]}
                  onPress={this.handleOnClose}
                >
                  <Text style={styles.buttonText}>{closeText.toUpperCase()}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRight} onPress={this.handleOnDetail}>
                  <Text style={styles.buttonRightText}>{buttonText.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    )
  }
}

HomeNotification.defaultProps = {
  children: null,
  show: false,
  cancellable: true,
  slideAnimationDuration: 250,
  overlayStyle: {},
}

HomeNotification.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
  cancellable: PropTypes.bool,
  onRequestClose: PropTypes.func,
  slideAnimationDuration: PropTypes.number,
  overlayStyle: ViewPropTypes.style,
}

export default HomeNotification
