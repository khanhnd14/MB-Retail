import React, { useState, useEffect } from 'react'
import {
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Verify } from '../../../components'
import { Colors, Helpers } from '../../../theme'
import { settingOperations } from '../../../state/setting'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import { Utils } from '../../../utilities'
import { appTypes } from '../../../state/application'

const ChangePassOTP = ({ route }) => {
  const { oldPassword, newPassword } = route.params
  const { userName, securityTypeMB, loginSecurityType } = useSelector((state) => state.user)

  const dispatch = useDispatch()
  const { sendOtpComplete, changePassComplete, changePassError } = useSelector(
    (state) => state.setting
  )
  const { sessionId } = sendOtpComplete || {}
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading && changePassComplete) {
      setLoading(false)
      Navigation.pop()
      Utils.showToast(I18n.t('setting.change_pass_success'))
      if (loginSecurityType === appTypes.SECURITY_TYPE.FP || securityTypeMB === appTypes.SECURITY_TYPE.FP) {
        dispatch(settingOperations.updatePrivateKeyFP({
          username: userName,
          password: newPassword,
        }))
      }
    }
  }, [changePassComplete])

  useEffect(() => {
    if (loading && changePassError) {
      setLoading(false)
      if (changePassError.status !== '230') {
        Navigation.popToPop()
        const params = { }
        Navigation.push('Failed', params)
      }
    }
  }, [changePassError])

  const sendOtp = (pin) => {
    setLoading(true)
    const params = { sessionId, oldPassword, newPassword, otp: pin }
    dispatch(settingOperations.changePass(params))
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('setting.change_pass')} isBottomSubLayout background={Colors.white} />
      <Verify
        data={sendOtpComplete}
        loading={loading}
        onComplete={sendOtp}
      />
    </View>
  )
}

export default ChangePassOTP
