/* eslint-disable react/require-default-props */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable vars-on-top */
/* eslint-disable react/sort-comp */
/* eslint-disable no-var */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import { View, LayoutAnimation, Platform } from 'react-native'
import PropTypes from 'prop-types'
import MsbText from './MsbText'
import MsbTextInput from './MsbTextInput'
import { Utils } from '../utilities'
import { Colors } from '../theme'

class FloatingLabel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.value ? Utils.formatAmountText(this.props.value) : '',
      dirty: !!this.props.value,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isAmount) {
      if (Platform.OS !== 'ios') {
        if (nextProps.readOnly) {
          this.state.text = Utils.formatAmountText(nextProps.value)
        } else {
          this.state.text = nextProps.value
        }
      } else this.state.text = Utils.formatAmountText(nextProps.value)
    } else {
      this.state.text = nextProps.value
    }

    this.state.dirty = !!nextProps.value
    LayoutAnimation.easeInEaseOut()
  }

  focusInputText() {
    if (this.refs.inputText) {
      this.refs.inputText.focus()
    }
  }

  isFocused() {
    this.refs.inputText.isFocused()
  }

  render() {
    const props = {
      autoCapitalize: this.props.autoCapitalize,
      autoCorrect: false,
      bufferDelay: this.props.bufferDelay,
      clearButtonMode: this.props.clearButtonMode,
      clearTextOnFocus: this.props.clearTextOnFocus,
      controlled: this.props.controlled,
      editable: this.props.editable,
      enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
      keyboardType: this.props.isAmount ? 'numeric' : this.props.keyboardType,
      multiline: this.props.multiline,
      onChange: this.props.onChange,
      onChangeText: this.onChangeText.bind(this),
      onSubmitEditing: this.props.onSubmitEditing,
      onBlur: this.props.onBlur,
      password: this.props.password,
      selectTextOnFocus: this.props.selectTextOnFocus,
      selectionState: this.props.selectionState,
      testID: this.props.testID,
      maxLength: this.props.maxLength,
      underlineColorAndroid: 'transparent',
      secureTextEntry: this.props.secureTextEntry,
      returnKeyType: 'done',
      onFocus: this.props.onFocus,
    }
    const nonValueStyle = this.state.dirty
      ? { height: Utils.getRatioDimension(25) }
      : { height: Utils.getRatioDimension(40) }

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <View style={this.props.style}>
          <View style={{ flex: 1 }}>
            {this.state.dirty && this.props.children && (
              <MsbText
                style={[
                  { fontSize: 10, color: Colors.holder, fontWeight: 'bold' },
                  this.props.readOnly === true ? {} : this.props.labelStyle,
                ]}
              >
                {this.props.children}
              </MsbText>
            )}
            {!this.props.readOnly ? (
              <MsbTextInput
                ref="inputText"
                placeholder={
                  !this.state.dirty ? this.props.placeHolder || this.props.children : null
                }
                placeholderTextColor={this.props.placeholderTextColor}
                autoCorrect={false}
                style={[styles.input, this.props.inputStyle]}
                value={this.state.text}
                {...props}
              />
            ) : (
              <View style={this.props.textStyle}>
                <MsbText style={{ fontSize: 14, paddingTop: Utils.getRatioDimension(5) }}>
                  {this.state.text}
                </MsbText>
              </View>
            )}
          </View>
        </View>
        {this.props.rightText.length > 0 && (
          <View style={{ borderColor: Colors.borderColor, borderLeftWidth: 1 }}>
            <MsbText
              style={{
                marginVertical: -2,
                marginHorizontal: 4,
                color: Colors.holder,
              }}
            >
              {this.props.rightText}
            </MsbText>
          </View>
        )}
      </View>
    )
  }

  onChangeText(text) {
    if (this.props.onChangeText) {
      this.props.onChangeText(this.props.isAmount ? text.split(',').join('') : text)
    }
  }
}

var styles = {
  element: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },

  label: {
    color: Colors.holder,
    fontSize: 12,
    paddingVertical: 4,
  },
  text: {
    justifyContent: 'center',
    paddingVertical: 4,
  },
  input: {
    fontSize: 14,
    paddingVertical: 0
  },
}

FloatingLabel.defaultProps = {
  labelStyle: styles.label,
  style: styles.element,
  text: 'Input text here',
  isAmount: false,
  rightText: '',
  readOnly: false,
  textStyle: styles.text,
}

FloatingLabel.propTypes = {
  disabled: PropTypes.bool,
}

export default FloatingLabel
