import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import I18n from '../../translations'
import Text from '../MsbText'
import { Colors, Metrics } from '../../theme'

const styles = StyleSheet.create({
  container: {
    minHeight: Metrics.small * 32.2,
    width: Metrics.small * 29.6,
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
    backgroundColor: Colors.primary2,
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small * 0.7,
    marginVertical: Metrics.normal * 2,
  },
})

const Alert = (props) => {
  const { title, children, visible, handleModal, onConfirm, onModalHide } = props

  const onClick = () => {
    handleModal(false)
    if (onConfirm) {
      onConfirm()
    }
  }
  const onHide = () => {
    if (onModalHide) {
      onModalHide()
    }
  }
  return (
    <Modal isVisible={visible} onBackdropPress={() => handleModal(false)} onModalHide={() => onHide()}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title.toUpperCase()}</Text>
          </View>
          <View style={styles.content}>{children}</View>
          <TouchableOpacity onPress={() => onClick()} style={styles.button}>
            <Text style={styles.title}>{I18n.t('action.action_done').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

Alert.defaultProps = {
  title: I18n.t('application.title_alert_notification'),
  onConfirm: null,
  onModalHide: null
}

Alert.propTypes = {
  title: PropTypes.string,
  onConfirm: PropTypes.func,
  onModalHide: PropTypes.func
}
export default Alert
