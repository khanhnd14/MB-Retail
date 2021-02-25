/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import Modal from 'react-native-modal'
import EventEmitter from 'react-native-eventemitter'
import I18n from '../../translations'
import { Text } from '../../components'
import { Colors, Metrics, Helpers } from '../../theme'
import { Config } from '../../config'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  container: {
    minHeight: Metrics.small * 27.2,
    width: Metrics.small * 33,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: 10,
  },
  header: {
    backgroundColor: Colors.primary2,
    padding: Metrics.small * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: Metrics.small * 1.8,
  },
  button: {
    borderRadius: 38,
    alignSelf: 'center',
    backgroundColor: Colors.gray4,
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small * 0.7,
    marginHorizontal: Metrics.small,
    marginTop: Metrics.tiny,
    marginBottom: Metrics.small
  },
  input: {
    marginTop: Metrics.normal * 2,
    marginHorizontal: Metrics.normal,
    textAlign: 'center',
    flex: 1,
  },
})

const MainAlert = () => {
  const [visible, setVisible] = useState(false)
  const [visibleBtn, setVisibleBtn] = useState(false)
  const [title, setTitle] = useState(I18n.t('application.title_alert_notification'))
  const [message, setMessage] = useState('')

  useEffect(() => {
    eventBinding()
    return () => {
      unEventBinding()
    }
  }, [])

  const eventBinding = () => {
    EventEmitter.on(Config.EVENT_NAMES.user_alert_mess, showMess)
    EventEmitter.on(Config.EVENT_NAMES.user_alert_change_softtoken, showSettingSoftToken)
  }

  const unEventBinding = () => {
    EventEmitter.removeListener(Config.EVENT_NAMES.user_alert_mess, showMess)
    EventEmitter.removeListener(
      Config.EVENT_NAMES.user_alert_change_softtoken,
      showSettingSoftToken
    )
  }

  const showMess = (param) => {
    setMessage(param.message)
    setVisible(true)
  }
  const showSettingSoftToken = (param) => {
    console.log('jkashdjahsjdkhasjkhdas:', param);
    setMessage(param.message)
    setVisible(true)
    setVisibleBtn(true)
  }

  const onHide = () => {
    setVisible(false)
    setVisibleBtn(false)
  }

  const onContinuous = () => {
    setVisible(false)
    setVisibleBtn(false)
    Navigation.push('SoftTokenScreen')
  }
  return (
    <View>
      {visible && (
        <Modal isVisible={visible} onBackdropPress={() => onHide()} onModalHide={() => onHide()}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>{title.toUpperCase()}</Text>
              </View>
              <Text style={styles.input}>{message}</Text>
              <View style={[Helpers.row, { justifyContent: 'center' }]}>
                {visibleBtn && (
                  <TouchableOpacity
                    onPress={() => onContinuous()}
                    style={[styles.button, { backgroundColor: Colors.primary2 }]}
                  >
                    <Text style={styles.title}>{I18n.t('action.action_done').toUpperCase()}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => onHide()} style={styles.button}>
                  <Text style={styles.title}>{I18n.t('action.action_close').toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  )
}

export default MainAlert
