import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import I18n from '../../translations'
import { Text, TextInput } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
})

const EnterCustomersCode = ({ onChangeCustomerCode, customerCodeFill, customerName, label }) => {
  const [value, setValue] = React.useState(customerCodeFill || '')
  const onChangeText = (e) => {
    setValue(e);
  }
  const onBlur = () => {
    value === '' ? null : onChangeCustomerCode(value)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label || I18n.t('product.customer_code')}</Text>
      <View
        style={{
          marginTop: Metrics.small,
        }}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={I18n.t('product.input_customer_code')}
          placeholderTextColor={Colors.gray}
          onBlur={onBlur}
        />
        <Text style={styles.subValue}>{customerName}</Text>
      </View>
    </View>
  )
}

export default EnterCustomersCode
