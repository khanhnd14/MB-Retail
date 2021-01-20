import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../theme'
import { removedSpecialCharacterFromNumber, numberWithCommas } from '../utilities/common'
import { TextInput } from '.'

const styles = StyleSheet.create({
  input: {
    color: Colors.gray1,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  }
})
const AmountInputTextRecharge = ({ amount, onAmountChange }) => {
  const [value, setValue] = React.useState(`${amount}` || '')
  const onChangeText = (e) => {
    setValue(removedSpecialCharacterFromNumber(e))
  }
  React.useEffect(() => {
    onAmountChange(value)
  }, [value])
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: Metrics.small,
        }}
      >
        <TextInput
          style={styles.input}
          value={`${numberWithCommas(value)}`}
          onChangeText={onChangeText}
          placeholder="Nhập giá trị khác"
          placeholderTextColor={Colors.gray1}
          keyboardType="number-pad"
        />
      </View>
    </View>
  )
}
export default AmountInputTextRecharge
