import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Verify, Topbar } from '../../components'
import { Colors, Helpers } from '../../theme'
import { qrcodeOperations } from '../../state/qrcode'
import * as Navigation from '../../navigation'
import { QRCODE_SEND_OTP_COMPLETED, QRCODE_SEND_OTP_FAILED } from '../../state/qrcode/types'

const styles = StyleSheet.create({})

const QrcodeVerify = ({ route }) => {
  const [loading, setLoading] = useState(false)
  const { sendOtpResult, parseQrCodeResult, completeRechargeError, completeRechargeResult } = useSelector((state) => state.qrcode)
  const dispatch = useDispatch()

  const sendOtp = (pin) => {
    const { jsonQr } = route.params
    const param = {
      tokenTransaction: sendOtpResult.tokenTransaction,
      sessionId: sendOtpResult.sessionId || '0',
      otpInput: pin,
      payContentdtl: jsonQr,
      merchantId: parseQrCodeResult.merchantId,
      addinfo: parseQrCodeResult.addinfo || '',
      qrType: parseQrCodeResult.qrType,
      merchantName: parseQrCodeResult.merchantName,
      billNo: parseQrCodeResult.billOrProductId || '',
      tag62: parseQrCodeResult.tag62 || '',
    }
    console.log('====================================');
    console.log(param);
    console.log('====================================');
    setLoading(true)
    dispatch(qrcodeOperations.completeQrcodeRecharge(param))
  }
  // unmount
  useEffect(() => () => {
      dispatch([{
        type: QRCODE_SEND_OTP_COMPLETED,
        payload: null
      }, {
        type: QRCODE_SEND_OTP_FAILED,
        payload: null
      }])
  }, [])

  useEffect(() => {
    if (completeRechargeError) {
      dispatch(qrcodeOperations.reset())
      Navigation.popToPop()
      Navigation.push('Failed')
      setLoading(false)
    }
  }, [completeRechargeError])

  useEffect(() => {
    const { amount, discount } = route.params
    if (completeRechargeResult) {
      dispatch(qrcodeOperations.reset())
      Navigation.popToPop()
      Navigation.push('QrcodeSuccess', {
        ...completeRechargeResult.data,
        payment: discount || amount,
        service: parseQrCodeResult.purpose,
        merchant: parseQrCodeResult.merchantName,
        redoTransaction: 'ScanQrScreen',
        tokenTransaction: sendOtpResult.tokenTransaction,
      })
      setLoading(false)
    }
  }, [completeRechargeResult])

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title="OTP" isBottomSubLayout background={Colors.white} />
      <Verify
        data={sendOtpResult}
        loading={loading}
        onComplete={sendOtp}
      />
    </View>
  )
}

export default QrcodeVerify
