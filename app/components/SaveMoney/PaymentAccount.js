import React, { forwardRef, useImperativeHandle, useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import MsbIcon from '../MsbIcon'
import { Colors, Metrics } from '../../theme'
import { Text } from '..'

const styles = StyleSheet.create({
  accNumberContainer: {
    flexDirection: 'row',
     alignItems: 'center'
  },
  accNumber: {
    marginLeft: Metrics.normal,
    fontWeight: 'bold',
    marginHorizontal: Metrics.tiny * 3,
    marginVertical: Metrics.tiny * 2,
    fontSize: 15
  }
})

const PaymentAccount = forwardRef(({ index, value, changeDDAccount, accChoosed, fromAcc }, ref) => {
  const onChoice = (acctNo) => {
    changeDDAccount(acctNo)
  }

  useImperativeHandle(ref, () => ({

    onChoice,

  }));

  useEffect(() => {
    if (value.acctNo === fromAcc) {
      onChoice(fromAcc)
    }
  }, [fromAcc])
  return (
    <TouchableOpacity onPress={() => onChoice(value.acctNo)} key={index} style={styles.accNumberContainer}>
      <Text style={styles.accNumber}>{`${value ? value.accountInString : ''}`}</Text>
      {accChoosed === value.acctNo ? <MsbIcon name="icon-check" color={Colors.buttonPrimary[0]} size={Metrics.normal} /> : <MsbIcon name="icon-detail" color={Colors.check} />}
    </TouchableOpacity>
    )
})

export default PaymentAccount
