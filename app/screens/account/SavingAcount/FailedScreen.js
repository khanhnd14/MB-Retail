import * as React from 'react'
import {
  TouchableOpacity, View, StyleSheet, Image, ScrollView, Dimensions,
  BackHandler,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { TapGestureHandler } from 'react-native-gesture-handler'

import I18n from 'i18n-js'
import * as Navigation from '../../../navigation'
import { RESET_STORE } from '../../../state/save/types'
import { Colors, Metrics, Helpers, Images } from '../../../theme'
import { Icon, Text, Button } from '../../../components'

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
    backgroundColor: Colors.gray11,
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

const FailedScreen = () => {
  const dispatch = useDispatch()
  const resetStore = () => {
    dispatch({ type: RESET_STORE })
  }
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      Navigation.navigate('MainScreen')
      resetStore()
    })
  }, [])
  const _onPress = () => {
    Navigation.resetTo('MainScreen')
    BackHandler.removeEventListener('hardwareBackPress', () => {
      Navigation.navigate('MainScreen')
      resetStore()
    })
  }
  const handleTapStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === 1) {
      Navigation.resetTo('MainScreen')
      resetStore()
    }
  }
  return (
    <>
      <TapGestureHandler onHandlerStateChange={handleTapStateChange}>

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
                backgroundColor: Colors.mainBg,
                width: Metrics.medium * 7.55,
                height: Metrics.medium * 7.55
              }}
              />
            </View>

            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <View style={styles.titleContent}>
                <Text style={styles.title}>{I18n.t('fail.failed_exchange')}</Text>
              </View>
            </ScrollView>
            <Button
              color={Colors.white}
              indicatorStyle={styles.indicator}
              style={styles.mainBtn}
              onPress={_onPress}
            >
              <Text style={styles.mainBtnText}>{I18n.t('account.title_other_payment')}</Text>
            </Button>
          </View>
        </View>
      </TapGestureHandler>

    </>
  )
}

export default FailedScreen
