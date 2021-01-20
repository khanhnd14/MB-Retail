import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../theme'
import I18n from '../../translations'
import { Topbar, MenuItem } from '../../components'
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
    paddingHorizontal: Metrics.medium,
    height: Metrics.medium * 3.5,
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
    // flex: 8 / 10
  },
  icon: {
    color: Colors.iconGray,
    // fontSize: 40,
    // flex: 2 / 10
  },
})

const ProductScreen = () => (
  <>
    <Topbar
      title={I18n.t('main.product')}
      rightIcon={null}
      leftIcon={null}
      onLeftPress={null}
      background={Colors.mainBg}
    />
    <ScrollView style={[Helpers.fill, styles.container]}>
      <MenuItem
        icon="home_chuyenkhoan"
        text={I18n.t('product.transfer')}
        onPress={() => Navigation.push('TransferScreen')}
        iconSize={55}
      />
      <MenuItem
        icon="home_the"
        onPress={() => Navigation.push('CreditScreen')}
        text={I18n.t('product.card')}
        iconSize={55}

      />
      <MenuItem
        icon="home_tietkiem"
        onPress={() => Navigation.push('SaveScreen')}
        text={I18n.t('product.saving')}
        iconSize={55}

      />
      <MenuItem
        icon="home_naptien"
        onPress={() => Navigation.push('RechargeScreen')}
        text={I18n.t('product.topup')}
        iconSize={55}

      />
      <MenuItem
        icon="home_thanhtoan"
        onPress={() => Navigation.push('HistoryBillPayment')}
        text={I18n.t('product.billing')}
        iconSize={55}

      />
      <MenuItem
        icon="home_qr"
        onPress={() => Navigation.push('ScanQrScreen')}
        text="QR code"
        iconSize={55}

      />
      <MenuItem
        icon="home_softtoken"
        onPress={() => Navigation.push('SoftTokenScreen')}
        text="Soft Token"
        iconSize={55}

      />
    </ScrollView>
  </>
)
export default ProductScreen
