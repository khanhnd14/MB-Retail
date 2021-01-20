import * as React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Colors, Metrics } from '../../theme'
import MsbIcon from '../MsbIcon'
import { Icon, Text, TextInput } from '..'
import { Utils } from '../../utilities'

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
    fontSize: 16,
    height: 24,
    fontWeight: 'bold',
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

const FeildItem = ({ title, content, isInput, dataCheckBox, isCheckBox, showIconArrow }) => {
  const [value, setValue] = React.useState('')
  const [indexChecked, setIndexChecked] = React.useState(0)
  const onChange = (e) => {
    setValue(e.target.value)
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
          {isInput ? (
            <TextInput
              style={styles.input}
              value={value}
              onChange={onChange}
              placeholder="Nhập giá trị khác"
              placeholderTextColor={Colors.gray1}
            />
          ) : null}
          {isCheckBox ? (
            <View>
              {dataCheckBox.map((element, index) => (
                <View style={styles.viewCheckBox} onTouchEnd={() => setIndexChecked(index)}>
                  <View
                    style={{
                      ...styles.checkBox,
                      backgroundColor: indexChecked === index ? Colors.primary2 : Colors.white,
                    }}
                  >
                    <Icon
                      name="icon-check"
                      size={Utils.getWindowHeight() / 100}
                      color={Colors.white}
                    />
                  </View>
                  <View>
                    <Text style={styles.textContent}>{element.title}</Text>
                    <Text style={{ ...styles.textContent, fontWeight: 'bold' }}>{element.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
          <Text style={styles.subValue}>{content}</Text>
        </View>
      </View>
      {showIconArrow ? (
        <MsbIcon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
      ) : null}
    </View>
  )
}

export default FeildItem
