import React, { Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { Helpers, Metrics, Colors } from '../../theme'
import { Topbar, MenuItem } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.medium
  },
})
const TransferScreen = () => {
  function internalTransfer() {
    Navigation.push('InternalTransfer')
  }
  function interbankTransfer() {
    Navigation.push('InterbankTransfer')
  }
  function stockTransfer() {
    Navigation.push('StockTransfer')
  }
  function managerTransfer() {
    Navigation.push('ManagerTransfer')
  }
  function managerBenefit() {
    Navigation.push('ManagerBenefit')
  }
  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.title')} background={Colors.mainBg} />
      <View style={[Helpers.fill, styles.container]}>
        <MenuItem
          onPress={internalTransfer}
          text={I18n.t('transfer.internal_transfer')}
          leftColor={Colors.yellow}
        />
        <MenuItem
          onPress={interbankTransfer}
          text={I18n.t('transfer.interbank_transfer')}
          leftColor={Colors.yellow}
        />
        <MenuItem
          onPress={stockTransfer}
          text={I18n.t('transfer.stock_transfer')}
          leftColor={Colors.yellow}
        />
        <MenuItem
          onPress={managerTransfer}
          text={I18n.t('transfer.manager_transfer')}
          leftColor={Colors.yellow}
        />
        <MenuItem
          onPress={managerBenefit}
          text={I18n.t('transfer.manager_benefit')}
          leftColor={Colors.yellow}
        />
      </View>
    </Fragment>
  )
}
export default TransferScreen
