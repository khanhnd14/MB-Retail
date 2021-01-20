import * as React from 'react'
import { ScrollView, View, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { Metrics, Colors } from '../../../../theme'
import { productOperations } from '../../../../state/product'
import {
  Topbar,
  HeaderTop,
  SelectAccount,
  EnterPhoneNumber,
  ConfirmButton,
  DatePicker,
  Switch,
  Icon,
  ModalSelect,
  SelectSupplier,
  Toast,
  NoteSheet,
  Text,
} from '../../../../components'
import * as Navigation from '../../../../navigation'
import I18n from '../../../../translations'
import MsbIcon from '../../../../components/MsbIcon'
import MsbRadio from '../../../../components/MsbRadio'
import SelectPayment from '../../../../components/SelectPayment'
import { networkOperatorCheck, phoneFormatNetwork } from '../../../../utilities/common'
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
    color: Colors.textBlack,
    fontWeight: 'bold',
  },
  contentProvider: {
    color: Colors.textBlack,
    fontSize: 16,
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingLeft: Metrics.tiny,
  },
  formAmount: {
    paddingLeft: Metrics.tiny,
    marginBottom: Metrics.medium * 1.5,
  },
  amountContainer: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    height: Metrics.medium * 6,
  },
  providerContainer: {
    paddingBottom: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray10,
  },
  timeContainer: {
    paddingBottom: Metrics.tiny,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray5,
    paddingTop: Metrics.tiny * 2
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: Metrics.normal,
    top: '50%',
  },
  dateSchedule: {
    flexDirection: 'row',
    width: '100%',
    marginLeft: Metrics.tiny,
    paddingVertical: Metrics.small
  },
  element: {
    marginVertical: Metrics.medium,
  },
  termContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.medium,
    paddingBottom: Metrics.normal
  },
  checked: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconItem: {
    color: Colors.white,
    fontSize: 40,
    marginLeft: 5,
  },
  term1: {
    width: '80%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingRight: Metrics.small,
  },
  term2: {
    width: '20%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  voucher: {
    paddingVertical: Metrics.tiny * 2,
    paddingLeft: Metrics.tiny
  },
  termTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  }
})

const CardMobile = ({ route }) => {
  const rechargeLimit = [
    { label: `1 ${I18n.t('account.card_payment.times')}`, value: 1 },
    { label: `2 ${I18n.t('account.card_payment.times')}`, value: 2 },
    { label: `3 ${I18n.t('account.card_payment.times')}`, value: 3 },
    { label: `4 ${I18n.t('account.card_payment.times')}`, value: 4 },
  ]
  const { handleSubmit, register, errors, setValue, unregister, getValues } = useForm()
  const {
    title,
    groupType,
    serviceList,
    contractNo,
    amount,
    lastAmount,
    pRolloutAccountNo,
    transDate,
  } = route.params
  const dispatch = useDispatch()
  const {
    completedOtpRecharge,
    errorOtpRecharge,
    servicesList,
    loading,
    account,
  } = useSelector((state) => state.product)
  const mobileServiceList = React.useMemo(() => servicesList[_.findIndex(servicesList, (e) => e.groupType === '0')], [servicesList])
  const [accountNo, setAccountNo] = React.useState(null)
  const [phoneNumber, setPhoneNumber] = React.useState(null)
  const [payment, setPayment] = React.useState(null)
  const refToast = React.useRef()
  const [supplyServiceId, setIsSupplyServiceId] = React.useState(false)
  const [limit, setLimit] = React.useState({})
  const [date, setDate] = React.useState(new Date())

  const [switchStatus, setSwitchStatus] = React.useState(false)

  const [visibleLimit, setVisibleLimit] = React.useState(false)

  const [isConfirmed, setIsConfirmed] = React.useState(false)
  const sheetNote = React.useRef()

  // l?y ra service ?c ch?n t? list service
  const selectedService = React.useMemo(() => mobileServiceList.serviceList[_.findIndex(mobileServiceList.serviceList, (e) => e.serviceId === supplyServiceId)], [supplyServiceId])
  const onSubmit = (data) => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const billCode = mobileServiceList.serviceList[_.findIndex(mobileServiceList.serviceList, (e) => e.serviceId === supplyServiceId)].category.split('|')[0]
    const body = {
      serviceId: supplyServiceId,
      contractNo: phoneNumber,
      amount: payment.value,
      tranDate: moment(date).format('DD/MM/YYYY'),
      tranLimit: switchStatus ? `0${limit.value}` : '01',
      isSchedule: switchStatus,
      rolloutAccountNo: accountNo,
      billCode
    }
    Navigation.push('BuyCardRechargeConfirm',
    {
      title,
      serviceList: mobileServiceList.serviceList,
      contractNo: phoneNumber,
      selectedService,
      amount: payment.value,
      lastAmount: null,
      pRolloutAccountNo: accountNo,
      transDate: date,
      ...body
    })
  }

  const onShowPolicy = () => {
    sheetNote && sheetNote.current.show()
  }

  const onChoiceAccount = (val) => {
    setValue('account', val)
    setAccountNo(val)
  }

  const onChangePhoneNumber = (val) => {
    setValue('numberPhone', val)
    setPhoneNumber(val)
  }

  const onSelectItemService = (serviceId) => {
    setValue('supply', serviceId)
    setIsSupplyServiceId(serviceId)
    setTimeout(() => {
      Keyboard.dismiss()
    }, 500);
  }

  const onSelectPayment = (val) => {
    setValue('payment', val)
    setPayment(val)
  }

  const onSetLimit = (item) => {
    setLimit(item)
    setValue('limit', item)
    setVisibleLimit(false)
  }

  const onSelectTerm = () => {
    setValue('confirm', !isConfirmed)
    setIsConfirmed(!isConfirmed)
  }

  const reset = () => {
    dispatch(productOperations.setProduct())
  }

  React.useEffect(() => {
    dispatch(productOperations.getAccount())
  }, [])

  React.useEffect(
    () => () => {
      dispatch(productOperations.setCheckBill())
      dispatch(productOperations.setCheckPayBill())
    },
    []
  )

  React.useEffect(() => {
    register('account', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_account')
      }
    })
    register('numberPhone', {
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

  React.useEffect(() => {
    if (switchStatus) {
      register('limit', {
        required: {
          value: true,
          message: `${I18n.t('product.service_list.error')} ${I18n.t('product.limit')}`
        }
      })
      register('confirm', {
        required: {
          value: true,
          message: `${I18n.t('product.service_list.error')} ${I18n.t('product.service_list.error_accept_term')}`
        }
      })
    } else {
      unregister(['limit', 'confirm'])
    }
  }, [switchStatus])

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
    console.log('====================================');
    console.log('get service', phoneNumber);
    console.log('====================================');
    if (phoneNumber) {
      const network = phoneFormatNetwork(phoneNumber)
      const service = _.filter(mobileServiceList.serviceList, (e) => e.serviceName === network)
      onSelectItemService(service[0]?.serviceId)
    }
  }, [phoneNumber])

  React.useEffect(() => {
    if (contractNo) {
      onChangePhoneNumber(contractNo)
    }
  }, [contractNo])

  React.useEffect(() => {
    if (amount) {
      onSelectPayment({ value: amount })
    }
  }, [amount])

  return (
    <View style={styles.container}>
      <Topbar subTitle={title} title={I18n.t('product.recharge')} />
      <KeyboardAwareScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onChoiceAccount} />
        <View style={styles.contentLayout}>
          <EnterPhoneNumber phoneNumberFill={contractNo} onChangePhoneNumber={onChangePhoneNumber} />
          {phoneNumber && <SelectSupplier data={mobileServiceList.serviceList} onSelectItemService={onSelectItemService} serviceNameFill={phoneFormatNetwork(phoneNumber)} />}
          <SelectPayment onSelectPayment={onSelectPayment} filledAmount={amount} />
          {/* <View style={[styles.field, { borderBottomWidth: 0 }]}>
            <Text style={styles.title}>Mã giảm giá</Text>
            <TextInput
              onBlur={() => {}}
              style={styles.voucher}
              onChangeText={() => {}}
              placeholder={I18n.t('product.typing')}
            />
          </View> */}
          {!switchStatus && (
          <View style={{ ...styles.timeContainer }}>
            <Text style={styles.title}>{I18n.t('transfer.time')}</Text>
            <View style={styles.dateSchedule}>
              <Text style={{
              fontWeight: 'normal',
              fontSize: 14,

            }}
              >{Utils.toStringServerDate(date)}
              </Text>
            </View>
          </View>
)}
          <View style={[styles.element]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={styles.title}>{I18n.t('product.title_recharge_promotion')}</Text>
              <Switch
                isOn={switchStatus}
                onColor={Colors.primary}
                offColor={Colors.gray}
                size="small"
                onToggle={(val) => {
                  setSwitchStatus(val)
                }}
              />
            </View>
          </View>
          {switchStatus ? (
            <>
              <View
                style={{ ...styles.providerContainer }}
                onTouchStart={() => setVisibleLimit(true)}
              >
                <Text style={styles.title}>{I18n.t('product.title_date_rechargeLimit')}</Text>
                <View
                  style={{
                    marginTop: Metrics.small,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: Metrics.tiny,

                  }}
                >
                  <Text
                    style={{
                      color: Colors.gray1,
                      fontSize: 14,
                      paddingBottom: Metrics.small
                    }}
                  >
                    {limit.label || <Text style={{ fontWeight: 'normal', }}>{I18n.t('product.choice_limit')}</Text>}
                  </Text>
                </View>
                <MsbIcon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
                <ModalSelect
                  title={I18n.t('product.limit')}
                  visible={visibleLimit}
                  handleModal={() => setVisibleLimit(false)}
                >
                  <ScrollView>
                    {rechargeLimit.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          marginHorizontal: Metrics.small * 4,
                          paddingVertical: Metrics.small,
                          ...(index !== rechargeLimit.length - 1 && {
                            borderBottomColor: Colors.gray6,
                            borderBottomWidth: 1,
                          }),
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onPress={() => {
                          onSetLimit(item)
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 16, color: Colors.textBlack }}>
                            {item.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </ModalSelect>
              </View>
              <View style={styles.termContainer}>
                <View style={styles.term1}>
                  <MsbRadio
                    text={I18n.t('product.confirm_content_policy')}
                    checked={isConfirmed}
                    onPress={onSelectTerm}
                  />
                </View>
                <TouchableOpacity onPress={onShowPolicy} style={styles.term2}>
                  <Icon
                    name="icon-lichsu"
                    styles={styles.iconItem}
                    size={28}
                    color={Colors.primary2}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
      <NoteSheet
        title={I18n.t('product.recharge_service.term_title')}
        text={(
          <Text style={{ lineHeight: Metrics.normal * 1.5 }}>
            <Text style={styles.termTitle}>{I18n.t('product.recharge_service.term')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.recharge_service.define1.title')}</Text>{'\n'}

            {
              [1, 2, 3, 4, 5, 6, 7].map((value, index) => (
                <Text key={index}>{I18n.t(`product.recharge_service.define1.define_${value}`)}{'\n'}</Text>
              ))
            }
            <Text style={styles.termTitle}>{I18n.t('product.recharge_service.define2.title')}</Text>{'\n'}
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((value, index) => (
                <Text key={index}>{I18n.t(`product.recharge_service.define2.define_${value}`)}{'\n'}</Text>
              ))
            }
            <Text style={styles.termTitle}>{I18n.t('product.recharge_service.define3.title')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.recharge_service.define4.title')}</Text>{'\n'}
            <Text style={styles.termTitle}>{I18n.t('product.recharge_service.define5.title')}</Text>{'\n'}

          </Text>
          )}
        ref={sheetNote}
      />
      <View
        style={{
          marginHorizontal: Metrics.medium,
        }}
      >
        <ConfirmButton onPress={() => handleSubmit(onSubmit)()} loading={loading} style={styles.buttonConfirm} />
      </View>
      <Toast ref={refToast} position="bottom" />

    </View>
  )
}

export default CardMobile
