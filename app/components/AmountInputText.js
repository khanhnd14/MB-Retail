/* eslint-disable no-param-reassign */
/* eslint-disable react/require-default-props */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable vars-on-top */
/* eslint-disable react/sort-comp */
/* eslint-disable no-var */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import MsbTextInput from './MsbTextInput'
import { Utils } from '../utilities'

export default class AmountInputText extends Component {
  constructor(props) {
    super(props)
    this.state = { text: props.defaultVal !== '0' && props.defaultVal ? props.defaultVal : '' }
  }

  changeText = (textValue) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(textValue)
    }
    this.setState({ text: this.formatInputText(textValue) })
  }

  formatInputText = (textValue) => {
    if (!(textValue)) return ''
    textValue += ''
    textValue = textValue.replace(/[^\d]/g, '')
    if (textValue === '0') {
      textValue = ''
    }
    if (textValue.length > 3) {
      let temp = ''
      let lengthString = textValue.length

      while (lengthString > 3) {
        temp = `,${textValue.substr(lengthString - 3, lengthString)}${temp}`
        textValue = textValue.substr(0, lengthString - 3)
        lengthString = textValue.length
      }
      temp = textValue.substr(0, lengthString) + temp
      textValue = temp
    }
    return textValue
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps');
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.value !== this.state.text) {
      this.setState({ text: this.formatInputText(nextProps.value) })
    }
  }

  render() {
    const { text } = this.state
    const { style, defaultValue, placeholderTextColor } = this.props
    return (
      <MsbTextInput
        style={style}
        maxLength={16}
        onChangeText={(val) => this.changeText(val)}
        value={text}
        autoCorrect={false}
        keyboardType="number-pad"
        underlineColorAndroid="transparent"
        placeholder={this.props.placeholder}
        editable={!defaultValue}
        returnKeyType="done"
        placeholderTextColor={placeholderTextColor}
      />
    )
  }
}

AmountInputText.defaultProps = {
  rightText: '',
}
