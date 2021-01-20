import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import Modal from 'react-native-modal'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Helpers, Metrics, Colors } from '../../../../theme'
import { Topbar, Text, ConfirmButton, Radio, DatePicker } from '../../../../components'
import I18n from '../../../../translations'
import { productOperations } from '../../../../state/product'
import * as Navigation from '../../../../navigation'

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
    paddingVertical: Metrics.normal,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  text: {
    fontWeight: 'bold',
    color: Colors.primary2,
    height: '100%',
    textAlign: 'right',
    paddingLeft: Metrics.small,
  },
  textDetail: {
    fontWeight: 'bold',
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
  centeredView: {
    // flex: 2,
    paddingHorizontal: Metrics.medium,
    width: '100%',
  },
  dateContainer: {
    paddingHorizontal: Metrics.medium * 5,
    paddingVertical: Metrics.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    flexWrap: 'wrap',
    width: '100%',
    borderRadius: 20,
  },
})
const ScheduleRecharge = ({ route }) => {
  const { tranLimit, isNow, dateRechargeMobile } = useSelector((state) => state.product)

  const [valiDate, setValidDate] = useState(dateRechargeMobile || tomorrowDate)
  const [isInDate, setIsInDate] = useState(true)
  const [isInPromotion, setIsInPromotion] = useState(false)
  const [modalVisible, setModalVisible] = useState(true)

  const { timeCreateToken } = useSelector((state) => state.user)
  const tomorrowDate = new Date(timeCreateToken)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const dispatch = useDispatch()

  const onConfirm = () => {
    if (isInDate) {
      dispatch(
        productOperations.setScheduleRecharge({
          dateRechargeMobile: valiDate,
        })
      )
    } else {
    }
    dispatch(productOperations.setScheduleRecharge({ isNow: false }))
    Navigation.pop()
  }

  const onSchedule = () => {
    setIsInPromotion(true)
    setIsInDate(false)
  }

  const renderScheduleDetail = () => (
    <View style={styles.contentDetailContainer}>
      <Text>{I18n.t('product.title_date_tranLimit')}</Text>
      {/* <Radio
        textStyle={styles.text}
        text="01"
        checked={!isTransferDate}
        onPress={() => onSchedule()}
      />
      <Radio
        textStyle={styles.text}
        text="02"
        checked={!isTransferDate}
        onPress={() => onSchedule()}
      />
      <Radio
        textStyle={styles.text}
        text="03"
        checked={!isTransferDate}
        onPress={() => onSchedule()}
      />
      <Radio
        textStyle={styles.text}
        text="04"
        checked={!isTransferDate}
        onPress={() => onSchedule()}
      /> */}
    </View>
    )

  //
  const onIsInDate = () => {
    setIsInDate(true)
    setModalVisible(true)
    setIsInPromotion(false)
  }
  const hideDatePicker = () => {
    setModalVisible(false)
    // setIsInDate(false)
  }
  const toggleDatePicker = (date) => {
    console.log('date', date)
    setValidDate(date)
    hideDatePicker()
  }
  return (
    <Fragment>
      <Topbar title={I18n.t('product.recharge')} subTitle={I18n.t('saving.cardMobile')} />
      <View style={[Helpers.fillColCross]}>
        <View style={[Helpers.fillColCross, styles.container]}>
          <View style={styles.contentContainer}>
            <View style={[styles.elementDate]}>
              <Radio
                text={I18n.t('product.title_recharge_date')}
                checked={isInDate}
                textStyle={styles.text}
                onPress={() => onIsInDate()}
              />

              <DateTimePickerModal
                isVisible={modalVisible}
                mode="date"
                confirmTextIOS="Chọn"
                cancelTextIOS="Hủy"
                onConfirm={toggleDatePicker}
                onCancel={hideDatePicker}
              />
            </View>
            <View style={styles.element}>
              <Radio
                textStyle={styles.text}
                text={I18n.t('product.title_recharge_promotion')}
                checked={isInPromotion}
                onPress={() => onSchedule()}
              />
            </View>
          </View>
          {/* {!isInDate && renderScheduleDetail()} */}
        </View>
        <ConfirmButton onPress={() => onConfirm()} />
      </View>
    </Fragment>
  )
}
export default ScheduleRecharge
