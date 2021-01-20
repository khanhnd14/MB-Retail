import React, { } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Helpers, Colors } from '../../../theme'
import { cardChangeStatus } from '../../../state/account/actions'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { RESET_STORE } from '../../../state/account/types'

const BillPaymentOTPScreen = ({ route }) => {
  const { loading, transAccountComplete, cardChangeComplete, cardChangeError } = useSelector(
    (state) => state.account
  )
  const dispatch = useDispatch()
  const { sessionId } = transAccountComplete || {}

  const resetStore = () => {
    dispatch({ type: RESET_STORE })
  }

  function sendOtp(otp) {
    dispatch(cardChangeStatus({
      contractNumber: route.params.contractNumber,
      status: 'UNLOCK',
      sessionId,
      otpInput: otp
    }))
  }
  React.useEffect(() => {
    if (cardChangeComplete) {
      Navigation.push('SuccessChangeStatusScreen', { route })
      resetStore()
    }
  }, [cardChangeComplete])

  React.useEffect(() => {
    if (cardChangeError) Navigation.push('FailedScreen')
    resetStore()
  }, [cardChangeError])

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify
        data={transAccountComplete}
        loading={loading}
        onComplete={sendOtp}
      />
    </View>
  )
}

export default BillPaymentOTPScreen
