import * as React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import RNPickerSelect from 'react-native-picker-select'
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
  Text,
} from '../../../components'
import { productOperations } from '../../../state/product'
import { networkOperatorCheckRecharge, networkBillCodeRecharge, numberToVietnameseText } from '../../../utilities/common'
import { Utils } from '../../../utilities'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { transferSelectors } from '../../../state/transfer'

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
    padding: Metrics.normal,
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
    paddingVertical: Metrics.tiny / 2,
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
  },
})

const DataInputRechargeItemFill = ({ route }) => {
  const { title, groupType, serviceType, items } = route.params
  const [phoneNumber, setPhoneNumber] = React.useState(items.contractNo)
  const [pRolloutAccountNo, setPRolloutAccountNo] = React.useState(null)
  const { completedOtpRecharge, errorOtpRecharge, rechargeAmount, loading } = useSelector((state) => state.product)
  const [onPressSubmit, setOnPressSubmit] = React.useState(false)
  const [amountInput, setAmountInput] = React.useState(items.amount || 0)
  const [amountInWord, setAmountInWord] = React.useState(undefined)
  const [selectIdService, setSelectIdService] = React.useState(items.serviceId)
  const [customersCode, setCustomerCode] = React.useState(null)
  const [cardNumber, setCardNumber] = React.useState(null)
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
  const onAmountChange = (value) => {
    setAmountInput(value)
    setAmountInWord(transferSelectors.amountToWord(value.toString()))
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
  return (
    <View style={styles.container}>
      <Topbar title={I18n.t('product.recharge')} />
      <HeaderTop title={title} />
      <ScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          {groupType === '0' ? <EnterPhoneNumber onChangePhoneNumber={onChangePhoneNumber} phoneNumberFill={items.contractNo} /> : null}
          {groupType === '2'
            ? (
              <>
                <SelectSupplier data={listSupplier} onSelectItemService={onSelectItemService} />
                <EnterCustomersCodeRecharge onChangeCustomerCode={onChangeCustomerCode} />
              </>
            )
            : null
          }
          {groupType === '6' ? <EnterCardNumber onChangeCardNumber={onChangeCardNumber} /> : null}
          <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
          <RNPickerSelect
            onValueChange={onAmountChange}
            items={rechargeAmount}
            style={{
              viewContainer: {
                padding: Metrics.tiny
              }
            }}
            placeholder={{ label: '' }}
            textInputProps={styles.contentBold}
          />
          {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}
        </View>
      </ScrollView>
      <ConfirmButton onPress={onSubmit} loading={loading} />
    </View>
  )
}

export default DataInputRechargeItemFill
