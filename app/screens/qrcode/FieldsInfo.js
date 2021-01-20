/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { TextInput, Text, AmountInputText } from '../../components'
import { Colors, Metrics } from '../../theme'
import { transferSelectors } from '../../state/transfer'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginTop: Metrics.tiny * 2,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny,
  },
  formAmount: {
    fontSize: 15,
    paddingVertical: 4,
    color: Colors.gray1,
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
  },
  machantname: {
    paddingTop: Metrics.tiny,
    paddingBottom: Metrics.normal
  },
  field: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray9,
    marginHorizontal: Metrics.normal,
    paddingVertical: Metrics.normal
  },
  code: {
    paddingVertical: Metrics.tiny
  },
  discount: {
    color: Colors.buttonPrimary[2],
    textDecorationLine: 'line-through',
    paddingVertical: Metrics.tiny
  }
})

const FieldsInfo = ({ setAmountPayment, onChangeCode, checkPromotioncode, setAmountDiscount }) => {
  const [amount, setAmount] = useState('')
  const [discount, setDiscount] = useState('')
  const [amountInWord, setAmoutInWord] = useState(null)
  const { parseQrCodeResult, promotionCodeResult } = useSelector((state) => state.qrcode)
  const [defaultAmount, setDefaultAmount] = useState(parseQrCodeResult?.price)

  const onAmoutChange = (amount) => {
    setAmount(amount.replace(/,/g, ''))
    setAmoutInWord(transferSelectors.amountToWord(amount))
    setAmountPayment(amount)
  }

  const onBlurCode = () => {
    checkPromotioncode()
  }

  useEffect(() => {
    if (parseQrCodeResult) {
      parseQrCodeResult.price && onAmoutChange(parseQrCodeResult.price.toString())
    }
  }, [parseQrCodeResult])

  useEffect(() => {
    if (promotionCodeResult) {
      console.log('====================================');
      console.log(promotionCodeResult);
      console.log('====================================');
      const defaultAmount = Utils.formatAmountText(promotionCodeResult.discountedAmount)
      setDiscount(Utils.formatAmountText(amount))
      setAmountDiscount(promotionCodeResult.discountedAmount)
      setAmount(defaultAmount)
      setDefaultAmount(defaultAmount)
    }
  }, [promotionCodeResult])

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.title}>{I18n.t('qrcode.merchant')}</Text>
        <TextInput style={styles.machantname} defaultValue={parseQrCodeResult?.merchantName} />
      </View>
      <View style={styles.field}>
        <Text style={styles.title}>{I18n.t('qrcode.qr_indentify')}</Text>
        <TextInput style={styles.machantname} defaultValue={parseQrCodeResult?.qrIndentify} />
      </View>
      <View style={styles.field}>
        <Text style={styles.title}>{I18n.t('qrcode.payment')}</Text>
        {!!discount && <Text style={styles.discount}>{discount} <Text>VND</Text></Text>}
        <AmountInputText
          style={styles.contentBold}
          value={amount}
          rightText="VND"
          onChangeText={onAmoutChange}
          returnKeyType="done"
          maxLength={16}
          defaultValue={defaultAmount}
        />
        {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}

      </View>
      <View style={[styles.field, { borderBottomWidth: 0 }]}>
        <Text style={styles.title}>Mã giảm giá</Text>
        <TextInput onBlur={onBlurCode} style={styles.code} onChangeText={onChangeCode} />
      </View>
    </View>
    )
}
export default FieldsInfo
