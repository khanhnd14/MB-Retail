import * as React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  Topbar,
  HeaderTop,
  HistoryListBillPayment,
  MenuItem,
} from '../../../components'
import { Metrics, Colors, ApplicationStyles } from '../../../theme'
import * as Navigation from '../../../navigation'
import { productOperations } from '../../../state/product'
import I18n from '../../../translations'

const styles = StyleSheet.create({
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
    color: Colors.iconGray,
    fontSize: 40,
    flex: 2 / 10,
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
const RechargeScreen = () => {
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(
      productOperations.getDataHistoryBillPayment({
        moduleType: 'RG',
      })
    )
    dispatch(
      productOperations.getServiceList({
        moduleType: 'RG',
      })
    )
    dispatch(productOperations.queryServiceListTC())
  }, [])
  React.useEffect(() => {
    dispatch(productOperations.getAccount())
  }, [])
  const dataHistoryBillPayment = useSelector((state) => state.product.dataHistoryBillPayment)
  return (
    <View style={{ backgroundColor: Colors.mainBg }}>
      <Topbar title={I18n.t('product.recharge')} background={Colors.mainBg} />
      <View style={{ paddingHorizontal: Metrics.medium }}>
        <MenuItem
          onPress={() => Navigation.push('ListRechargeScreen')}
          text={I18n.t('product.title_select_service')}
          leftColor={Colors.yellow}
        />
        <MenuItem
          onPress={() =>
            Navigation.push('AutoManagerBillScreen', {
              title_topBar: 'product.title_top_bar_recharge_auto',
              title_history: 'product.title_history_auto_recharge',
              type_screen: 'RG',
            })
          }
          text={I18n.t('product.Automatic_deposit_management')}
          leftColor={Colors.yellow}
        />
      </View>
      <View style={styles.recentlyList}>
        <HeaderTop title={I18n.t('product.title_recently_list_recharge')} />
        <HistoryListBillPayment data={dataHistoryBillPayment || null} typeModule="RG" />
      </View>
    </View>
  )
}
export default RechargeScreen
