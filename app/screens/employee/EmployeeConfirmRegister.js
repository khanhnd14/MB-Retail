/* eslint-disable no-use-before-define */
import React, { Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../theme'
import { ConfirmButton, Text, Topbar } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.small,
  },
  element: {
    paddingVertical: Metrics.small * 1.3,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
  },
  inputText: {
    marginTop: Metrics.small,
  },
  note: {

    color: Colors.textBlack,
    marginVertical: Metrics.normal * 2,
    marginLeft: Metrics.medium,
  },
})

const EmployeeConfirmRegister = () => {
  const { otpComplete } = useSelector((state) => state.employee)
  const { info } = otpComplete || {}
  const { employeeId, certNo, phoneNumber, birthDay, actNo } = info || {}

  const register = () => {
    Navigation.replace('EmployeeOTP')
  }
  return (
    <Fragment>
      <Topbar title={I18n.t('employee.title')} subTitle={I18n.t('employee.sub_title')} />
      <View style={[Helpers.fill]}>
        <View style={styles.container}>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('employee.employeeId')}</Text>
            <Text style={styles.inputText}>{employeeId}</Text>
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('employee.certNo')}</Text>
            <Text style={styles.inputText}>{certNo}</Text>
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('employee.phoneNumber')}</Text>
            <Text style={styles.inputText}>{phoneNumber}</Text>
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('employee.birthDay')}</Text>
            <Text style={styles.inputText}>{birthDay}</Text>
          </View>
          <View style={[styles.element, { borderBottomWidth: 0 }]}>
            <Text style={styles.title}>{I18n.t('employee.actNo')}</Text>
            <Text style={styles.inputText}>{actNo}</Text>
          </View>
        </View>
      </View>
      <ConfirmButton onPress={() => register()} />
    </Fragment>
  )
}

export default EmployeeConfirmRegister
