/* eslint-disable no-shadow */

import React, { forwardRef, useImperativeHandle, useEffect, useRef, useMemo } from 'react'
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import I18n from 'i18n-js'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import Input from './Input'
import Checkbox from '../Checkbox'
import { Colors, Metrics } from '../../theme'
import { DatePicker, Text } from '..'
import { Utils } from '../../utilities'
import { ekycOperations } from '../../state/ekyc'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  txtCheckbox: {
    marginLeft: Metrics.tiny
  },
  intro: {
    textAlign: 'center',
    paddingHorizontal: Metrics.medium * 5,
    paddingVertical: Metrics.normal
  },
  form: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.normal,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal,
  },
  gender: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.normal * 2,
    paddingTop: Metrics.normal
  },
  label: {
    color: Colors.primary2,
    fontWeight: 'bold'
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
  disableCheckbox: {
    width: Utils.getWindowWidth(),
    height: Metrics.normal * 3,
    position: 'absolute',
    backgroundColor: Colors.transparent,
    zIndex: 999
  }
})

const CustomerInfo = forwardRef(({ showAlert, onBack, toastAlert, setCustomerInfoForm, customerInfoForm, setDisableButton }, ref) => {
  const [mapRef, setMapRef] = React.useState(undefined)
  const [address, setAddress] = React.useState('')

  const { handleSubmit, register, errors, setValue, getValues } = useForm()
  const { dataOtpVerified, resultEkycSdk, errorVerifyCustomer, requestIdDetail } = useSelector((state) => state.ekyc)
  const dispatch = useDispatch()
  const refName = useRef(null)
  const refAddress = useRef(null)
  const refIdentifier = useRef(null)
  const infos = useMemo(() => {
    const obj = {}
    resultEkycSdk?.frontCardImage.cardInfoResult.infos.map((value, index) => {
      obj[value.field] = value.value
    })
    return obj
  }, [resultEkycSdk])
  const infosBackcard = useMemo(() => {
    const obj = {}
    if (resultEkycSdk?.backCardImage) {
      resultEkycSdk?.backCardImage?.cardInfoResult?.infos.map((value, index) => {
        obj[value.field] = value.value
      })
    }
    return obj
  }, [resultEkycSdk])

  const onSubmit = (data) => {
    const { token } = dataOtpVerified
    const { fullname, identifier, birthday, gender, address } = data
    const idType = infos.card_type
    const idNumber = identifier
    const nationality = infos.nationality === 'Việt Nam'.toUpperCase() ? 'VN' : (infos.nationality || infos.passport_code)
    const dob = Utils.toStringServerDate(Utils.toDateObject(infos.dob)) || Utils.toStringServerDate(getValues().birthday)
    // const dob = Utils.toStringServerDate(new Date())
    const registedAddress = address
    const imageFront = resultEkycSdk?.frontCardImage.idFrontImage
    const imageBack = resultEkycSdk?.backCardImage?.idBackImage
    const idFace = resultEkycSdk?.selfieImage.selfieImage
    const idDate = infosBackcard.issue_date || infos.issue_date // issuePlace
    const issuePlace = infosBackcard.issue_place
    const idExpireDate = infos.expiry_date ? infos.expiry_date : Utils.toStringServerDate(new Date(new Date().setFullYear(new Date().getFullYear() + 15)))

    setCustomerInfoForm(data)
    const body = {
      token,
      fullName: fullname,
      idType,
      idNumber,
      nationality,
      dob,
      gender: mapRef.toString() === '1' ? 'M' : 'F',
      registedAddress,
      imageFront,
      imageBack,
      idFace,
      idDate,
      idExpireDate,
      issuePlace,
      requestIdDetail
    }
    dispatch(ekycOperations.verifyCustomerInfo(body))
  }

  const submit = () => {
    handleSubmit(onSubmit)()
  }

  const onChoiceCheckbox = (number, value) => {
    console.log('====================================');
    console.log(number, value);
    console.log('====================================');
    if (typeof number === 'string' && !value) {
      setMapRef(null)
      setValue('gender', null)
    } else {
      setMapRef(number)
      setValue('gender', number)
    }
  }

  const onChangeName = (text) => {
    setValue('fullname', text)
  }

  const onChangeIdentifier = (text) => {
    setValue('identifier', text)
  }

  const onChangeAddress = (text) => {
    setValue('address', text)
    setAddress(text)
  }

  const onFocusAddress = () => {
    refAddress.current.clear()
    onChangeAddress('')
    setAddress('')
  }

  const reActionForm = () => {
    onBack()
  }

  const onClosePopup = () => {
    Navigation.replace('Welcome')
  }

  useImperativeHandle(ref, () => ({

    submit,
    reActionForm

  }));

  useEffect(() => {
    register('fullname', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.fullname_required')
      }
    })
    register('identifier', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.identifier_required')
      }
    })
    register('birthday')
    register('gender', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.gender_required')
      }
    })
    register('address', {
      required: {
        value: true,
        message: I18n.t('ekyc.customer_info.address_required')
      }
    })
  }, [register])

  React.useEffect(() => {
    const keys = Object.keys(errors)
    console.log('====================================');
    console.log(errors);
    console.log('====================================');
    if (keys.length) {
      toastAlert(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

  useEffect(() => {
    if (errorVerifyCustomer) {
      const data = errorVerifyCustomer.response ? errorVerifyCustomer.response.data : errorVerifyCustomer
      // check time out
      if (!errorVerifyCustomer.code || errorVerifyCustomer.code !== 'ECONNABORTED') {
        showAlert(true, I18n.t('ekyc.alert'), data.message, () => onClosePopup)
      } else {
        showAlert(true, I18n.t('ekyc.alert'), I18n.t('ekyc.sdk_error.system_error'), () => onClosePopup)
      }
    }
  }, [errorVerifyCustomer])

  useEffect(() => {
    if (infos) {
      infos.gender ? infos.gender === 'NAM' ? onChoiceCheckbox(String(1), 'Nam') : onChoiceCheckbox(String(0), 'Nữ') : () => {}
      setValue('gender', infos.gender)
      setValue('fullname', infos.name)
      setValue('identifier', infos.id)
      setValue('address', infos.address || infos.native_place)
      setAddress(infos.address || infos.native_place)
    }
  }, [infos])

  useEffect(() => {
    if (getValues().fullname && getValues().identifier && getValues().gender && getValues().address) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [address, mapRef])

  useEffect(() => {
    if (customerInfoForm) {
      setValue('identifier', customerInfoForm.identifier)
      onChangeAddress(customerInfoForm.address)
      if (customerInfoForm.gender === '1') {
        onChoiceCheckbox(String(1), 'Nam')
      } else if (customerInfoForm.gender === '0') {
        onChoiceCheckbox(String(0), 'Nữ')
      }
    }
  }, [customerInfoForm])

  useEffect(() => {
    setDisableButton(true)
    return () => {
      setDisableButton(false)
    }
  }, [])

  console.log('====================================');
  console.log(infos, getValues(), mapRef, errors);
  console.log('====================================');

  return (
    <>
      <Text style={styles.intro}>{I18n.t('ekyc.customer_info_intro')}</Text>
      <View style={styles.form}>
        <Input disable style={{ color: Colors.gray9 }} value={infos.name} ref={refName} onChangeText={onChangeName} label={I18n.t('ekyc.customer_info.fullname')} placeholder="Nguyễn Văn A" />
        <Input disable style={{ color: Colors.gray9 }} value={getValues().identifier} ref={refIdentifier} onChangeText={onChangeIdentifier} label={I18n.t('ekyc.customer_info.identifier')} placeholder="031614513215" />
        {/* <Input style={{ color: Colors.gray9 }} defaultValue={getValues().identifier} ref={refIdentifier} onChangeText={onChangeIdentifier} label={I18n.t('ekyc.customer_info.identifier')} placeholder="031614513215" /> */}
        <View style={styles.gender}>
          <Text style={styles.label}>{I18n.t('ekyc.customer_info.birthday')}</Text>
          {/* <DatePicker
            dateStyle={{ color: Colors.black, fontWeight: 'normal', alignSelf: 'flex-end' }}
            style={{ flex: 1 }}
            date={getValues().birthday || Utils.toDateObject(infos.dob)}
            onPressConfirm={(date) => {
              setValue('birthday', date)
            }}
          /> */}
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ color: Colors.gray9 }}>{Utils.toStringServerDate(Utils.toDateObject(infos.dob))}</Text>
          </View>
        </View>
        <View style={styles.gender}>
          <Text style={styles.label}>{I18n.t('ekyc.customer_info.gender')}</Text>
          <TouchableOpacity disabled={infos.gender === 'NỮ'} onPress={() => onChoiceCheckbox(String(1), 'Nam')} style={styles.checkboxButton}>
            <Checkbox
              name="1"
              checked={mapRef === '1'}
              onChange={onChoiceCheckbox}
              style={styles.checkbox}
              size={Metrics.tiny * 5}
              color={Colors.white}
              disabled={infos.gender === 'NỮ'}
            >
              <View style={styles.subCheckbox} />
            </Checkbox>
            <Text style={styles.txtCheckbox}>{I18n.t('ekyc.login_info.male')}</Text>

          </TouchableOpacity>
          {infos.gender && (
            <View style={styles.disableCheckbox} />
            )}

          <TouchableOpacity disabled={infos.gender === 'NAM'} onPress={() => onChoiceCheckbox(String(0), 'Nữ')} style={styles.checkboxButton}>
            <Checkbox
              name="0"
              checked={mapRef === '0'}
              onChange={onChoiceCheckbox}
              style={styles.checkbox}
              size={Metrics.tiny * 5}
              color={Colors.white}
              disabled={infos.gender === 'NAM'}
            >
              <View style={styles.subCheckbox} />
            </Checkbox>
            <Text style={styles.txtCheckbox}>{I18n.t('ekyc.login_info.Female')}</Text>
          </TouchableOpacity>
        </View>
        <Input
          defaultValue={getValues().address}
          ref={refAddress}
          onChangeText={onChangeAddress}
          inputStyle={{ borderBottomWidth: 0 }}
          multiline
          label={I18n.t('ekyc.customer_info.address')}
          onFocus={onFocusAddress}
          style={{
            height: Utils.getRatioDimension(70)
            // flexShrink: 1
          }}
        />
      </View>

    </>
    )
})

export default CustomerInfo
