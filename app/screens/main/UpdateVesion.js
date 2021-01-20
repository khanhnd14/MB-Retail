import React from 'react'
import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native'
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
    marginHorizontal: Metrics.normal,
  },
  title: {
    fontSize: 14,
    color: Colors.primary2,
    fontWeight: 'bold',
  },
  containerButton: {
    ...Helpers.rowCross,
    borderTopColor: Colors.line,
    borderTopWidth: 1,
    paddingTop: Metrics.medium,
  },
})

const UpdateVesion = ({ link }) => {
  const onOpenNew = () => {
      Linking.openURL(link)
  }

  return (
    <View style={styles.container}>
      <Animated.View animation="zoomIn" duration={500} style={styles.content}>
        <Text style={styles.title}>
          {I18n.t('application.title_alert_notification').toUpperCase()}
        </Text>

        <View>
          <Text style={styles.note}>{I18n.t('version.content')} </Text>
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity onPress={onOpenNew} style={styles.button}>
            <Text style={styles.txtButton}>{I18n.t('action.action_update').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

export default UpdateVesion
