import React, { useState, useMemo } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native'
import I18n from 'i18n-js'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { Metrics, Colors } from '../../theme'
import { transferSelectors } from '../../state/transfer'
import ModalSelect from '../ModalSelect'
import MsbIcon from '../MsbIcon'
import { Text } from '..'

const styles = StyleSheet.create({
  amountContainer: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingBottom: Metrics.normal
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingTop: Metrics.tiny * 2,
    paddingLeft: Metrics.tiny,
  },
  formAmount: {
    paddingLeft: Metrics.tiny,
    fontSize: 12
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: 0,
  },
})

const SelectPayment = ({ onSelectPayment, filledAmount }) => {
  const {
    rechargeAmount,

  } = useSelector((state) => state.product)
  const [isVisible, setIsVisible] = useState(false)
  const [payment, setPayment] = React.useState(null)

  const setVisibleAmount = (bool) => {
    setIsVisible(bool)
  }
  const amount = useMemo(() => rechargeAmount[_.findIndex(rechargeAmount, (e) => e.value.toString() === filledAmount)], [filledAmount])
  return (
    <TouchableWithoutFeedback onPress={() => setVisibleAmount(true)}>
      <View style={styles.amountContainer}>
        <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
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
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: Metrics.tiny,
            }}
          >
            {payment?.label || amount?.label || <Text style={{ fontWeight: 'normal', color: Colors.gray, }}>{I18n.t('product.select_amount')}</Text>}
          </Text>
          <MsbIcon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />

        </View>
        <Text style={styles.formAmount}>
          {transferSelectors.amountToWord(payment?.value ? payment?.value.toString() : (amount ? amount?.value.toString() : 0))}
        </Text>
        <ModalSelect
          title={I18n.t('product.amount')}
          visible={isVisible}
          handleModal={() => setVisibleAmount(false)}
        >
          <ScrollView>
            {rechargeAmount.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  marginHorizontal: Metrics.small * 4,
                  paddingVertical: Metrics.small,
                  ...(index !== rechargeAmount.length - 1 && {
                    borderBottomColor: Colors.gray6,
                    borderBottomWidth: 1,
                  }),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  setPayment(item)
                  onSelectPayment(item)
                  setVisibleAmount(false)
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, color: Colors.textBlack }}>{item?.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ModalSelect>
      </View>
    </TouchableWithoutFeedback>
    )
}

export default SelectPayment
