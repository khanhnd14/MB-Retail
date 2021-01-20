/* eslint-disable no-param-reassign */
import React, { useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import I18n from 'i18n-js'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import Input from './Input'
import { Metrics, Colors } from '../../theme'
import Select from './Select'
import { Text } from '..'
import Checkbox from '../Checkbox'
import { Utils } from '../../utilities'
import { ekycOperations } from '../../state/ekyc'

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
    borderRadius: Metrics.tiny * 2.5,
    borderColor: Colors.primary2,
  },
  subCheckbox: {
    backgroundColor: Colors.primary2,
    width: Metrics.tiny * 4,
    height: Metrics.tiny * 4,
    borderRadius: Metrics.tiny * 2
  },
  txtCheckbox: {
    marginLeft: Metrics.tiny,
    color: Colors.black1
  },
  intro: {
    textAlign: 'center',
    paddingHorizontal: Metrics.medium * 4,
    paddingVertical: Metrics.normal * 2,
    color: Colors.black1
  },
  form: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.normal,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal,
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
const CustomerInfo2 = forwardRef(({ numberPhone, toastAlert, showAlert, setAdditionInfoForm, additionInfoForm, customerInfoForm, setDisableButton }, ref) => {
  const [mapRef, setMapRef] = React.useState(undefined)
  const [, setAddress] = React.useState(undefined)
  const [, setEmail] = React.useState(undefined)

  const [errorEmail, setErrorEmail] = React.useState('')

  const { handleSubmit, register, errors, setValue, getValues } = useForm()
  const values = getValues()
  const { dataOtpVerified, errorAdditionInfo, resultEkycSdk } = useSelector((state) => state.ekyc)
  const addressRef = useRef(null)
  const refEmail = useRef()
  const dispatch = useDispatch()
  const infos = useMemo(() => {
    const obj = {}
    resultEkycSdk.frontCardImage.cardInfoResult.infos.map((value, index) => {
      obj[value.field] = value.value
    })
    return obj
  }, [resultEkycSdk])

  const onChoiceCheckbox = (key, value) => {
    console.log('====================================');
    console.log(key, value);
    console.log('====================================');
    if (value) {
      setMapRef(key)
    } else {
      setMapRef(null)
    }
  }

  const onSubmit = (data) => {
    if (!mapRef) {
      showAlert(true, I18n.t('ekyc.alert'), I18n.t('ekyc.customer_info.salary_required'))
      return
    }
    delete data.numberphone
    console.log(data, mapRef);
    const { token } = dataOtpVerified
    const { email, currentAddress } = data

    setAdditionInfoForm({ ...data, mapRef })
    dispatch(ekycOperations.saveAdditionInfo(token, email, currentAddress, mapRef))
  }

  const submit = () => {
    handleSubmit(onSubmit)()
  }

  const onChangeAddress = (text) => {
    setValue('currentAddress', text)
    setAddress(text)
  }

  const onFocusAddress = () => {
    if (customerInfoForm.address === values.currentAddress) {
      onChangeAddress('')
    }
  }

  const onChangeNumberPhone = (text) => {
    setValue('numberphone', text)
  }

  const onChangeEmail = (text) => {
    if (!Utils.getEmailRegex().test(text)) {
      setErrorEmail(I18n.t('ekyc.customer_info.email_required'))
    } else {
      setErrorEmail('')
    }
    setValue('email', text)
    setEmail(text)
  }

  useEffect(() => {
    register('currentAddress', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.address_required')
      }
    })
    register('numberphone')
    register('email', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.info_invalid')
      },
      pattern: {
        value: Utils.getEmailRegex(),
        message: I18n.t('ekyc.customer_info.email_required')
      },
    })
  }, [register])

  React.useEffect(() => {
    const keys = Object.keys(errors)
    console.log('====================================');
    console.log(errors);
    console.log('====================================');
    if (keys.length) {
      toastAlert(errors[keys[0]]?.message, 3000)

      setTimeout(() => {
        if (keys[0] === 'email') {
          refEmail.current.focus()
        }
      }, 1000);
    }
  }, [errors])

  useImperativeHandle(ref, () => ({

    submit,

  }));

  useEffect(() => {
    setDisableButton(true)
    return () => {
      setDisableButton(false)
    }
  }, [])

  useEffect(() => {
    // nếu có đủ thông tin và validate email hợp lệ thì enable button
    if ((values.currentAddress && values.email && mapRef) && Utils.getEmailRegex().test(values.email)) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [values.currentAddress, values.email, mapRef])

  useEffect(() => {
   if (customerInfoForm && !additionInfoForm) {
    onChangeAddress(customerInfoForm.address)
   }
  }, [customerInfoForm])

  useEffect(() => {
    if (additionInfoForm) {
      setTimeout(() => {
        onChoiceCheckbox(additionInfoForm.mapRef, true)
        onChangeEmail(additionInfoForm.email)
        onChangeAddress(additionInfoForm.currentAddress)
      }, 500);
    }
  }, [additionInfoForm])

  return (
    <>

      <Text style={styles.intro}>{I18n.t('ekyc.customer_info.addition_intro')}</Text>

      <View style={styles.form}>
        <Input
          label={I18n.t('ekyc.customer_info.addition_address')}
          isNormal
          onChangeText={onChangeAddress}
          ref={addressRef}
          defaultValue={getValues().currentAddress}
          onFocus={onFocusAddress}
          multiline
          autoCompleteType="off"
          style={{
            height: Utils.getRatioDimension(70)
            // flexShrink: 1
          }}
        />
        <Input
          label={I18n.t('ekyc.customer_info.addition_phone')}
          value={numberPhone}
          isNormal
          onChangeText={onChangeNumberPhone}
          disable
          style={{ color: Colors.gray }}
        />
        <Input
          label={I18n.t('ekyc.customer_info.addition_email')}
          isNormal
          onChangeText={onChangeEmail}
          ref={refEmail}
          error={errorEmail || (errors.email && errors.email.message)}
          defaultValue={getValues().email}
          placeholder="someone@gmail.com"
          keyboardType="email-address"
          autoCompleteType="off"
        />
        <Text style={[styles.label, { paddingLeft: Metrics.normal, paddingTop: Metrics.normal }]}>{I18n.t('ekyc.customer_info.addition_income')}</Text>
        <View style={styles.income}>

          {
            dataOtpVerified?.lstComboEmployment.map((value, index) => (
              <TouchableOpacity key={index} onPress={() => onChoiceCheckbox(value.code, true)} style={styles.checkboxButton}>
                <Checkbox
                  name={value.code}
                  checked={mapRef === value.code}
                  onChange={onChoiceCheckbox}
                  style={styles.checkbox}
                  size={Metrics.tiny * 5}
                  color={Colors.white}
                >
                  <View style={styles.subCheckbox} />
                </Checkbox>
                <Text style={styles.txtCheckbox}>{value.name}</Text>
              </TouchableOpacity>
              ))
          }
        </View>
      </View>
    </>
    )
})
export default CustomerInfo2
