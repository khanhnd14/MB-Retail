import * as React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  FlatList
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, Text, ConfirmButton, } from '../../../components'
import { Metrics, Colors } from '../../../theme'
import { productOperations } from '../../../state/product'
import I18n from '../../../translations'
import { formatInputTextIsAmount } from '../../../utilities/common'
import * as Navigation from '../../../navigation'
import { Utils } from '../../../utilities'
import * as productTypes from '../../../state/product/types'

const styles = StyleSheet.create({
  item1: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: Metrics.medium * 0.7,
    paddingHorizontal: Metrics.medium,
    minHeight: Metrics.medium * 3.1,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  item2: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: Metrics.medium * 0.7,
    paddingHorizontal: Metrics.medium,
    minHeight: Metrics.medium * 3.1,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: Metrics.medium * 4
  },
  title: { fontWeight: 'bold', fontSize: 13, color: Colors.primary2 },
  container: {
    backgroundColor: Colors.white,
    flex: 1
  },
  content: {
    width: '100%',
    backgroundColor: Colors.mainBg,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: -1,
  },
  headerTop: {
    marginLeft: Metrics.normal * 1.3,
    marginTop: Metrics.medium * 1.4,
    marginBottom: Metrics.medium * 0.8,
    fontWeight: 'normal',
    fontSize: 15,
    color: Colors.textBlack
  },
  typeService: {
    width: '100%',
  },
  providerService: {
    fontWeight: 'bold',
    width: '100%',
    fontSize: 14,
    color: Colors.primary2,
    marginVertical: Metrics.tiny * 0.55
  },
  info: {
    fontWeight: 'normal',
    fontSize: 14,
    color: Colors.textBlack,
    marginTop: Metrics.tiny
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray9,
    marginTop: Metrics.normal,
    marginBottom: Metrics.normal * 0.4
  },
  history: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Metrics.tiny
  },
  wrapperList: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})
const _renderItem = ({ item }) => (
  <View style={styles.typeService}>
    <View style={styles.history}>
      <Text style={styles.info}>{item ? item?.tranTime : ''}</Text>
      <Text style={styles.info}>{formatInputTextIsAmount(item?.amount) ? formatInputTextIsAmount(item?.amount) : 0} VND</Text>
    </View>
    <View style={styles.hr} />
  </View>
)
const DetailAutoManagerBillScreen = ({ route }) => {
  const dispatch = useDispatch()
  const { items, routes, titleServices } = route.params
  const [loading, setLoading] = React.useState(false)

  const { title_topBar, title_history, type_screen } = routes.params
  React.useEffect(() => {
    dispatch(productOperations.getDataQueryScheduleHistory())
  }, [])
  const {
     dataQueryScheduleHistory,
     makeTransactionResult,
     makeTransactionError,
     sendOtpBillingResult,
     sendOtpBillingError
    } = useSelector((state) => state.product)

  const onDelete = () => {
    setLoading(true)
    dispatch(productOperations.makeTransactionBilling())
  }

  React.useEffect(() => {
    if (makeTransactionResult) {
      console.log('====================================');
      console.log('makeTransactionResult', makeTransactionResult);
      console.log('====================================');
      const { message } = makeTransactionResult
      const body = {
        transaction: message
      }
      dispatch(productOperations.sendOtpBilling(body))
    }
  }, [makeTransactionResult])

  React.useEffect(() => {
    if (sendOtpBillingResult) {
      console.log('====================================');
      console.log('sendOtpBillingResult', sendOtpBillingResult);
      console.log('====================================');
      setLoading(false)
      Navigation.push('AutoPaymentOTPScreen', {
        ...route.params,
        hideSaveInfo: true,
        hideEmail: true,
        amount: items.amount,
        titleServices,
        customerInfo: items.customerCode,
        hideCongrat: true,
        paramsMessage: I18n.t('product.service_list.delete_success'),
        redoTransaction: type_screen === 'BP' ? 'HistoryBillPayment' : 'RechargeScreen'
      })
    }
  }, [sendOtpBillingResult])

  React.useEffect(() => {
    if (makeTransactionError) {
      setLoading(false)
    }
  }, [makeTransactionError])

  React.useEffect(() => {
    if (sendOtpBillingError) {
      setLoading(false)
      dispatch([
        {
          type: productTypes.MAKE_TRANSACTION_BILLING_COMPLETED,
          payload: null
        },
        {
          type: productTypes.MAKE_TRANSACTION_BILLING_FAILED,
          payload: null
        },
        {
          type: productTypes.SEND_OTP_BILLING_COMPLETED,
          payload: null
        },
        {
          type: productTypes.SEND_OTP_BILLING_FAILED,
          payload: null
        }
      ])
    }
  }, [sendOtpBillingError])

  React.useEffect(() => {
    if (loading) {
      Utils.showLoading()
    } else {
      Utils.hideLoading()
    }
  }, [loading])

  return (
    <View style={styles.container}>
      <Topbar background={Colors.white} title={I18n.t(title_topBar)} />
      <ScrollView style={styles.content}>
        <Text style={styles.headerTop}>{I18n.t('product.title_detail_info')}</Text>
        <View style={styles.item1}>
          <View style={styles.typeService}>
            <Text style={styles.providerService}>{I18n.t('product.title_service_provide')}</Text>
            <Text style={styles.info}>{items.serviceName}</Text>
            <View style={styles.hr} />
            <Text style={styles.providerService}>{I18n.t('product.title_service')}</Text>
            <Text style={styles.info}>{items.serviceType}</Text>
            <View style={styles.hr} />
            <Text style={styles.providerService}>{I18n.t('product.title_date_create')}</Text>
            <Text style={styles.info}>{items.createDate} - {items.createTime}</Text>
          </View>
        </View>
        <View style={styles.item2}>
          <Text style={styles.providerService}>{I18n.t(title_history)}</Text>
          <View style={styles.wrapperList}>
            <FlatList
              data={dataQueryScheduleHistory}
              style={styles.list}
              renderItem={_renderItem}
              keyExtractor={(item, index) => `${index}`}
            />

          </View>
        </View>

      </ScrollView>
      <View style={{ backgroundColor: Colors.mainBg }}>
        <ConfirmButton
          onPress={onDelete}
          style={{
          paddingHorizontal: Metrics.medium,
        }}
          styleButton={{ width: '100%' }}
          loading={loading}
          text={I18n.t('action.action_delete')}
        />
      </View>
    </View>
  )
}
export default DetailAutoManagerBillScreen;
