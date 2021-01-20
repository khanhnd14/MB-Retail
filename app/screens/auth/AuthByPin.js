/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import I18n from '../../translations'
import { Helpers, Colors, Metrics } from '../../theme'
import { loginOperations } from '../../state/login'
import { Utils } from '../../utilities'
import { Topbar, PinCode, Text } from '../../components'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
  },
  skipButton: {
    marginBottom: Metrics.medium * 2,
    padding: Metrics.small,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    color: Colors.textBlack,
  },
})

const AuthByPin = (props) => {
  const { activeCode, userName } = useSelector((state) => state.user)
  const { authUser, authError } = useSelector((state) => state.login)
  const pinRef = useRef(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const isShowTopbar = !(
    props.route.name === 'AccountScreen' ||
    props.route.name === 'ProductScreen' ||
    props.route.name === 'Loyalty'
  )

  useEffect(() => {
    if (authUser && loading) {
      setLoading(false)
      if (props.route.name && props.route.name !== 'AuthByPin') {
        Navigation.replace(props.route.name)
      } else {
        Navigation.pop()
      }
    }
  }, [authUser])

  useEffect(() => {
    if (authError && loading) {
      setLoading(false)
      pinRef.current && pinRef.current.newAttempt()
    }
  }, [authError])

  const complete = (pin) => {
    setLoading(true)
    dispatch(
      loginOperations.authUserByPin({
        pinCode: pin,
        activeCode,
        userNameOrMobile: userName,
        uiid: Utils.getUserDeviceID(),
        version: DeviceInfo.getVersion(),
      })
    )
  }
  const onSkip = () => {
    Navigation.replace('AuthScreen', { nextSceen: props.route.name })
  }

  return (
    <Fragment>
      <Topbar
        title={I18n.t('vefiry.title')}
        isBottomSubLayout
        background={Colors.white}
        leftIcon={isShowTopbar ? 'icon-back' : null}
        onLeftPress={isShowTopbar ? () => Navigation.pop() : null}
        rightIcon={isShowTopbar ? 'icon-home' : null}
      />
      <View style={[Helpers.fill, styles.container]}>
        <PinCode
          loading={loading}
          ref={pinRef}
          styleContainer={Helpers.fill}
          status="enter"
          sentenceTitle={I18n.t('vefiry.enter_pin')}
          endProcess={(val) => complete(val)}
        />
        {isShowTopbar && (
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.text}>{I18n.t('login.login_pass')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Fragment>
  )
}

export default AuthByPin
