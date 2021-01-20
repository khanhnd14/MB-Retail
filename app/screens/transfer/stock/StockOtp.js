/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Colors, Metrics, Helpers } from '../../../theme'
import { transferStockOperations } from '../../../state/stocktransfer'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'

const StockOtp = (props) => {
  const { stockCode } = props.route.params
  const { otpDataComplete, transferComplete, transferError } = useSelector(
    (state) => state.stocktransfer
  )
  const { sessionId, tokenTransaction, securityType } = otpDataComplete || {}
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading && transferComplete) {
      setLoading(false)
      const redoTransaction = 'StockTransfer'
      const params = { ...otpDataComplete, ...transferComplete, redoTransaction }
      Navigation.popToPop()
      Navigation.push('TransferSuccess', params)
    }
  }, [transferComplete])

  useEffect(() => {
    if (loading && transferError) {
      setLoading(false)
      if (transferError.status !== '230') {
        Navigation.popToPop()
        const redoTransaction = 'StockTransfer'
        const params = { ...otpDataComplete, ...transferComplete, redoTransaction }
        Navigation.push('Failed', params)
      }
    }
  }, [transferError])

  function sendOtp(pin) {
    setLoading(true)
    const body = {
      tokenTransaction,
      sessionId: sessionId || '0',
      otpInput: pin,
      stockCode,
    }
    dispatch(transferStockOperations.transfer(body))
  }

  const resend = () => {}

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title="OTP" isBottomSubLayout background={Colors.white} />
      <Verify loading={loading} onComplete={sendOtp} data={otpDataComplete} />
    </View>
  )
}

export default StockOtp
