/* eslint-disable no-shadow */
import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18n from '../../../../translations'
import { Metrics, Colors } from '../../../../theme'
import {
  Topbar,
  HeaderTop,
  SelectAccount,
  SelectSupplier,
  ConfirmButton,
  AmountInputText,
  RegisAutoPayAndConfirm,
  DatePicker,
  Toast,
  EnterCustomersCode,
  AmountPaymentMany,
  NoteSheet,
  Text,
} from '../../../../components'
import { productOperations } from '../../../../state/product'
import * as Navigation from '../../../../navigation'
import { transferSelectors } from '../../../../state/transfer'
import { checkAutoPayment } from '../../../../utilities/common'
import { Utils } from '../../../../utilities'

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
    color: Colors.gray1,
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
    // marginBottom: Metrics.medium * 1.5,
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
  dot: {
    fontSize: 14,
    color: Colors.primary2
  }
})

const ElectricPayment = ({ route }) => {
  const { groupType, title, serviceList, contractNo, selectedService } = route.params
  const { checkBill, loading, account, checkPayBill, errorCheckBill, completedOtp, errorCompletedOtp } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const { handleSubmit, register, errors, setValue, unregister } = useForm()

  const [, setRolloutAccountNo] = React.useState(null)
  const [supplyServiceId, setSupplyServiceId] = React.useState(null)
  const [isAutoPayment, setIsAutoPayment] = React.useState(false)
  const [customerCode, setCustomerCode] = React.useState('')
  const [amountInput, setAmountInput] = React.useState(null)
  const [amountInWord, setAmoutInWord] = React.useState(null)
  const [pIsSchedule, setPIsSchedule] = React.useState(false)
  const [customerName, setCustomerName] = React.useState(null)
  const [paidBillCode, setPaidBillCode] = React.useState('')
  const [listPayments, setListPayment] = React.useState([])
  const [date, setDate] = React.useState(new Date())
  const [loadingCheckBill, setLoadingCheckBill] = React.useState(false)
  const [selectedSv, setselectedSv] = React.useState(null)

  const refToast = React.useRef()
  const sheetNote = React.useRef()

  const onChangeCustomerCode = (val) => {
    setValue('customerCode', val)
    setCustomerCode(val)
  }

  const onShowPolicy = () => {
    sheetNote && sheetNote.current.show()
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
    setSupplyServiceId(serviceId)
    setIsAutoPayment(checkAutoPayment(serviceId))
    for (let i = 0; i < serviceList.length; i++) {
      const element = serviceList[i];
      if (element.serviceId == serviceId) {
        setselectedSv(element)
        break;
      }
    }
  }

  const onAmoutChange = (val) => {
    setValue('payment', val.replace(/,/g, ''))
    setAmountInput(val.replace(/,/g, ''))
    setAmoutInWord(transferSelectors.amountToWord(val))
  }

  const onSubmit = (data) => {
    try {
    console.log('====================================');
    console.log('groupType',{ groupType, title, serviceList, contractNo, selectedService });
    console.log('====================================');
    const { account, customerCode, payment, supply } = data
    let body = null
    // check điện chỉ chọn những tháng đầu tiên
    if (supply === 16) {
      if (paidBillCode.includes('0')) {
        body = {
          serviceId: supply,
          contractNo: customerCode,
          amount: payment || '',
          tranDate: moment().format('DD/MM/YYYY'),
          isSchedule: pIsSchedule,
          rolloutAccountNo: account,
          paidBillCode
        }
      } else {
        refToast.current.show(I18n.t('product.EVNRule'), 3000)
        return
      }
    } else {
      const listSelected = _.filter(listPayments, item => item.checked)
      let paid = ''
      listSelected?.forEach((element, index) => {
        paid += `${element.bill_no}:${element.amount}:${index}${index !== checkBill.length - 1 ? ',' : ''}`
      });
      body = {
        serviceId: supply,
        contractNo: customerCode,
        amount: payment || '',
        tranDate: moment().format('DD/MM/YYYY'),
        isSchedule: pIsSchedule,
        rolloutAccountNo: account,
        paidBillCode: paid
      }
    }
    // debugger
    if (body && selectedSv.paymentType == 'MB') {
      body.paidBillCode = ""
    }
    if (errorCheckBill) {
      return
    }
    dispatch(productOperations.checkPayBill(body))
  // eslint-disable-next-line no-empty
  } catch (error) {

  }
  }

  const checkPayment = (payments) => {
    // console.log('==================payments==================');
    // console.log(payments);
    // console.log('====================================');
    // get sum payment
    const sum = _.sumBy(_.filter(payments, item => item.checked), 'amount')
    // get paidBillCode: 0,1
    const paidBillCode = Object.keys(payments).toString()
    onAmoutChange(sum.toString())
    setPaidBillCode(paidBillCode)
    setListPayment(payments)
  }

  React.useEffect(() => {
    register('account', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_account')
      }
    })
    register('supply', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_supply')
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
    // console.log('====================================');
    // console.log(errors);
    // console.log('====================================');
    if (keys.length) {
      refToast.current.show(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

  React.useEffect(() => {
    dispatch(productOperations.getAccount())
    return () => {
      dispatch(productOperations.setCheckBill())
      dispatch(productOperations.setCheckPayBill())
    }
  }, [])

  React.useEffect(() => {
    if (checkBill) {
      // console.log('====================================');
      // console.log(checkBill);
      // console.log('====================================');
      // setValue('supply', serviceList[0]?.serviceId)
      setCustomerName(checkBill[0]?.description)
      setLoadingCheckBill(false)
      Utils.hideLoading()
    }
  }, [checkBill])

  React.useEffect(() => {
    if (checkBill) {
      register('payment', {
        required: {
          value: true,
          message: I18n.t('product.service_list.error_payment')
        }
      })
    }
  }, [checkBill])

  React.useEffect(() => {
    if (errorCheckBill) {
      setLoadingCheckBill(false)
      Utils.hideLoading()
      unregister('payment', {
        required: {
          value: true,
          message: I18n.t('product.service_list.error_payment')
        }
      })
    }
  }, [errorCheckBill])

  React.useEffect(() => {
    if (checkPayBill) {
      if (checkPayBill?.isTrust) {
        const body = {
          tokenTransaction: checkPayBill?.tokenTransaction,
          sessionId: checkPayBill?.sessionId || 0,
          otpInput: '000000',
          saveValue: '',
          paymentType: '',
          queryAmount: '',
          rolloutAccnountNo: ''
        }
        dispatch(productOperations.sendOtp(body))
      } else {
        Navigation.navigate('BillPaymentOTPScreen',
        {
          amount: amountInput,
          customerInfo: customerCode,
          titleServices: title,
          typeService: groupType,
          disableLeftIcon: true,
          textButton: I18n.t('application.another_payment'),
          content: I18n.t('product.bill_payment_success'),
        })
      }
    }
  }, [checkPayBill])

  React.useEffect(() => {
    if (checkPayBill?.isTrust) {
      if (completedOtp) {
        Navigation.popToPop()
        Navigation.push('SuccessScreen', {
          ...route.params,
          ...completedOtp,
          amount: amountInput,
          customerInfo: checkPayBill.previewData.customerCode,
          tokenTransaction: checkPayBill?.tokenTransaction,
          hideSaveInfo: true,
          hideEmail: true,
          typeModule: 'BP',
          titleServices: title,
          typeService: groupType,
          paramsMessage: I18n.t('product.bill_payment_success'),
          redoTransaction: 'HistoryBillPayment'
        })
      }
    }
  }, [completedOtp])

  React.useEffect(() => {
    if (checkPayBill?.isTrust) {
      if (errorCompletedOtp) {
        if (errorCompletedOtp.status === '230') {
          return
        }
        Navigation.popToPop()
        Navigation.push('FailedScreen')
      }
    }
  }, [errorCompletedOtp])

  React.useEffect(() => {
    if (customerCode && supplyServiceId) {
      setLoadingCheckBill(true)
      Utils.showLoading()
      dispatch(productOperations.getCheckBill(customerCode.trim(), supplyServiceId))
    }
  }, [customerCode, supplyServiceId])

  React.useEffect(() => {
    if (contractNo) {
      onChangeCustomerCode(contractNo)
    }
  }, [contractNo])

  React.useEffect(() => {
    if (selectedService) {
      onSelectItemService(selectedService.serviceId)
    }
  }, [selectedService])

  return (
    <View style={styles.container}>
      <Topbar subTitle={title} title={I18n.t('product.bill_payment')} />
      <KeyboardAwareScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <SelectSupplier data={serviceList} onSelectItemService={onSelectItemService} serviceNameFill={selectedService?.serviceName} />
          <EnterCustomersCode onChangeCustomerCode={onChangeCustomerCode} customerCodeFill={contractNo} customerName={customerName} />
          {checkBill && checkBill[0]?.paymentType !== 'ONE' ? (
            <AmountPaymentMany
              amount={checkBill}
              groupType={groupType}
              getAmount={checkPayment}
            />
            ) : checkBill && (
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
            )}
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
                marginBottom: Metrics.tiny
              }}
            />
          </View>
          {isAutoPayment && (
          <RegisAutoPayAndConfirm
            onShowPolicy={onShowPolicy}
            onIsSchedule={onIsSchedule}
            register={register}
            setValue={setValue}
            unregister={unregister}
          />
)}

        </View>
      </KeyboardAwareScrollView>
      <Toast ref={refToast} position="bottom" />
      <NoteSheet
        title={I18n.t('ekyc.select_acc.privacy')}
        text={(
          <Text style={{ lineHeight: Metrics.normal * 1.5 }}>
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.term')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define1.title')}</Text>{'\n'}

            {
              [1, 2, 3, 4, 5, 6].map((value) => (
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
        disabled={loadingCheckBill}
        style={{
          paddingHorizontal: Metrics.medium,
        }}
        styleButton={{ width: '100%' }}
      />
    </View>
  )
}

export default ElectricPayment
