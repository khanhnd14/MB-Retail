import * as React from 'react'
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import RNPickerSelect from 'react-native-picker-select';
import { Metrics, Colors } from '../../../theme'
import {
  Topbar,
  HeaderTop,
  SelectAccount,
  EnterPhoneNumber,
  ConfirmButton,
  SelectSupplier,
  EnterCustomersCodeRecharge,
  EnterCardNumber,
  DiscountCode,
  FieldInputCheckBox,
  Radio,
  AmountPayment,
  Text,
} from '../../../components'
import { productOperations } from '../../../state/product'
import { networkOperatorCheckRecharge, networkBillCodeRecharge } from '../../../utilities/common'
import { Utils } from '../../../utilities'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { transferSelectors } from '../../../state/transfer'
import MsbIcon from '../../../components/MsbIcon'
import { loadRate } from '../../../state/save/actions'

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
    paddingBottom: Metrics.small * 6,
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
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingTop: Metrics.tiny,
    paddingLeft: Metrics.tiny
  },
  formAmount: {
    paddingLeft: Metrics.tiny
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: Metrics.normal,
    top: '50%',
  },
  cardContainer: {
    paddingVertical: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray11
  },
  providerContainer: {
    marginVertical: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray11,
    paddingBottom: Metrics.small
  },
  contentProvider: {
    color: Colors.textBlack,
    fontSize: 16,
  },
  sendCardContainer: { paddingHorizontal: Metrics.medium * 1.5, paddingVertical: Metrics.small, flexDirection: 'row' },
  sendCardChild: {
    paddingLeft: Metrics.medium
  }
})

const DataInputRechargeCardScreen = ({ route }) => {
  const { title, groupType, serviceType } = route.params
  const [phoneNumber, setPhoneNumber] = React.useState(null)
  const [pRolloutAccountNo, setPRolloutAccountNo] = React.useState(null)
  const { completedOtpRecharge, errorOtpRecharge, serviceProvider, loading, rechargeAmount } = useSelector((state) => state.product)
  const [onPressSubmit, setOnPressSubmit] = React.useState(false)
  const [amountInput, setAmountInput] = React.useState(0)
  const [amountInWord, setAmoutInWord] = React.useState(null)
  const [selectIdService, setSelectIdService] = React.useState(null)
  const [customersCode, setCustomerCode] = React.useState(null)
  const [cardNumber, setCardNumber] = React.useState(null)
  const [isCheckedEmail, setIsCheckedEmail] = React.useState(null)
  const [payment, setPayment] = React.useState('')
  const [isCheckedPhone, setIsCheckedPhone] = React.useState(null)
  const [productCode, setProductCode] = React.useState('')
  // const terms = useSelector((state) => state.save.terms).filter((term) => term.category === catCode)
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(productOperations.getAccount())
    dispatch(
      productOperations.getServiceList({
        moduleType: 'RG',
      })
    )
  }, [])
  const account = useSelector((state) => state.product.account)
  const onChangePhoneNumber = (val) => {
    setPhoneNumber(val)
  }
  const onAmoutChange = (amount) => {
    setAmountInput(amount)
    setAmoutInWord(transferSelectors.amountToWord(amount ? amount.toString() : 0))
  }
  const onSubmit = () => {
    setOnPressSubmit(true)
    if ((!phoneNumber && !customersCode) || !pRolloutAccountNo) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    if (!amountInput) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    const body = {
      serviceId: groupType === '0' ? networkOperatorCheckRecharge(phoneNumber) : selectIdService,
      contractNo: groupType === '0' ? phoneNumber : customersCode,
      amount: amountInput,
      tranDate: moment().format('DD/MM/YYYY'),
      // tranLimit: '01',
      isSchedule: false,
      rolloutAccountNo: pRolloutAccountNo,
      billCode: groupType === '0' ? networkBillCodeRecharge(phoneNumber) : null,
    }
    dispatch(productOperations.sendOTPRecharge(body))
  }
  React.useEffect(() => {
    if (completedOtpRecharge && onPressSubmit) {
      Navigation.push('RechargeOTPScreen',
        {
          amount: amountInput,
          customerInfo: groupType === '0' ? phoneNumber : customersCode,
          titleServices: title,
          typeService: 0,
          success: 'SuccessScreen'

        })
    } else if (errorOtpRecharge) {
      Utils.toast(errorOtpRecharge)
    }
  }, [errorOtpRecharge, completedOtpRecharge, onPressSubmit])
  React.useEffect(() => () => {
    setOnPressSubmit(false)
    dispatch(productOperations.setProduct())
  }, [])
  const onSelectRolloutAccountNo = (val) => {
    setPRolloutAccountNo(val)
  }
  const onSelectItemService = (serviceId) => {
    setSelectIdService(serviceId)
  }
  const onChangeCustomerCode = (value) => {
    setCustomerCode(value)
  }
  const onChangeCardNumber = (value) => {
    setCardNumber(value)
  }
  const servicesList = useSelector((state) => state.product.servicesList)
  const filter1 = _.filter(servicesList, (item) => item.groupType === groupType)
  const listSupplier =
    filter1.length !== 0
      ? groupType !== '3'
        ? filter1[0].serviceList
        : _.filter(filter1[0].serviceList, (item) => item.serviceType === serviceType)
      : []

  const changePayment = (text) => {
    setPayment(text)
      // if (productCode) {
      //   dispatch(loadRate(terms[0].productCode, text))
      //   setProductCode(terms[0].productCode)
      // }
  }
  console.log('rechargeAmount', rechargeAmount)
  return (
    <View style={styles.container}>
      <Topbar title={I18n.t('product.recharge')} />
      <HeaderTop title={title} />
      <ScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          {/* {groupType === '0' ? <EnterPhoneNumber onChangePhoneNumber={onChangePhoneNumber} /> : null}
          {groupType === '2'
            ? (
              <>
                <SelectSupplier data={listSupplier} onSelectItemService={onSelectItemService} />
                <EnterCustomersCodeRecharge onChangeCustomerCode={onChangeCustomerCode} />
              </>
            )
            : null
          } */}
          {groupType === '4' ? <EnterCardNumber onChangeCardNumber={onChangeCardNumber} /> : null}
          {groupType === '6' ? (

            <View style={{ ...styles.providerContainer }}>
              <Text style={styles.title}>{I18n.t('product.title_card_type')}</Text>
              <RNPickerSelect
                onValueChange={() => {}}
                items={serviceProvider}
                style={{
              viewContainer: {
                paddingVertical: Metrics.tiny * 2,
                paddingLeft: Metrics.tiny,
                marginTop: Metrics.small,
              }
            }}
                placeholder={{ label: 'Select' }}
                textInputProps={styles.contentProvider}
              />
              <MsbIcon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
            </View>

) : null}
          {groupType === '4' ?
            <AmountPayment changePayment={changePayment} groupType={groupType} height={40} amount="" onEnterAmountPayment={() => {}} /> : null}
          {groupType === '6' ? (
            <View style={styles.cardContainer}>
              <Text style={styles.title}>{I18n.t('product.title_card_denominations')}</Text>
              <RNPickerSelect
                onValueChange={() => {}}
                items={rechargeAmount}
                style={{
              viewContainer: {
                paddingVertical: Metrics.tiny * 2,
                paddingLeft: Metrics.tiny,
              }
            }}
                placeholder={{ label: '' }}
                textInputProps={styles.contentBold}
              />
              {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}
              <MsbIcon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
            </View>
) : null}
          {groupType === '6' ? (
            <View style={{ ...styles.cardContainer, borderBottomWidth: 0 }}>
              <Text style={styles.title}>{I18n.t('product.title_send_card')}</Text>

              <View
                style={styles.sendCardContainer}
              >

                <Radio
                  checked={isCheckedEmail}
                  onPress={() => setIsCheckedEmail(!isCheckedEmail)}
                />
                <View style={styles.sendCardChild}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: Metrics.tiny }}>Email:</Text>
                  <Text style={{ fontSize: 14, color: Colors.gray1 }}>Tự nhận (có chỉnh sửa)</Text>
                </View>
              </View>
              <View
                style={styles.sendCardContainer}
              >

                <Radio
                  checked={isCheckedPhone}
                  onPress={() => setIsCheckedPhone(!isCheckedPhone)}
                />
                <View style={styles.sendCardChild}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: Metrics.tiny }}>Số điện thoại:</Text>
                  <Text style={{ fontSize: 14, color: Colors.gray1 }}>Tự nhận (có chỉnh sửa)</Text>
                </View>
              </View>
            </View>
) : null}
        </View>
      </ScrollView>
      <ConfirmButton onPress={onSubmit} loading={loading} />
    </View>
  )
}

export default DataInputRechargeCardScreen
