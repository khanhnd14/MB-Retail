import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Text, CustomInput, Topbar, ConfirmButton } from '../../components'
import { ApplicationStyles, Colors, Metrics, Helpers } from '../../theme'
import { employeeOperations } from '../../state/employee'
import I18n from '../../translations'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: Metrics.medium * 4,
  },
  resendContainer: {
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
  },
  input: {
    marginBottom: Metrics.small,
    marginTop: Metrics.medium * 2,
  },
})

const EmployeeOTP = () => {
  const dispatch = useDispatch()
  const { otpComplete, activeComplete, activeError } = useSelector((state) => state.employee)
  const { tranId } = otpComplete || {}
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const codeIp = useRef(null)

  useEffect(() => {
    if (loading) {
      setLoading(false)
      dispatch(employeeOperations.getInfo())
      Navigation.pop()
    }
  }, [activeComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.pop()
    }
  }, [activeError])

  const sendOtp = () => {
    setLoading(true)
    const params = {
      otpInput: otp,
      tranIdEncode: tranId,
    }
    dispatch(employeeOperations.completeRegister(params))
  }

  const desc = I18n.t('vefiry.input_otp')

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[Helpers.fill, Helpers.crossCenter, ApplicationStyles.mainContainer]}>
          <Text style={[styles.title, Helpers.contentWidth]}>{desc}</Text>
          <View style={styles.input}>
            <CustomInput ref={codeIp} value={otp} onChange={setOtp} onComplete={() => sendOtp()} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <ConfirmButton loading={loading} />
    </View>
  )
}

export default EmployeeOTP
