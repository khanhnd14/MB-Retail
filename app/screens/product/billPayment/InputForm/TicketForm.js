/* eslint-disable no-shadow */
import * as React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import I18n from '../../../../translations'
import { Metrics, Colors } from '../../../../theme'
import {
  Topbar,
  HeaderTop,
  SelectAccount,
  SelectSupplier,
  ConfirmButton,
  AmountInputText,
  DatePicker,
  Toast,
  EnterCustomersCode,
  Text,
} from '../../../../components'
import { productOperations } from '../../../../state/product'
import * as Navigation from '../../../../navigation'
import { transferSelectors } from '../../../../state/transfer'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.normal,
  },
  contentLayout: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.normal,
    paddingBottom: Metrics.normal,
    marginTop: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  btnLayout: {
    padding: Metrics.normal,
  },
  btn: {
    backgroundColor: Colors.primary2,
    height: 50,
    borderRadius: 38,
  },
  btnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  contentBold: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: Metrics.tiny / 2,
    marginHorizontal: Metrics.tiny
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
    marginHorizontal: Metrics.tiny
  },
  formAmount: {
    paddingVertical: Metrics.tiny,
    marginHorizontal: Metrics.tiny,
    fontSize: 12,
    paddingBottom: Metrics.normal,
  },
  wrapAmountInputGroup0: {
    marginTop: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray5
  },
  blockMargin: {
    marginBottom: Metrics.medium + (Metrics.tiny * 3) / 2
  },
  time: {
    marginVertical: Metrics.normal,
    marginHorizontal: Metrics.tiny,
    fontSize: 16
  },
  dateSchedule: {
    width: '100%',
    marginLeft: Metrics.tiny,
    paddingVertical: Metrics.tiny
  },
})

const TicketForm = ({ route }) => {
  const { groupType, serviceType, title, items, serviceList } = route.params
  const { checkBill, loading, account, checkPayBill } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const { handleSubmit, register, errors, setValue, getValues } = useForm()

  const [RolloutAccountNo, setRolloutAccountNo] = React.useState(null)
  const [supplyServiceId, setIsSupplyServiceId] = React.useState(false)
  const [customerCode, setCustomerCode] = React.useState('')
  const [amountInput, setAmountInput] = React.useState(null)
  const [amountInWord, setAmoutInWord] = React.useState(null)
  const [pIsSchedule, setPIsSchedule] = React.useState(false)
  const [customerName, setCustomerName] = React.useState(null)
  const [date, setDate] = React.useState(new Date())

  const refToast = React.useRef()

  const onChangeCustomerCode = (val) => {
    setValue('customerCode', val)
    setCustomerCode(val)
    if (!supplyServiceId) {
      refToast.current.show(I18n.t('product.service_list.error_supply'), 3000)
    }
  }

  const onSelectRolloutAccountNo = (acctNo) => {
    setValue('account', acctNo)
    setRolloutAccountNo(acctNo)
  }

  const onIsSchedule = (val) => {
    setPIsSchedule(val)
  }

  const onSelectItemService = (serviceId) => {
    setValue('supply', serviceId)
    setIsSupplyServiceId(serviceId)
  }

  const onAmoutChange = (val) => {
    setValue('payment', val.replace(/,/g, ''))
    setAmountInput(val.replace(/,/g, ''))
    setAmoutInWord(transferSelectors.amountToWord(val))
  }

  const onSubmit = (data) => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const { account, customerCode, payment, supply } = data
    const body = {
      serviceId: supply,
      contractNo: customerCode,
      amount: payment,
      tranDate: moment().format('DD/MM/YYYY'),
      isSchedule: pIsSchedule,
      rolloutAccountNo: account,
      paidBillCode: 0
    }
    dispatch(productOperations.checkPayBill(body))
  }

  React.useEffect(() => {
    dispatch(productOperations.getAccount())
    return () => {
      dispatch(productOperations.setCheckBill())
      dispatch(productOperations.setCheckPayBill())
    }
  }, [])

  React.useEffect(() => {
    if (checkBill) {
      console.log('====================================');
      console.log(checkBill);
      console.log('====================================');
      setValue('supply', serviceList[0]?.serviceId)
      setCustomerName(checkBill[0]?.customerName)
    }
  }, [checkBill])

  React.useEffect(() => {
    register('account', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_account')
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
    register('supply', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_supply')
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
    if (checkPayBill) {
      Navigation.navigate('BillPaymentOTPScreen',
        {
          amount: amountInput,
          customerInfo: customerCode,
          titleServices: title,
          typeService: groupType,
          content: I18n.t('product.bill_payment_success'),
        })
    }
  }, [checkPayBill])

  React.useEffect(() => {
    if (customerCode && supplyServiceId) {
      console.log('====================================');
      console.log('OK');
      console.log('====================================');
      dispatch(productOperations.getCheckBill(customerCode, supplyServiceId))
    }
  }, [customerCode, supplyServiceId])

  return (
    <View style={styles.container}>
      <Topbar subTitle={title} title={I18n.t('product.bill_payment')} />

      <ScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <SelectSupplier data={serviceList} onSelectItemService={onSelectItemService} />
          <EnterCustomersCode
            onChangeCustomerCode={onChangeCustomerCode}
            customerName={customerName}
            label={I18n.t('product.ticket_code')}
          />
          <View style={styles.wrapAmountInputGroup0}>
            <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
            <AmountInputText
              style={styles.contentBold}
              value={amountInput}
              rightText="VND"
              onChangeText={onAmoutChange}
              returnKeyType="done"
              maxLength={16}
            />
            {amountInWord ? null : <View style={styles.blockMargin} />}
            {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}
          </View>
          <View style={styles.wrapAmountInputGroup0}>
            <Text style={styles.title}>{I18n.t('transfer.time')}</Text>
            <DatePicker
              date={date}
              selectDate={date}
              style={styles.dateSchedule}
              onPressConfirm={(val) => setDate(val)}
              dateStyle={{
                fontWeight: 'normal',
                fontSize: 14,
                marginBottom: Metrics.small
              }}
            />
          </View>
        </View>
      </ScrollView>
      <Toast ref={refToast} position="bottom" />

      <ConfirmButton
        onPress={() => handleSubmit(onSubmit)()}
        loading={loading}
        disabled={loading}
        style={{
        paddingHorizontal: Metrics.medium,
      }}
        styleButton={{ width: '100%' }}
      />
    </View>
  )
}

export default TicketForm
