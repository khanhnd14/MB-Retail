import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import I18n from '../../translations'
import { Radio, Alert, TextInput, DatePicker } from '..'
import { Metrics, Colors, Helpers } from '../../theme'

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  element: {
    paddingVertical: Metrics.small,
    paddingHorizontal: Metrics.tiny,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    paddingLeft: Metrics.medium,
  },
  counter: {
    width: Metrics.medium * 5,
    textAlign: 'right',
  },
})
const EndDateDialog = (props) => {
  const { valiDate, onChangeFreq, freq, onChangeExpiredTime } = props
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const [counter, setCounter] = useState('')
  const [date, setDate] = useState(valiDate)

  useEffect(() => {
    setDate(valiDate)
  }, [valiDate])

  const toggleDatePicker = (d) => {
    setDate(d)
    onChangeExpiredTime(d)
  }

  const submit = () => {
    onChangeFreq(counter)
  }

  const onReset = () => {
    setCounter(freq)
  }

  useEffect(() => {
    setCounter(`${freq}`)
    setTimeout(() => {
      onChangeExpiredTime(tomorrowDate)
    }, 500);
  }, [])

  return (
    <Alert
      {...props}
      title={I18n.t('transfer.title_end')}
      onModalHide={() => onReset()}
      onConfirm={() => submit()}
    >
      {/* EndType - E : Có thời hạn , C :Số lần , L : Vô thời hạn */}
      <View style={styles.element}>
        <Radio
          style={Helpers.fill}
          textStyle={styles.text}
          text={I18n.t('transfer.end_date')}
          checked
          onPress={() => {
            setCounter('')
          }}
        />
        <DatePicker
          style={{ flex: 1 }}
          dateStyle={{ textAlign: 'right' }}
          date={date}
          minDate={valiDate}
          onPressConfirm={toggleDatePicker}
        />
      </View>
      <View style={styles.element}>
        <Radio
          style={Helpers.fill}
          textStyle={styles.text}
          text={I18n.t('saving.freq')}
          checked
        />
        <TextInput
          autoCorrect={false}
          placeholderTextColor={Colors.holder}
          placeholder={I18n.t('saving.holder_end_after')}
          value={counter}
          style={styles.counter}
          onChangeText={(val) => setCounter(val)}
          maxLength={5}
          keyboardType="numeric"
          returnKeyType="done"
          underlineColorAndroid="transparent"
        />
      </View>

    </Alert>
  )
}
export default EndDateDialog
