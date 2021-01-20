import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker, Text, TextInput, Topbar, ConfirmButton } from '../../components'
import { Helpers, Metrics, Colors } from '../../theme'
import I18n from '../../translations'
import * as Navigation from '../../navigation'
import { loginOperations } from '../../state/login'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    paddingBottom: Metrics.small * 0.8
  },
  element: {
    paddingBottom: Metrics.normal,
    marginBottom: Metrics.normal,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  input: {
    color: '#4F4F4F',
    fontWeight: 'normal',
    width: '100%'
  }
})

const ForgotScreen = () => {
  const { forgotError, forgotUser } = useSelector((state) => state.login)
  const [date, setDate] = useState(new Date())
  const [identify, setIdentify] = useState('')
  const [username, setUserName] = useState('')
  const [acctNo, setAccNo] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (forgotError && loading) {
      setLoading(false)
    }
  }, [forgotError])

  useEffect(() => {
    if (forgotUser && loading) {
      setLoading(false)
      Navigation.push('ForgotOTPScreen', {
        certificateNo: identify,
        issueDate: Utils.toStringServerDate(date),
        userName: username,
        acctNo,
      })
    }
  }, [forgotUser])

  const getOtp = () => {
    if (!date || !identify || !username || !acctNo) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    setLoading(true)
    dispatch(
      loginOperations.forgot({
        certificateNo: identify,
        issueDate: Utils.toStringServerDate(date),
        userName: username,
        acctNo,
      })
    )
  }

  const selectDate = (d) => {
    setDate(d)
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('forgot.title')} isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fill, { paddingHorizontal: Metrics.small * 3.4 }]}>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('forgot.account_number')}</Text>
            <TextInput
              style={styles.input}
              value={acctNo}
              onChangeText={(val) => setAccNo(val)}
              returnKeyType="done"
              maxLength={150}
            />
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('forgot.username')}</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={(val) => setUserName(val)}
              returnKeyType="next"
              maxLength={150}
            />
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('forgot.certNo')}</Text>
            <TextInput
              style={styles.input}

              value={identify}
              onChangeText={(val) => setIdentify(val)}
              returnKeyType="next"
              maxLength={150}
            />
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('forgot.date')}</Text>
            <DatePicker
              date={date}
              onPressConfirm={selectDate}
              dateStyle={styles.input}
              style={{ height: Metrics.normal * 2 }}
            />
          </View>
        </View>
      </View>
      <ConfirmButton onPress={getOtp} loading={loading} />
    </View>
  )
}
export default ForgotScreen
