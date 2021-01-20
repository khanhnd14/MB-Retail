import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Colors, Metrics, Helpers } from '../../../../theme'
import I18n from '../../../../translations'
import { Radio, Alert, TextInput, DatePicker } from '../../../../components'
import { transferOperations } from '../../../../state/transfer'

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

    height: Metrics.medium,
    width: Metrics.medium * 4,
  },
})
const EndDateDialog = (props) => {
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const { endType, frqLimit, expiredDate, validatedDate } = useSelector((state) => state.transfer.editSchedule)
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(`${frqLimit}`)
  const [date, setDate] = useState(expiredDate || validatedDate || tomorrowDate)
  const [type, setType] = useState(endType)

  const toggleDatePicker = (d) => {
    setDate(d)
  }

  const submit = () => {
    dispatch(
      transferOperations.setSchedule({
        endType: type,
        frqLimit: type === 'C' ? counter : 0,
        expiredDate: type === 'E' ? date : null,
      })
    )
  }

  const onReset = () => {
    setType(endType)
  }

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
          checked={type === 'E'}
          onPress={() => setType('E')}
        />
        <DatePicker
          style={{ flex: 1 }}
          dateStyle={{ textAlign: 'right' }}
          date={date}
          minDate={validatedDate}
          onPressConfirm={toggleDatePicker}
        />
      </View>
      <View style={styles.element}>
        <Radio
          style={Helpers.fill}
          textStyle={styles.text}
          text={I18n.t('transfer.endTypeC')}
          checked={type === 'C'}
          onPress={() => setType('C')}
        />
        <TextInput
          autoCorrect={false}
          placeholderTextColor={Colors.holder}
          placeholder="Nhập số lần"
          value={counter}
          style={styles.counter}
          onChangeText={(val) => setCounter(val)}
          maxLength={5}
          keyboardType="numeric"
          returnKeyType="done"
          underlineColorAndroid="transparent"
        />
      </View>
      <View style={styles.element}>
        <Radio
          textStyle={styles.text}
          text={I18n.t('transfer.never_end')}
          checked={type === 'L'}
          onPress={() => setType('L')}
        />
      </View>
    </Alert>
  )
}
export default EndDateDialog
