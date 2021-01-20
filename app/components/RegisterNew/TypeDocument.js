/* eslint-disable no-shadow */
import React, { useState } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import { useDispatch } from 'react-redux'
import { Colors, Metrics } from '../../theme'
import MsbIcon from '../MsbIcon'
import SelectCardType from './SelectCardType'
import { Text, TextInput } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    marginHorizontal: Metrics.normal,
    paddingVertical: Metrics.small,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.textBlack,
    fontSize: 16,

  },
  amountDash: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  amountNumber: {
    color: Colors.gray1,
    fontSize: 16,
    marginTop: Metrics.small,
  },
  amountString: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
  input: {

  }
})
let refSelect
const TypeDocument = ({ cardTypes, setIdType }) => {
  const [cardType, setCardType] = useState(undefined)

  const setRefSelect = (ref) => {
    refSelect = ref
  }

  const onShowSelect = () => {
    refSelect.current.setVisible(true)
  }

  const onChoiceCardType = (cardType) => {
    setCardType(cardType)
    setIdType(cardType.id)
  }

  return (
    <TouchableWithoutFeedback onPress={onShowSelect}>
      <View style={styles.container}>
        <SelectCardType onChoiceCardType={onChoiceCardType} setRef={setRefSelect} data={cardTypes} />
        <Text style={styles.title}>Loại giấy tờ</Text>
        <View
          style={{
          marginVertical: Metrics.small,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
        >
          <TextInput
            style={styles.input}
            placeholder="CMND"
            placeholderTextColor={Colors.gray}
            keyboardType="number-pad"
            editable={false}
            value={cardType && cardType.id}
          />
          <MsbIcon name="icon-detail" color={Colors.check} />

        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
export default TypeDocument
