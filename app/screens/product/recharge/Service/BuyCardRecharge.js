import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18n from '../../../../translations'
import { Topbar, HeaderTop, SelectAccount, Radio, ConfirmButton, TextInput, SelectSupplier, Toast, Text } from '../../../../components'
import styles from './styles'
import { Colors, Metrics } from '../../../../theme'
import { Utils } from '../../../../utilities'
import { userOperations } from '../../../../state/user';
import { productOperations } from '../../../../state/product';
import * as Navigation from '../../../../navigation'
import SelectPayment from '../../../../components/SelectPayment'

const BuyCardRecharge = ({ route }) => {
  const { title } = route.params
  const { email, mobile } = useSelector((state) => state.user)
  const {
    account,
    loading,
    completedOtpRecharge,
    servicesList,
    serviceProvider
  } = useSelector((state) => state.product)
  const mobileServiceList = React.useMemo(() => serviceProvider[_.findIndex(serviceProvider, (e) => e.groupType === '0')], [serviceProvider])
  const { handleSubmit, register, errors, setValue, getValues } = useForm()
  const dispatch = useDispatch()
  const [rolloutAccountNo, setRolloutAccountNo] = React.useState(null)
  const [isCheckedEmail, setIsCheckedEmail] = React.useState(false)
  const [isCheckedPhone, setIsCheckedPhone] = React.useState(false)
  const [service, setService] = React.useState({})
  const [phoneCard, setPhoneCard] = React.useState()
  const [emailInput, setEmailInput] = React.useState('')
  const [phoneInput, setPhone] = React.useState('')

  const refToast = React.useRef()

  // lấy ra service đc chọn từ list service
  const selectedService = React.useMemo(() => mobileServiceList.serviceList[_.findIndex(mobileServiceList.serviceList, (e) => e.serviceId === service)], [service])
  const onSubmit = (data) => {
    const body = {
      serviceId: service,
      contractNo: selectedService.serviceName,
      amount: phoneCard.value,
      tranDate: Utils.toStringServerDate(new Date()),
      isSchedule: false,
      rolloutAccountNo,
      category: selectedService.category,
      cardName: phoneCard.label
    }
    const category = selectedService?.category.split('|')[0]
    const amount = phoneCard?.label

    if (isCheckedEmail) body.rechargeCardEmail = emailInput || email
    if (isCheckedPhone) body.rechargeCardSms = phoneInput || mobile

    Navigation.push('BuyCardConfirmScreen', {
      title: I18n.t('product.title_buy_card_recharge'),
      pRolloutAccountNo: rolloutAccountNo,
      category,
      amount,
      selectedService,
      email: isCheckedEmail ? (emailInput || email) : undefined,
      mobile: isCheckedPhone ? (phoneInput || mobile) : undefined,
      service,
      phoneCard,
      rolloutAccountNo
    })
  }

  const onSelectRolloutAccountNo = (val) => {
    setRolloutAccountNo(val)
  }

  const onSelectItemService = (val) => {
    setValue('supply', val)
    setService(val)
  }

  const onSelectPhoneCard = (val) => {
    setValue('payment', val)
    setPhoneCard(val)
  }

  const onChangeEmail = (text) => {
    if (text) {
      setIsCheckedEmail(true)
      setEmailInput(text)
    } else {
      setIsCheckedEmail(false)
    }
  }

  const onChangePhone = (text) => {
    if (text) {
      setIsCheckedPhone(true)
      setPhone(text)
    } else {
      setIsCheckedPhone(false)
    }
  }

  React.useEffect(() => {
    register('supply', {
      required: {
        value: true,
        message: `${I18n.t('product.service_list.error')} ${I18n.t('product.title_supplier')}`
      }
    })
    register('payment', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_payment')
      }
    })
    register('supply', {
      required: {
        value: true,
        message: `${I18n.t('product.service_list.error')} ${I18n.t('product.title_supplier')}`
      }
    })
    register('emailOrPhone', {
      required: {
        value: true,
        message: I18n.t('product.required_phone_email')
      }
    })
  }, [register])

  React.useEffect(() => {
    const keys = Object.keys(errors)
    console.log('====================================');
    console.log(errors);
    console.log('====================================');
    if (keys.length) {
      refToast.current.show(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

  React.useEffect(() => {
    dispatch(userOperations.getInfoUser())
  }, [])

  React.useEffect(() => {
    const category = selectedService?.category.split('|')[0]
    const amount = phoneCard?.label
    if (completedOtpRecharge) {
      Navigation.push('BuyCardConfirmScreen', {
        title: I18n.t('product.title_buy_card_recharge'),
        pRolloutAccountNo: rolloutAccountNo,
        category,
        amount,
        selectedService,
        email: isCheckedEmail ? (emailInput || email) : undefined,
        mobile: isCheckedPhone ? (phoneInput || mobile) : undefined
      })
    }
  }, [completedOtpRecharge])

  React.useEffect(() => {
    if (email) {
      setValue('emailOrPhone', mobile)
      setIsCheckedEmail(!isCheckedEmail)
    }
  }, [email])

  React.useEffect(() => {
    if (isCheckedEmail && (emailInput || email)) {
      setValue('emailOrPhone', true)
    } else if (isCheckedPhone && (phoneInput || mobile)) {
      setValue('emailOrPhone', true)
    }
  }, [isCheckedEmail, isCheckedPhone, emailInput, phoneInput])

  return (
    <View style={styles.container}>
      <Topbar subTitle={title} title={I18n.t('product.recharge')} />
      <KeyboardAwareScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <SelectSupplier data={mobileServiceList?.serviceList} onSelectItemService={onSelectItemService} serviceNameFill="" label={I18n.t('product.type_card')} />
          <SelectPayment onSelectPayment={onSelectPhoneCard} />
          <View style={{ ...styles.cardContainer, borderBottomWidth: 0 }}>
            <Text style={styles.title}>{I18n.t('product.title_send_card')}</Text>

            <View
              style={styles.sendCardContainer}
            >

              <Radio
                checked={isCheckedEmail}
                onPress={() => {
                  setIsCheckedEmail(!isCheckedEmail)
                }}
              />
              <View style={styles.sendCardChild}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: Metrics.tiny }}>Email:</Text>
                <TextInput
                  onChangeText={onChangeEmail}
                  defaultValue={email}
                  style={styles.input}
                />
              </View>
            </View>
            <View
              style={styles.sendCardContainer}
            >

              <Radio
                checked={isCheckedPhone}
                onPress={() => {
                  setIsCheckedPhone(!isCheckedPhone)
                }}
              />
              <View style={styles.sendCardChild}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: Metrics.tiny }}>Số điện thoại:</Text>
                <TextInput
                  onChangeText={onChangePhone}
                  defaultValue={mobile}
                  style={styles.input}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Toast ref={refToast} position="bottom" />
      <ConfirmButton onPress={() => handleSubmit(onSubmit)()} loading={loading} style={styles.buttonConfirm} />
    </View>
  )
}

export default BuyCardRecharge
