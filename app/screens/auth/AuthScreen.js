/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import TouchID from 'react-native-touch-id'
import EventEmitter from 'react-native-eventemitter'
import { useFocusEffect } from '@react-navigation/native'
import Communications from 'react-native-communications'
import DeviceInfo from 'react-native-device-info'
import I18n from '../../translations'
import { Helpers, Colors, ApplicationStyles, Metrics, Images } from '../../theme'
import { loginOperations } from '../../state/login'
import { appTypes, appOperations } from '../../state/application'
import { Utils } from '../../utilities'
import { Button, Text, Avatar, TextInput, Icon } from '../../components'
import * as Navigation from '../../navigation'
import { storeService } from '../../services'
import BioConfirmPopup from './BioConfirmPopup'
import { Config } from '../../config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  logo: {
    width: Metrics.small * 16.7,
    height: Metrics.medium * 2,
  },
  logoContainer: {
    paddingVertical: Metrics.medium,
    marginBottom: Metrics.small * 1.2,
  },
  marginTopbar: {
    marginTop: Metrics.small,
  },
  forgotPass: {
    ...Helpers.row,
    marginTop: Metrics.small * 2.8,
  },
  input: {
    ...Helpers.contentWidth,
    justifyContent: 'center',
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    height: Metrics.tiny * 10,
    marginTop: Metrics.small * 1.2,
    paddingLeft: Metrics.small * 3.3,
    paddingRight: Metrics.medium,
  },
  inputText: {},
  buttonLogin: {
    ...ApplicationStyles.btnPrimary,
    ...Helpers.fill,
    ...Helpers.fullWidth,
    ...Helpers.contentWidth,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingVertical: Metrics.small * 0.9,
  },
  textLogin: {
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: Metrics.medium * 2,
  },
  signup: {
    color: Colors.second,
    marginTop: Utils.getRatioDimension(20),
  },
  containerRegister: {
    padding: Metrics.small,
  },
  hotlineContainer: {
    marginRight: Metrics.medium * 5,
  },
  hotlineText: {
    color: Colors.gray,
    marginTop: Metrics.tiny,
    fontSize: 12,
  },
  hotlineIcon: {
    width: Metrics.small * 2,
    height: Metrics.small * 2,
  },
  forgotText: {
    fontSize: 12,
    color: Colors.textBlack,
    marginTop: Metrics.small,
    textDecorationLine: 'underline',
  },
  registerTest: {
    fontWeight: 'bold',
  },
  user: {
    marginTop: Metrics.small * 1.9,
  },
  biometricButton: {
    borderRadius: 38,
    paddingHorizontal: Metrics.small * 1.7,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: Metrics.tiny,
  },
  indicator: {
    marginLeft: Metrics.medium * 2,
  },
  statusBar: {
    height: Metrics.STATUSBAR_HEIGHT,
    backgroundColor: Colors.white,
  },
})

const AuthScreen = (props) => {
  const user = useSelector((state) => state.user)
  const { authUser, authError } = useSelector((state) => state.login)
  const { language } = useSelector((state) => state.application)
  const [pass, setPass] = useState('')
  const dispatch = useDispatch()
  const inputPass = useRef(null)
  const [isShowPass, showPass] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isVisibleFP, showFPPopup] = useState(false)
  const [typeFaceId, setTypeFaceId] = useState('FaceID')
  const languageIcon = language === appTypes.LANGUAGE_CODE.VI ? Images.uk : Images.vn
  const isShowTopbar = !(
    props.route.name === 'AccountScreen' ||
    props.route.name === 'ProductScreen' ||
    props.route.name === 'Loyalty'
  )

  useEffect(() => {
    TouchID.isSupported()
      .then((type) => {
        setTypeFaceId(type)
      })
      .catch((e) => {
        Utils.bioError(e)
      })
  }, [])

  useEffect(() => {
    if (authUser && loading) {
      setLoading(false)
      if (props.route.name && props.route.name !== 'AuthScreen') {
        // EventEmitter.emit(Config.EVENT_NAMES.user_change_tab, { route: props.route.name })
        Navigation.replace(props.route.name)
      } else if (props.route.params.nextSceen && props.route.params.nextSceen !== 'AuthByPin') {
        // nếu chuyển qua từ màn login pin
        // EventEmitter.emit(Config.EVENT_NAMES.user_change_tab, { route: props.route.params.nextSceen })
        Navigation.replace(props.route.params.nextSceen)
      } else {
        Navigation.pop()
      }
    }
  }, [authUser])

  useEffect(() => {
    if (authError && loading) {
      setLoading(false)
    }
  }, [authError])

  // useEffect(() => {
  //   if (user.loginSecurityType === appTypes.SECURITY_TYPE.FP) {
  //     onShowBioAuthen()
  //   }
  // }, [])

  useFocusEffect(
    useCallback(() => {
      if (user.loginSecurityType === appTypes.SECURITY_TYPE.FP) {
        onShowBioAuthen()
      }
      return () => {}
    }, [])
  )

  const onShowBioAuthen = () => {
    TouchID.authenticate('', {})
      .then(() => {
        setLoading(true)
        dispatch(
          loginOperations.authUserbyFP({
            uiid: Utils.getUserDeviceID(),
            activeCode: user.activeCode,
            version: DeviceInfo.getVersion(),
          })
        )
      })
      .catch((e) => {
        Utils.bioError(e)
      })
  }

  const getOtp = () => {
    if (!pass) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    setLoading(true)
    dispatch(
      loginOperations.authUser({
        userNameOrMobile: user.userName,
        password: pass,
        activeCode: user.activeCode,
        uiid: Utils.getUserDeviceID(),
        version: DeviceInfo.getVersion(),

      })
    )
  }

  const turnOnFPLogin = () => {
    storeService.getAuthBioKey().then((pin) => {
      if (pin) {
        onShowBioAuthen()
      } else {
        TouchID.isSupported()
          .then(() => {
            showFPPopup(true)
          })
          .catch((e) => {
            Utils.bioError(e)
          })
      }
    })
  }

  const forgotPass = () => {
    Navigation.push('ForgotScreen')
  }
  const onSignup = () => {
    EventEmitter.emit(Config.EVENT_NAMES.user_reactive)
  }
  const onShowPass = () => {
    showPass(!isShowPass)
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

  const isDisableFPLogin = user.securityTypeMB === appTypes.SECURITY_TYPE.FP
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
              opacity: isShowTopbar ? 1 : 0,
            }}
            onPress={(isShowTopbar ? () => Navigation.pop() : null)}
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
        <Avatar user={user} size={180} />
        <Text style={styles.user}>{I18n.t('main.welcome')}</Text>
        <Text
          style={[
            styles.user,
            { color: Colors.primary2, marginTop: Metrics.small * 0.7, fontWeight: 'bold' },
          ]}
        >
          {user.fullName}
        </Text>
        <View style={[Helpers.fill, Helpers.crossCenter]}>
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
              maxLength={30}
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity onPressIn={() => showPass(false)} onPressOut={() => showPass(true)}>
              <Icon name="icon-show" size={14} color={isShowPass ? Colors.primary2 : Colors.gray} />
            </TouchableOpacity>
          </View>
          <View style={[Helpers.row, Helpers.contentWidth, { marginTop: Metrics.normal }]}>
            <Button
              onPress={getOtp}
              loading={loading}
              color={Colors.primary2}
              indicatorStyle={styles.indicator}
              style={styles.buttonLogin}
            >
              <Text style={styles.textLogin}>{I18n.t('action.action_login').toUpperCase()}</Text>
            </Button>
            <Button
              disabled={isDisableFPLogin}
              onPress={() => turnOnFPLogin()}
              color={isDisableFPLogin ? '#BDBDBD' : Colors.primary2}
              style={styles.biometricButton}
            >
              <Icon
                name={typeFaceId === 'FaceID' ? 'account_face' : 'biometric'}
                size={20}
                color={Colors.white}
              />
            </Button>
          </View>
          <View
            style={[
              { marginTop: Metrics.medium, marginHorizontal: Metrics.medium },
              Helpers.fillColCross,
            ]}
          >
            <TouchableOpacity onPress={forgotPass}>
              <Text style={styles.forgotText}>{I18n.t('login.forgot')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSignup}>
              <Text style={styles.forgotText}>{I18n.t('login.switch_account')}</Text>
            </TouchableOpacity>
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
      <BioConfirmPopup
        visible={isVisibleFP}
        handleModal={() => showFPPopup(false)}
        onConfirm={onShowBioAuthen}
      />
    </>
  )
}

export default AuthScreen
