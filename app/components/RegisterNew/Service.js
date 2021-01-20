/* eslint-disable no-shadow */
import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import Input from './Input'
import { Metrics, Colors } from '../../theme'
import { Text } from '..'
import { Utils } from '../../utilities'
import { ekycOperations } from '../../state/ekyc'
import * as Navigation from '../../navigation'
import * as ekycTypes from '../../state/ekyc/types'

const styles = StyleSheet.create({
  input: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'red',
    paddingVertical: 0
  },
  checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  checkbox: {
    backgroundColor: '#FFFFFF',
    color: Colors.white,
    borderRadius: Metrics.tiny * 2,
    borderColor: Colors.primary2,
  },
  subCheckbox: {
    backgroundColor: Colors.primary2,
    width: Metrics.tiny * 3,
    height: Metrics.tiny * 3,
    borderRadius: Metrics.tiny * 1.5
  },
  txtCheckbox: {
    marginLeft: Metrics.tiny,
    color: Colors.black1
  },
  intro: {
    textAlign: 'center',
    paddingHorizontal: Metrics.medium * 4,
    paddingVertical: Metrics.normal,
    color: Colors.black1
  },
  form: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.normal,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal,
    paddingBottom: Metrics.normal
  },
  income: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.normal * 2,
    paddingVertical: Metrics.normal
  },
  label: {
    color: Colors.primary2,
    fontWeight: 'bold',
  }
})
const Service = forwardRef(({ openCard, showAlert, numberPhone, setDisableButton, setLoading, setLoadingSdkColor }, ref) => {
  const { handleSubmit, register, errors, setValue, getValues } = useForm()
  const { dataOtpVerified, formAdditionInfo, choiceBranch, choiceCombo, resultRegister, errorRegister, resultCheckUsername, errorCheckUsername } = useSelector((state) => state.ekyc)
  const values = getValues()
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [username, setUsername] = useState(numberPhone)
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const [errorUsername, setErrorUsername] = useState(null)
  const [errorPassword, setErrorPassword] = useState(null)
  const [errorRePassword, setErrorRePassword] = useState(null)

  const onSubmit = (data) => {
    const { userName, password, confirmPassword } = data
    const { token } = dataOtpVerified
    if (password !== confirmPassword) {
      showAlert(true, I18n.t('ekyc.alert'), I18n.t('ekyc.login_info.password_not_match'))
      return
    }
    dispatch(ekycOperations.checkUsername(userName, token))
    // set giá trị cho form để check có register ko
    setData(data)
  }

  const submit = () => {
    handleSubmit(onSubmit)()
  }

  const onChangeUsername = (text) => {
    setUsername(text)
    setValue('userName', text)
    if (Utils.getUsernameRegex().test(text)) {
      setErrorUsername(null)
    } else {
      setErrorUsername(I18n.t('ekyc.login_info.error_username'))
    }
  }

  const onChangePassword = (text) => {
    setValue('password', text)
    setPassword(text)
    if (Utils.getPasswordRegex().test(text)) {
      setErrorPassword(null)
    } else {
      setErrorPassword(I18n.t('ekyc.login_info.error_password'))
    }
  }

  const onChangeRePassword = (text) => {
    setValue('confirmPassword', text)
    setRePassword(text)
    if (Utils.getPasswordRegex().test(text)) {
      setErrorRePassword(null)
    } else {
      setErrorRePassword(I18n.t('ekyc.login_info.error_password'))
    }
  }

  const onFocusUserName = () => {
    if (username === numberPhone) {
      onChangeUsername('')
    }
    if (!Utils.getUsernameRegex().test(username)) {
      setErrorUsername(I18n.t('ekyc.login_info.error_username'))
    }
  }

  const onFocusPassword = () => {
    if (!Utils.getPasswordRegex().test(password)) {
      setErrorPassword(I18n.t('ekyc.login_info.error_password'))
    }
  }

  const onFocusRePassword = () => {
    if (!Utils.getPasswordRegex().test(rePassword)) {
      setErrorRePassword(I18n.t('ekyc.login_info.error_password'))
    }
  }

  const onBlurUserName = () => {
    if (Utils.getUsernameRegex().test(username)) {
      setErrorUsername(null)
      const { token } = dataOtpVerified
      setLoadingSdkColor('rgba(0,0,0,0.6)')
      setLoading(true)
      dispatch(ekycOperations.checkUsername(username, token))
    }
  }

  const onBlurPassword = () => {
    if (Utils.getPasswordRegex().test(password)) {
      setErrorPassword(null)
    }
  }

  const onBlurRePassword = () => {
    if (Utils.getPasswordRegex().test(rePassword)) {
      setErrorRePassword(null)
    }
  }

  const onClosePopup = () => {
    Navigation.replace('Welcome')
  }

  useImperativeHandle(ref, () => ({

    submit,

  }));

  useEffect(() => {
    register('userName', {
      required: {
        value: true,
        message: I18n.t('ekyc.login_info.error_username')
      },
      pattern: {
        value: Utils.getUsernameRegex(),
        message: I18n.t('ekyc.login_info.error_username')
      },
    })
    register('password', {
      required: {
        value: true,
        message: I18n.t('ekyc.login_info.error_password')
      },
      pattern: {
        value: Utils.getPasswordRegex(),
        message: I18n.t('ekyc.login_info.error_password')
      },
    })
    register('confirmPassword', {
      required: {
        value: true,
        message: I18n.t('ekyc.login_info.error_password')
      },
      pattern: {
        value: Utils.getPasswordRegex(),
        message: I18n.t('ekyc.login_info.error_password')
      },
    })
  }, [register])

  useEffect(() => {
    const keys = Object.keys(errors)
    console.log('====================================');
    console.log('errors', errors);
    console.log('====================================');
  }, [errors])

  useEffect(() => {
    if (errorRegister) {
      setLoading(false)
      if (errorRegister.status === '408' || errorRegister.status === '401') {
        showAlert(true, I18n.t('ekyc.alert'), errorRegister.message, () => onClosePopup)
      } else {
        showAlert(true, I18n.t('ekyc.alert'), errorRegister.message)
        dispatch({
          type: ekycTypes.RESET_CHECK_USERNAME,
          payload: null
        })
        // nếu đăg ký lỗi thì reset giá trị form
        setData(null)
      }
    }
  }, [errorRegister])

  useEffect(() => {
    if (resultRegister) {
      setLoading(false)
    }
  }, [resultRegister])

  useEffect(() => {
    if (resultCheckUsername) {
      !data && setLoading(false)

      const { token, xRequest } = dataOtpVerified
      const retryStep = errorRegister?.data?.retryStep
      const retryId = errorRegister?.data?.retryId
      const comboCode = choiceCombo.code
      const branchCode = choiceBranch.code
      data && dispatch(ekycOperations.sendRegister({
        token,
        comboCode,
        branchCode,
        userName: data.userName,
        password: data.password,
        openCard,
        retryId,
        retryStep,
        xRequest
      })
    )
    }
  }, [resultCheckUsername])

  useEffect(() => {
    if (errorCheckUsername) {
      setLoading(false)

      setErrorUsername(I18n.t('ekyc.login_info.exist_username'))
      // nếu đã tồn tại username thì phải nhập lại form
      if (data) {
        setData(null)
      }
    }
  }, [errorCheckUsername])

  useEffect(() => {
    if (numberPhone) {
      onChangeUsername(numberPhone)
    }
  }, [numberPhone])

  console.log('====================================');
  console.log(values, errorUsername, errorPassword, errorRePassword, data);
  console.log('====================================');
  useEffect(() => {
    // nếu  các trường đều có giá trị và không có lỗi validate nào và 2 password match nhau thì enable button
    if ((values.userName && values.password && values.confirmPassword) && (!errorUsername && !errorPassword && !errorRePassword) && (values.password === values.confirmPassword)) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [values])

  return (
    <>

      <View style={styles.form}>
        <Input
          label={I18n.t('ekyc.login_info.username')}
          isNormal
          error={(errors?.userName && errors.userName.message) || errorUsername}
          onChangeText={onChangeUsername}
          defaultValue={username}
          onFocus={onFocusUserName}
          onBlur={onBlurUserName}
          value={username}
          returnKeyType="done"
        />
        <Input
          label={I18n.t('ekyc.login_info.password')}
          isNormal
          secureTextEntry
          error={(errors.password && errors.password.message) || errorPassword}
          onChangeText={onChangePassword}
          onFocusPassword
          onFocus={onFocusPassword}
          onBlur={onBlurPassword}
        />
        <Input
          label={I18n.t('ekyc.login_info.re_password')}
          isNormal
          secureTextEntry
          onChangeText={onChangeRePassword}
          error={(errors.confirmPassword && errors.confirmPassword.message) || errorRePassword}
          onFocus={onFocusRePassword}
          onBlur={onBlurRePassword}
        />

      </View>
    </>
    )
})
export default Service
