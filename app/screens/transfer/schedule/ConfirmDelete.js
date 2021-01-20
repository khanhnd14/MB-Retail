import React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import I18n from '../../../translations'
import { Text, Icon, Button } from '../../../components'
import { Colors, Metrics, Helpers } from '../../../theme'

const styles = StyleSheet.create({
  container: {
    minHeight: Metrics.small * 22,
    backgroundColor: Colors.white,
    borderRadius: 7,
    alignItems: 'center',
    marginHorizontal: Metrics.medium,
    paddingHorizontal: Metrics.small * 1.2,
    paddingTop: Metrics.normal * 2,
  },
  fullname: {
    fontSize: 14,
    color: Colors.textBlack,
    marginTop: Metrics.medium,
  },
  button: {
    borderRadius: 38,
    alignSelf: 'center',
    backgroundColor: Colors.primary2,
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small * 0.7,
    marginVertical: Metrics.normal * 2,
    marginHorizontal: Metrics.small,
    minWidth: Metrics.medium * 5,
  },
  textButton: {
    color: Colors.white,
    fontWeight: 'bold',
  },
})

const ConfirmDelete = (props) => {
  const { visible, handleModal, onConfirm, onModalHide } = props

  const onClick = () => {
    handleModal(false)
    if (onConfirm) {
      onConfirm()
    }
  }
  const onHide = () => {
    handleModal(false)
    if (onModalHide) {
      onModalHide()
    }
  }
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => handleModal(false)}
      onModalHide={() => onHide()}
    >
      <View style={styles.container}>
        <Icon name="delete" size={50} color={Colors.primary2} />
        <Text style={styles.fullname}>{I18n.t('transfer.delete_mess')}</Text>
        <View style={Helpers.rowCross}>
          <Button onPress={() => onHide()} style={[styles.button, { backgroundColor: '#BDBDBD' }]}>
            <Text style={styles.textButton}>{I18n.t('action.action_cancel').toUpperCase()}</Text>
          </Button>
          <Button onPress={() => onClick()} style={styles.button}>
            <Text style={styles.textButton}>{I18n.t('action.action_done').toUpperCase()}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}

ConfirmDelete.defaultProps = {
  onConfirm: null,
  onModalHide: null,
}

ConfirmDelete.propTypes = {
  onConfirm: PropTypes.func,
  onModalHide: PropTypes.func,
}
export default ConfirmDelete
