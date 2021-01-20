import * as React from 'react'
import { View } from 'react-native'
import { Topbar, MenuItem } from '../../../components'
import { Metrics, Colors } from '../../../theme'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'

const ListRechargeScreen = () => (
  <View style={{ backgroundColor: Colors.mainBg, flex: 1 }}>
    <Topbar background={Colors.mainBg} title={I18n.t('product.recharge')} />
    <View style={{ paddingHorizontal: Metrics.medium }}>
      <MenuItem
        icon="icon-didong"
        onPress={() =>
          Navigation.push('CardMobileScreen', {
            title: I18n.t('product.title_mobile'),
            groupType: '0',
          })
        }
        text={I18n.t('product.title_mobile')}
      />
      <MenuItem
        icon="mathe"
        onPress={() =>
          Navigation.push('BuyCardRechargeScreen', {
            title: I18n.t('product.title_buy_card_recharge'),
            groupType: '6',
          })
        }
        text={I18n.t('product.title_buy_card_recharge')}
      />
      <MenuItem
        icon="napgame"
        onPress={() =>
          Navigation.push('BuyGameCardScreen', {
            title: I18n.t('product.title_game_recharge'),
            groupType: '2',
          })
        }
        text={I18n.t('product.title_game_recharge')}
      />
      <MenuItem
        icon="hocphi"
        onPress={() =>
          Navigation.push('PayFeeScreen', { title: I18n.t('product.title_fee'), groupType: '3' })
        }
        text={I18n.t('product.title_fee')}
      />
      <MenuItem
        icon="napthe"
        onPress={() =>
          Navigation.push('RechargeCardScreen', {
            title: I18n.t('product.title_card_recharge'),
            groupType: '4',
          })
        }
        text={I18n.t('product.title_card_recharge')}
      />
    </View>
  </View>
)
export default ListRechargeScreen
