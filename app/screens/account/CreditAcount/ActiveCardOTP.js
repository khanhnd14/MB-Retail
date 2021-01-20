import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Helpers, Colors } from '../../../theme'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { CHANGE_STATUS_ACTIVE_CARD_COMPLETED, MAKE_TRANSACTION_ACCOUNT_ACTIVE_CARD_COMPLETED, SEND_OTP_ACTIVE_CARD_COMPLETED } from '../../../state/account/types'
import { accountOperations } from '../../../state/account'
import { Utils } from '../../../utilities'

const ActiveOTPScreen = ({ route }) => {
  const { creditItem } = route.params
  const { loading,
    payApiFailed,
    sendOtpActiveCard,
  } = useSelector(
    (state) => state.account
  )
  const dispatch = useDispatch()

  function sendOtp(otp) {
    const body = {
      contractNumber: creditItem?.contractNumber,
      status: 'ACTV',
      sessionId: sendOtpActiveCard?.sessionId,
      otpInput: otp
    }
    Utils.showLoading()
    Navigation.pop()
    dispatch(accountOperations.changeStatusActiveCard(body))
  }

  const reset = () => {
    dispatch([
      {
        type: MAKE_TRANSACTION_ACCOUNT_ACTIVE_CARD_COMPLETED,
        payload: null
      },
      {
        type: SEND_OTP_ACTIVE_CARD_COMPLETED,
        payload: null
      },
      {
        type: CHANGE_STATUS_ACTIVE_CARD_COMPLETED,
        payload: null
      },
    ])
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify
        data={{
          securityType: sendOtpActiveCard?.securityType,
          tokenTransaction: sendOtpActiveCard?.transaction,
          qrString: sendOtpActiveCard?.qrString
        }}
        loading={loading}
        onComplete={sendOtp}
      />
    </View>
  )
}

export default ActiveOTPScreen
