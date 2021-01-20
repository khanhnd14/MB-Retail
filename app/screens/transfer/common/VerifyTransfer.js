import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Colors, Helpers } from '../../../theme'
import { transferOperations } from '../../../state/transfer'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'

const VerifyTransfer = () => {
  const {
    sendOtpOnlyComplete,
    type,
    transferComplete,
    transferError,
    transferConfirm,
  } = useSelector((state) => state.transfer)
  const { sessionId, tokenTransaction } = sendOtpOnlyComplete || {}
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading && transferComplete) {
      setLoading(false)
      const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
      const params = { type, ...transferConfirm, ...transferComplete, redoTransaction }
      Navigation.popToPop()
      Navigation.push('TransferSuccess', params)
    }
  }, [transferComplete])

  useEffect(() => {
    if (loading && transferError) {
      const { isAxiosError, code } = transferError
      console.log('codecode:', code)
      setLoading(false)
      if (transferError.status !== '230') {
        if (isAxiosError && code === 'ECONNABORTED') {
          const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
          const params = {
            type,
            ...transferConfirm,
            ...transferComplete,
            redoTransaction,
            hideTitle: true,
            paramsMessage: I18n.t('application.mess_timeout'),
            showButton: false
          }
          Navigation.popToPop()
          Navigation.push('TransferSuccess', params)
        } else if (transferError.status === '202') {
          const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
          const params = {
            type,
            ...transferConfirm,
            ...transferComplete,
            redoTransaction,
            hideTitle: true,
          }
          Navigation.popToPop()
          Navigation.push('TransferSuccess', params)
        } else {
          Navigation.popToPop()
          const redoTransaction = type === 'N' ? 'InternalTransfer' : 'InterbankTransfer'
          const params = { type, ...transferConfirm, ...transferComplete, redoTransaction }
          Navigation.push('Failed', params)
        }
      }
    }
  }, [transferError])

  function sendOtp(pin) {
    setLoading(true)
    const body = {
      tokenTransaction,
      sessionId: sessionId || '0',
      otpInput: pin,
    }
    dispatch(transferOperations.transfer(type, body))
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify data={sendOtpOnlyComplete} loading={loading} onComplete={sendOtp} />
    </View>
  )
}

export default VerifyTransfer
