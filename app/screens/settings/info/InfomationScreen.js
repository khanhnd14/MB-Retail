import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker, Text, TextInput, Topbar, ConfirmButton } from '../../../components'
import { Helpers, Metrics, Colors } from '../../../theme'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import { userOperations } from '../../../state/user'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    paddingBottom: Metrics.small * 0.8,
  },
  element: {
    paddingBottom: Metrics.normal,
    marginBottom: Metrics.normal,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  input: {
    color: '#4F4F4F',
    fontWeight: 'normal',
    width: '100%',
  },
  hiden: {
    color: '#B3B9C4',
    fontWeight: 'normal',
    width: '100%',
  },
})

const InfomationScreen = () => {
  const { userName, cifNo, email, mobile, address, cifAcctName } = useSelector(
    (state) => state.user
  )
  const [addressEdit, setAddress] = useState('')
  const [emailEdit, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDisable, setDisable] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userOperations.getInfoUser())
  }, [])

  useEffect(() => {
    setAddress(address)
  }, [address])

  useEffect(() => {
    setEmail(email)
  }, [email])

  useEffect(() => {
    if (addressEdit === address && emailEdit === email) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [addressEdit, emailEdit])

  const updateInfo = () => {

  }
  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('infomation.title')} isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fill, { paddingHorizontal: Metrics.small * 3.4 }]}>
        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('infomation.user_name')}</Text>
            <Text style={styles.hiden}>{userName}</Text>
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('infomation.cif_name')}</Text>
            <Text style={styles.hiden}>{cifNo}</Text>
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('infomation.full_name')}</Text>
            <Text style={styles.hiden}>{cifAcctName}</Text>
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('infomation.phone')}</Text>
            <Text style={styles.hiden}>{mobile}</Text>
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('infomation.address')}</Text>
            <TextInput
              style={styles.input}
              value={addressEdit}
              onChangeText={(val) => setAddress(val)}
              returnKeyType="done"
              maxLength={150}
            />
          </View>
        </View>

        <View style={styles.element}>
          <View style={Helpers.fill}>
            <Text style={styles.title}>{I18n.t('infomation.email')}</Text>
            <TextInput
              style={styles.input}
              value={emailEdit}
              onChangeText={(val) => setEmail(val)}
              returnKeyType="done"
              maxLength={150}
            />
          </View>
        </View>
      </View>
      {/* <ConfirmButton
        text={I18n.t('action.action_edit')}
        onPress={updateInfo}
        loading={loading}
        disabled={isDisable}
        color={isDisable ? '#BDBDBD' : Colors.primary2}
      /> */}
    </View>
  )
}
export default InfomationScreen
