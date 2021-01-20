/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react'
import { View, StyleSheet, Platform, TouchableOpacity, Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import MsbText from './MsbText'
import TextInput from './MsbTextInput'
import { Utils } from '../utilities'
import { Colors } from '../theme'

const dotSize = Utils.getRatioDimension(10)
const boxSize = Utils.getRatioDimension(20)
const containSize = Utils.getRatioDimension(35)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 0,
    height: 0,
    opacity: 0,
  },
  box: {
    width: containSize,
    height: containSize * 1.2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  bar: {
    backgroundColor: '#9A9A9A',
    height: 1,
    width: dotSize,
  },
  barActive: {
    // backgroundColor: '#EF4029',
    // height: 2,
    // marginTop: -0.5
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  code: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
  },
  boxCode: {
    width: boxSize,
    height: boxSize * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class ConfirmationCodeInput extends Component {
  input = null

  constructor(props) {
    super(props)

    this.state = {
      value: props.defaultValue,
    }
  }

  componentDidMount() {
    this.props.autoFocus && this.input.refs.input.focus()
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value !== this.state.value) {
      await this._setValue(nextProps.value)
    }

    if (this.state.value.length < this.props.length) {
      // this.props.autoFocus && this.input.refs.input.focus()
    } else {
      this.input.refs.input.blur()
    }
  }

  reset() {
    this.setState(
      {
        value: '',
      },
      () => {
        this.input.refs.input.focus()
      }
    )
  }

  clear() {
    this.setState({
      value: '',
    })
  }

  _onFocus() {
    if (this.state.value.length < this.props.length && this.input) {
      // this.props.autoFocus &&
      Keyboard.dismiss()
      this.input.refs.input.focus()
    }
  }

  _setValue(value) {
    if (this.props.uppercase) {
      value = value.toUpperCase()
    }
    if (this.props.alphaNumeric) {
      value = value.replace('/[^a-z0-9]/i', '')
    }

    this.setState({ value })
  }

  async _changeText(value) {
    await this._setValue(value)

    if (this.props.onChange) {
      await this.props.onChange(this.state.value)
    }

    if (this.state.value.length < this.props.length) {
      return
    }

    if (this.input) {
      this.input.refs.input.blur()
    }

    if (this.props.onComplete) {
      setTimeout(() => {
        this.props.onComplete(this.state.value)
      }, 200)
    }
  }

  _renderBoxes() {
    const elements = []
    let i = 0
    const vals = this.state.value.split('')
    while (i < this.props.length) {
      const active = i === this.state.value.length
      const barStyles = [
        styles.bar,
        active ? [styles.barActive, { backgroundColor: Colors.primary }] : [],
      ]

      elements.push(
        <TouchableOpacity onPress={this._onFocus.bind(this)} style={styles.box} key={i}>
          <View style={styles.boxCode}>
            {vals[i] ? (
              <MsbText style={[styles.text, { color: this.props.textColor }]}>
                {vals[i] || ''}
              </MsbText>
            ) : (
              <View style={styles.code} />
            )}
          </View>
          {!vals[i] && <View style={barStyles} />}
        </TouchableOpacity>
      )

      i++
    }

    return elements
  }

  render() {
    const keyboardType = this.props.numeric
      ? 'numeric'
      : Platform.OS === 'ios'
      ? 'ascii-capable'
      : 'default'

    return (
      <View style={[styles.container, this.props.style]}>
        <TextInput
          ref={(component) => {
            this.input = component
            if (this.props.inputRef) {
              this.props.inputRef(component)
            }
          }}
          style={styles.input}
          autoFocus={this.props.autoFocus}
          autoCorrect={false}
          autoCapitalize="characters"
          value={this.state.value}
          blurOnSubmit={false}
          keyboardType={keyboardType}
          maxLength={this.props.length}
          disableFullscreenUI
          clearButtonMode="never"
          spellCheck={false}
          returnKeyType="go"
          underlineColorAndroid="transparent"
          onChangeText={(text) => this._changeText(text)}
          caretHidden
        />

        {this._renderBoxes()}
      </View>
    )
  }
}

ConfirmationCodeInput.propTypes = {
  length: PropTypes.number,
  tintColor: PropTypes.string,
  textColor: PropTypes.string,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.string,
  regex: PropTypes.any,
  uppercase: PropTypes.bool,
  alphaNumeric: PropTypes.bool,
  numeric: PropTypes.bool,
  value: PropTypes.string,
  style: PropTypes.any,
  inputRef: PropTypes.func,
}

ConfirmationCodeInput.defaultProps = {
  tintColor: '#F0F0F0',
  textColor: '#000',
  length: 8,
  autoFocus: true,
  numeric: true,
  alphaNumeric: true,
  uppercase: true,
  defaultValue: '',
  value: '',
}
