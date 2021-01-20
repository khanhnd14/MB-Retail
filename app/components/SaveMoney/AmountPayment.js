import React, { useState, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { Colors, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import I18n from '../../translations'
import { transferSelectors } from '../../state/transfer'
import { TextInput, Text } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.normal,
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
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  amountString: {
    color: Colors.gray2,
    fontSize: 14,
  },
  input: {
    color: Colors.black,
    paddingVertical: Metrics.tiny,
    fontSize: 14,
    flex: 1,
  },
  stylePlaceHolder: {
    color: Colors.gray,
    fontSize: 16,
    fontWeight: 'normal',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  currency: {
    fontWeight: 'bold'
  }
})

const AmountPayment = ({ changePayment }) => {
  const [value, setValue] = useState('')
  const payment = useMemo(() => {
    const temp = typeof value === 'string' && value?.split(' ')
    return temp.length === 1 ? value : temp[0]
  }, [value])

  const onChangePayment = (text) => {
    setValue(Utils.formatAmountText(text))
    // setValue(`${text}`)
    changePayment(Utils.clearFormatAmount(text))
  }
  const onBlur = () => {
    // if (value) {
    //   changePayment(Utils.clearFormatAmount(value))
    //   setValue(`${value}`)
    // }
  }
  const input = useMemo(() => value ? _.assign({ fontWeight: 'bold' }, styles.input) : styles.input, [value])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={input}
            placeholder={I18n.t('employee.enterAmount')}
            placeholderTextColor={Colors.gray}
            placeholderStyle={styles.stylePlaceHolder}
            onChangeText={onChangePayment}
            onBlur={onBlur}
            defaultValue={value}
            keyboardType="number-pad"
            value={value}
            maxLength={15}
          />
          {payment ? <Text style={styles.currency}>VND</Text> : null}
        </View>
        <Text style={styles.amountString}>
          {payment && transferSelectors.amountToWord(Utils.clearFormatAmount(payment))}
          {/* {payment && <Text> {Number(Utils.clearFormatAmount(payment)) % 2 === 0 ? I18n.t('account.text_amount_even') : I18n.t('account.text_amount_odd') }.</Text>} */}
        </Text>
      </View>
    </View>
  )
}
export default AmountPayment
