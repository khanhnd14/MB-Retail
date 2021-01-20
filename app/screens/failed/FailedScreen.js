import * as React from 'react'
import {
  TouchableOpacity, View, StyleSheet, Image, ScrollView, BackHandler,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { TapGestureHandler } from 'react-native-gesture-handler'
import I18n from 'i18n-js'
import { Helpers, Colors, Images, Metrics } from '../../theme'
import { Text, Icon, ConfirmButtonWhite } from '../../components'
import * as Navigation from '../../navigation'
import { productOperations } from '../../state/product'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.gray11,
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...Helpers.center,
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.medium,
    height: Utils.getWindowHeight() / 1.5
  },
  check: {
    width: Metrics.medium * 6,
    marginTop: -(Metrics.medium * 4),
    height: Metrics.normal * 20
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

const FailedScreen = ({ route }) => {
  const { redoTransaction, onSwitchTransaction } = route.params
  const dispatch = useDispatch()
  const resetStore = () => {
    dispatch(productOperations.setProduct())
  }
  React.useEffect(() => {
    resetStore()
  }, [])
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      Navigation.replace(redoTransaction || 'HistoryBillPayment')
      resetStore()
    })
  }, [])
  const _onPress = () => {
    onSwitchTransaction && onSwitchTransaction()
    Navigation.replace(redoTransaction || 'HistoryBillPayment')
    BackHandler.removeEventListener('hardwareBackPress', () => {
      Navigation.replace(redoTransaction || 'HistoryBillPayment')
      resetStore()
    })
  }
  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === 1) {
      Navigation.replace(redoTransaction || 'HistoryBillPayment')
      resetStore()
    }
  }
  return (
    <>
      <TapGestureHandler onHandlerStateChange={onHandlerStateChange}>
        <View style={[Helpers.fill, styles.container]}>
          <View style={styles.topBar}>
            <Image source={Images.logo} resizeMode="contain" style={styles.logo} />
            <TouchableOpacity style={styles.btnHome} onPress={() => Navigation.navigate('MainScreen')}>
              <Icon name="icon-home" size={26} style={styles.btnHomeIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.mainLayout}>
            <View style={{ marginTop: -Metrics.normal * 5, height: Metrics.medium * 7.5, overflow: 'hidden', width: Metrics.medium * 7.5, borderRadius: Metrics.medium * 3.75 }}>
              <Image
                source={Images.failed}
                resizeMode="contain"
                style={{
                  overflow: 'hidden',
                  backgroundColor: Colors.white,
                  width: Metrics.medium * 7.55,
                  height: Metrics.medium * 7.55
                }}
              />
            </View>

            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <View style={styles.titleContent}>
                <Text style={styles.title}>Giao dịch thất bại</Text>
              </View>
            </ScrollView>
            <ConfirmButtonWhite onPress={_onPress} text={I18n.t('account.title_other_payment')} />
          </View>
        </View>
      </TapGestureHandler>
    </>
  )
}

export default FailedScreen
