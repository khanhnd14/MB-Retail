/* eslint-disable no-new-wrappers */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors, Metrics } from '../../theme'
import {
  AmountLabel,
  ConfirmButton,
  SelectAccount,
  Text,
  AmountInputText,
  Icon,
} from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { employeeOperations } from '../../state/employee'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.small * 1.8,
    marginHorizontal: Metrics.small * 1.8,
  },
  contentContainer: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.small * 1.8,
  },
  element: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    paddingVertical: Metrics.tiny / 2,
  },
  input: {
    ...Helpers.contentWidth,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: Metrics.tiny * 10,
    marginTop: Metrics.tiny,
    paddingHorizontal: Metrics.small,
  },
  inputText: {
    fontWeight: 'bold',
  },
  contentAmount: {
    color: Colors.textBlack,
    paddingTop: Metrics.tiny / 2,
    paddingBottom: Metrics.medium,
    fontSize: 16,
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.small,
  },
  elementEnd: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: Metrics.small * 1.8,
  },
  deregisterBtn: {
    backgroundColor: Colors.primary2,
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    zIndex: 2,
  },
})
const EmployeeTransfer = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { balance, rolloutAcc, transferComplete, transferError } = useSelector(
    (state) => state.employee
  )
  const [rolloutAccountNo, setRolloutAccountNo] = useState(null)
  const [amount, setAmount] = useState('0')

  useEffect(() => {
    dispatch(employeeOperations.getBalance())
    dispatch(employeeOperations.getRolloutAcc())
  }, [])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = 'EmployeeScreen'
      const params = {
        ...transferComplete,
        redoTransaction,
        lblAmount: amount.replace(/,/g, ''),
        showButton: false,
      }
      Navigation.push('TransferSuccess', params)
    }
  }, [transferComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = 'EmployeeScreen'
      const params = { ...transferComplete, redoTransaction }
      Navigation.push('Failed', params)
    }
  }, [transferError])

  const onSelectRolloutAccountNo = (val) => {
    setRolloutAccountNo(val)
  }

  const deregister = () => {
    Utils.confirm(I18n.t('application.title_confirm'), I18n.t('employee.deregisterConfirm'), () => {
      Utils.showLoading()
      dispatch(employeeOperations.deregister())
    })
}

  const completeTransfer = () => {
    if (!amount || amount === '0') {
      Utils.toast(I18n.t('employee.enterAmount'))
      return
    }
    if (!rolloutAccountNo) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    const enteredAmount = amount.replace(/,/g, '')
    if (Number.isNaN(enteredAmount)) {
      Utils.toast(I18n.t('employee.enterValidAmount'))
      return
    }
    if (enteredAmount > balance) {
      Utils.toast(I18n.t('employee.enterValidAmount'))
      return
    }
    setLoading(true)
    dispatch(
      employeeOperations.transfer({
        amount: amount.replace(/,/g, ''),
        toBenefitAcc: rolloutAccountNo,
      })
    )
  }
  return (
    <Fragment>
      <View style={[Helpers.fill]}>
        <View style={[Helpers.fill]}>
          <TouchableOpacity style={styles.deregisterBtn} onPress={deregister}>
            <Icon name="icon-close" color="#FFF" size={16} />
          </TouchableOpacity>
          <View
            style={[
              styles.element,
              styles.container,
              { marginBottom: Metrics.small, backgroundColor: Colors.white },
            ]}
          >
            <Text style={styles.title}>{I18n.t('employee.available_balance')}</Text>
            <AmountLabel style={styles.contentAmount} value={balance} currency="VND" />
          </View>
          <View style={styles.contentContainer}>
            <SelectAccount
              data={rolloutAcc || []}
              onSelectRolloutAccountNo={onSelectRolloutAccountNo}
            />
            <View
              style={{
                height: 1,
                backgroundColor: Colors.line,
                marginHorizontal: Metrics.small * 1.8,
              }}
            />
            <View style={[styles.element, styles.elementEnd]}>
              <Text style={styles.title}>{I18n.t('employee.amount')}</Text>
              <AmountInputText
                style={styles.contentBold}
                value={amount}
                rightText="VND"
                onChangeText={(val) => setAmount(val)}
                returnKeyType="done"
                maxLength={16}
              />
            </View>
          </View>
        </View>
        <ConfirmButton onPress={() => completeTransfer()} loading={loading} />
      </View>
    </Fragment>
  )
}

export default EmployeeTransfer
