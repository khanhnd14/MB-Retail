import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import I18n from '../../../translations'
import { Text, TextInput, Button } from '../../../components'
import { Colors, Metrics, Helpers } from '../../../theme'
import { transferOperations } from '../../../state/transfer'
import { settingOperations } from '../../../state/setting'
import { Utils } from '../../../utilities'
import { appTypes } from '../../../state/application'

const styles = StyleSheet.create({
  container: {
    minHeight: Metrics.small * 20,
    backgroundColor: Colors.white,
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
  line: {
    height: 1,
    backgroundColor: '#BDBDBD',
    marginTop: Metrics.small * 1.1,
    marginHorizontal: Metrics.normal

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
  input: {
    marginTop: Metrics.normal * 2,
    marginHorizontal: Metrics.normal
  }
})

const SendMailDialog = (props) => {
  const { tokenTransaction, visible, handleModal, onConfirm, onModalHide, onSendEmail } = props
  const { sendEmailComplete, sendEmailError } = useSelector((state) => state.transfer)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (loading) {
      setLoading(false)
      handleModal(false)
      Utils.showToast(I18n.t('application.mess_send_email_succ'))
    }
  }, [sendEmailComplete])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [sendEmailError])

  const onClick = () => {
    if (!email) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    setLoading(true)
    if (onSendEmail) {
      onSendEmail(Utils.clean_vietnamese(email))
      return
    }
    dispatch(
      transferOperations.sendEmail({
        tokenTransaction,
        email: Utils.clean_vietnamese(email),
      })
    )
  }
  const onHide = () => {
    handleModal(false)
    setEmail('')
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
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t('application.send_email').toUpperCase()}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholderTextColor="#828282"
          autoCorrect={false}
          autoFocus
          placeholder="Email"
          value={email}
          onChangeText={(val) => setEmail(val)}
          onSubmitEditing={() => {}}
          returnKeyType="done"
          underlineColorAndroid="transparent"
        />
        <View style={styles.line} />
        <View style={[Helpers.rowCross, { alignSelf: 'center' }]}>
          <Button onPress={() => onHide()} style={[styles.button, { backgroundColor: '#BDBDBD' }]}>
            <Text style={styles.textButton}>{I18n.t('action.action_cancel').toUpperCase()}</Text>
          </Button>
          <Button onPress={() => onClick()} style={styles.button} loading={loading}>
            <Text style={styles.textButton}>{I18n.t('action.action_done').toUpperCase()}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}

SendMailDialog.defaultProps = {
  onConfirm: null,
  onModalHide: null,
}

SendMailDialog.propTypes = {
  onConfirm: PropTypes.func,
  onModalHide: PropTypes.func,
  tokenTransaction: PropTypes.string,
}
export default SendMailDialog
