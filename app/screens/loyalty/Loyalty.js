import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../theme'
import { Topbar, MenuItem } from '../../components'
import I18n from '../../translations'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.small * 1.8,
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
  title: { fontWeight: 'bold', fontSize: 15, color: Colors.primary2 },
  icon: { color: Colors.iconGray, fontSize: 40, marginRight: 20 },
})

const Loyalty = () => {
  const registerCard = () => {
    Navigation.push('RegisterCreditCard')
  }
  const game = () => {
    Navigation.push('ListWordsScreen')
  }
  return (
    <>
      <Topbar
        title={I18n.t('main.loyaty')}
        rightIcon={null}
        leftIcon={null}
        onLeftPress={null}
        background={Colors.mainBg}
      />
      <ScrollView style={[Helpers.fill, styles.container]}>
        <MenuItem icon="napgame" onPress={game} text={I18n.t('msbplus.game')} iconSize={35} />
        <MenuItem
          icon="mathe"
          onPress={registerCard}
          text={I18n.t('msbplus.register_card')}
          iconSize={35}
        />
        <MenuItem
          icon="nap_tien"
          onPress={() => Navigation.push('ExchangeScreen')}
          text={I18n.t('product.exchange_rate.title')}
          iconSize={55}
        />
        <MenuItem
          icon="icon-atm"
          onPress={() => Navigation.push('ATMScreen')}
          text={I18n.t('product.atm.title')}
          iconSize={42}
        />
      </ScrollView>
    </>
  )
}
export default Loyalty
