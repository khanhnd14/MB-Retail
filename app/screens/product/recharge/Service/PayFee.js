import * as React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { useForm } from 'react-hook-form';
import I18n from '../../../../translations'
import { Topbar, HeaderTop, SelectAccount, Radio, ConfirmButton, ModalSelect, DatePicker, AmountInputText, SelectSupplier, Toast, TextInput, Text } from '../../../../components'
import styles from './styles'
import { Colors, Metrics, Helpers } from '../../../../theme'
import { Utils } from '../../../../utilities'
import { productOperations } from '../../../../state/product'
import * as Navigation from '../../../../navigation'
import SelectPayment from '../../../../components/SelectPayment';

const PayFee = ({ route }) => {
  const { title } = route.params
  const { handleSubmit, register, errors, setValue } = useForm()

  const account = useSelector((state) => state.product.account)
  const {
    loading,
    servicesList,
    completedOtpRecharge
  } = useSelector((state) => state.product)
  const mobileServiceList = React.useMemo(() => servicesList[_.findIndex(servicesList, (e) => e.groupType === '5')], [servicesList])
  const refToast = React.useRef()
  const dispatch = useDispatch()

  const [pRolloutAccountNo, setPRolloutAccountNo] = React.useState(null)
  const [service, setService] = React.useState({})
  const [code, setCode] = React.useState(0)
  const [amount, setAmount] = React.useState(0)
  const [date, setDate] = React.useState(new Date())
  const selectedService = React.useMemo(() => mobileServiceList?.serviceList[_.findIndex(mobileServiceList?.serviceList, (e) => e.serviceId === service)], [service])

  const onSelectRolloutAccountNo = (val) => {
    setPRolloutAccountNo(val)
  }
  const onSelectItemService = (val) => {
    setValue('supply', val)
    setService(val)
  }

  const onSelectPhoneCard = (val) => {
    setValue('payment', val)
    setAmount(val)
  }

  const onChangCode = (val) => {
    setValue('customerCode', val)
    setCode(val)
  }

  const onSubmit = () => {
    const body = {
      serviceId: service,
      contractNo: code,
      tranDate: Utils.toStringServerDate(date),
      tranLimit: '01',
      isSchedule: false,
      pRolloutAccountNo,
      amount: amount.value,
    }
    console.log('====================================');
    console.log(body, selectedService);
    console.log('====================================');
    Navigation.push('BuyGameCardConfirmScreen', {
      title,
      pRolloutAccountNo,
      serviceName: selectedService.serviceName,
      contractNo: code,
      amount: amount.value,
      tranDate: date,
      selectedService,
      ...body
    })
  }

  React.useEffect(() => {
    register('supply', {
      required: {
        value: true,
        message: `${I18n.t('product.service_list.error')} ${I18n.t('product.title_supplier')}`
      }
    })
    register('customerCode', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_customer_code')
      }
    })
    register('payment', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_payment')
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

  return (
    <View style={styles.container}>
      <Topbar title={I18n.t('product.recharge')} />
      <HeaderTop title={title} />
      <ScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />

        <View style={styles.contentLayout}>
          <SelectSupplier data={mobileServiceList?.serviceList} onSelectItemService={onSelectItemService} serviceNameFill="" />
          <View style={[styles.element]}>
            <View style={Helpers.fill}>
              <Text style={styles.title}>{I18n.t('product.customer_code')}</Text>
              <TextInput
                onChangeText={onChangCode}
                style={styles.amountBold}
                returnKeyType="done"
                placeholder={I18n.t('product.input_customer_code')}
              />
            </View>
          </View>
          <SelectPayment onSelectPayment={onSelectPhoneCard} />
          <View style={{ ...styles.timeContainer }}>
            <Text style={styles.title}>{I18n.t('transfer.time')}</Text>
            <DatePicker
              date={date}
              selectDate={date}
              style={styles.dateSchedule}
              onPressConfirm={(val) => setDate(val)}
              dateStyle={{
                fontWeight: 'normal',
                fontSize: 14,
              }}
            />
          </View>
        </View>
      </ScrollView>
      <Toast ref={refToast} position="bottom" />
      <ConfirmButton onPress={() => handleSubmit(onSubmit)()} loading={loading} style={styles.buttonConfirm} />
    </View>
  )
}

export default PayFee
