/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Colors, Metrics } from '../../../theme'
import { Text, Success, AmountLabel } from '../../../components'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import SendMailDialog from './SendMailDialog'

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
    // fontWeight: 'bold',
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1,
  },
  detailRight: {
    fontSize: 14,
    color: Colors.white,
    paddingHorizontal: Metrics.tiny,
    flex: 1,
    textAlign: 'right',
  },
})

const TransferSuccess = (props) => {
  const { fullName } = useSelector((state) => state.user)
  const { params } = props.route
  console.log('props transfer:', params)
  const { lblAmount, lblBenefitAcc, lblBenefitName, type, showButton, lblRemark } = params
  const [isSendEmail, setSendEmail] = useState(false)
  const onSaveBenefit = () => {
    Navigation.push('SaveBenefit', params)
  }

  const textBenefit =
    type === 'C'
      ? I18n.t('transfer.benefit_card_number')
      : I18n.t('transfer.benefit_account_number')

  return (
    <>
      <Success
        {...props}
        {...params}
        onSave={onSaveBenefit}
        onEmail={() => setSendEmail(true)}
        showButton={showButton}
      >
        <View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('transfer.from_acct')}</Text>
            <Text style={styles.detailRight}>{fullName}</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('transfer.amount')}</Text>
            <AmountLabel style={styles.detailRight} value={lblAmount} currency="VND" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{textBenefit}</Text>
            <Text style={styles.detailRight}>{lblBenefitAcc}</Text>
          </View>
          <View style={[styles.detailContent, { borderBottomWidth: showButton ? 1 : 0 }]}>
            <Text style={styles.detail}>{I18n.t('transfer.benefit_account_name')}</Text>
            <Text style={styles.detailRight}>{lblBenefitName}</Text>
          </View>
          {showButton && (
            <View style={[styles.detailContent, { borderBottomWidth: 0 }]}>
              <Text style={styles.detail}>{I18n.t('transfer.content')}</Text>
              <Text style={styles.detailRight}>{lblRemark}</Text>
            </View>
          )}
        </View>
      </Success>
      <SendMailDialog
        visible={isSendEmail}
        handleModal={() => setSendEmail(false)}
        tokenTransaction={params.tokenTransaction}
      />
    </>
  )
}

export default TransferSuccess
