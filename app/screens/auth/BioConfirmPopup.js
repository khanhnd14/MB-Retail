import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import I18n from '../../translations'
import { Text, TextInput, Button } from '../../components'
import { Colors, Metrics, Helpers } from '../../theme'
import { loginOperations } from '../../state/login'
import { settingOperations } from '../../state/setting'
import { Utils } from '../../utilities'
import { appTypes } from '../../state/application'

const styles = StyleSheet.create({
  container: {
    minHeight: Metrics.small * 32,
    backgroundColor: Colors.white,
    borderRadius: 7,
    alignItems: 'center',
    marginHorizontal: Metrics.medium,
    paddingHorizontal: Metrics.small * 1.2,
  },
  fullname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginTop: Metrics.medium * 3,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#BDBDBD',
    marginTop: Metrics.small * 1.1,
  },
  title: {
    color: Colors.textBlack,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: Metrics.medium * 2,
    marginTop: Metrics.small * 2.8,
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
    marginHorizontal: Metrics.small,
    minWidth: Metrics.medium * 5,
  },
  textButton: {
    color: Colors.white,
    fontWeight: 'bold',
  },
})

const BioConfirmPopup = (props) => {
  const { visible, handleModal, onConfirm, onModalHide } = props
  const { fullName, loginSecurityType, userName, activeCode } = useSelector((state) => state.user)
  const { verifyUser, verifyUserError } = useSelector((state) => state.login)
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (loading) {
      // Nếu xác thực user xong thì lấy mã pin fp
      dispatch(settingOperations.getPrivateKeyFP())
    }
  }, [verifyUser])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [verifyUserError])

  useEffect(() => {
    if (loading && loginSecurityType === appTypes.SECURITY_TYPE.FP) {
      setLoading(false)
      handleModal(false)
      if (onConfirm) {
        onConfirm()
      }
    }
  }, [loginSecurityType])

  const onClick = () => {
    if (!pass) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    setLoading(true)
    dispatch(
      loginOperations.verifyUser({
        userNameOrMobile: userName,
        password: pass,
        activeCode,
        uiid: Utils.getUserDeviceID(),
      })
    )
  }
  const onHide = () => {
    handleModal(false)
    setPass('')
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
        <Text style={styles.title}>{I18n.t('login.active_fp')}</Text>
        <Text style={styles.fullname}>{fullName}</Text>
        <View style={styles.line} />
        <TextInput
          style={{ marginTop: Metrics.normal * 2, width: '100%', textAlign: 'center' }}
          placeholderTextColor="#828282"
          autoCorrect={false}
          autoFocus
          placeholder={I18n.t('login.input_pass')}
          value={pass}
          secureTextEntry
          onChangeText={(val) => setPass(val)}
          onSubmitEditing={() => {}}
          returnKeyType="done"
          underlineColorAndroid="transparent"
        />
        <View style={styles.line} />
        <View style={Helpers.rowCross}>
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

BioConfirmPopup.defaultProps = {
  onConfirm: null,
  onModalHide: null,
}

BioConfirmPopup.propTypes = {
  onConfirm: PropTypes.func,
  onModalHide: PropTypes.func,
}
export default BioConfirmPopup
