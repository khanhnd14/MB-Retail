/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import I18n from 'i18n-js'
import { useSelector, useDispatch } from 'react-redux'
import * as Navigation from '../../navigation'
import { Metrics, Colors } from '../../theme'
import { Text, Success, TextInput } from '../../components'
import { ekycOperations } from '../../state/ekyc'
import { Utils } from '../../utilities'
import storeService from '../../services/storeService'
import Loading from '../../components/RegisterNew/Loading'
import Checkbox from '../../components/Checkbox'
import AppStateListener from '../../AppStateListener'

const styles = StyleSheet.create({
  detailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: {
    fontSize: 15,
    color: Colors.white,
    textAlign: 'left',
    paddingHorizontal: Metrics.tiny,
  },
  note: {
    fontSize: 10,

    color: Colors.white,
    paddingVertical: Metrics.tiny
  },
  income: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.normal * 2,
    paddingTop: Metrics.normal
  },
  txtCheckbox: {
    marginLeft: Metrics.tiny,
    color: Colors.white
  },
  checkbox: {
    backgroundColor: '#FFFFFF',
    color: Colors.white,
    borderColor: Colors.white,
  },
  checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.normal,
    paddingVertical: Metrics.tiny,
    borderRadius: Metrics.tiny,
    height: Utils.getRatioDimension(40),
    marginVertical: Metrics.medium
  },
  experience: {
    marginVertical: Metrics.medium,
    flexDirection: 'row'
  },
  txtExperience: {
    color: Colors.white,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 18
  }
})

const EkycSuccess = (props) => {
  const { params } = props.route
  console.log('props transfer:', params)
  const [mapRef1, setMapRef1] = React.useState(null)
  const [mapRef2, setMapRef2] = React.useState(null)

  const { dataOtpVerified, resultRegister, formRegister, choiceCombo, resultActiveKyc, loading } = useSelector((state) => state.ekyc)
  const { activeCode } = useSelector((state) => state.user)

  const [voucher, setVoucher] = useState('')

  const dispatch = useDispatch()

  const onSaveBenefit = () => {
    Navigation.replace('SaveBenefit', params)
  }

  const onChoiceCheckbox1 = (key, value) => {
    console.log('====================================');
    console.log(key, value);
    console.log('====================================');
    setMapRef1(key)
    if (value) {
      setMapRef1(key)
    } else {
      setMapRef1(null)
    }
  }

  const onChoiceCheckbox2 = (key, value) => {
    console.log('====================================');
    console.log(key, value);
    console.log('====================================');
    setMapRef2(key)
    if (value) {
      setMapRef2(key)
    } else {
      setMapRef2(null)
    }
  }

  const onExperience = () => {
    const { token } = dataOtpVerified
    const deviceId = Utils.getUserDeviceID()
    console.log('====================================');
    console.log(token, resultRegister, voucher, formRegister, deviceId);
    console.log('====================================');
    dispatch(ekycOperations.saveReferralCode(token, voucher, resultRegister.retryId))
    dispatch(ekycOperations.activeEKYC(token, formRegister.userName, formRegister.password, deviceId))
  }

  const onChangeVoucher = (text) => {
    setVoucher(text)
  }

  const onRightPress = () => {
    Navigation.resetTo('LoginScreen')
  }

  const handleBackground = () => {
    Navigation.resetTo('LoginScreen')
  }

  const onActive = () => {

  }

  useEffect(() => {
    if (resultActiveKyc) {
      console.log('====================================');
      console.log(resultActiveKyc);
      console.log('====================================');
      resultActiveKyc.userInfo.userName = formRegister.userName
      dispatch(ekycOperations.saveActiveUser(resultActiveKyc))
      storeService.setTokenNo(resultActiveKyc.userInfo.tokenNo)
    }
  }, [resultActiveKyc])

  useEffect(() => {
    if (activeCode) {
      Navigation.replace('OpenNewAccount')
      BackHandler.removeEventListener('hardwareBackPress', () => true)
    }
  }, [activeCode])

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
  }, [])

  return (
    <>
      <AppStateListener
        onActive={onActive}
        onBackground={handleBackground}
      />
      <Success
        {...props}
        disableLeftIcon
        message={I18n.t('ekyc.success.open_acc_success')}
        onSave={onSaveBenefit}
        showButton={false}
        buttonComfirm={(
          <TouchableOpacity disabled={loading} onPress={onExperience} style={styles.experience}>
            <Text style={styles.txtExperience}>{I18n.t('ekyc.success.experience').toLocaleUpperCase()}</Text>
          </TouchableOpacity>
        )}
        onRightPress={onRightPress}
      >
        <View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('ekyc.success.username')}</Text>
            <Text style={[styles.detail, { fontWeight: 'bold' }]}>{formRegister?.userName}</Text>
          </View>
          {/* <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('ekyc.success.type_acc')}</Text>
            <Text style={[styles.detail, { fontWeight: 'bold' }]}>{choiceCombo?.name}</Text>
          </View> */}
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('ekyc.success.num_acc')}</Text>
            <Text style={[styles.detail, { fontWeight: 'bold' }]}>{resultRegister?.acctNo}</Text>
          </View>
          <View style={[styles.detailContent, { borderBottomWidth: 0 }]}>
            <Text style={styles.detail}>{I18n.t('ekyc.success.limit_trans')}</Text>
            {/* <Text style={[styles.detail, { fontWeight: 'bold', textAlign: 'right' }]}>{Utils.formatAmountText(100000000)} VND/tháng</Text> */}
            <Text style={[styles.detail, { fontWeight: 'bold', textAlign: 'right' }]}>{Utils.formatAmountText(resultRegister?.limitAmount)} VND/tháng</Text>
          </View>
        </View>
        <Text style={styles.note}>{I18n.t('ekyc.success.limit_note')}</Text>
        <TextInput
          style={styles.input}
          placeholder={I18n.t('ekyc.success.voucher')}
          onChangeText={onChangeVoucher}
        />
        <Text style={[styles.detail]}>{I18n.t('ekyc.success.question')}</Text>
        <View style={styles.income}>
          <TouchableOpacity onPress={() => onChoiceCheckbox1(I18n.t('ekyc.success.rent'))} style={styles.checkboxButton}>
            <Checkbox
              name={I18n.t('ekyc.success.rent')}
              checked={mapRef1 === I18n.t('ekyc.success.rent')}
              onChange={onChoiceCheckbox1}
              size={Metrics.tiny * 4}
              color={Colors.primary2}
              borderRadius={Metrics.tiny}
              style={styles.checkbox}
            />
            <Text style={styles.txtCheckbox}>{I18n.t('ekyc.success.rent')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChoiceCheckbox2(I18n.t('ekyc.success.card'))} style={styles.checkboxButton}>
            <Checkbox
              name={I18n.t('ekyc.success.card')}
              checked={mapRef2 === I18n.t('ekyc.success.card')}
              onChange={onChoiceCheckbox2}
              size={Metrics.tiny * 4}
              color={Colors.primary2}
              borderRadius={Metrics.tiny}
              style={styles.checkbox}
            />
            <Text style={styles.txtCheckbox}>{I18n.t('ekyc.success.card')}</Text>
          </TouchableOpacity>
        </View>
      </Success>
      {loading ? <Loading color="rgba(0,0,0,0.6)" /> : null}
    </>
  )
}

export default EkycSuccess
