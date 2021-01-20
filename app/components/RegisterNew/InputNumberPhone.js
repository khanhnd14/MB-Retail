import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, View, Alert, TouchableWithoutFeedback } from 'react-native'
import { useDispatch } from 'react-redux'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import { sendOTPVerify } from '../../state/ekyc/actions'
import { checkPhoneNumber } from '../../utilities/common'
import { Text, TextInput } from '..'

const styles = StyleSheet.create({
  title: {
    color: Colors.black,
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: Metrics.medium * 4,
    paddingVertical: Metrics.medium * 2
  },
  input: {
    color: Colors.gray,
    width: 0
  },
  digit: {
    height: Metrics.normal * 3,
    width: Metrics.normal * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 30,
    textAlign: 'center',
    color: Colors.black,
  },
  underline: {
    width: Metrics.normal,
    height: 1,
    backgroundColor: Colors.gray12,
  },
})
const InputNumberPhone = forwardRef(({ setNumberPhone, showAlert }, ref) => {
  const [value, setValue] = useState('')
  const refInput = useRef();
  const dispatch = useDispatch()

  const onChangePayment = (text) => {
    if (text.length < 10) {
      setValue(text)
      setNumberPhone(text)
    } else if (text.length === 10) {
      setValue(text)
      if (!checkPhoneNumber(text)) {
        return
      }
      setNumberPhone(text)
    }
  }

  const submit = () => {
    dispatch(sendOTPVerify(value))
  }

  const onFocus = () => {
    refInput && refInput.current.focus()
  }

  useImperativeHandle(ref, () => ({

    submit

  }));

  useEffect(() => {
    setTimeout(() => {
      refInput.current && refInput.current.focus()
    }, 0);
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('ekyc.input_phone_otp')}</Text>
      <TouchableWithoutFeedback onPress={onFocus}>
        <View
          style={{
          marginVertical: Metrics.small,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: Metrics.medium * 2,
          paddingTop: Metrics.medium * 2,
        }}
        >
          <View style={styles.digit}>
            <Text style={styles.number}>{value[0]}</Text>
            {!value[0] && <View style={styles.underline} />}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[1]}</Text>
            {!value[1] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[2]}</Text>
            {!value[2] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[3]}</Text>
            {!value[3] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[4]}</Text>
            {!value[4] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[5]}</Text>
            {!value[5] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[6]}</Text>
            {!value[6] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[7]}</Text>
            {!value[7] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[8]}</Text>
            {!value[8] ? <View style={styles.underline} /> : null}
          </View>
          <View style={styles.digit}>
            <Text style={styles.number}>{value[9]}</Text>
            {!value[9] ? <View style={styles.underline} /> : null}
          </View>

        </View>
      </TouchableWithoutFeedback>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        placeholderTextColor={Colors.gray}
        onChangeText={onChangePayment}
        keyboardType="number-pad"
        ref={refInput}
        value={value}
      />
    </View>
  )
})
export default InputNumberPhone
