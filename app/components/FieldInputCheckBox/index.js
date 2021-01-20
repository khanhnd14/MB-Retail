import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { AmountInputValue, Icon, Text, AmountInputText } from '../index'
import { numberWithCommas } from '../../utilities/common'
import I18n from '../../translations'

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
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
  },
})

const FieldInputCheckBox = ({ title, content, dataCheckBox, selectedValueCheckBox, indexTab }) => {
  const [value, setValue] = React.useState('')
  const [indexChecked, setIndexChecked] = React.useState(0)
  const onChange = (e) => {
    setValue(e)
  }
  React.useEffect(() => {
    selectedValueCheckBox(value)
  }, [indexChecked, value])
  React.useEffect(() => {
    setIndexChecked(0)
    setValue('')
  }, [indexTab])
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={{
            marginTop: Metrics.small,
          }}
        >
          <View>
            {dataCheckBox.map((element, index) => (
              <View
                style={styles.viewCheckBox}
                onTouchEnd={() => {
                  setIndexChecked(index)
                  if (element.value !== null) setValue(element.value)
                }}
              >
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
                  {index !== 2 ? (<Text style={{ ...styles.textContent, }}>{`${numberWithCommas(element.value)} VND`}</Text>) : null}
                </View>
              </View>
            ))}
          </View>
          {indexChecked === 2 ? (
            <View style={{ marginLeft: Metrics.medium * 2.5, flexDirection: 'row', alignItems: 'center' }}>
              {/* <AmountInputValue
                amount={value}
                onChangeAmountInputValue={onChange}
              /> */}
              <AmountInputText
                value={value}
                placeholder={I18n.t('product.holder_amount')}
                onChangeText={onChange}
                returnKeyType="done"
                maxLength={16}
              />
              <Text style={[{ paddingHorizontal: Metrics.tiny }]}>VND</Text>
            </View>
          ) : null}
          <Text style={styles.subValue}>{content}</Text>
        </View>
      </View>
    </View>
  )
}

export default FieldInputCheckBox
