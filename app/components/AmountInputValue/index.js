import React from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import { TextInput, Text } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.tiny,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.textBlack,
    fontSize: 16,
  },
  amountDash: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  amountNumber: {
    color: Colors.gray1,
    fontSize: 16,
    marginTop: Metrics.small,
  },
  amountString: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
  input: {
    fontFamily: 'Helvetica',
  }
})

const AmountInputValue = ({ amount, onChangeAmountInputValue }) => {
  const [value, setValue] = React.useState(null)
  const formatInputText = (textValue) => {
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
  const onChangeText = (val) => {
    setValue(formatInputText(val))
  }
  React.useEffect(() => {
    onChangeAmountInputValue(value)
  }, [value])
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: Metrics.tiny * 0.1,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={I18n.t('product.holder_amount')}
            placeholderTextColor={Colors.gray10}
            keyboardType="number-pad"
            maxLength={15}
          />
          {value ? <Text style={styles.input}> VND</Text> : null}
        </View>
      </View>
    </View>
  )
}
AmountInputValue.defaultProps = {
  amount: 0,

}
export default AmountInputValue
