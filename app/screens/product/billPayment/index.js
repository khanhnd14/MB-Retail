import * as React from 'react'
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  Topbar,
  HeaderTop,
  Text,
  Icon,
  HistoryListBillPayment,
  MenuItem,
} from '../../../components'
import { Metrics, Colors, ApplicationStyles } from '../../../theme'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { productOperations } from '../../../state/product'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    marginBottom: Metrics.normal,
  },
  item: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: Metrics.medium,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    ...ApplicationStyles.shadow,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.primary2,
    flex: 8 / 10,
  },
  icon: {
    fontSize: 40,
    marginRight: 20,
    flex: 2 / 10,
    alignItems: 'flex-end',
  },
  recentlyList: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    alignItems: 'stretch',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: Dimensions.get('window').height,
  },
})
const HistoryBillPayment = () => {
  const { dataHistoryBillPayment } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(
      productOperations.getDataHistoryBillPayment({
        moduleType: 'BP',
      })
    )
  }, [])
  React.useEffect(() => {
    dispatch(productOperations.getAccount())
  }, [])
  return (
    <View style={styles.container}>
      <Topbar background={Colors.mainBg} title={I18n.t('product.bill_payment')} />
      <View style={{ paddingHorizontal: Metrics.medium }}>
        <MenuItem
          onPress={() => Navigation.push('BillPaymentScreen')}
          text={I18n.t('product.title_select_service')}
          leftColor={Colors.yellow}
        />
        <MenuItem
          onPress={() =>
            Navigation.push('AutoManagerBillScreen', {
              title_topBar: 'product.title_autoManagerBill',
              title_history: 'product.title_history_auto_payment',
              type_screen: 'BP',
            })
          }
          text={I18n.t('product.auto_bill_manager')}
          leftColor={Colors.yellow}
        />
      </View>

      <View style={styles.recentlyList}>
        <HeaderTop title={I18n.t('product.title_recently_list_bill')} />
        <HistoryListBillPayment data={dataHistoryBillPayment || null} typeModule="BP" />
      </View>
    </View>
  )
}
export default HistoryBillPayment
