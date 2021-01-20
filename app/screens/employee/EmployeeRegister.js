/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../theme'
import { ConfirmButton, TextInput, Text } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { employeeOperations } from '../../state/employee'
import { Utils } from '../../utilities'

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
    marginHorizontal: Metrics.medium,
  },
})

const EmployeeRegister = () => {
  const [employeeId, setEmployeeId] = useState('')
  const [certNo, setCertNo] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { otpComplete, otpError } = useSelector((state) => state.employee)

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.push('EmployeeConfirmRegister')
    }
  }, [otpComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [otpError])

  const register = () => {
    if (!employeeId || !certNo) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    setLoading(true)
    dispatch(
      employeeOperations.sendOtp({
        certNo,
        employeeId,
      })
    )
  }
  return (
    <Fragment>
      <View style={[Helpers.fill]}>
        <View style={styles.container}>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('employee.employeeId')}</Text>
            <TextInput
              style={[styles.inputText]}
              placeholderTextColor={Colors.holder}
              autoCorrect={false}
              placeholder={I18n.t('employee.placeHolder')}
              value={employeeId}
              onChangeText={(val) => setEmployeeId(val)}
              maxLength={15}
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[styles.element, { borderBottomWidth: 0 }]}>
            <Text style={styles.title}>{I18n.t('employee.certNo')}</Text>
            <TextInput
              style={[styles.inputText]}
              placeholderTextColor={Colors.holder}
              autoCorrect={false}
              placeholder={I18n.t('employee.certNo')}
              value={certNo}
              onChangeText={(val) => setCertNo(val)}
              maxLength={20}
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <Text style={styles.note}>{I18n.t('employee.employeeInfo')}</Text>
      </View>
      <ConfirmButton onPress={() => register()} loading={loading} />
    </Fragment>
  )
}

export default EmployeeRegister
