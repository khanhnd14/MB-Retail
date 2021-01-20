import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { TextInput, Text } from '..'

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
    color: Colors.gray1,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
})

const EnterCustomersCodeRecharge = ({ onChangeCustomerCode }) => {
  const [value, setValue] = React.useState('')
  const onChangeText = (e) => {
    setValue(e);
  }
  const onBlur = () => {
    onChangeCustomerCode(value)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mã khách hàng</Text>
      <View
        style={{
          marginTop: Metrics.small,
        }}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Nhập giá trị khác"
          placeholderTextColor={Colors.gray1}
          onBlur={onBlur}
        />
      </View>
    </View>
  )
}

export default EnterCustomersCodeRecharge
