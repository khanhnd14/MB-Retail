import * as React from 'react'
import { useState, Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, View, ImageBackground, Image, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import I18n from 'i18n-js'
import { ScrollView } from 'react-native-gesture-handler';
import { Helpers, Metrics, Colors, ApplicationStyles, Images } from '../../../theme'
import { Text, ConfirmButton, Verify, Topbar, Loader } from '../../../components'
import * as Navigation from '../../../navigation'
import { productOperations } from '../../../state/product'
import { Utils } from '../../../utilities'
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import { odSavingOperations } from '../../../state/overdraftSaving'


const CreateODVerify = () => {
  const reset = () => {
    // console.log('goi reset data o day');
  }
  const dispatch = useDispatch()
  const { sendOTPOnly, completeRegister, completeRegisterError } = useSelector((state) => state.overdraft)
  // const [checked, setCheck] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSetup, setIsSetup] = useState(false)
  React.useEffect(() => {
    setLoading(false)
    if (isSetup) {
      setIsSetup(false)
      if (completeRegister) {
        Navigation.popToPop()
        Navigation.push('CreateODSuccessScreen', {
          title: 'CreateODSuccessScreen',
redoTransaction: 'ODServiceScreen',
          onSwitchTransaction: reset
        })
      } else {
        Navigation.popToPop()
        Navigation.push('Failed', {
          title: 'CreateODSuccessScreen',
redoTransaction: 'ODServiceScreen',
          onSwitchTransaction: reset
        })
      }
    }
  }, [completeRegister])

  React.useEffect(() => {
    setLoading(false)
    if (isSetup && completeRegisterError) {
      Navigation.popToPop()
      Navigation.push('Failed', {
        title: 'CreateODSuccessScreen',
        redoTransaction: 'ODServiceScreen',
        onSwitchTransaction: reset
      })
    }
  }, [completeRegisterError])

  function sendOtp(pin) {
    const body = {
      tokenTransaction: sendOTPOnly.tokenTransaction,
      sessionId: sendOTPOnly.sessionId || '0',
      otpInput: pin,
    }
    setIsSetup(true)
    setLoading(true)
    dispatch(odSavingOperations.completeRegister(body))
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify data={sendOTPOnly} loading={loading} onComplete={sendOtp} />
    </View>
  )
}

export default CreateODVerify
