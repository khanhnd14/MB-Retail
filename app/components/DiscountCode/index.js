import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { Text, TextInput } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
    paddingBottom: Metrics.medium * 1.5,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  code: {
    color: Colors.textBlack,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  btn: {
    backgroundColor: Colors.primary2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  btnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})

const DiscountCode = () => {
  const [code, setAmount] = React.useState('')
  const onChange = (e) => {
    setAmount(e.target.value)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mã giảm giá</Text>
      <View
        style={{
          marginTop: Metrics.small,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          style={styles.code}
          value={code}
          onChange={onChange}
          placeholder="Typing"
          placeholderTextColor={Colors.gray1}
        />
        {/* <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Áp dụng</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  )
}

export default DiscountCode
