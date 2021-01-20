import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Dimensions, Vibration, Animated, Easing, View } from 'react-native'
import { RNCamera as Camera } from 'react-native-camera'
import { Text } from '..'

export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    vibrate: PropTypes.bool,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    cameraType: PropTypes.oneOf(['front', 'back']),
    customMarker: PropTypes.element,
    containerStyle: PropTypes.any,
    cameraStyle: PropTypes.any,
    markerStyle: PropTypes.any,
    topViewStyle: PropTypes.any,
    bottomViewStyle: PropTypes.any,
    topContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    bottomContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    notAuthorizedView: PropTypes.element,
    permissionDialogTitle: PropTypes.string,
    permissionDialogMessage: PropTypes.string,
    checkAndroid6Permissions: PropTypes.bool,
    cameraProps: PropTypes.object,
  }

  static defaultProps = {
    onRead: () => {
      console.log('QR code scanned!')
    },
    reactivate: false,
    vibrate: true,
    reactivateTimeout: 0,
    fadeIn: true,
    showMarker: false,
    cameraType: 'back',
    notAuthorizedView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          Camera not authorized
        </Text>
      </View>
    ),
    pendingAuthorizationView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          ...
        </Text>
      </View>
    ),
    permissionDialogTitle: 'Info',
    permissionDialogMessage: 'Need camera permission',
    checkAndroid6Permissions: false,
    cameraProps: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      scanning: false,
      fadeInOpacity: new Animated.Value(0),
      isAuthorized: false,
      isAuthorizationChecked: false,
      disableVibrationByUser: false,
      isOn: true,
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
  }

  componentDidMount() {
    if (this.props.fadeIn) {
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(this.state.fadeInOpacity, {
          toValue: 1,
          easing: Easing.inOut(Easing.quad),
        }),
      ]).start()
    }
  }

  disable() {
    this.setState({ disableVibrationByUser: true })
  }

  enable() {
    this.setState({ disableVibrationByUser: false })
  }

  turnOn() {
    this.setState({ isOn: true })
  }

  turnOff() {
    this.setState({ isOn: false })
  }

  _setScanning(value) {
    this.setState({ scanning: value })
  }

  _handleBarCodeRead(e) {
    if (!this.state.scanning && !this.state.disableVibrationByUser) {
      if (this.props.vibrate) {
        Vibration.vibrate()
      }
      this._setScanning(true)
      this.props.onRead(e)
      if (this.props.reactivate) {
        setTimeout(() => this._setScanning(false), this.props.reactivateTimeout)
      }
    }
  }

  _renderTopContent() {
    if (this.props.topContent) {
      return this.props.topContent
    }
    return null
  }

  _renderBottomContent() {
    if (this.props.bottomContent) {
      return this.props.bottomContent
    }
    return null
  }

  _renderCameraMarker() {
    if (this.props.showMarker) {
      if (this.props.customMarker) {
        return this.props.customMarker
      }
      return (
        <View style={styles.rectangleContainer}>
          <View
            style={[styles.rectangle, this.props.markerStyle ? this.props.markerStyle : null]}
          />
        </View>
      )
    }
    return null
  }

  _renderCamera() {
    const { notAuthorizedView, pendingAuthorizationView, cameraType } = this.props
    const { isAuthorized, isAuthorizationChecked } = this.state

    if (this.props.fadeIn) {
      return (
        <Animated.View
          style={{
            opacity: this.state.fadeInOpacity,
            backgroundColor: 'transparent',
          }}
        >
          <Camera
            captureAudio={false}
            style={[styles.camera, this.props.cameraStyle]}
            onBarCodeRead={this._handleBarCodeRead.bind(this)}
            type={this.props.cameraType}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            {...this.props.cameraProps}
          >
            {this._renderCameraMarker()}
          </Camera>
        </Animated.View>
      )
    }
    return (
      <Camera
        captureAudio={false}
        type={cameraType}
        style={[styles.camera, this.props.cameraStyle]}
        onBarCodeRead={this._handleBarCodeRead.bind(this)}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        {...this.props.cameraProps}
      >
        {this._renderCameraMarker()}
      </Camera>
    )
  }

  reactivate() {
    this._setScanning(false)
  }

  render() {
    return (
      <View style={[styles.mainContainer, this.props.containerStyle]}>
        {this.state.isOn && this._renderCamera()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },

  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: (Dimensions.get('window').width * 2) / 3,
    width: (Dimensions.get('window').width * 2) / 3,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
    marginBottom: (Dimensions.get('window').width * 2) / 3,
  },
})
