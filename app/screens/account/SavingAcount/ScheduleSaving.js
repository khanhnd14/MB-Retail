import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, ConfirmButton, Radio, DatePicker } from '../../../components'
import I18n from '../../../translations'
import { transferSelectors } from '../../../state/transfer'
import * as Navigation from '../../../navigation'
import { Utils } from '../../../utilities'
import LoopDialog from '../../../components/SaveMoney/LoopDialog'
import { saveOperations } from '../../../state/save'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Metrics.small * 1.8,
  },
  element: {
    ...Helpers.rowCross,
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small * 4,
  },
  elementDetail: {
    ...Helpers.rowCross,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: Metrics.normal,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  text: {
    color: Colors.primary2,
    height: '100%',
    textAlign: 'right',
    paddingLeft: Metrics.small,
  },
  textDetail: {
    flex: 1,
    color: Colors.black,
  },
  btnContinue: {
    padding: 12,
    ...Helpers.contentWidth,
    marginVertical: Metrics.normal,
  },
  contentDetailContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.medium,
    alignSelf: 'stretch',
    marginHorizontal: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: Utils.getWindowWidth() - Metrics.normal * 2,
  },
})
const ScheduleSaving = ({ route }) => {
  const { timeCreateToken } = useSelector((state) => state.user)
  const { schedule } = useSelector((state) => state.save)

  const { startedTime, expiredTime } = schedule || {}
  const tomorrowDate = new Date(timeCreateToken)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)

  const fDate = new Date(timeCreateToken)
  fDate.setDate(fDate.getDate() + 2)

  const [minDate, setMinDate] = useState(startedTime || tomorrowDate)
  const [valiFrqDate, setValidFrqDate] = useState(startedTime || tomorrowDate)
  const [valiEndDate, setValidEndDate] = useState(expiredTime || fDate)

  const [isVisibleLoop, setVisibleLoop] = useState(false)
  const dispatch = useDispatch()
  const [freqCode, setFreqCode] = useState(schedule ? schedule.freqCode : 'D')
  const [freq, setFreq] = useState(schedule ? schedule.freq : '1')

  const onConfirm = () => {
    dispatch(saveOperations.dispatchSchedule({
      freqCode,
      freq,
      startedTime: valiFrqDate,
      expiredTime: valiEndDate,
    }))
    Navigation.pop()
  }

  const toggleFrqDatePicker = (date) => {
    setValidFrqDate(date)
  }

  const onChangeFreqCode = (f) => {
    setFreqCode(f)
    // chọn theo tháng
    if (f === 'M') {
      const EDate = new Date(valiFrqDate)
      EDate.setDate(EDate.getDate() + 31)
      setValidEndDate(EDate)
    }
  }

  const onChangeFreq = (f) => {
    setFreq(f)
  }

  const onChangeExpiredTime = (date) => {
    setValidEndDate(date)
  }

  const renderScheduleDetail = () => {
    const loopText = transferSelectors.getLoopText(freqCode)
    return (
      <View style={styles.contentDetailContainer}>
        <TouchableOpacity onPress={() => setVisibleLoop(true)} style={styles.elementDetail}>
          <Text style={styles.textDetail}>{I18n.t('transfer.title_loop')}</Text>
          <Text style={styles.text}>{loopText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.elementDetail}>
          <Text style={styles.textDetail}>{I18n.t('transfer.title_start')}</Text>
          <DatePicker
            dateStyle={styles.text}
            style={{ flex: 1 }}
            date={valiFrqDate}
            minDate={minDate}
            onPressConfirm={(date) => toggleFrqDatePicker(date)}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.elementDetail}>
          <Text style={styles.textDetail}>{I18n.t('transfer.title_end')}</Text>
          <DatePicker
            dateStyle={styles.text}
            style={{ flex: 1 }}
            date={valiEndDate}
            minDate={valiFrqDate}
            onPressConfirm={(date) => onChangeExpiredTime(date)}
          />
        </TouchableOpacity>
        <LoopDialog
          onChangeFreqCode={onChangeFreqCode}
          visible={isVisibleLoop}
          handleModal={() => setVisibleLoop(false)}
          freqCode={freqCode}
          freq={freq}
          onChangeFreq={onChangeFreq}
        />
      </View>
    )
  }

  return (
    <Fragment>
      <Topbar subTitle={I18n.t('saving.deposit_saving')} title={I18n.t('account.title_saving')} />
      <View style={[Helpers.fillColCross]}>
        <View style={[Helpers.fillColCross, styles.container]}>{renderScheduleDetail()}</View>
        <ConfirmButton onPress={onConfirm} />
      </View>
    </Fragment>
  )
}
export default ScheduleSaving
