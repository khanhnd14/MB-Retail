/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import { View } from 'react-native'
import { Utils } from '../utilities'
import MsbText from './MsbText'

export default class AmountLabel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        value: props.value,
      }
    }
    return null
  }

  render() {
    const { currencyParentheses } = this.props
    let hasCurrencyParentheses = currencyParentheses
    if (hasCurrencyParentheses === undefined) {
      hasCurrencyParentheses = false
    }
    const openParentheses = hasCurrencyParentheses ? '(' : ''
    const closeParentheses = hasCurrencyParentheses ? ')' : ''
    let hasPositiveSign = this.props.positiveSign
    if (hasCurrencyParentheses === undefined) {
      hasPositiveSign = false
    }
    const positiveSign = hasPositiveSign && this.props.value > 0 ? '+' : ''
    const textValue = Utils.displayAmount(this.state.value)
    const displayValue = this.state.value >= 0 ? textValue : `-${textValue}`

    if (this.props.isBPHistory) {
      return (
        <View style={[{ flexDirection: 'row' }, this.props.style]}>
          <MsbText style={[this.props.amountStyle]}>
            {positiveSign}
            {displayValue}
          </MsbText>
          <MsbText style={[this.props.currencyStyle]}>
            {this.props.currency
              ? ` ${openParentheses}${this.props.currency}${closeParentheses}`
              : null}
          </MsbText>
        </View>
      )
    }
    return (
      <MsbText style={this.props.style}>
        {positiveSign}
        {displayValue}
        {this.props.currency
          ? ` ${openParentheses}${this.props.currency}${closeParentheses}`
          : null}
      </MsbText>
    )
  }
}
