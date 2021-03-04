/* eslint-disable no-bitwise */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import 'react-native-gesture-handler'
import './translations'
import { View, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import EventEmitter from 'react-native-eventemitter'
import OneSignal from 'react-native-onesignal' // Import package from node modules
import DeviceInfo from 'react-native-device-info'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage'
import JailMonkey from 'jail-monkey'
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'

import Clipboard from '@react-native-community/clipboard'
import AppStateListener from './AppStateListener'
import configureStore from './store/configureStore'
import { SplashScreen } from './screens'
import { routes } from './routes'
import { navigationRef, popToPop, push, resetTo } from './navigation'
import { Helpers, Images } from './theme'
import { storeService } from './services'
import { Config } from './config'
import { appOperations } from './state/application'

import { Toast } from './components'
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { userOperations } from './state/user'
import { Utils } from './utilities'
import MainAlert from './screens/main/MainAlert'

const App = () => {
  const [storeCreated, setStoreCreated] = useState(false)
  // const [storeRehydrated, setStoreRehydrated] = useState(false)
  const [store, setStore] = useState(null)
  const [initScreen, setInitScreen] = useState(routes.Welcome.name)
  const [openedNoti, setOpenedNoti] = useState(null)
  const Stack = createStackNavigator()
  const refToast = useRef()

  useEffect(() => {
    if (store) {
      initData()
    }
  }, [store])

  useEffect(() => {
    navigationOnReady()
  }, [openedNoti])

  useEffect(() => {
    eventBinding()
    return () => {
      unEventBinding()
    }
  }, [])

  useEffect(() => {
    PushNotification.configure({
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification(notification) {
        push('NotificationScreen')
      },
    })

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { notification } = remoteMessage
      const { body, title } = notification || {}
      PushNotification.localNotification({
        autoCancel: false,
        bigText: '',
        subText: '',
        title,
        message: body,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
      })
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // push('NotificationScreen')
    })

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          // push('NotificationScreen')
        }
      })
  }, [])

  useEffect(() => {
    async function fetStore() {
      const isJailBreak = await JailMonkey.isJailBroken()
      if (isJailBreak) {
        showAlertJailBreak()
      }
      const storeReceive = await configureStore((_) => {
        // setStoreRehydrated(true)
      })
      setStore(storeReceive)
    }
    setTimeout(() => {
      fetStore().then(() => {
        initOneSignal()
        initFirebaseNotification()
      })
    }, 1500)
  }, [])

  async function initData() {
    const oldData = await storeService.migrate()
    if (oldData && oldData.activeCode) {
      store?.dispatch(userOperations.setUserInfo(oldData))
    }

    const { showIntro, isLogin, language } = store.getState().application
    store?.dispatch(appOperations.logout())
    store?.dispatch(appOperations.updateLanguage(language))
    const initRoute = showIntro
      ? routes.Welcome.name
      : isLogin
      ? routes.MainScreen.name
      : routes.LoginScreen.name
    setInitScreen(initRoute)
    setStoreCreated(true)
  }

  async function initOneSignal() {
    // Remove this method to stop OneSignal Debugging
    OneSignal.setLogLevel(6, 0)
    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init(Config.APP_ID_ONESIGNAL, {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    })
    OneSignal.inFocusDisplaying(2) // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback)
    OneSignal.addEventListener('received', onReceived)
    OneSignal.addEventListener('opened', onOpened)
    OneSignal.addEventListener('ids', onIds)
  }

  function navigationOnReady() {
    if (openedNoti) {
      push('NotificationScreen', openedNoti)
    }
  }

  function onReceived(notification) {}

  function onOpened(openResult) {
    setOpenedNoti(openResult)
  }

  function onIds(device) {
    if (device) {
      storeService.setPushId(device.userId)
      // store.dispatch(appOperations.updatePushId(device.userId))
    }
  }

  function myiOSPromptCallback(permission) {
    // do something with permission value
  }

  const eventBinding = () => {
    EventEmitter.on(Config.EVENT_NAMES.user_toast, showToast)
  }
  const unEventBinding = () => {
    EventEmitter.removeListener(Config.EVENT_NAMES.user_toast, showToast)
  }

  const showToast = ({ message }) => {
    refToast.current && refToast.current.show(message, 3000)
  }

  function handleStartApp(lang) {
    if (store) {
      store?.dispatch(appOperations.logout())
      store?.dispatch(appOperations.updateLanguage(lang))
    }
  }

  async function handleActive() {
    const time = await storeService.getSessionTime()
    if (time > Config.SREEN_TIMEOUT) {
      if (store) {
        popToPop()
        EventEmitter.emit(Config.EVENT_NAMES.user_home)
        store?.dispatch(appOperations.logout())
      }
    }
    console.log('The application is now active!', time)
  }

  function handleBackground() {
    storeService.setSessionTime()
    console.log('The application is now in the background!')
  }

  function handleInactive() {
    storeService.setSessionTime()
    storeService.getBadge().then((result) => {
      Utils.setBadge(result)
    })
    console.log('The application is now inactive!')
  }

  /// /firebase setup
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    if (enabled) {
      console.log('Authorization status:', authStatus)
    }
  }

  // Listen to whether the token changes
  async function initFirebaseNotification() {
    requestUserPermission().then(() => {
      messaging()
        .getToken()
        .then((token) => {
          console.log(`token :${token}`)
          storeService.setFireBaseId(token)
          // Clipboard.setString(token)
        })
    })
  }

  const showAlertJailBreak = () => {
    Alert.alert(
      '',
      'Thiết bị của quý khách đã bị Root/Jailbreak. Do đó có thể xảy ra rủi ro về an toàn thông tin.\n Để đảm bảo giao dịch an toàn quý khách nên kiểm tra lại thiết bị',
      [
        {
          text: 'Đóng',
          onPress: () => {},
        },
      ],
      {
        cancelable: false,
      }
    )
  }

  if (!storeCreated) {
    return <SplashScreen />
  }

  return (
    <View style={Helpers.fill}>
      <AppStateListener
        onActive={handleActive}
        onBackground={handleBackground}
        onInactive={handleInactive}
      />
      <Provider store={store}>
        <NavigationContainer ref={navigationRef} onReady={navigationOnReady}>
          <Stack.Navigator
            initialRouteName={initScreen}
            screenOptions={{
              headerShown: false,
            }}
          >
            {Object.keys(routes).map((component, index) => (
              <Stack.Screen {...routes[component]} key={index.toString()} />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      <Toast ref={refToast} position="bottom" />
      <MainAlert />
    </View>
  )
}

export default App
