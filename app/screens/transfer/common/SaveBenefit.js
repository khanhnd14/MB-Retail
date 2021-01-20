/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, ConfirmButton, TextInput, Switch } from '../../../components'
import * as Navigation from '../../../navigation'
import I18n from '../../../translations'
import { historyTransferOperations } from '../../../state/managertransfer'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.small,
  },
  element: {
    paddingVertical: Metrics.small * 1.3,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
  },
  content: {
    color: '#4F4F4F',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: Metrics.small,
  },
})
const SaveBenefit = ({ route }) => {
  const { params } = route
  const { lblBenefitBankName, lblBenefitAcc, lblBenefitName, tokenTransaction } = params
  const { addBenefit, addBenefitError } = useSelector((state) => state.managertransfer)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [alias, setAlias] = useState('')
  const [isTrust, setTrust] = useState(false)

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Utils.showToast(I18n.t('transfer.add_benefit_success'))
      Navigation.pop()
    }
  }, [addBenefit])

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [addBenefitError])

  const onSave = () => {
    setLoading(true)
    dispatch(
      historyTransferOperations.addBenefit({
        tokenTransaction,
        alias: Utils.clean_vietnamese(alias),
        trustAlias: false,
        certificateNo: '',
      })
    )
  }

  return (
    <Fragment>
      <Topbar
        title={I18n.t('transfer.manager_benefit')}
        subTitle={I18n.t('transfer.add_benefit')}
      />
      <View style={Helpers.fill}>
        <View style={[styles.container]}>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.alias')}</Text>
            <TextInput
              style={styles.content}
              autoCorrect={false}
              placeholderTextColor={Colors.holder}
              placeholder=""
              value={alias}
              onChangeText={(val) => setAlias(val)}
              maxLength={30}
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.benefit_account')}</Text>
            <Text style={styles.content}>{lblBenefitAcc}</Text>
          </View>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.benefit_name_human')}</Text>
            <Text style={styles.content}>{lblBenefitName}</Text>
          </View>
          <View style={[styles.element, { borderBottomWidth: 0 }]}>
            <Text style={styles.title}>{I18n.t('transfer.benefit_bank')}</Text>
            <Text style={styles.content}>{lblBenefitBankName || 'MSB'}</Text>
          </View>
          {/* <View style={[styles.element, Helpers.rowCross, { borderBottomWidth: 0 }]}>
            <Text style={[styles.title, Helpers.fill]}>{I18n.t('transfer.bnfTrust')}</Text>
            <Switch
              isOn={isTrust}
              onColor={Colors.primary}
              offColor={Colors.gray}
              size="small"
              onToggle={(val) => setTrust(val)}
            />
          </View> */}
        </View>
      </View>
      <ConfirmButton text={I18n.t('action.action_complete')} onPress={() => onSave()} loading={loading} />
    </Fragment>
  )
}
export default SaveBenefit
