/* eslint-disable no-empty */
/* eslint-disable radix */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../theme'
import {
  Topbar,
  Text,
  ConfirmButton,
  AmountInputText,
  AmountLabel,
  Radio,
  SelectBox,
} from '../../components'
import * as Navigation from '../../navigation'
import { overdraftOperations } from '../../state/overdraftstaff'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  element: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  error: {
    color: Colors.error,
    fontSize: 12,
    paddingVertical: Utils.getRatioDimension(8),
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    fontSize: 12,
    paddingVertical: Utils.getRatioDimension(8),
  },
  content: {
    color: '#8E8E93',
    paddingVertical: Utils.getRatioDimension(8),
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny,
    paddingRight: Metrics.tiny,
  },
  contentAmount: {
    color: Colors.text,
    paddingVertical: Metrics.tiny / 2,
  },
  line: {
    backgroundColor: Colors.line,
    height: 1,
  },
  formAmount: {
    fontSize: 12,
    color: Colors.gray1,
  },
  input: {
    paddingTop: Metrics.small,
  },
  checkBox: {
    paddingVertical: Metrics.normal,
  },
  textCheckBox: {
    fontSize: 12,
    color: '#171D33',
  },
})

const OverDraftScreen = () => {
  const dispatch = useDispatch()
  const { initData, initError } = useSelector((state) => state.overdraftstaff)
  const {
    accounts,
    effectiveDate,
    expiredDate,
    interestRate,
    isExistOD,
    odLimitAmountMax,
    odLimitAmountOnline,
    odLimitAmountOffline,
    purposeList,
    flagOdLmAmountOnline,
  } = initData || {}
  const [loading, setLoading] = useState(false)
  const [checked, setCheck] = useState(false)
  const [listPurpose, setListPurPose] = useState([])
  const [listAccount, setListAccount] = useState([])
  const [purpose, setPurpose] = useState({})
  const [account, setAccount] = useState({})
  const [amountInput, setAmountInput] = useState('')
  const [isShowError, setError] = useState(true)

  useEffect(() => {
    setLoading(true)
    dispatch(overdraftOperations.init())
  }, [])

  useEffect(() => {
    console.log('initData', initData)
    if (loading) {
      setLoading(false)
      setError(false)
      const am = parseInt(odLimitAmountMax) - parseInt(odLimitAmountOnline)
      console.log('odLimitAmountMax:', am)
      setAmountInput(am)
    }
  }, [initData])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      setError(true)
    }
  }, [initError])

  useEffect(() => {
    if (!Utils.isArrayEmpty(purposeList)) {
      const tempList = []
      purposeList.forEach((item) => {
        tempList.push({ ...item, value: item.code === '46' ? I18n.t('overdraft.consumption') : item.desc })
      })
      setListPurPose(tempList)
      setPurpose(tempList[0])
    }
  }, [purposeList])

  useEffect(() => {
    if (!Utils.isArrayEmpty(accounts)) {
      const tempList = []
      accounts.forEach((item) => {
        tempList.push({ ...item, value: item.accountInString })
      })
      setListAccount(tempList)
      setAccount(tempList[0])
    }
  }, [accounts])

  const onAmoutChange = (val) => {
    setAmountInput(val)
  }

  const isShowField = () => flagOdLmAmountOnline !== '1'

  const onRegister = () => {
    const amount = `${amountInput}`
    try {
      if (_.isEmpty(account)) {
        Utils.toast(I18n.t('overdraft.account_empty'))
        return
      }
      if (Utils.isStringEmpty(amount)) {
        Utils.toast(I18n.t('overdraft.empty_amount'))
        return
      }
      if (parseInt(amount.replace(/,/g, '')) < 1000000) {
        Utils.toast(I18n.t('overdraft.empty_amount'))
        return
      }
      if (parseInt(amount.replace(/,/g, '')) + parseInt(odLimitAmountOnline) > odLimitAmountMax) {
        Utils.toast(I18n.t('overdraft.limit'))
        return
      }
      const body = {
        odLimitAmount: amount.replace(/,/g, ''),
        rolloutAcctNo: account.acctNo,
        effectiveDate: Utils.toStringServerDate(effectiveDate),
        expireDate: Utils.toStringServerDate(expiredDate),
        purpose: purpose.code,
        isAutoDept: checked,
      }
      setLoading(false)
      Navigation.push('OverDraftCondition', { body })
    } catch (error) {}
  }

  const ItemDisplay = (title, content, isAmount = false) => (
    <View style={styles.element}>
      <Text style={[styles.title]}>{title}</Text>
      {!isAmount ? (
        <Text style={[styles.content]}>{content}</Text>
      ) : (
        <View style={Helpers.rowCross}>
          <AmountLabel style={styles.content} value={content || 0} />
          <Text style={[styles.content]}> VND</Text>
        </View>
      )}
    </View>
  )
  return (
    <Fragment>
      <Topbar title={I18n.t('overdraft.title')} subTitle={I18n.t('overdraft.sub_title')} />
      {loading && (
        <View style={[Helpers.fill, styles.container, Helpers.center]}>
          <ActivityIndicator
            style={Helpers.mainCenter}
            animating={loading}
            color={Colors.primary2}
            size="large"
          />
        </View>
      )}
      {!loading && isShowError && (
        <View style={[Helpers.fill, styles.container]}>
          <Text style={[Helpers.textCenter, { marginTop: Metrics.medium }]}>
            {initError?.message}
          </Text>
        </View>
      )}
      {!loading && !isShowError && (
        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          showsVerticalScrollIndicator
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Helpers.fill, styles.container]}>
            {ItemDisplay(I18n.t('overdraft.max_limit'), odLimitAmountMax, true)}
            {/* {ItemDisplay(I18n.t('overdraft.limit_branch'), odLimitAmountOffline, true)} */}
            {ItemDisplay(I18n.t('overdraft.limit_online'), odLimitAmountOnline, true)}
            <View style={styles.element}>
              <Text style={[styles.title]}>{I18n.t('overdraft.limit_require')}</Text>
              <AmountInputText
                style={[styles.content, { color: '#15181B' }]}
                value={amountInput}
                defaultVal={Utils.formatAmountText(amountInput)}
                rightText="VND"
                placeholder={I18n.t('overdraft.enterAmount')}
                placeholderTextColor="#15181B"
                onChangeText={onAmoutChange}
                returnKeyType="next"
                maxLength={13}
              />
            </View>
            {ItemDisplay(I18n.t('overdraft.date'), Utils.toStringServerDate(effectiveDate), false)}
            {ItemDisplay(
              I18n.t('overdraft.dua_date'),
              Utils.toStringServerDate(expiredDate),
              false
            )}
            <SelectBox
              title={I18n.t('overdraft.account')}
              data={listAccount}
              defaultValue={account}
              readOnly={!isShowField()}
              onSelect={(item) => {
                setAccount(item)
              }}
            />

            {ItemDisplay(
              I18n.t('overdraft.interest_rate'),
              `${interestRate}%/${I18n.t('overdraft.year')}`,
              false
            )}

            <SelectBox
              title={I18n.t('overdraft.purpose')}
              data={listPurpose}
              defaultValue={purpose}
              readOnly
              onSelect={(item) => {
                setPurpose(item)
              }}
            />

            {isShowField() && (
              <Radio
                size={Utils.getRatioDimension(18)}
                style={[Helpers.fill, styles.checkBox]}
                textStyle={styles.textCheckBox}
                text={I18n.t('overdraft.auto_register')}
                checked={checked}
                onPress={() => {
                  setCheck(!checked)
                }}
              />
            )}
          </View>
          <ConfirmButton onPress={() => onRegister()} />
        </KeyboardAwareScrollView>
      )}
    </Fragment>
  )
}
export default OverDraftScreen
