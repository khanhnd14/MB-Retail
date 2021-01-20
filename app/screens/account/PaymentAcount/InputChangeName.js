import React from 'react'
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Keyboard, Platform, Alert } from 'react-native'
import Modal from 'react-native-modal'
import { TextInput, Icon } from '../../../components'
import { Utils } from '../../../utilities'
import { Colors, Metrics } from '../../../theme'
import { RESULT_TYPE } from '../../../state/save/types'
import * as Navigation from '../../../navigation'

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
let keyboardDidShowListener
let keyboardDidHideListener
export default class InputChangeName extends React.Component {
  text

  constructor(props) {
    super(props)
    this.state = {
      loadingRename: false,
      keyboardOffset: 0
    }
  }

  componentDidMount() {
    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    keyboardDidShowListener && keyboardDidShowListener.remove();
    keyboardDidHideListener && keyboardDidHideListener.remove();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { resultChangeAliasName, setIsShowInput } = this.props
    if (resultChangeAliasName === nextProps.resultChangeAliasName) {
      return
    }
    if (nextProps.resultChangeAliasName === RESULT_TYPE.SUCCESS) {
      this.setState({ loadingRename: false })
      Keyboard.dismiss()
      Utils.alert('Đổi tên thành công!', '', () => {
        setIsShowInput(false)
        Navigation.pop()
        nextProps.getAccount()
      })
    } else if (nextProps.resultChangeAliasName === RESULT_TYPE.FAIL) {
      this.setState({ loadingRename: false })
      Keyboard.dismiss()
      Alert.alert('Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  }

  _keyboardDidShow = (event) => {
    this.setState({ keyboardOffset: event.endCoordinates.height })
  }

  _keyboardDidHide = () => {
    this.setState({ keyboardOffset: 0 })
  }

  onChangeAliasName = (text) => {
    this.text = text
  }

  onFocus = () => {
    refInputChangeName && refInputChangeName.focus()
  }

  changeAliasAccount = () => {
    const { submitInput } = this.props
    this.setState({ loadingRename: true })
    submitInput(this.text)
  }

  render() {
    const { loadingRename, keyboardOffset } = this.state
    const { account, setIsShowInput, isShowInput } = this.props
    return (
      <Modal
        style={{
        margin: 0,
        justifyContent: 'flex-end',
        marginBottom: keyboardOffset

      }}
        isVisible={isShowInput}
        onBackdropPress={() => {
          setIsShowInput(false)
        }}
      >
        <View style={[styles.inputRenameContainer]}>
          <TextInput
            returnKeyType="done"
            defaultValue={account?.title}
            ref={(ref) => refInputChangeName = ref}
            onChangeText={this.onChangeAliasName}
            style={{
            width: Utils.getWindowWidth() * (8 / 10),
            paddingVertical: Metrics.tiny * 3,
            fontWeight: 'bold'

          }}
          />
          <TouchableOpacity
            onPress={this.changeAliasAccount}
            style={styles.buttonRename}
          >
            {loadingRename ? <ActivityIndicator /> : <Icon name="icon-check" size={Utils.getWindowHeight() / 100} color={Colors.white} />}
          </TouchableOpacity>
        </View>
      </Modal>
      )
  }
}
