import React, { useState, useEffect, useMemo } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import I18n from 'i18n-js'
import { useDispatch, useSelector } from 'react-redux'
import { Colors, Metrics, Helpers } from '../../../theme'
import { Topbar, HeaderTop, Icon, Text } from '../../../components'
import ExchangeDetailItem from '../../../components/Account/exchange_detail_item.component'
import { Utils } from '../../../utilities'
import { accountOperations } from '../../../state/account'
import InputSubmitInvestigate from './InputSubmitInvestigate'
import AlertMessage from './AlertMessage'
import * as accountTypes from '../../../state/account/types'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
  },
  scrollView: {
    paddingHorizontal: Metrics.normal,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.normal,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: Metrics.normal * 2,
  },
  trasoat: {
    color: Colors.white,
  },
  iconTraSoat: {
    backgroundColor: Colors.primary2,
    padding: Metrics.normal,
    borderRadius: Metrics.normal * 2,
  },
  textTrasoat: {
    color: '#828282',
    fontSize: 12,
  },
})
let refInput
export default ({ route }) => {
  const exchange = route.params
  const [isShowInput, setIsShowInput] = useState(false)
  const [isShowAlert, setIsShowAlert] = useState(false)
  const { resultInvestigation } = useSelector((state) => state.account)
  const checkInvestigate = useMemo(
    () => (exchange.channel === 'IBS' || exchange.channel === 'MBA') && exchange.dcSign === 'D',
    [exchange]
  )
  const dispatch = useDispatch()

  const fields = [
    {
      label: I18n.t('account.exchange.rollout_acc'),
      // nếu dcSign tăng = create => tài khoản chuyển bằng beneficiaryAcctNo
      value: exchange.dcSign === 'C' ? exchange.beneficiaryAcctNo : exchange.rolloutAcctNo,
      note: exchange.dcSign === 'C' ? exchange.beneficiaryAcctName : exchange.rolloutAcctName,
    },
    {
      label: I18n.t('account.exchange.benefit_acc'),
      // nếu dcSign tăng = create => tài khoản thụ hưởng bằng rolloutAcctNo
      value: exchange.dcSign === 'C' ? exchange.rolloutAcctNo : exchange.beneficiaryAcctNo,
      note: exchange.dcSign === 'C' ? exchange.rolloutAcctName : exchange.beneficiaryAcctName,
    },
    {
      label: I18n.t('account.exchange.amount'),
      value: `${Utils.formatAmountText(exchange.amount)} ${exchange.currencyCode}`,
    },
    {
      label: I18n.t('account.exchange.remark'),
      value: '',
      note: exchange.remark,
    },
    {
      label: I18n.t('account.exchange.trans_type'),
      value: '',
      note: exchange.tranType,
    },
    {
      label: I18n.t('account.exchange.channel_name'),
      value: '',
      note: exchange.channelName,
    },
    {
      label: I18n.t('account.exchange.trans_date'),
      note: exchange.transferDate,
    },
  ]
  const onPressExchange = () => {
    setIsShowInput(true)
    setTimeout(() => {
      refInput.current.onFocus()
    }, 0)
  }
  const setRefInput = (ref) => {
    refInput = ref
  }
  const onSubmitExchange = (text) => {
    dispatch(
      accountOperations.onSubmitExchange(
        `Số TK nguồn: ${exchange.rolloutAcctNo} - Tài khoản đích: ${
          exchange.beneficiaryAcctNo ? exchange.beneficiaryAcctNo : ''
        } - Ngân hàng thụ hưởng: ${
          exchange.beneficiaryAcctBank ? exchange.beneficiaryAcctBank : ''
        } - Số tiền: ${exchange.amount} VND - Loại giao dịch: ${exchange.tranType} - Thời gian: ${
          exchange.transferTime
        } ${exchange.transferDate}Ghi chú: ${exchange.remark}. Nội dung tra soát:  - ${text}`
      )
    )
  }
  useEffect(() => {
    if (resultInvestigation) {
      setIsShowInput(false)
      setIsShowAlert(true)
    }
  }, [resultInvestigation])
  // unmount
  useEffect(
    () => () => {
      dispatch({
        type: accountTypes.RESET_ACCOUNT_INVESTIGATION,
      })
    },
    []
  )
  return (
    <View style={styles.container}>
      <Topbar subTitle={I18n.t('account.title_exchange_detail')} title={I18n.t('account.title')} />
      <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: Metrics.medium * 2 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.scrollView}>
            <View>
              {fields.map((value, index) => {
                if (value.value || value.note) {
                  return (
                    <ExchangeDetailItem
                      key={index}
                      fields={fields}
                      index={index}
                      label={value.label}
                      value={value.value}
                      note={value.note}
                    />
                  )
                }
                  return null
              })}
            </View>
          </View>
        </View>

        {checkInvestigate && (
          <TouchableOpacity onPress={onPressExchange} style={styles.button}>
            <View style={styles.iconTraSoat}>
              <Icon name="trasoat" size={20} style={styles.trasoat} />
            </View>
            <Text style={styles.textTrasoat}>{I18n.t('account.exchange.investigation')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <InputSubmitInvestigate
        setRef={setRefInput}
        setIsShowInput={setIsShowInput}
        isShowInput={isShowInput}
        onSubmitExchange={onSubmitExchange}
        exchange={exchange}
      />
      {isShowAlert ? (
        <AlertMessage
          showAlert={setIsShowAlert}
          title={I18n.t('application.result').toLocaleUpperCase()}
          content="Gửi tra soát thành công! MSB sẽ kiểm tra trong thời gian sớm nhất. Xin cảm ơn Quý khách."
        />
      ) : null}
    </View>
  )
}
