/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useCallback } from 'react'
import { View, Platform, BackHandler,Alert } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch, useSelector } from 'react-redux'
import EventEmitter from 'react-native-eventemitter'
import { useFocusEffect } from '@react-navigation/native'
import DeviceInfo from 'react-native-device-info'
import { useBackHandler } from '@react-native-community/hooks'
import { Helpers } from '../../theme'
import MainTab from './MainTab'
import HomeScreen from '../home/HomeScreen'
import AccountScreen from '../account/AccountScreen'
import Loyalty from '../loyalty/Loyalty'
import ProductScreen from '../product/ProductScreen'
import SettingScreen from '../settings/SettingScreen'
import styles from './MainScreenStyle'
import { appOperations, appTypes } from '../../state/application'
import { versionOperations } from '../../state/version'
import { Config } from '../../config'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import { Loader } from '../../components'
import MenuTranslate from '../intro/MenuTranslate'
import { withAuthentication } from '../../enhancers'
import { storeService } from '../../services'
import UpdateVesion from './UpdateVesion'
import Clipboard from '@react-native-community/clipboard';

var isFocusScreen = false
const MainScreen = () => {
  const { showTooltip, isUpdatePushId, isUpdateFireBaseId, fireBaseToken } = useSelector((state) => state.application)
  const { activeCode } = useSelector((state) => state.user)
  const { versionComplete } = useSelector((state) => state.version)

  const user = useSelector((state) => state.user)
  const { loginSecurityType } = user || {}

  const Tab = createBottomTabNavigator()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showUpdate, setUpdate] = useState(false)

  useEffect(() => {
    eventBinding()
    return () => {
      unEventBinding()
    }
  }, [])

  useEffect(() => {
    if (versionComplete) {
      setUpdate(versionComplete.isForceUpdate)
    }
  }, [versionComplete])

  useFocusEffect(
    useCallback(() => {
      isFocusScreen = true
      return () => {
        isFocusScreen = false
      }
    }, [])
  )

  useBackHandler(() => {
    if (isFocusScreen) {
      BackHandler.exitApp()
      return true
    }
    return false
  })
  useEffect(() => {
    updateNotifyId()
  }, [])

  useEffect(() => {
    dispatch(
      versionOperations.getData({
        activeCode,
        version: DeviceInfo.getVersion(),
        osName: Platform.OS,
      })
    )
  }, [])

  useEffect(() => {
    if (user) {
      storeService.setListModule(user)
    }
  }, [user])

  const updateNotifyId = async () => {
    
    const fbToken = await storeService.getFireBaseId()
    // Clipboard.setString(fbToken)
    // Alert.alert(fbToken)
    let isTokenChange = false
    if (fbToken !== fireBaseToken && fbToken !== null) {
      isTokenChange = true
    }
    if (!isUpdatePushId || !isUpdateFireBaseId || isTokenChange) {
      const pushId = await storeService.getPushId()
      dispatch(
        appOperations.updatePushIdServer({
          uniqueId: Utils.getUserDeviceID(),
          pushId,
          code: 'MB',
          fireBaseToken: fbToken
        })
      )
     }
  }

  const onUserLogOut = () => {
    dispatch(appOperations.reactive())
    Navigation.resetTo('LoginScreen')
  }

  const signOut = (param) => {
    const title = I18n.t('application.title_alert_warning')
    const message = param ? param.message : I18n.t('application.message_signout')
    Utils.confirm(title, message, () => onUserLogOut())
  }

  const unAuthorize = () => {
    if (!isFocusScreen) {
      Navigation.popToPop()
      setTimeout(() => {
        dispatch(appOperations.logout())
        if (loginSecurityType === appTypes.SECURITY_TYPE.PIN) {
          Navigation.push('AuthByPin')
        } else {
          Navigation.push('AuthScreen')
        }
      }, 300)
    }
  }

  const showLoading = ({ isLoading }) => {
    setLoading(isLoading)
  }

  const eventBinding = () => {
    EventEmitter.on(Config.EVENT_NAMES.user_reactive, signOut)
    EventEmitter.on(Config.EVENT_NAMES.user_signout, unAuthorize)
    EventEmitter.on(Config.EVENT_NAMES.user_loading, showLoading)
  }

  const unEventBinding = () => {
    EventEmitter.removeListener(Config.EVENT_NAMES.user_reactive, signOut)
    EventEmitter.removeListener(Config.EVENT_NAMES.user_signout, unAuthorize)
    EventEmitter.removeListener(Config.EVENT_NAMES.user_loading, showLoading)
  }

  const initRoute = 'HomeScreen'
  return (
    <View style={[Helpers.fill, styles.container]}>
      <Tab.Navigator initialRouteName={initRoute} tabBar={(prop) => <MainTab {...prop} />}>
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="AccountScreen" component={withAuthentication(AccountScreen)} />
        <Tab.Screen name="ProductScreen" component={withAuthentication(ProductScreen)} />
        <Tab.Screen name="Loyalty" component={withAuthentication(Loyalty)} />
        <Tab.Screen name="SettingScreen" component={SettingScreen} />
      </Tab.Navigator>
      {showTooltip && <MenuTranslate />}
      <Loader modalVisible={loading} />
      {showUpdate && <UpdateVesion link={versionComplete.appLink} />}
    </View>
  )
}
export default MainScreen
