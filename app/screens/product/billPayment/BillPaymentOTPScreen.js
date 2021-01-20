import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Helpers, Colors } from '../../../theme'
import { productOperations } from '../../../state/product'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'

const BillPaymentOTPScreen = ({ route }) => {
  const getCheckBillPayload = useSelector((state) => state.product.checkPayBill)
  const { completedOtp, loading, errorCompletedOtp } = useSelector((state) => state.product)
  const { sessionId, tokenTransaction } = getCheckBillPayload || {}
  const dispatch = useDispatch()

  function sendOtp(otp) {
    const body = {
      tokenTransaction,
      sessionId: sessionId || '0',
      otpInput: otp,
    }
    dispatch(productOperations.sendOtp(body))
  }
  React.useEffect(() => {
    if (completedOtp) {
      Navigation.popToPop()
      Navigation.push('SuccessScreen', {
        ...route.params,
        tokenTransaction,
        hideSaveInfo: true,
        typeModule: 'BP',
        redoTransaction: 'HistoryBillPayment',
        ...completedOtp
      })
    }
  }, [completedOtp])

  React.useEffect(() => {
    if (errorCompletedOtp) {
      if (errorCompletedOtp.status === '230') {
        return
      }
      Navigation.popToPop()
      Navigation.push('FailedScreen')
    }
  }, [errorCompletedOtp])

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify data={getCheckBillPayload} loading={loading} onComplete={sendOtp} />
    </View>
  )
}

export default BillPaymentOTPScreen
