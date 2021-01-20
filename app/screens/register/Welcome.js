import React from 'react'
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import I18n from '../../translations'
import { Images, Colors, Metrics, Helpers } from '../../theme'
import { Utils } from '../../utilities'
import { Text } from '../../components'
import homeStyle from '../home/HomeScreenStyle'
import * as Navigation from '../../navigation'
import { appOperations, appTypes } from '../../state/application'
import { Config } from '../../config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    alignSelf: 'center',
  },
  logo: {
    width: 170,
    height: 80,
    alignSelf: 'center',
    marginTop: Metrics.normal * 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Utils.getWindowWidth(),
    paddingVertical: Metrics.medium,
    paddingHorizontal: Metrics.medium,
  },
  textFooter: {
    color: Colors.white,
    fontSize: 12,
  },
  buttonGroup: {
    alignSelf: 'center',
    paddingTop: Utils.getWindowHeight() / 2,
  },
  button: {
    paddingHorizontal: Metrics.medium * 1.5,
    paddingVertical: Metrics.small * 0.9,
    borderRadius: Metrics.medium * 2,
    marginVertical: Metrics.tiny,
    backgroundColor: Colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: Colors.white,
    fontSize: 15,
  },
  english: {
    position: 'absolute',
    top: Metrics.normal * 4,
    right: Metrics.normal * 2,
  },
})

const Welcome = () => {
  const { language } = useSelector((state) => state.application)
  const languageIcon = language === appTypes.LANGUAGE_CODE.VI ? Images.uk_white : Images.vn_white

  const dispatch = useDispatch()

  const onLogin = () => {
    Navigation.replace('LoginScreen')
    dispatch(appOperations.introComplete())
  }
  const onRegister = async () => {
    // const isBool = await Utils.isDate()
    // if (isBool) {
    //   Utils.alert(I18n.t('ekyc.alert'), Utils.compS(Config.stringekyc, '122'), () => {})
    //   return
    // }
    
    Navigation.replace('Register')
    dispatch(appOperations.introComplete())
  }
  const changeLanguage = () => {
    if (language === appTypes.LANGUAGE_CODE.VI) {
      dispatch(appOperations.updateLanguage(appTypes.LANGUAGE_CODE.EN))
    } else {
      dispatch(appOperations.updateLanguage(appTypes.LANGUAGE_CODE.VI))
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={Images.bgHome} style={styles.image}>
        <View style={{ flex: 1 }}>
          <View style={styles.logo}>
            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              source={Images.ekyc_logo}
            />
          </View>
          <TouchableOpacity style={styles.english} onPress={changeLanguage}>
            <Image
              resizeMode="contain"
              source={languageIcon}
              style={{
                height: Metrics.small * 1.4,
                width: Metrics.small * 2.4,
                marginTop: Metrics.tiny,
              }}
            />
          </TouchableOpacity>

          <Text style={styles.text}>{I18n.t('welcome.title')}!</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={onLogin} style={[styles.button]}>
              <Text style={styles.buttonText}>{I18n.t('welcome.login').toLocaleUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRegister} style={[styles.button]}>
              <Text style={styles.buttonText}>
                {I18n.t('welcome.register').toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.textFooter}>{I18n.t('welcome.copyright')}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Welcome
