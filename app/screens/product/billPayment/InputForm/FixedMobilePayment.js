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
  EnterPhoneNumber,
  ConfirmButton,
  AmountInputText,
  RegisAutoPayAndConfirm,
  DatePicker,
  Toast,
  NoteSheet,
  Text,
} from '../../../../components'
import { productOperations } from '../../../../state/product'
import { checkAutoPayment } from '../../../../utilities/common'
import * as Navigation from '../../../../navigation'
import { transferSelectors } from '../../../../state/transfer'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.small,
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
    padding: Metrics.small,
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
    color: Colors.gray1,
    fontWeight: 'bold',
    fontSize: 14,
    marginHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
    marginHorizontal: Metrics.tiny
  },
  formAmount: {
    marginHorizontal: Metrics.tiny,
    fontSize: 12,
    color: Colors.gray1,
    marginBottom: Metrics.small
  },
  wrapAmountInputGroup0: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray5,
    paddingTop: Metrics.small
  },
  blockMargin: {
    marginBottom: Metrics.medium + (Metrics.tiny * 3) / 2
  },
  time: {
    marginVertical: Metrics.small,
    marginHorizontal: Metrics.tiny,
    fontSize: 16
  },
  dateSchedule: {
    width: '100%',
    marginLeft: Metrics.tiny,
    paddingVertical: Metrics.tiny
  },
})

const FixedMobilePayment = ({ route }) => {
  const { groupType, title, items, serviceList } = route.params
  const { loading, account, checkPayBill } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const { handleSubmit, register, errors, setValue, unregister } = useForm()

  const [, setRolloutAccountNo] = React.useState(null)
  const [supplyServiceId, setIsSupplyServiceId] = React.useState(false)
  const [isShowSelectSupplies, setIsShowSelectSupplies] = React.useState(false)
  const [numberPhone, setNumberPhone] = React.useState('')
  const [amountInput, setAmountInput] = React.useState(null)
  const [amountInWord, setAmoutInWord] = React.useState(null)
  const [pIsSchedule, setPIsSchedule] = React.useState(false)
  const [date, setDate] = React.useState(new Date())
  const [isShowServiceId, setIsShowServiceId] = React.useState(false)

  const refToast = React.useRef()
  const sheetNote = React.useRef()

  const onShowPolicy = () => {
    sheetNote && sheetNote.current.show()
  }

  const onChangePhoneNumber = (val) => {
    setValue('numberphone', val)
    setNumberPhone(val)
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
    setIsShowServiceId(checkAutoPayment(serviceId))
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
    const { account, numberphone, payment, supply } = data
    const body = {
      serviceId: supply,
      contractNo: numberphone,
      amount: payment,
      tranDate: moment().format('DD/MM/YYYY'),
      isSchedule: pIsSchedule,
      rolloutAccountNo: account,
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
    register('account', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_account')
      }
    })
    register('numberphone', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_phone')
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

  // show thông báo lỗi form
  React.useEffect(() => {
    const keys = Object.keys(errors)
    if (keys.length) {
      refToast.current.show(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

  // submit success, đi qua otp
  React.useEffect(() => {
    if (checkPayBill) {
      Navigation.navigate('BillPaymentOTPScreen',
        {
          amount: amountInput,
          customerInfo: numberPhone,
          titleServices: title,
          typeService: groupType,
          content: I18n.t('product.bill_payment_success'),
        })
    }
  }, [checkPayBill])

  // show chọn nhà cung cấp
  React.useEffect(() => {
    if (numberPhone) {
      setIsShowSelectSupplies(true)
    }
  }, [numberPhone])

  // check bill
  React.useEffect(() => {
    if (numberPhone && supplyServiceId) {
      dispatch(productOperations.getCheckBill(numberPhone, supplyServiceId))
    }
  }, [numberPhone, supplyServiceId])

  return (
    <View style={styles.container}>
      <Topbar subTitle={title} title={I18n.t('product.bill_payment')} />
      <ScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <EnterPhoneNumber onChangePhoneNumber={onChangePhoneNumber} phoneNumberFill={items ? items.contractNo : null} />
          {isShowSelectSupplies && <SelectSupplier data={serviceList} onSelectItemService={onSelectItemService} />}
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
                paddingBottom: Metrics.small
              }}
            />
          </View>
          {isShowServiceId && (
          <RegisAutoPayAndConfirm
            onShowPolicy={onShowPolicy}
            onIsSchedule={onIsSchedule}
            register={register}
            setValue={setValue}
            unregister={unregister}
          />
)}

        </View>
      </ScrollView>
      <Toast ref={refToast} position="bottom" />
      <NoteSheet
        title={I18n.t('product.bill_note.term_title')}
        text={(
          <Text style={{ lineHeight: Metrics.normal * 1.5 }}>
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.term')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define1.title')}</Text>{'\n'}

            {
              [1, 2, 3, 4, 5, 6, 7].map((value) => (
                <Text>{I18n.t(`product.bill_note.define1.define_${value}`)}{'\n'}</Text>
              ))
            }
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define2.title')}</Text>{'\n'}
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((value) => (
                <Text>{I18n.t(`product.bill_note.define2.define_${value}`)}{'\n'}</Text>
              ))
            }
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define3.title')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define4.title')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define5.title')}</Text>{'\n'}

          </Text>
        )}
        ref={sheetNote}
      />
      <ConfirmButton
        onPress={() => handleSubmit(onSubmit)()}
        loading={loading}
        style={{
          paddingHorizontal: Metrics.medium,
        }}
        styleButton={{ width: '100%' }}
      />
    </View>
  )
}

export default FixedMobilePayment
