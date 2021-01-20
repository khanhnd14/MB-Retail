import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Metrics, Colors } from '../../../theme'
import {
  Topbar,
} from '../../../components'
import CollapsibleComponent from '../../../components/Account/collapsible.component'
import * as Navigation from '../../../navigation'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.normal,
  },
  contentLayout: {
    backgroundColor: Colors.white,
    padding: Metrics.normal,
    marginTop: Metrics.small,
    paddingBottom: Metrics.small * 6,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  btnLayout: {
    padding: Metrics.normal,
  },
  btn: {
    backgroundColor: Colors.primary2,
    height: 50,
    borderRadius: 38,
  },
  btnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
})

const StoreSaveScreen = ({ route }) => {
  const { title, price } = route.params
  const { savingLocalizeAccounts, savingOnlineAccounts } = useSelector((state) => state.save)

  const dataSaving = []
  savingLocalizeAccounts.forEach(element => {
    dataSaving.push({ title: element.alias, content: element.receiptNoInString, amount: element.currentCashValue, currencyCode: element.currencyCode })
  });
  return (
    <View style={styles.container}>
      <Topbar title={I18n.t('product.saving')} />
      <CollapsibleComponent
        iconName="icon-tietkiem"
        title={title}
        amount={price}
        data={dataSaving}
        onItemPress={(element) => { Navigation.push('SavingAcountScreen', { element: element + savingOnlineAccounts.length, page: 'StoreSaveScreen' }) }}
        currencyCode={savingLocalizeAccounts[0]?.currencyCode}
        expand
      />

    </View>
  )
}

export default StoreSaveScreen
