import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../components'
import { Colors, Helpers } from '../../theme'
import I18n from '../../translations'
import * as Navigation from '../../navigation'
import { overdraftOperations } from '../../state/overdraftstaff'

const OverDraftVerify = ({ route }) => {
  const { completeData, completeError, prepareData } = useSelector(
    (state) => state.overdraftstaff
  )
  const { params } = route
  const { sessionId, tokenTransaction } = prepareData || {}
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading && completeData) {
      setLoading(false)
      Navigation.popToPop()
      Navigation.push('OverDraftSuccess', { onSwitchTransaction: () => {} })
    }
  }, [completeData])

  useEffect(() => {
    if (loading && completeError) {
      setLoading(false)
      if (completeError.status !== '230') {
        Navigation.popToPop()
        const params = { }
        Navigation.push('Failed', params)
      }
    }
  }, [completeError])

  function sendOtp(pin) {
    setLoading(true)
    const body = {
      tokenTransaction,
      sessionId: sessionId || '0',
      otpInput: pin,
    }
    dispatch(overdraftOperations.completeRegister(body))
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('overdraft.title')} isBottomSubLayout background={Colors.white} />
      <Verify data={prepareData} loading={loading} onComplete={sendOtp} />
    </View>
  )
}

export default OverDraftVerify
