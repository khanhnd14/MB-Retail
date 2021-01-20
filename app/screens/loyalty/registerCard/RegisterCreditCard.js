import React, { Fragment, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Helpers, Metrics, Colors } from '../../../theme'
import {
  Topbar,
  Text,
  TextInput,
  ConfirmButton,
  ComboBox,
  Icon,
  FloatingLabel,
} from '../../../components'
import * as Navigation from '../../../navigation'
import { applyCardOperations } from '../../../state/applycard'
import { userOperations } from '../../../state/user'
import I18n from '../../../translations'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  element: {
    ...Helpers.rowCross,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    paddingVertical: Metrics.tiny / 2,
  },
  content: {
    color: Colors.textBlack,
    paddingVertical: Metrics.tiny / 2,
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny,
    paddingRight: Metrics.tiny,
  },
  contentAmount: {
    color: Colors.text,
    paddingVertical: Metrics.tiny / 2,
  },
  line: {
    backgroundColor: Colors.line,
    height: 1,
  },
  formAmount: {
    fontSize: 12,
    color: Colors.gray1,
  },
  input: {
    paddingTop: Metrics.small,
  },
})
const dataChoice = [
  { display: '00:00', value: 0 },
  { display: '01:00', value: 1 },
  { display: '02:00', value: 2 },
  { display: '03:00', value: 3 },
  { display: '04:00', value: 4 },
  { display: '05:00', value: 5 },
  { display: '06:00', value: 6 },
  { display: '07:00', value: 7 },
  { display: '08:00', value: 8 },
  { display: '09:00', value: 9 },
  { display: '10:00', value: 10 },
  { display: '11:00', value: 11 },
  { display: '12:00', value: 12 },
  { display: '13:00', value: 13 },
  { display: '14:00', value: 14 },
  { display: '15:00', value: 15 },
  { display: '16:00', value: 16 },
  { display: '17:00', value: 17 },
  { display: '18:00', value: 18 },
  { display: '19:00', value: 19 },
  { display: '20:00', value: 20 },
  { display: '21:00', value: 21 },
  { display: '22:00', value: 22 },
  { display: '23:00', value: 23 },
]

const RegisterCreditCard = () => {
  const dispatch = useDispatch()
  const [addressEdit, setAddress] = useState('')
  const [amount, setAmount] = useState('0')
  const [timeFrom, setTimeFrom] = useState(dataChoice[8])
  const [timeTo, setTimeTo] = useState(dataChoice[17])

  const { mobile, address, cifAcctName } = useSelector((state) => state.user)
  const { registerComplete, registerError } = useSelector((state) => state.applycard)

  const [loading, setLoading] = useState(false)
  const refTimeFrom = useRef(null)
  const refTimeTo = useRef(null)

  useEffect(() => {
    setAddress(address)
  }, [address])

  useEffect(() => {
    dispatch(userOperations.getInfoUser())
  }, [])

  useEffect(() => {
    if (loading && registerComplete) {
      setLoading(false)
      const params = { paramsMessage: I18n.t('msbplus.applyCardSucc') }
      Navigation.popToPop()
      Navigation.push('SuccessMess', params)
    }
  }, [registerComplete])

  useEffect(() => {
    if (loading && registerError) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = 'RegisterCreditCard'
      const params = { redoTransaction }
      Navigation.push('Failed', params)
    }
  }, [registerError])

  const onRegister = () => {
    if (timeFrom.value > timeTo.value) {
      Utils.showToast(I18n.t('msbplus.timeCallInvalid'))
      return
    }
    const body = {
      fromTime: timeFrom.value,
      toTime: timeTo.value,
      address: addressEdit,
      income: amount,
    }
    setLoading(true)
    dispatch(applyCardOperations.register(body))
  }

  const onSelectTimeFrom = () => {
    refTimeFrom.current && refTimeFrom.current.show()
  }

  const onSelectTimeTo = () => {
    refTimeTo.current && refTimeTo.current.show()
  }

  const onSelectFrom = (item) => {
    refTimeFrom.current && refTimeFrom.current.hide()
    setTimeFrom(item)
  }

  const onSelectTo = (item) => {
    refTimeTo.current && refTimeTo.current.hide()
    setTimeTo(item)
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('main.loyaty')} subTitle={I18n.t('msbplus.register_card')} />
      <KeyboardAwareScrollView
        style={Helpers.fullWidth}
        extraHeight={300}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Helpers.fill, styles.container]}>
          <View style={[styles.element]}>
            <View style={Helpers.fill}>
              <Text style={[styles.title]}>{I18n.t('msbplus.nameOfCustomer')}</Text>
              <Text style={[styles.content]}>{cifAcctName}</Text>
            </View>
          </View>
          <View style={[styles.element]}>
            <View style={Helpers.fill}>
              <Text style={[styles.title]}>{I18n.t('msbplus.address')}</Text>
              <TextInput
                value={addressEdit}
                placeholderTextColor="#828282"
                onChangeText={(val) => setAddress(val)}
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={[styles.element]}>
            <View style={Helpers.fill}>
              <Text style={[styles.title]}>{I18n.t('msbplus.phone')}</Text>
              <Text style={[styles.content]}>{mobile}</Text>
            </View>
          </View>
          <View style={[styles.element]}>
            <View style={Helpers.fill}>
              <Text style={[styles.title]}>{I18n.t('msbplus.time')}</Text>
              <View style={Helpers.rowCross}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flex: 1,
                  }}
                  onPress={onSelectTimeFrom}
                >
                  <Text style={[styles.contentBold]}>{I18n.t('msbplus.timeFrom')}</Text>
                  <Text style={[styles.contentBold]}>{timeFrom.display}</Text>
                  <Icon name="account_down" size={8} color={Colors.primary2} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flex: 1,
                  }}
                  onPress={onSelectTimeTo}
                >
                  <Text style={[styles.contentBold]}>{I18n.t('msbplus.timeTo')}</Text>
                  <Text style={[styles.contentBold]}>{timeTo.display}</Text>
                  <Icon name="account_down" size={8} color={Colors.primary2} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[styles.element, { borderBottomWidth: 0 }]}>
            <View style={Helpers.fill}>
              <Text style={[styles.title]}>{I18n.t('msbplus.income')}</Text>
              <FloatingLabel
                inputStyle={{ paddingVertical: Metrics.tiny }}
                value={amount}
                isAmount
                rightText="VND"
                placeholderTextColor="#828282"
                onChangeText={(val) => setAmount(val)}
                returnKeyType="done"
                keyboardType="numeric"
                maxLength={13}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ConfirmButton onPress={() => onRegister()} loading={loading} />
      <ComboBox
        ref={refTimeFrom}
        data={dataChoice}
        onSelect={onSelectFrom}
        title={I18n.t('msbplus.time')}
      />
      <ComboBox
        ref={refTimeTo}
        data={dataChoice}
        onSelect={onSelectTo}
        title={I18n.t('msbplus.time')}
      />
    </Fragment>
  )
}
export default RegisterCreditCard
