import * as React from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  BackHandler,
} from 'react-native'
import I18n from 'i18n-js'
import { Helpers, Colors, Images, Metrics } from '../../../../theme'
import {
  Text,
  Icon,
  ConfirmButtonWhite
} from '../../../../components'
import * as Navigation from '../../../../navigation'

import { numberWithCommas } from '../../../../utilities/common'

const heightDevice = Dimensions.get('screen').height

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingTop: Metrics.medium + 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBar: {
    position: 'relative',
    flexDirection: 'row',
    ...Helpers.center,
    width: '100%',
  },
  logo: { width: Metrics.medium * 6 },
  btnHome: { marginRight: Metrics.medium, position: 'absolute', right: 0 },
  btnHomeIcon: { color: Colors.gray1, fontSize: 26 },
  mainLayout: {
    backgroundColor: Colors.primary2,
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...Helpers.center,
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.medium,
    maxHeight: heightDevice * (heightDevice > 667 ? 0.8 : 1),
    minHeight: heightDevice * (heightDevice > 667 ? 0.7 : 0.6),
  },
  check: {
    width: Metrics.medium * 6,
    marginTop: -(Metrics.medium * 4),
  },
  titleContent: { marginBottom: Metrics.medium },
  title: { fontWeight: 'bold', fontSize: 24, color: Colors.white, textAlign: 'center' },
  detailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: { fontWeight: 'bold', fontSize: 14, color: Colors.white, textAlign: 'center' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.medium,
  },
  actionsBtn: {
    alignItems: 'center',
    marginHorizontal: Metrics.medium + 10,
  },
  actionsIcon: {
    color: Colors.white,
    fontSize: 36,
    marginBottom: Metrics.tiny,
  },
  mainBtn: {
    backgroundColor: Colors.white,
    borderRadius: 38,
    marginTop: Metrics.medium,
    ...Helpers.fullWidth,
    ...Helpers.center,
    padding: Metrics.small,
  },
  mainBtnText: {
    color: Colors.gray1,
    fontSize: 18,
    fontWeight: 'bold',
  },
})

const SuccessCardPayment = ({ route }) => {
  const { amount, customerInfo, titleServices } = route.params
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      Navigation.navigate('MainScreen')
    })
  }, [])
  const _onPress = () => {
    Navigation.navigate('MainScreen')
    BackHandler.removeEventListener('hardwareBackPress', () => {
      Navigation.navigate('MainScreen')
    })
  }
  return (
    <>
      <View style={[Helpers.fill, styles.container]}>
        <View style={styles.topBar}>
          <Image source={Images.logo} resizeMode="contain" style={styles.logo} />
          <TouchableOpacity style={styles.btnHome} onPress={() => Navigation.push('MainScreen')}>
            <Icon name="icon-home" size={26} style={styles.btnHomeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.mainLayout}>
          <Image source={Images.success} resizeMode="contain" style={styles.check} />
          <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
            <View style={styles.titleContent}>
              <Text style={styles.title}>{I18n.t('application.message_congrat')}</Text>
              <Text style={styles.title}>{I18n.t('application.payment_success')}</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detail}>{I18n.t('transfer.amount')}</Text>
              <Text style={styles.detail}>{`${numberWithCommas(amount)} VND`}</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detail}>{I18n.t('product.customer_code')}</Text>
              <Text style={styles.detail}>{customerInfo}</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detail}>{I18n.t('product.type_service')}</Text>
              <Text style={styles.detail}>{titleServices}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionsBtn}>
                <Icon name="icon-email" size={26} style={styles.actionsIcon} />
                <Text style={styles.detail}>{I18n.t('application.send_email')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <ConfirmButtonWhite onPress={_onPress} text={I18n.t('account.title_other_payment')} />
        </View>
      </View>
    </>
  )
}

export default SuccessCardPayment
