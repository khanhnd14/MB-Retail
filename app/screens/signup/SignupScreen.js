import React, { useState } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import { Utils } from '../../utilities'
import { Button, Text, FloatingLabel, Topbar } from '../../components'
import { ApplicationStyles, Helpers, Metrics, Colors } from '../../theme'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginVertical: Metrics.small * 2,
  },
  buttonLogin: {
    width: '100%',
  },
})

const SignupScreen = () => {
  const [userName, setUserName] = useState('Nguyen Van A')
  const [identify, setIdentify] = useState('02464361313')
  const [accNo, setAccNo] = useState('0310101656487463')
  const [phone, setPhone] = useState('096584131331')
  const [user, setUser] = useState('someone@gmail.com')

  const getOtp = () => {
    if (!phone) {
      Utils.toast('Vui lòng nhập đủ thông tin')
      return
    }
    Navigation.push('SignupOTPScreen')
  }

  return (
    <View style={[Helpers.fill, Helpers.crossCenter, { backgroundColor: '#fff' }]}>
      <Topbar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={Helpers.fill}>
          <Text style={styles.title}>Nhập thông tin</Text>
          <View style={ApplicationStyles.inputPrimary}>
            <FloatingLabel
              returnKeyType="next"
              onChangeText={(val) => setUserName(val)}
              maxLength={10}
              value={userName}
            >
              Tên đăng nhập
            </FloatingLabel>
          </View>
          <View style={[ApplicationStyles.inputPrimary, styles.marginTopbar]}>
            <FloatingLabel
              returnKeyType="next"
              onChangeText={(val) => setIdentify(val)}
              maxLength={10}
              value={identify}
            >
              Số CMND/ CCCD/ Hộ chiếu
            </FloatingLabel>
          </View>
          <View style={ApplicationStyles.inputPrimary}>
            <FloatingLabel
              returnKeyType="next"
              onChangeText={(val) => setAccNo(val)}
              maxLength={10}
              value={accNo}
            >
              Số tài khoản
            </FloatingLabel>
          </View>
          <View style={ApplicationStyles.inputPrimary}>
            <FloatingLabel
              returnKeyType="next"
              onChangeText={(val) => setPhone(val)}
              maxLength={10}
              value={phone}
            >
              Số điện thoại
            </FloatingLabel>
          </View>
          <View style={ApplicationStyles.inputPrimary}>
            <FloatingLabel
              returnKeyType="done"
              onChangeText={(val) => setUser(val)}
              maxLength={10}
              value={user}
            >
              Tên truy cập (Email hoặc SĐT)
            </FloatingLabel>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <View style={ApplicationStyles.confirmContainer}>
        <Button
          onPress={getOtp}
          colors={Colors.buttonPrimary}
          style={[Helpers.contentWidth, ApplicationStyles.btnPrimary]}
        >
          <Text style={{ color: Colors.white }}>{'Tiếp tục'.toUpperCase()}</Text>
        </Button>
      </View>
    </View>
  )
}
export default SignupScreen
