import * as React from 'react'
import { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DeviceInfo from 'react-native-device-info';

import { Helpers, Metrics, Colors, ApplicationStyles } from '../../theme'
import { Topbar, MenuItem, Loader } from '../../components'
import I18n from '../../translations'
import * as Navigation from '../../navigation'
import { openCardOperations } from '../../state/opencard'
import { Utils } from '../../utilities'

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
  const dispatch = useDispatch()
  const { mPlusAppLink, mPlusAppLinkError } = useSelector((state) => state.opencard)
  const [loading, setLoading] = useState(false)

  const registerCard = () => {
    Navigation.push('RegisterCreditCard')
  }
  const game = () => {
    Navigation.push('ListWordsScreen')
  }

  useEffect(() => {
    if (loading && mPlusAppLink) {
      setLoading(false)
      // open app
      // Linking.openURL('app-settings:')
      Linking.openURL(mPlusAppLink.appURL)
    }
  }, [mPlusAppLink])

  useEffect(() => {
    if (loading && mPlusAppLinkError) {
      setLoading(false)
    }
  }, [mPlusAppLinkError])

  const mplus = () => {
    setLoading(true)
    DeviceInfo.getDeviceName().then((dname) => {
      const name = dname
      const params = {
        deviceName: name,
        deviceId: Utils.getUserDeviceID(),
      }
      dispatch(openCardOperations.getMPlusAppLink(params))
    })
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
        <MenuItem
          icon="icon-atm"
          onPress={mplus}
          text={I18n.t('product.mPlus')}
          iconSize={42}
        />
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
          icon="icon-dv-the"
          onPress={() => Navigation.push('ATMScreen')}
          text={I18n.t('product.atm.title')}
          iconSize={42}
        />
      </ScrollView>
      <Loader modalVisible={loading} />
    </>
  )
}
export default Loyalty
