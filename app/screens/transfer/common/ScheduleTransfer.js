import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, ConfirmButton, Radio, DatePicker } from '../../../components'
import I18n from '../../../translations'
import LoopDialog from './LoopDialog'
import EndDateDialog from './EndDateDialog'
import { transferSelectors, transferOperations } from '../../../state/transfer'
import * as Navigation from '../../../navigation'

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
  elementDate: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small * 2,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
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
  dateElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.medium,
    width: '100%',
    marginHorizontal: Metrics.small,
  },
  contentDetailContainer: {
    backgroundColor: '#BDBDBD',
    paddingHorizontal: Metrics.medium,
    alignSelf: 'stretch',
    marginHorizontal: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dateSchedule: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: Metrics.medium * 1.7,
  },
})
const ScheduleTransfer = ({ route }) => {
  const { timeCreateToken } = useSelector((state) => state.user)
  const { editSchedule, isScheduleDate } = useSelector((state) => state.transfer)

  const { validatedDate, expiredDate, frqType, endType, frqLimit } = editSchedule
  const tomorrowDate = new Date(timeCreateToken)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)

  const [isTransferDate, setTransferDate] = useState(isScheduleDate)

  const [minDate, setMinDate] = useState(validatedDate || tomorrowDate)
  const [valiDate, setValidDate] = useState(validatedDate || tomorrowDate)

  const [minFrqDate, setMinFrqDate] = useState(validatedDate || tomorrowDate)
  const [valiFrqDate, setValidFrqDate] = useState(validatedDate || tomorrowDate)

  const [isVisibleLoop, setVisibleLoop] = useState(false)
  const [isVisibleEnd, setVisibleEnd] = useState(false)
  const dispatch = useDispatch()

  const onConfirm = () => {
    if (isTransferDate) {
      dispatch(
        transferOperations.setScheduleTransfer({
          isScheduleDate: isTransferDate,
          validatedDate: valiDate,
          expiredDate: valiDate,
          debitDate: 0,
          frqLimit: 1,
          endType: 'E',
        })
      )
    } else {
      let debitD = 0
      if (editSchedule.frqType === 'M') {
        debitD = valiFrqDate.getDate()
      } else if (editSchedule.frqType === 'W') {
        debitD = valiFrqDate.getDay()
      }
      dispatch(
        transferOperations.setScheduleTransfer({
          isScheduleDate: isTransferDate,
          validatedDate: valiFrqDate,
          expiredDate,
          frqType,
          endType,
          frqLimit,
          debitDate: debitD,
        })
      )
    }
    dispatch(transferOperations.setScheduleTransfer({ isNow: false }))
    Navigation.pop()
  }

  const onTransferDate = () => {
    setTransferDate(true)
  }

  const onSchedule = () => {
    setTransferDate(false)
  }

  const toggleDatePicker = (date) => {
    setValidDate(date)
  }

  const toggleFrqDatePicker = (date) => {
    setValidFrqDate(date)
  }

  const renderScheduleDetail = () => {
    const loopText = transferSelectors.getLoopText(frqType)
    const endText = transferSelectors.getEndText(endType, frqLimit, expiredDate)
    return (
      <View style={styles.contentDetailContainer}>
        <TouchableOpacity onPress={() => setVisibleLoop(true)} style={styles.elementDetail}>
          <Text style={styles.textDetail}>{I18n.t('transfer.title_loop')}</Text>
          <Text style={styles.text}>{loopText}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisibleLoop(true)} style={styles.elementDetail}>
          <Text style={styles.textDetail}>{I18n.t('transfer.title_start')}</Text>
          <DatePicker
            dateStyle={styles.text}
            style={{ flex: 1 }}
            date={valiFrqDate}
            minDate={minDate}
            onPressConfirm={(date) => toggleFrqDatePicker(date)}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisibleEnd(true)} style={styles.elementDetail}>
          <Text style={styles.textDetail}>{I18n.t('transfer.title_end')}</Text>
          <Text style={styles.text}>{endText}</Text>
        </TouchableOpacity>
        <LoopDialog visible={isVisibleLoop} handleModal={() => setVisibleLoop(false)} />
        <EndDateDialog
          visible={isVisibleEnd}
          handleModal={() => setVisibleEnd(false)}
          valiDate={valiFrqDate}
        />
      </View>
    )
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.title')} subTitle={I18n.t('transfer.schedule')} />
      <View style={[Helpers.fillColCross]}>
        <View style={[Helpers.fillColCross, styles.container]}>
          <View style={styles.contentContainer}>
            <View style={[styles.elementDate]}>
              <Radio
                text={I18n.t('transfer.transfer_date')}
                checked={isTransferDate}
                textStyle={styles.text}
                onPress={() => onTransferDate()}
              />
              <DatePicker
                style={styles.dateSchedule}
                date={valiDate}
                minDate={minFrqDate}
                onPressConfirm={(date) => toggleDatePicker(date)}
              />
            </View>
            <View style={styles.element}>
              <Radio
                textStyle={styles.text}
                text={I18n.t('transfer.frequency_date')}
                checked={!isTransferDate}
                onPress={() => onSchedule()}
              />
            </View>
          </View>
          {!isTransferDate && renderScheduleDetail()}
        </View>
        <ConfirmButton onPress={() => onConfirm()} />
      </View>
    </Fragment>
  )
}
export default ScheduleTransfer
