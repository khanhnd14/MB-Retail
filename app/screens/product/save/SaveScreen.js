import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity, ScrollView, StyleSheet, View } from 'react-native'
import _ from 'lodash'
import I18n from 'i18n-js'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../../theme'
import { Topbar, Text, Icon, MenuItem } from '../../../components'
import * as Navigation from '../../../navigation'
import MsbIcon from '../../../components/MsbIcon'
import { getCategory, getListSaveAcount } from '../../../state/save/actions'
import { Utils } from '../../../utilities'
import CollapsibleComponent from '../../../components/Account/collapsible.component'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
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
    justifyContent: 'space-between',
    ...ApplicationStyles.shadow,
  },
  title: { fontWeight: 'bold', fontSize: 16, color: Colors.primary2 },
  icon: { color: Colors.iconGray, fontSize: 40, marginRight: 20 },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  registerTest: {
    fontWeight: 'bold',
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    marginLeft: Metrics.normal * 2
  },
  price: {
    fontFamily: 'Helvetica',
    marginTop: Metrics.tiny
  },
  openSave: {
    paddingHorizontal: Metrics.normal
  }
})

const SaveScreen = () => {
  const savingOnlineAccounts = useSelector((state) => state.save.savingOnlineAccounts)
  const savingLocalizeAccounts = useSelector((state) => state.save.savingLocalizeAccounts)
  const { loadingCreateSaving } = useSelector((state) => state.save)

  const [totalSavingOnline, setTotalSavingOnline] = React.useState(undefined)
  const [totalSavingLocalize, setTotalSavingLocalize] = React.useState(undefined)

  const dataSavingOnline = React.useMemo(() => savingOnlineAccounts.map((value, index) => ({ title: value.alias, content: value.receiptNoInString, amount: value.currentCashValue, currencyCode: value.currencyCode })), [savingOnlineAccounts])
  const dataSavingLocalize = React.useMemo(() => savingLocalizeAccounts.map((value, index) => ({ title: value.alias, content: value.receiptNoInString, amount: value.currentCashValue, currencyCode: value.currencyCode })), [savingOnlineAccounts])

  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(getCategory())
    dispatch(getListSaveAcount())
  }, [])

  React.useEffect(() => {
    if (loadingCreateSaving) {
      Utils.showLoading()
    } else {
      Utils.hideLoading()
    }
  }, [loadingCreateSaving])

  React.useEffect(() => {
    const currentCashValueOnline = []
    const currentCashValueLocalize = []
    savingOnlineAccounts.forEach((acc) => {
      acc.currencyCode === 'VND' && currentCashValueOnline.push(typeof acc.currentCashValue === 'number' ? acc.currentCashValue : 0)
    })
    savingLocalizeAccounts.forEach((acc) => {
      acc.currencyCode === 'VND' && currentCashValueLocalize.push(typeof acc.currentCashValue === 'number' ? acc.currentCashValue : 0)
    })
    setTotalSavingOnline(_.sum(currentCashValueOnline))
    setTotalSavingLocalize(_.sum(currentCashValueLocalize))
    console.log(totalSavingOnline)
  }, [savingOnlineAccounts])

  return (
    <>
      <Topbar background={Colors.mainBg} title={I18n.t('product.saving')} />
      <ScrollView style={[Helpers.fill, styles.container]}>

        <View style={styles.openSave}>
          <MenuItem
            onPress={() => Navigation.push('OpenSaveScreen')}
            text={I18n.t('account.open_save')}
            leftColor={Colors.yellow}
            icon="icon-tietkiem"
          />
          <MenuItem
            onPress={() => Navigation.push('ODServiceScreen')}
            text={I18n.t('overdraft.fromOnlineSaving.title')}
            leftColor={Colors.yellow}
            icon="icon-tietkiem"
          />
        </View>

        {dataSavingOnline.length ? (
          <CollapsibleComponent
            iconName="icon-tietkiem"
            title={I18n.t('account.live_save')}
            amount={totalSavingOnline}
            data={dataSavingOnline}
            currencyCode={savingOnlineAccounts[0]?.currencyCode}
            expand
            onItemPress={(element) => { Navigation.push('SavingAcountScreen', { element, page: 'LiveSaveScreen' }) }}
          />
        ) : null}

        {dataSavingLocalize.length ? (
          <CollapsibleComponent
            iconName="icon-tietkiem"
            title={I18n.t('account.store_save')}
            amount={totalSavingLocalize}
            data={dataSavingLocalize}
            currencyCode={savingOnlineAccounts[0]?.currencyCode}
            expand
            onItemPress={(element) => { Navigation.push('SavingAcountScreen', { element, page: 'StoreSaveScreen' }) }}
          />
        ) : null}

      </ScrollView>
    </>
  )
}
export default SaveScreen
