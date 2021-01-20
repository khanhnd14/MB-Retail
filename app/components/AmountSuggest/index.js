/* eslint-disable no-use-before-define */
import React, { useState, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import AmountInputText from '../AmountInputText'
import AmountLabel from '../AmountLabel'
import { Colors, Metrics } from '../../theme'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  input: {
    color: Colors.textBlack,
    paddingVertical: Metrics.tiny,
  },
})

const AmountSuggest = (props) => {
  const { amount, min, max, style, placeholder, placeholderTextColor, onChange } = props
  const [value, setAmount] = useState(amount)

  const amountSuggestion = () => {
    var listArray = []
    const suggestCount = 4
    var maxValue = max
    var minValue = min
    var amountValue = value
    try {
      if (
        amountValue.length === 0 ||
        (amountValue.length === 1 && amountValue === '0') ||
        amountValue.length > 4
      ) {
        return []
      }

      const tempCount = 5 - amountValue.length
      let zero = ''
      for (let i = 0; i < tempCount; i++) {
        zero += '0'
      }
      let duple = '0'

      if (amountValue.indexOf('0') === amountValue.length - 1) {
        zero += '0'
        if (parseFloat(maxValue) > 9999999) {
          duple = '00'
        }
        if (parseFloat(maxValue) > 99999999) {
          duple = '000'
        }
      }
      if (amountValue.indexOf('00') === 1) {
        zero += '00'
        if (parseFloat(maxValue) > 9999999) {
          duple = '00'
        }
        if (parseFloat(maxValue) > 99999999) {
          duple = '000'
        }
      }
      let tempAmount
      let i = 0
      while (i < suggestCount) {
        tempAmount = amountValue + zero
        if (maxValue != null) {
          if (parseFloat(tempAmount) > parseFloat(maxValue)) {
            if (duple.length > 1 && parseFloat(tempAmount) / 10 < parseFloat(maxValue)) {
              listArray.push(tempAmount.substring(0, tempAmount.length - 1))
            }
            break
          }
        }
        if (minValue != null && parseFloat(tempAmount) >= parseFloat(minValue)) {
          listArray.push(tempAmount)
          i++
        }
        zero += duple
      }
      if (amountValue.length === 3 && `${maxValue}`.indexOf(amountValue) === 0) {
        listArray[listArray.length - 1] = `${maxValue}`
      }
    } catch (error) {
      return listArray
    }
    return listArray
  }

  const listSuggest = useMemo(() => amountSuggestion(), [value])

  const onAmoutChange = (am) => {
    setAmount(am.replace(/,/g, ''))
    if (onChange) {
      onChange(am)
    }
  }

  const renderAmountSuggestion = () => (
    <View style={[{ backgroundColor: 'white' }]}>
      {listSuggest.map((item, index) => (
        <TouchableOpacity
          key={`${index}`}
          onPress={() => {
            onAmoutChange(item)
            Keyboard.dismiss()
          }}
        >
          <View
            style={{
              padding: 10,
              borderWidth: 0.5,
              borderColor: Colors.light2,
            }}
          >
            <AmountLabel value={item} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )

  return (
    <>
      <AmountInputText
        style={[styles.input, style]}
        value={amount}
        rightText="VND"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || '#828282'}
        onChangeText={onAmoutChange}
        returnKeyType="done"
        maxLength={13}
      />
      {!Utils.isArrayEmpty(listSuggest) && renderAmountSuggestion()}
    </>
  )
}

AmountSuggest.defaultProps = {
  min: 5000,
}

AmountSuggest.propTypes = {
  amount: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
  placeholderTextColor: PropTypes.string,
  placeholder: PropTypes.string,
}
export default AmountSuggest
