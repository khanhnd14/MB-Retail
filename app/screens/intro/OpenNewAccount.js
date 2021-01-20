import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import * as Animated from 'react-native-animatable'
import I18n from '../../translations'
import { Colors, Metrics, Helpers } from '../../theme'
import { Utils } from '../../utilities'
import { Text } from '../../components'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    marginHorizontal: Metrics.medium * 2,
    paddingHorizontal: Metrics.small * 1.6,
    paddingVertical: Metrics.small * 2.4,
    borderRadius: 15,
  },
  image: {
    width: Utils.getWindowWidth() / 1.5,
    height: Utils.getWindowWidth() / 1.5,
  },
  skip: {
    position: 'absolute',
    right: Metrics.medium * 2,
    top: Metrics.medium,
  },
  openAcc: {
    color: Colors.primary2,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: Metrics.medium,
    textAlign: 'center',
  },
  note: {
    paddingVertical: Metrics.normal * 2,
    paddingHorizontal: Metrics.tiny,
    alignSelf: 'center',
    textAlign: 'center',
  },
  minute: {
    color: Colors.second2,
    fontWeight: 'bold',
  },
  txtButton: {
    color: Colors.white,
  },
  button: {
    borderRadius: 38,
    alignSelf: 'center',
    backgroundColor: Colors.primary2,
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small * 0.7,
    marginHorizontal: Metrics.normal
  },
  title: {
    fontSize: 14,
    color: Colors.primary2,
    fontWeight: 'bold'
  },
  containerButton: {
    ...Helpers.rowCross,
    borderTopColor: Colors.line,
    borderTopWidth: 1,
    paddingTop: Metrics.medium * 1.5
  }
})

const OpenNewAccount = ({ openTutorials, skipTutorials }) => {
  const onOpenNew = () => {
    openTutorials()
  }
  const onSkip = () => {
    skipTutorials()
  }
  return (
    <View style={styles.container}>
      <Animated.View animation="zoomIn" duration={500} style={styles.content}>
        <Text style={styles.title}>
          {I18n.t('ekyc.alert').toUpperCase()}
        </Text>

        <View>
          <Text style={styles.note}>{I18n.t('ekyc.open_acc.note')} </Text>
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity onPress={onSkip} style={[styles.button, { backgroundColor: '#BDBDBD' }]}>
            <Text style={styles.txtButton}>{I18n.t('ekyc.open_acc.skip').toUpperCase()}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onOpenNew} style={styles.button}>
            <Text style={styles.txtButton}>{I18n.t('ekyc.open_acc.open_now').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

export default OpenNewAccount
