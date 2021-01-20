import React, { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Image, StatusBar } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Communications from 'react-native-communications'
import DeviceInfo from 'react-native-device-info'
import I18n from '../../translations'
import { Helpers, Colors, ApplicationStyles, Metrics, Images } from '../../theme'
import { loginOperations } from '../../state/login'
import { Utils } from '../../utilities'
import { Button, Text, Avatar, TextInput, Icon } from '../../components'
import * as Navigation from '../../navigation'
import styles from './LoginScreenStyle'
import { appTypes, appOperations } from '../../state/application'
import { Config } from '../../config'

const LoginScreen = () => {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [isShowPass, showPass] = useState(true)
  const tranId = useSelector((state) => state.login.tranId)
  const loading = useSelector((state) => state.login.loading)
  const { language } = useSelector((state) => state.application)
  const languageIcon = language === appTypes.LANGUAGE_CODE.VI ? Images.uk : Images.vn

  const dispatch = useDispatch()
  const inputPass = useRef(null)

  useEffect(() => {
    if (user && tranId) {
      Navigation.push('LoginOTPScreen')
    }
  }, [tranId])

  const getOtp = () => {
    if (!user || !pass) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    dispatch(
      loginOperations.login({
        userName: user,
        password: pass,
        uiid: Utils.getUserDeviceID(),
        version: DeviceInfo.getVersion(),
      })
    )
  }
  const forgotPass = () => {
    Navigation.push('ForgotScreen')
  }
  const onSignup = () => {
    Navigation.push('Register')
  }

  const onFAQ = () => {
    Navigation.push('FAQScreen')
  }

  const changeLanguage = () => {
    if (language === appTypes.LANGUAGE_CODE.VI) {
      dispatch(appOperations.updateLanguage(appTypes.LANGUAGE_CODE.EN))
    } else {
      dispatch(appOperations.updateLanguage(appTypes.LANGUAGE_CODE.VI))
    }
  }

  return (
    <>
      <View style={styles.statusBar}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      </View>
      <View style={styles.container}>
        <View
          style={[Helpers.row, Helpers.fullWidth, Helpers.mainSpaceBetween, styles.logoContainer]}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: Metrics.small * 2.8,
              paddingVertical: Metrics.small,
              marginLeft: Metrics.small,
            }}
            onPress={() => Navigation.replace('Welcome')}
          >
            <Icon name="icon-back" size={24} />
          </TouchableOpacity>
          <Image resizeMode="contain" source={Images.logo} style={styles.logo} />
          <TouchableOpacity
            style={{ paddingHorizontal: Metrics.normal * 2 }}
            onPress={changeLanguage}
          >
            <Image
              resizeMode="contain"
              source={languageIcon}
              style={{
                height: Metrics.small * 1.2,
                width: Metrics.small * 2.2,
                marginTop: Metrics.normal,
              }}
            />
          </TouchableOpacity>
        </View>
        <Avatar size={160} />
        <View style={[Helpers.fill, Helpers.crossCenter]}>
          <View style={[styles.input, styles.marginTopbar]}>
            <TextInput
              style={styles.inputText}
              autoCorrect={false}
              placeholderTextColor={Colors.primary2}
              placeholder={I18n.t('login.input_mobile')}
              value={user}
              onChangeText={(val) => setUser(val)}
              onSubmitEditing={() => {
                inputPass.current.focus()
              }}
              autoCapitalize="none"
              maxLength={100}
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[styles.input, Helpers.rowCenter]}>
            <TextInput
              style={[Helpers.fill, styles.inputText]}
              placeholderTextColor={Colors.primary2}
              ref={inputPass}
              autoCorrect={false}
              placeholder={I18n.t('login.input_pass')}
              value={pass}
              onChangeText={(val) => setPass(val)}
              onSubmitEditing={getOtp}
              secureTextEntry={isShowPass}
              maxLength={100}
              autoCapitalize="none"
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity onPressIn={() => showPass(false)} onPressOut={() => showPass(true)}>
              <Icon name="icon-show" size={14} color={isShowPass ? Colors.primary2 : Colors.gray} />
            </TouchableOpacity>
          </View>
          <Button
            onPress={getOtp}
            loading={loading}
            color={Colors.primary2}
            style={[ApplicationStyles.btnPrimary, styles.buttonLogin]}
          >
            <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
              {I18n.t('action.action_login').toUpperCase()}
            </Text>
          </Button>
          <View style={[{ marginTop: Metrics.medium, marginHorizontal: Metrics.medium * 1.5 }]}>
            <TouchableOpacity onPress={forgotPass} style={[{ padding: Metrics.small }]}>
              <Text style={styles.forgotText}>{I18n.t('login.forgot')}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={onSignup}>
              <Text style={styles.forgotText}>{I18n.t('login.register').toUpperCase()}</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={[styles.containerRegister, Helpers.crossCenter]}>
          <View style={[Helpers.rowCenter, { marginVertical: Metrics.normal * 2 }]}>
            <TouchableOpacity style={[Helpers.colCenter, styles.hotlineContainer]} onPress={onFAQ}>
              <Icon name="icon-hoidap" size={24} color={Colors.primary2} />

              <Text style={styles.hotlineText}>{I18n.t('login.faq')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[Helpers.colCenter]}
              onPress={() => Communications.phonecall(Config.phoneNumber, true)}
            >
              <Icon name="icon-247" size={24} color={Colors.primary2} />

              <Text style={styles.hotlineText}>{I18n.t('login.247')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

export default LoginScreen
