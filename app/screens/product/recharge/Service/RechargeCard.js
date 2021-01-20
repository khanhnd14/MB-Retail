/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';
import _ from 'lodash'
import I18n from '../../../../translations'
import { Topbar, SelectAccount, Radio, ConfirmButton, EnterCardNumber, AmountPayment, AmountInputText, Icon, DatePicker, Toast, Text } from '../../../../components'
import styles from './styles'
import { Utils } from '../../../../utilities'
import * as Navigation from '../../../../navigation'
import { Helpers, Colors } from '../../../../theme';
import { transferSelectors } from '../../../../state/transfer';

const RechargeCard = ({ route }) => {
  const {
    loading,
    servicesList,
    prepaidCardError
  } = useSelector((state) => state.product)
  const mobileServiceList = React.useMemo(() => servicesList[_.findIndex(servicesList, (e) => e.groupType === '6')], [servicesList])
  const selectedService = React.useMemo(() => mobileServiceList.serviceList[_.findIndex(mobileServiceList.serviceList, (e) => e.category === 'CA')], [mobileServiceList])

  const { title, transDate, contractNo } = route.params
  const { handleSubmit, register, errors, setValue } = useForm()
  const refToast = React.useRef()

  const account = useSelector((state) => state.product.account)
  const [cardNumber, setCardNumber] = React.useState('')
  const [pRolloutAccountNo, setPRolloutAccountNo] = React.useState(null)

  const [amount, setAmount] = useState(0)
  const [amountInWord, setAmoutInWord] = useState(null)

  const [date, setDate] = React.useState(new Date())
  const dispatch = useDispatch()

   const onChangeCardNumber = (value) => {
     setValue('cardCode', value)
      setCardNumber(value)
  }
  const onAmoutChange = (amount) => {
    setValue('payment', Utils.clearFormatAmount(amount))
    setAmount(amount)
    setAmoutInWord(transferSelectors.amountToWord(amount))
  }

  const onSelectRolloutAccountNo = (val) => {
    setPRolloutAccountNo(val)
  }

  const onSubmit = (data) => {
    const { cardCode, payment } = data
    const body = {
      serviceId: selectedService.serviceId,
      amount: payment,
      tranDate: Utils.toStringServerDate(date),
      from: pRolloutAccountNo,
      toCard: cardCode
    }
    console.log(body)
    Navigation.push('RechargeCardConfirmScreen', {
      title: I18n.t('product.recharge'),
      cardCode: cardNumber,
      amount: amount?.value,
      pRolloutAccountNo,
      tranDate: date,
      ...body
    })
  }

  React.useEffect(() => {
    register('cardCode', {
      required: {
        value: true,
        message: I18n.t('product.service_list.error_card_code')
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

  useEffect(() => {
    if (prepaidCardError) {
     console.log('====================================');
     console.log(prepaidCardError);
     console.log('====================================');
    }
  }, [prepaidCardError])

  useEffect(() => {
    onChangeCardNumber(contractNo)
    onAmoutChange(Utils.formatAmountText(route.params.amount))
  }, [contractNo])

  return (
    <View style={styles.container}>
      <Topbar subTitle={title} title={I18n.t('product.recharge')} />
      <ScrollView style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <EnterCardNumber
            onChangeCardNumber={onChangeCardNumber}
            numberCard
            placeholder={I18n.t('product.input_card_number')}
            defaultNumberCard={contractNo}
          />
          <View style={[styles.element]}>
            <View style={Helpers.fill}>
              <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
              <AmountInputText
                style={styles.amountBold}
                placeholderTextColor={Colors.gray}
                value={amount}
                rightText="VND"
                onChangeText={onAmoutChange}
                returnKeyType="done"
                maxLength={16}
                placeholder={I18n.t('product.holder_amount')}
              />
              {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}
            </View>
          </View>

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

export default RechargeCard
