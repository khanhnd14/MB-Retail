/* eslint-disable no-shadow */
import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useEffect } from 'react'
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
import { networkOperatorCheck, checkAutoPayment, phoneFormatNetwork } from '../../../../utilities/common'
import { Utils } from '../../../../utilities'
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
    color: Colors.gray,
    fontSize: 16,
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
    borderBottomColor: Colors.gray5,
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
  hideAmount: {
    fontSize: 14,
    marginTop: Metrics.tiny * 2
  },
  dot: {
    fontSize: 14,
    color: Colors.primary2
  },
  termTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  }
})

const MobilePayment = ({ route }) => {
  const { groupType, title, serviceList, contractNo } = route.params
  const { checkBill, loading, account, checkPayBill, errorCheckBill, completedOtp, errorCompletedOtp } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const { handleSubmit, register, errors, setValue, unregister } = useForm()

  const [, setRolloutAccountNo] = React.useState(null)
  const [isShowSelectSupplies, setIsShowSelectSupplies] = React.useState(false)
  const [supplyServiceId, setIsSupplyServiceId] = React.useState(false)
  const [numberPhone, setNumberPhone] = React.useState('')
  const [amountInput, setAmountInput] = React.useState(null)
  const [amountInWord, setAmoutInWord] = React.useState(null)
  const [pIsSchedule, setPIsSchedule] = React.useState(false)
  const [hideAmount, setHideAmount] = React.useState('')
  const [loadingCheckBill, setLoadingCheckBill] = React.useState(false)
  const [isShowServiceId, setIsShowServiceId] = React.useState(false)

  const [date, setDate] = React.useState(new Date())

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
    console.log('====================================');
    console.log(serviceId);
    console.log('====================================');
    setValue('supply', serviceId)
    setIsSupplyServiceId(serviceId)
    setIsShowServiceId(checkAutoPayment(serviceId))
  }

  const onAmoutChange = (val) => {
    setValue('payment', val?.replace(/,/g, ''))
    setAmountInput(val?.replace(/,/g, ''))
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
      amount: payment || '',
      tranDate: moment().format('DD/MM/YYYY'),
      isSchedule: pIsSchedule,
      rolloutAccountNo: account,
    }
    if (errorCheckBill) {
      Utils.showLoading()
      dispatch(productOperations.getCheckBill(numberPhone, supplyServiceId))
      return
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
    register('supply', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_supply')
      }
    })
  }, [register])

  React.useEffect(() => {
    if (checkBill) {
      setLoadingCheckBill(false)
      // nếu bill là viettel đã có tiền > 0 rồi thì show điều khoản viettel, nếu bill có tiền < 0 thì show chưa đến ngày thanh toán
      if (supplyServiceId === 100028) {
        if (checkBill[0]?.amount > 0) {
          setHideAmount(I18n.t('product.hide_amount'))
        } else {
          setHideAmount(I18n.t('product.viettel_not_amount'))
        }
      } else if (checkBill[0]?.amount > 0) {
          onAmoutChange(checkBill[0]?.amount.toString())
      } else {
        setHideAmount(I18n.t('product.viettel_not_amount'))
      }
    }
  }, [checkBill])

  React.useEffect(() => {
    if (errorCheckBill) {
      setLoadingCheckBill(false)
      Utils.hideLoading()
      setHideAmount('')
    }
  }, [errorCheckBill])

  React.useEffect(() => {
    if (checkBill) {
      register('payment', {
        required: {
          value: true,
          message: I18n.t('product.service_list.error_payment')
        }
      })
      Utils.hideLoading()
      // trường hợp có tiền nhưg phải ẩn tiền đi
      onAmoutChange(checkBill[0]?.amount.toString())
    }
  }, [checkBill])

  React.useEffect(() => {
    if (errorCheckBill) {
      unregister('payment')
    }
  }, [errorCheckBill])

  React.useEffect(() => {
    console.log('====================================');
    console.log('errors', errors);
    console.log('====================================');
    const keys = Object.keys(errors)
    if (keys.length) {
      refToast.current.show(errors[keys[0]]?.message, 3000)
    }
  }, [errors])

    // show chọn nhà cung cấp, check chọn mặc định
  React.useEffect(() => {
    console.log('====================================');
    console.log('get service');
    console.log('====================================');
    if (numberPhone) {
      setIsShowSelectSupplies(true)
      const network = phoneFormatNetwork(numberPhone)
      const service = _.filter(serviceList, (e) => e.serviceName === network)
      onSelectItemService(service[0]?.serviceId)
    }
  }, [numberPhone])

  // check kích từ lịch sử ra
  useEffect(() => {
    if (contractNo) {
      onChangePhoneNumber(contractNo)
    }
  }, [contractNo])

    // check bill
  React.useEffect(() => {
    console.log('====================================');
    console.log(numberPhone, supplyServiceId);
    console.log('====================================');
    if (numberPhone && supplyServiceId) {
      setLoadingCheckBill(true)
      Utils.showLoading()
      dispatch(productOperations.getCheckBill(numberPhone, supplyServiceId))
    }
  }, [numberPhone, supplyServiceId])

  React.useEffect(() => {
    if (checkPayBill) {
      // nếu ko cần otp thì send otp luôn
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
          customerInfo: numberPhone,
          titleServices: title,
          typeService: groupType,
          content: pIsSchedule ? I18n.t('product.service_list.register_auto_payment_success') : I18n.t('product.bill_payment_success')
        })
      }
    }
  }, [checkPayBill])

  React.useEffect(() => {
    // const { tokenTransaction } = checkPayBill
    // nếu hoá đơn ko nợ cước
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

  return (
    <View style={styles.container}>
      <Topbar subTitle={title} title={I18n.t('product.bill_payment')} />
      <KeyboardAwareScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <EnterPhoneNumber phoneNumberFill={numberPhone} onChangePhoneNumber={onChangePhoneNumber} setIsShowSelectSupplies={setIsShowSelectSupplies} />
          {isShowSelectSupplies && <SelectSupplier data={serviceList} onSelectItemService={onSelectItemService} serviceNameFill={phoneFormatNetwork(numberPhone || '')} />}
          {(!hideAmount) ? checkBill && (
            <View style={styles.wrapAmountInputGroup0}>
              <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
              <AmountInputText
                style={styles.contentBold}
                value={amountInput}
                rightText="VND"
                onChangeText={onAmoutChange}
                returnKeyType="done"
                maxLength={16}
                placeholder={I18n.t('product.input_payment')}
              />
              {amountInWord ? null : <View style={styles.blockMargin} />}
              {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}
            </View>
          ) : (
            <Text style={styles.hideAmount}>
              {hideAmount}
            </Text>
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
                paddingBottom: Metrics.tiny
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
      </KeyboardAwareScrollView>
      <Toast ref={refToast} position="bottom" />
      <NoteSheet
        title={I18n.t('product.bill_note.term_title')}
        text={(
          <Text style={{ lineHeight: Metrics.normal * 1.5 }}>
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.term')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define1.title')}</Text>{'\n'}

            {
              [1, 2, 3, 4, 5, 6, 7].map((value, index) => (
                <Text key={index}>{I18n.t(`product.bill_note.define1.define_${value}`)}{'\n'}</Text>
              ))
            }
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define2.title')}</Text>{'\n'}
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((value, index) => (
                <Text key={index}>{I18n.t(`product.bill_note.define2.define_${value}`)}{'\n'}</Text>
              ))
            }
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define3.title')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define4.title')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define5.title')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.bill_note.define6.title')}</Text>{'\n'}

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

export default MobilePayment
