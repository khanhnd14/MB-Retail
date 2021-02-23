/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import {
  View,
  Modal,
  TouchableOpacity,
  DatePickerAndroid,
  Platform,
  StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'
import DateTimePicker from '@react-native-community/datetimepicker'
import I18n from '../translations'
import MsbText from './MsbText'
import { Colors } from '../theme'

class DatePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: this.props.date == null ? null : this.props.date,
      selectDate: this.props.minDate
        ? this.props.minDate
        : this.props.date == null
        ? new Date()
        : this.props.date,
      modalVisible: false,
      locale: 'vi'
    }
    this.datePicked = this.datePicked.bind(this)
    this.onPressDate = this.onPressDate.bind(this)
    this.onPressCancel = this.onPressCancel.bind(this)
    this.onPressConfirm = this.onPressConfirm.bind(this)
    this.onDatePicked = this.onDatePicked.bind(this)
    this.setModalVisible = this.setModalVisible.bind(this)
  }

  onSelect() {
    if (this.props.onSelect) {
      this.props.onSelect()
    } else {
      this.onPressDate()
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  onPressCancel() {
    this.setModalVisible(false)
  }

  onPressConfirm() {
    this.datePicked()
    if (Platform.OS === 'ios') {
      this.setModalVisible(false)
    }
    if (this.props.onPressConfirm) {
      this.props.onPressConfirm(this.state.selectDate)
    }
  }

  datePicked() {
    this.setState({
      date: this.state.selectDate,
    })
    if (typeof this.props.onDateChange === 'function') {
      this.props.onDateChange()
    }
  }

  onDatePicked({ action, year, month, day }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        selectDate: new Date(year, month, day),
      })
      this.onPressConfirm()
    }
  }

  onPressDate() {
    // reset state
    if (Platform.OS === 'ios') {
      this.setModalVisible(true)
    } else if (this.props.mode === 'date') {
      if (this.props.minDate && this.props.maxDate) {
        DatePickerAndroid.open({
          date: this.props.minDate,
          minDate: this.props.minDate,
          maxDate: this.props.maxDate,
        }).then(this.onDatePicked)
      } else if (this.props.maxDate) {
        DatePickerAndroid.open({
          date: this.props.maxDate,
          maxDate: this.props.maxDate,
        }).then(this.onDatePicked)
      } else if (this.props.minDate) {
        DatePickerAndroid.open({
          date: this.props.minDate,
          minDate: this.props.minDate,
        }).then(this.onDatePicked)
      } else {
        DatePickerAndroid.open({
          date: this.state.selectDate,
        }).then(this.onDatePicked)
      }
    }
  }

  onDateChange(event, date) {
    this.setState({ selectDate: date })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('disable') && nextProps.disable !== this.state.disable) {
      this.setState({
        disable: nextProps.disable,
      })
    }
    if (nextProps.hasOwnProperty('nullValue') && nextProps.nullValue !== this.state.nullValue) {
      this.setState({
        nullValue: nextProps.nullValue,
      })
    }
    if (nextProps.hasOwnProperty('date') && nextProps.date !== this.state.date) {
      this.setState({
        date: nextProps.date,
      })
    }
  }

  componentDidMount() {
    this.setState({ locale: I18n.currentLocale() })
  }

  render() {
    const { locale } = this.state
    return (
      <View style={this.props.style} underlayColor="transparent">
        <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 4, justifyContent: 'center' }}
            onPress={this.state.disable ? null : this.onSelect.bind(this)}
          >
            <View style={{ justifyContent: 'center' }}>
              {this.props.dateLabel && (
                <MsbText
                  style={[
                    styles.formLabel,
                    this.state.date != null ? { fontSize: 12 } : { fontSize: 14 },
                  ]}
                >
                  {this.props.dateLabel}
                </MsbText>
              )}
              {this.state.date != null && (
                <MsbText style={[styles.formText, this.props.dateStyle]}>
                  {this.state.date.getDate() < 10
                    ? `0${this.state.date.getDate()}`
                    : this.state.date.getDate()}
                  /
                  {this.state.date.getMonth() + 1 < 10
                    ? `0${this.state.date.getMonth() + 1}`
                    : this.state.date.getMonth() + 1}
                  /{this.state.date.getFullYear()}
                </MsbText>
              )}
            </View>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <Modal
              animationType="slide"
              transparent
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(false)
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.setState({ modalVisible: false })
                }}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', flex: 2 }}
              />
              <View style={[styles.datePicker]}>
                {/* Modal Button */}
                <View style={styles.modalButton}>
                  <TouchableOpacity activeOpacity={1} onPress={this.onPressCancel}>
                    <MsbText style={styles.navButton}>
                      {this.props.cancelBtnText || I18n.t('action.action_cancel')}
                    </MsbText>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} onPress={this.onPressConfirm}>
                    <MsbText style={styles.navButton}>
                      {this.props.confirmBtnText || I18n.t('action.action_done')}
                    </MsbText>
                  </TouchableOpacity>
                </View>
                {/* Modal Date */}
                <View>
                  <DateTimePicker
                    value={this.state.selectDate}
                    mode="date"
                    display="spinner"
                    minimumDate={this.props.minDate}
                    maximumDate={this.props.maxDate}
                    onChange={this.onDateChange.bind(this)}
                    locale={locale}
                  />
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    )
  }
}

DatePicker.defaultProps = {
  mode: 'date',
  confirmBtnText: null,
  cancelBtnText: null,
  disable: false,
  nullValue: ' ',
  dateStyle: {},
}

DatePicker.propTypes = {
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  onDateChange: PropTypes.func,
}

const styles = StyleSheet.create({
  formLabel: {
    fontSize: 12,
    color: Colors.gray2,
    paddingVertical: 4,
  },
  formText: {
    fontSize: 14,
  },
  datePicker: {
    borderTopWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 260,
    borderColor: Colors.seperate,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 30,
    borderColor: Colors.seperate,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  rowItemLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  rowItemRight: {
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  navButton: {
    fontSize: 13,
  },
})

export default DatePicker
