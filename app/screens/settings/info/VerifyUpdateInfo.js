import React, { useState, useEffect } from 'react'
import {
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Colors, Helpers } from '../../../theme'
import { transferOperations } from '../../../state/transfer'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'

const VerifyUpdateInfo = () => {
  const { transferConfirm, type, transferComplete, transferError } = useSelector(
    (state) => state.transfer
  )
  const { sessionId, tokenTransaction, securityType } = transferConfirm || {}
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading && transferComplete) {
      setLoading(false)
      const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
      const params = { ...transferConfirm, ...transferComplete, redoTransaction }
      Navigation.popToPop()
      Navigation.push('TransferSuccess', params)
    }
  }, [transferComplete])

  useEffect(() => {
    if (loading && transferError) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
      const params = { ...transferConfirm, ...transferComplete, redoTransaction }
      Navigation.push('Failed', params)
    }
  }, [transferError])

  function sendOtp(pin) {
    console.log('otppppp:', pin)

    setLoading(true)
    const body = {
      tokenTransaction,
      sessionId: sessionId || '0',
      otpInput: pin,
    }
    dispatch(transferOperations.transfer(type, body))
  }

  const resend = () => {}

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title="OTP" isBottomSubLayout background={Colors.white} />
      <Verify
        data={transferConfirm}
        loading={loading}
        onComplete={sendOtp}
      />
    </View>
  )
}

export default VerifyUpdateInfo
