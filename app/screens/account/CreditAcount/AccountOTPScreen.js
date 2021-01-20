import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Topbar, Verify } from '../../../components'
import { Helpers, Colors } from '../../../theme'
import { cardChangeStatus, getCardList, getCardListFull } from '../../../state/account/actions'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { MAKE_TRANSACTION_ACCOUNT_COMPLETED, PASSED_CARD_CURRENT_ACCOUNT_SELECT, PASSED_CARD_INPUT_AMOUNT_PAY, RESET_STORE, SEND_OTP_COMPLETED } from '../../../state/account/types'
import { Utils } from '../../../utilities'
import { accountOperations } from '../../../state/account'

const AccountOTPScreen = ({ route }) => {
  const { type, amount, customerInfo, toTime } = route.params
  const { loading,
    transAccountComplete,
    cardChangeComplete,
    cardChangeError,
    cardPrePayApi,
    currentAccountSelected,
    currentContractNumber,
    payApiCompleted,
    payApiFailed
  } = useSelector(
    (state) => state.account
  )
  const dispatch = useDispatch()
  const { sessionId } = transAccountComplete || {}

  function sendOtp(otp) {
    switch (type) {
      case 'PeopleCardCredit': {
        const body = {
          acctNo: currentAccountSelected,
          contractNoEncode: currentContractNumber,
          amount,
          isOption: true,
          toTime: toTime || '',
          isConfirm: true,
          otpInput: otp,
          sessionId: cardPrePayApi?.sessionId,
          tokenTransaction: cardPrePayApi?.tokenTransaction,
        }
        dispatch(accountOperations.sendCardPayAPI(body))
      }

      break;

      default:
        Utils.showLoading()
        dispatch(cardChangeStatus({
          contractNumber: route.params.contractNumber,
          status: 'UNLOCK',
          sessionId,
          otpInput: otp
        }))
        Navigation.pop()
        break;
    }
  }

  const reset = () => {
    dispatch([
      {
        type: PASSED_CARD_CURRENT_ACCOUNT_SELECT,
        payload: null
      },
      {
        type: PASSED_CARD_INPUT_AMOUNT_PAY,
        payload: null
      },
    ])
  }

  React.useEffect(() => {
    if (payApiCompleted) {
      Navigation.popToPop()
      Navigation.navigate('SuccessScreen', {
        amount,
        customerInfo,
        titleServices: I18n.t('account.title_payment_card'),
        hideEmail: true,
        hideSaveInfo: true,
        typeService: '4',
        redoTransaction: 'CreditScreen',
        onSwitchTransaction: reset
      })
      dispatch(accountOperations.setAccountCard())
    }
  }, [payApiCompleted])

  useEffect(() => {
    if (payApiFailed) {
      if (payApiFailed.status === '230') {
        return
      }
      Navigation.popToPop()
      Navigation.push('FailedScreen', {
        redoTransaction: 'CreditScreen',
        onSwitchTransaction: reset
      })
    }
  }, [payApiFailed])

  // unmout
  useEffect(() => {
    () => {
      dispatch([
        {
          type: SEND_OTP_COMPLETED,
          payload: null
        },
        {
          type: MAKE_TRANSACTION_ACCOUNT_COMPLETED,
          payload: null
        }
      ])
    }
  }, [])

  console.log('====================================');
  console.log('cardPrePayApi', cardPrePayApi);
  console.log('====================================');

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('application.verify')} isBottomSubLayout background={Colors.white} />
      <Verify
        data={transAccountComplete || cardPrePayApi}
        loading={loading}
        onComplete={sendOtp}
      />
    </View>
  )
}

export default AccountOTPScreen
