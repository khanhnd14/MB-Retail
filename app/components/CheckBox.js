/* eslint-disable no-param-reassign */
/* eslint-disable react/require-default-props */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Icon from './MsbIcon'
import Text from './MsbText'
import { Colors, Metrics } from '../theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDefault: {
    color: Colors.white,
  },
  text: {
    paddingHorizontal: Metrics.tiny,
    color: Colors.textBlack,
    fontSize: 12,
  },
})

class CheckBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: !!props.checked,
    }
    this.onPress = this.onPress.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.checked !== state.checked) {
      return {
        checked: props.checked,
      }
    }
    return null
  }

  check() {
    this.setState({ checked: true })
  }

  uncheck() {
    this.setState({ checked: false })
  }

  onPress() {
    if (this.props.onPress) {
      this.props.onPress()
    }
  }

  render() {
    const { checked } = this.state
    const { color, size, text, textSize, style, textStyle } = this.props
    const customStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: checked ? color : Colors.transparent,
      borderWidth: checked ? 0 : 1,
      borderColor: '#D0D1D3',
    }

    return (
      <TouchableOpacity
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
          },
          customStyle,
          style,
        ]}
        onPress={this.onPress}
      >
        {checked ? (
          <Icon name="icon-check" size={size} color={Colors.primary} />
        ) : (
          <Icon name="checkbox-unchecked" size={size} color={Colors.primary} />
        )}
        <Text style={[styles.text, { fontSize: textSize }, textStyle]}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

CheckBox.defaultProps = {
  size: 20,
  text: null,
  style: {},
  textSize: 14,
  color: Colors.primary2,
}

CheckBox.propTypes = {
  size: PropTypes.number,
  onPress: PropTypes.func,
  text: PropTypes.string,
  textSize: PropTypes.number,
  color: PropTypes.string,
  textStyle: PropTypes.object,
}
export default CheckBox
