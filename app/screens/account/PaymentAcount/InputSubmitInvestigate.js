import React, { useState, useEffect, useRef, useMemo } from 'react'
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Keyboard, Platform } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import { TextInput, Icon } from '../../../components'
import { Utils } from '../../../utilities'
import { Colors, Metrics } from '../../../theme'

const styles = StyleSheet.create({
  inputRenameContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    width: Utils.getWindowWidth(),
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.normal
  },
  buttonRename: {
    backgroundColor: Colors.primary2,
    width: Metrics.normal * 2,
    height: Metrics.normal * 2,
    borderRadius: Metrics.normal,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
let refInputChangeName
let alias
let keyboardDidShowListener
let keyboardDidHideListener
let ref
export default ({ setIsShowInput, isShowInput, setRef, onSubmitExchange, exchange }) => {
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const { errorInvestigation } = useSelector((state) => state.account)
  const onFocus = () => {
    refInputChangeName && refInputChangeName.focus()
  }
  const onChangeAliasName = (text) => {
    alias = text
  }
  const changeAliasAccount = () => {
    setLoading(true)
    onSubmitExchange(alias)
  }
  const _keyboardDidShow = (event) => {
    setKeyboardOffset(event.endCoordinates.height)
  }

  const _keyboardDidHide = () => {
    setKeyboardOffset(0)
  }
  ref = useRef({ onFocus })
  useEffect(() => {
    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    setRef(ref);
    () => {
      keyboardDidShowListener && keyboardDidShowListener.remove();
      keyboardDidHideListener && keyboardDidHideListener.remove();
    }
  }, [])
  useEffect(() => {
    setLoading(false)
  }, [errorInvestigation])
  return (
    <Modal
      style={{
      margin: 0,
      justifyContent: 'flex-end',
      marginBottom: Platform.OS === 'ios' ? keyboardOffset : 0

    }}
      isVisible={isShowInput}
      onBackdropPress={() => {
        setIsShowInput(false)
      }}
    >
      <View style={[styles.inputRenameContainer]}>
        <TextInput
          returnKeyType="done"
          ref={(ref) => refInputChangeName = ref}
          onChangeText={onChangeAliasName}
          style={{
          width: Utils.getWindowWidth() * (8 / 10),
          paddingVertical: Metrics.tiny * 3,
          fontWeight: 'bold'

        }}
        />
        <TouchableOpacity
          onPress={changeAliasAccount}
          style={styles.buttonRename}
        >
          {loading ? <ActivityIndicator /> : <Icon name="sendtrasoat" size={16} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </Modal>
    )
}
