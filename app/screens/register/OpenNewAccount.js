import React, { useEffect } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, BackHandler } from 'react-native'
import * as Animated from 'react-native-animatable'
import I18n from 'i18n-js'
import { useDispatch } from 'react-redux'
import { Colors, Images, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import Button from '../../components/RegisterNew/Button'
import * as Navigation from '../../navigation'
import { Text, ConfirmButton } from '../../components'
import { appOperations } from '../../state/application'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray11,
    justifyContent: 'center'
  },
  content: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    marginHorizontal: Metrics.medium * 2,
    padding: Metrics.medium * 2,
    borderRadius: Metrics.medium
  },
  image: {
    width: Utils.getWindowWidth() / 1.5,
    height: Utils.getWindowWidth() / 1.5,
  },
  skip: {
    position: 'absolute',
    right: Metrics.medium * 2,
    top: Metrics.medium
  },
  openAcc: {
    color: Colors.primary2,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: Metrics.medium,
    textAlign: 'center'
  },
  note: {
    paddingVertical: Metrics.normal * 2,
    paddingHorizontal: Metrics.tiny,
    alignSelf: 'center',
    textAlign: 'center',
  },
  minute: {
    color: Colors.second2,
    fontWeight: 'bold'
  }
})

const OpenNewAccount = () => {
  const dispatch = useDispatch()

  const onOpenNew = () => {
    Navigation.resetTo('MainScreen')
    BackHandler.removeEventListener('hardwareBackPress', () => true)
  }
  const onSkip = () => {
    dispatch(appOperations.tooltipComplete())
    Navigation.resetTo('MainScreen')
    BackHandler.removeEventListener('hardwareBackPress', () => true)
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
  }, [])

  return (
    <View style={styles.container}>

      <Animated.View
        animation="zoomIn"
        duration={500}
        style={styles.content}
      >
        <Text onPress={onSkip} style={styles.skip}>{I18n.t('ekyc.open_acc.skip')}</Text>

        <View style={styles.image}>
          <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={Images.ekyc_open_new_acc} />
        </View>
        <View>
          <Text style={styles.note}>{I18n.t('ekyc.open_acc.note')} </Text>
        </View>
        <View>

          <TouchableOpacity
            style={{
            backgroundColor: Colors.primary2,
            width: Utils.getWindowWidth() / 1.5,
            paddingVertical: Metrics.medium,
            borderRadius: Metrics.normal * 2,
            alignItems: 'center'
          }}
            onPress={onOpenNew}
          >
            <Text style={{
              color: Colors.white,
              fontWeight: 'bold'
            }}
            >{I18n.t('ekyc.open_acc.open_now').toLocaleUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

      </Animated.View>

    </View>
    )
}

export default OpenNewAccount
