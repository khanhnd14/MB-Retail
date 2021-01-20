import React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { HeaderTop, Topbar, SelectAccount, Icon, ConfirmButton, Text } from '../../../../../components'
import I18n from '../../../../../translations'
import { Colors, Metrics } from '../../../../../theme'
import { numberWithCommas } from '../../../../../utilities/common'
import styles from './style'
import { Utils } from '../../../../../utilities'

const PayFeeConfirm = ({ route }) => {
  const { body, title } = route.params
  const { pRolloutAccountNo } = body
  const account = useSelector((state) => state.product.account)
  const { serviceProvider, rechargeAmount, loading } = useSelector((state) => state.product)
  const accountSelect = account.filter((item) => pRolloutAccountNo === item.acctNo)[0]
  const provider = serviceProvider.filter((item) => body.billCode === item.value)[0]
  console.log('accountSelect', serviceProvider)
  console.log('body', body)
  console.log('provider', provider)
  const onSubmit = () => {
  }
  return (
    <View style={styles.bodyContainer}>
      <ScrollView style={styles.scrollView}>
        <Topbar title={I18n.t('product.recharge')} />
        <HeaderTop title={title} />
        <View style={styles.container}>
          <View style={styles.contentLayout}>
            <View style={styles.account}>
              <View style={styles.accountContainer}>
                <Text style={styles.title}>Tài khoản</Text>
                <Text style={styles.accountNo}>
                  {`${accountSelect ? accountSelect.accountInString : ''} - ${accountSelect ? accountSelect.alias : ''}`}
                </Text>
                <Text style={styles.amount}>
                  {`${numberWithCommas(accountSelect ? accountSelect.availableBalance : '')} VND`}
                </Text>
              </View>
              <View style={[styles.iconCheckContainer, { right: Metrics.small }]}>
                <Icon name="icon-circle-check" size={35} color={Colors.mainBg} />
                <View style={styles.iconCheck}>
                  <Icon name="icon-check" size={18} color={Colors.check} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.container2}>
          {body && body.billCode && provider ? (
            <View style={styles.content}>
              <View style={styles.account}>
                <View style={styles.accountContainer}>
                  <Text style={styles.title}>{I18n.t('product.title_supplier')}</Text>
                  <Text>{provider.label}</Text>
                </View>
                <View style={styles.iconCheckContainer}>
                  <Icon name="icon-circle-check" size={35} color={Colors.mainBg} />
                  <View style={styles.iconCheck2}>
                    <Icon name="icon-check" size={18} color={Colors.check} />
                  </View>
                </View>
              </View>
            </View>
        ) : null}
          {body && body.customer_code ? (
            <View style={styles.content}>
              <View style={styles.account}>
                <View style={styles.accountContainer}>
                  <Text style={styles.title}>{I18n.t('product.customer_code')}</Text>
                  <Text>{body.customer_code}</Text>
                </View>
                <View style={styles.iconCheckContainer}>
                  <Icon name="icon-circle-check" size={35} color={Colors.mainBg} />
                  <View style={styles.iconCheck2}>
                    <Icon name="icon-check" size={18} color={Colors.check} />
                  </View>
                </View>
              </View>
            </View>
        ) : null}
          {body && body.amount ? (
            <View style={{ ...styles.content }}>
              <View style={styles.account}>
                <View style={styles.accountContainer}>
                  <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
                  <Text>{`${numberWithCommas(body.amount.value)} VND`}</Text>
                </View>
                <View style={styles.iconCheckContainer}>
                  <Icon name="icon-circle-check" size={35} color={Colors.mainBg} />
                  <View style={styles.iconCheck2}>
                    <Icon name="icon-check" size={18} color={Colors.check} />
                  </View>
                </View>
              </View>
            </View>
      ) : null}
          {body && body.tranDate ? (
            <View style={{ ...styles.content, borderBottomWidth: 0 }}>
              <View style={styles.account}>
                <View style={styles.accountContainer}>
                  <Text style={styles.title}>{I18n.t('transfer.time')}</Text>
                  <Text>{Utils.toStringServerDate(body.tranDate)}</Text>
                </View>
                <View style={styles.iconCheckContainer}>
                  <Icon name="icon-circle-check" size={35} color={Colors.mainBg} />
                  <View style={styles.iconCheck2}>
                    <Icon name="icon-check" size={18} color={Colors.check} />
                  </View>
                </View>
              </View>
            </View>
    ) : null}
        </View>
      </ScrollView>
      <ConfirmButton onPress={onSubmit} loading={loading} style={styles.buttonConfirm} />
    </View>
  )
}

export default PayFeeConfirm
