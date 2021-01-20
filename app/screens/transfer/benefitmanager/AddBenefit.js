/* eslint-disable no-use-before-define */
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, ConfirmButton, TextInput, Icon } from '../../../components'
import * as Navigation from '../../../navigation'
import { transferOperations, transferSelectors } from '../../../state/transfer'
import { historyTransferOperations } from '../../../state/managertransfer'
import I18n from '../../../translations'
import BankScreen from '../interbank/BankScreen'
import BankBranchScreen from '../interbank/BankBranchScreen'
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
    marginTop: Metrics.small,
  },
})
const AddBenefit = ({ route }) => {
  const dispatch = useDispatch()
  const { type } = route.params
  const [loading, setLoading] = useState(false)
  const [alias, setAlias] = useState('')
  const [accountNo, setAccountNo] = useState('')
  const [accountName, setAccountName] = useState('')
  const [selectedAcc, setSelectedAcc] = useState(null)

  const {
    listBank,
    listBankSML,
    toBenefitBank,
    toBenefitBranch,
    rolloutAcc,
    benefitSelected,
  } = useSelector((state) => state.transfer)
  const { verifyAddBenefit, verifyAddBenefitError } = useSelector((state) => state.managertransfer)

  const sheetBank = useRef(null)
  const sheetBranch = useRef(null)

  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [verifyAddBenefitError])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.push('BenefitConfirm', {
        transType: type,
        accNo: accountNo,
        accName: Utils.clean_vietnamese(beneficiaryName || accountName),
        accAlias: Utils.clean_vietnamese(alias),
        bankNo: toBenefitBank ? toBenefitBank.bankNo : '',
        branchName: toBenefitBranch ? toBenefitBranch.bankOrgName : '',
        isTrust: false,
        benefId: '',
        certificateNo: '',
        bankName: toBenefitBank ? toBenefitBank.bankName : '',
        title: getTitle(),
      })
    }
  }, [verifyAddBenefit])

  useEffect(() => {
    if (rolloutAcc) {
      setSelectedAcc(rolloutAcc[0])
    }
  }, [rolloutAcc])

  useEffect(() => {
    if (type === 'A' || type === 'C') {
      dispatch(transferOperations.getRolloutAcc())
    }
    if (type === 'Y') {
      dispatch(transferOperations.getBeneficiary('Y'))
    }
    if (type === 'A') {
      dispatch(transferOperations.getListBank('A'))
    }
    return () => dispatch(transferOperations.reset())
  }, [])

  const selectBank = () => {
    sheetBank.current && sheetBank.current.show()
  }

  const selectBranch = () => {
    sheetBranch.current && sheetBranch.current.show()
  }

  const queryInternalAccount = () => {
    const params = {
      toBenefitAcc: accountNo,
    }
    dispatch(transferOperations.getAccInternal(params))
  }

  const queryInterbankAccount = () => {
    const bankCode = toBenefitBank ? toBenefitBank.bankNo : ''
    const params = {
      bankCode,
      beneficiaryAccount: accountNo,
      type: type === 'C' ? 'cardType' : 'acctType',
      fromAcct: selectedAcc.acctNo,
    }
    dispatch(transferOperations.getAccInterbank(params))
  }

  const onQueryAcc = () => {
    if (type === 'N') {
      queryInternalAccount()
    } else if (type === 'A' || type === 'C') {
      queryInterbankAccount()
    }
  }
  const getTitle = () => {
    if (type === 'Y') {
      return I18n.t('transfer.title_interbank')
    }
    if (type === 'N') {
      return I18n.t('transfer.title_internal')
    }
    if (type === 'A') {
      return I18n.t('transfer.title_interbank247')
    }
    if (type === 'C') {
      return I18n.t('transfer.title_interbank_card')
    }
  }
  const onSave = () => {
    setLoading(true)
    const param = {
      transType: type,
      accNo: accountNo,
      accName: Utils.clean_vietnamese(beneficiaryName || accountName),
      accAlias: Utils.clean_vietnamese(alias),
      bankNo: toBenefitBank ? toBenefitBank.bankNo : '',
      branchName: toBenefitBranch ? toBenefitBranch.bankOrgName : '',
      isTrust: false,
      benefId: '',
      certificateNo: '',
    }

    dispatch(historyTransferOperations.validateAddNewBenefit(param))
  }

  const beneficiaryBankName = toBenefitBank ? toBenefitBank.bankName : ''
  const beneficiaryBranchName = toBenefitBranch ? toBenefitBranch.bankOrgName : ''
  const subTitle = getTitle()
  const beneficiaryName = benefitSelected ? benefitSelected.beneficiaryName : ''

  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.add_benefit')} subTitle={subTitle} />
      <View style={Helpers.fill}>
        <View style={[styles.container]}>
          <View style={[styles.element]}>
            <Text style={styles.title}>{I18n.t('transfer.alias')}</Text>
            <TextInput
              style={styles.content}
              autoCorrect={false}
              placeholderTextColor={Colors.holder}
              placeholder={I18n.t('transfer.holder_input_alias')}
              value={alias}
              onChangeText={(val) => setAlias(val)}
              maxLength={30}
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>

          {(type === 'Y' || type === 'A') && (
            <TouchableOpacity onPress={selectBank} style={[styles.element, Helpers.rowCross]}>
              <View style={Helpers.fill}>
                <Text style={styles.title}>{I18n.t('transfer.benefit_bank')}</Text>
                <Text style={styles.content}>
                  {beneficiaryBankName || I18n.t('transfer.holder_input_bank')}
                </Text>
              </View>
              <Icon name="icon-detail" size={18} color={Colors.check} />
            </TouchableOpacity>
          )}
          {type === 'Y' && (
            <TouchableOpacity onPress={selectBranch} style={[styles.element, Helpers.rowCross]}>
              <View style={Helpers.fill}>
                <Text style={styles.title}>{I18n.t('transfer.benefit_branch')}</Text>
                <Text style={styles.content}>
                  {beneficiaryBranchName || I18n.t('transfer.holder_input_branch')}
                </Text>
              </View>
              <Icon name="icon-detail" size={18} color={Colors.check} />
            </TouchableOpacity>
          )}
          <View style={[styles.element]}>
            <Text style={styles.title}>
              {type === 'C' ? I18n.t('transfer.benefit_card') : I18n.t('transfer.benefit_account')}
            </Text>
            <TextInput
              style={styles.content}
              autoCorrect={false}
              placeholderTextColor={Colors.holder}
              placeholder={type === 'C' ? I18n.t('transfer.holder_input_card') : I18n.t('transfer.holder_input_acctno')}
              value={accountNo}
              onChangeText={(val) => setAccountNo(val)}
              maxLength={30}
              returnKeyType="search"
              onSubmitEditing={() => onQueryAcc()}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[styles.element, { borderBottomWidth: 0 }]}>
            <Text style={styles.title}>{I18n.t('transfer.benefit_name')}</Text>
            {type === 'Y' ? (
              <TextInput
                style={styles.content}
                autoCorrect={false}
                placeholderTextColor={Colors.holder}
                placeholder={I18n.t('transfer.holder_input_name')}
                value={accountName}
                onChangeText={(val) => setAccountName(val)}
                maxLength={30}
                returnKeyType="done"
                underlineColorAndroid="transparent"
              />
            ) : (
              <Text style={styles.content}>
                {beneficiaryName || I18n.t('transfer.input_benefit_name')}
              </Text>
            )}
          </View>
        </View>
      </View>
      <ConfirmButton
        text={I18n.t('action.action_complete')}
        onPress={() => onSave()}
        loading={loading}
      />
      <BankScreen
        ref={sheetBank}
        data={type === 'Y' ? listBank : listBankSML}
        type={type}
        selectBranch={selectBranch}
      />
      {type === 'Y' && <BankBranchScreen ref={sheetBranch} />}
    </Fragment>
  )
}
export default AddBenefit
