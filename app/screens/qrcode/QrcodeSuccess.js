/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'
import { useDispatch } from 'react-redux'
import { Success, AmountLabel, Text } from '../../components'
import { Colors, Metrics } from '../../theme'
import SendMailDialog from '../transfer/common/SendMailDialog'
import { productOperations } from '../../state/product'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1
  },
  detailRight: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1,
    textAlign: 'right'
  },
})

const QrcodeSuccess = (props) => {
  const { payment, service, merchant, redoTransaction, tokenTransaction } = props.route.params
  const [isSendEmail, setSendEmail] = React.useState(false)
  const dispatch = useDispatch()

  const onSaveBenefit = () => {

  }

  const onSendEmail = (email) => {
    const body = {
      tokenTransaction,
      email
    }
    dispatch(productOperations.paymentSendEmail(body))
    // typeModule === 'RG' && dispatch(productOperations.rechargeSendEmail(body))
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      Navigation.navigate('MainScreen')
    })
  }, [])
  return (
    <>
      <Success
        {...props}
        {...props.route.params}
        hideSaveInfo
        onSave={onSaveBenefit}
        redoTransaction={redoTransaction}
        onEmail={() => setSendEmail(true)}
      >
        <View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('qrcode.payment')}</Text>
            <AmountLabel style={styles.detailRight} value={payment} currency="VND" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('qrcode.service')}</Text>
            <Text style={styles.detailRight}>{service}</Text>
          </View>
          <View style={[styles.detailContent, { borderBottomWidth: 0 }]}>
            <Text style={styles.detail}>{I18n.t('qrcode.merchant')}</Text>
            <Text style={styles.detailRight}>{merchant}</Text>
          </View>
        </View>
      </Success>
      <SendMailDialog
        visible={isSendEmail}
        handleModal={() => setSendEmail(false)}
        tokenTransaction={tokenTransaction}
        onSendEmail={onSendEmail}
      />
    </>
  )
}

export default QrcodeSuccess
