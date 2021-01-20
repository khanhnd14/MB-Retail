import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import { formatInputTextIsAmount } from '../../utilities/common'
import { Text, TextInput } from '..'

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
    flex: 1,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    color: Colors.gray1,
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
  },
  checkBox: {
    height: Utils.getWindowHeight() / 35,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: Colors.gray10,
    borderRadius: Utils.getWindowHeight() / 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Utils.getWindowHeight() / 70
  },
  viewCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
  },
  textContent: {
    lineHeight: Utils.getWindowHeight() / 45,
    fontFamily: 'Helvetica',
  }
})

const FieldInputCardPayment = ({ title, content, isNumber, onBlurValue, placeholder = 'Nhập giá trị khác', inputRef }) => {
  const [value, setValue] = React.useState('')
  const onChangeText = (e) => {
    setValue(isNumber ? formatInputTextIsAmount(e) : e)
  }
  const onBlur = () => {
    onBlurValue(value)
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={{
            marginTop: Metrics.small,
          }}
        >
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={Colors.gray10}
            ref={inputRef}
          />
          <Text style={styles.subValue}>{content}</Text>
        </View>
      </View>
    </View>
  )
}

export default FieldInputCardPayment
