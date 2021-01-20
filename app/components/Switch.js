/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Metrics } from '../theme'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    marginHorizontal: 10,
  },
  circleChild: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
})

export default class Switch extends React.Component {
  static calculateDimensions(size) {
    switch (size) {
      case 'small':
        return {
          width: 30,
          padding: 3,
          circleWidth: 18,
          circleHeight: 18,
          translateX: 18,
        }
      case 'large':
        return {
          width: 70,
          padding: 20,
          circleWidth: 30,
          circleHeight: 30,
          translateX: 38,
        }
      default:
        return {
          width: 38,
          padding: 5,
          circleWidth: 18,
          circleHeight: 18,
          translateX: 22,
        }
    }
  }

  static propTypes = {
    isOn: PropTypes.bool.isRequired,
    label: PropTypes.string,
    onColor: PropTypes.string.isRequired,
    offColor: PropTypes.string.isRequired,
    size: PropTypes.string,
    labelStyle: PropTypes.object,
    onToggle: PropTypes.func,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    isOn: false,
    onColor: '#4cd137',
    offColor: '#ecf0f1',
    size: 'medium',
    labelStyle: {},
    thumbOnStyle: {},
    thumbOffStyle: {},
    trackOnStyle: {},
    trackOffStyle: {},
    icon: null,
    disabled: false,
  }

  offsetX = new Animated.Value(0)

  dimensions = Switch.calculateDimensions(this.props.size)

  createToggleSwitchStyle = () => ({
    justifyContent: 'center',
    width: this.dimensions.width,
    borderRadius: 20,
    padding: this.dimensions.padding,
    backgroundColor: '#D0D1D3',
  })

  createInsideCircleStyle = () => ({
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: this.props.isOn ? this.props.onColor : this.props.offColor,
    ...(this.props.isOn ? this.props.trackOnStyle : this.props.trackOffStyle),
    transform: [{ translateX: this.offsetX }],
    width: this.dimensions.circleWidth,
    height: this.dimensions.circleHeight,
    borderRadius: this.dimensions.circleWidth / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
    ...(this.props.isOn ? this.props.thumbOnStyle : this.props.thumbOffStyle),
  })

  render() {
    const { isOn, onToggle, disabled, labelStyle, label } = this.props

    const toValue = isOn ? this.dimensions.width - this.dimensions.translateX : 0

    Animated.timing(this.offsetX, {
      toValue,
      duration: 300,
      useNativeDriver: true
    }).start()

    return (
      <View style={styles.container}>
        {label ? <Text style={[styles.labelStyle, labelStyle]}>{label}</Text> : null}
        <TouchableOpacity
          style={this.createToggleSwitchStyle()}
          activeOpacity={0.8}
          onPress={() => (disabled ? null : onToggle(!isOn))}
        >
          <Animated.View
            style={this.createInsideCircleStyle()}
          >
            {/* <View style={styles.circleChild}></View> */}
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }
}
