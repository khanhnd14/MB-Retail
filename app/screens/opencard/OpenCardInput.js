/* eslint-disable no-empty */
/* eslint-disable radix */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
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
  Switch,
  Radio,
  SelectButton,
  SelectAccount,
  TextInput,
} from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import { employeeOperations } from '../../state/employee'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.transparent,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    paddingBottom: Metrics.small,
    marginTop: Utils.getRatioDimension(8),
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    paddingVertical: Utils.getRatioDimension(18),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: Utils.getRatioDimension(8),
    width: '100%',
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
    color: '#81838A',
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
    paddingVertical: Metrics.tiny,
  },
  textCheckBox: {
    fontSize: 12,
    color: '#171D33',
  },
  disableText: {
    color: '#81838A'
  }
})

const OpenCardInput = ({ route }) => {
  const dispatch = useDispatch()
  const { params } = route
  const { limitMin } = params.selectCard
  const { initData, listData, branch } = useSelector((state) => state.opencard)
  const { cardCode, liabilityContract, accounts } = initData || {}
  const { creditCardMax, securityName, typeCreditCardMax } = listData || {}

  const [loading, setLoading] = useState(false)
  const [auto, setAuto] = useState(false)
  const [amountInput, setAmountInput] = useState('')
  const [answer, setAnswer] = useState('')
  const [isFullPayment, setFullPayment] = useState(true)
  const [rolloutAccountNo, setRolloutAccountNo] = useState(null)

  useEffect(() => {
    dispatch(employeeOperations.getRolloutAcc())
  }, [])

  useEffect(() => {
    setAmountInput(creditCardMax)
  }, [creditCardMax])

  useEffect(() => {
    if (!_.isEmpty(securityName)) {
      setAnswer(securityName)
    }
  }, [securityName])

  const onAmoutChange = (val) => {
    setAmountInput(val)
  }
  const onSelectRolloutAccountNo = (val) => {
    setRolloutAccountNo(val)
  }
  const onRegister = () => {
    const amount = `${amountInput}`
    try {
      if (parseInt(amount.replace(/,/g, '')) < limitMin) {
        Utils.toast(I18n.t('opencard.min_amount').replace('{0}', Utils.formatAmountText(limitMin)))
        return
      }
      if (parseInt(amount.replace(/,/g, '')) > creditCardMax) {
        Utils.toast(I18n.t('opencard.max_amount'))
        return
      }
      if (Utils.isStringEmpty(amount)) {
        Utils.toast(I18n.t('opencard.empty_amount'))
        return
      }
      if (_.isEmpty(branch)) {
        Utils.toast(I18n.t('opencard.location_receive_holder'))
        return
      }
      if (_.isEmpty(answer)) {
        Utils.toast(I18n.t('opencard.empty_ques'))
        return
      }
      const body = {
        amountCredit: amount.replace(/,/g, ''),
        rolloutAcctNo: auto ? rolloutAccountNo : null,
        subBranch: branch.subBranch,
        isAutoDept: auto,
        scretAnswer: Utils.clean_vietnamese(answer),
        minOrMaxBilling: isFullPayment ? 1 : 0,
        liabilityContract,
        cardCode,
        scretQuestion: I18n.t('opencard.sec_question'),
      }

      Navigation.push('OpenCardCondition', { body })
    } catch (error) {}
  }

  const onSelectBranch = () => {
    Navigation.push('OpenCardBranch')
  }

  const renderAutoPayment = () => (
    <View style={[styles.contentContainer]}>
      <View style={[Helpers.rowCross, { paddingVertical: Metrics.tiny }]}>
        <Text style={Helpers.fill}>{I18n.t('opencard.auto_payment')}</Text>
        <Switch
          isOn={auto}
          onColor={Colors.primary}
          offColor={Colors.gray}
          size="small"
          onToggle={(val) => {
            if (val && _.isEmpty(accounts)) {
              Utils.toast(I18n.t('opencard.empty_account'))
              return
            }
            setAuto(val)
          }}
        />
      </View>
      {auto && (
        <View>
          <Radio
            size={Utils.getRatioDimension(18)}
            style={[styles.checkBox]}
            textStyle={styles.textCheckBox}
            text={I18n.t('opencard.full_billling')}
            checked={isFullPayment}
            onPress={() => {
              setFullPayment(true)
            }}
          />
          <Radio
            size={Utils.getRatioDimension(18)}
            style={[styles.checkBox]}
            textStyle={styles.textCheckBox}
            text={I18n.t('opencard.min_billling')}
            checked={!isFullPayment}
            onPress={() => {
              setFullPayment(false)
            }}
          />
          {!_.isEmpty(accounts) && (
            <SelectAccount
              style={{
                paddingHorizontal: 0,
              }}
              title={I18n.t('opencard.account_title')}
              data={accounts || []}
              onSelectRolloutAccountNo={onSelectRolloutAccountNo}
            />
          )}
        </View>
      )}
    </View>
  )

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
      <Topbar title={I18n.t('opencard.title')} subTitle={I18n.t('opencard.sub_title_input')} />
      <KeyboardAwareScrollView
        style={Helpers.fullWidth}
        showsVerticalScrollIndicator
        extraHeight={300}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Helpers.fill, styles.container]}>
          <View style={styles.titleContainer}>
            {ItemDisplay(I18n.t('opencard.max_limit'), creditCardMax, true)}
            <View style={styles.element}>
              <Text style={[styles.title]}>{I18n.t('opencard.request_limit')}</Text>
              <AmountInputText
                style={[styles.content, { color: typeCreditCardMax === '1' ? '#81838A' : '#15181B' }]}
                value={amountInput}
                defaultVal={Utils.formatAmountText(amountInput)}
                rightText="VND"
                placeholder={I18n.t('overdraft.enterAmount')}
                placeholderTextColor="#15181B"
                onChangeText={onAmoutChange}
                returnKeyType="next"
                defaultValue={typeCreditCardMax === '1' ? creditCardMax : null}
                maxLength={13}
              />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <SelectButton
              title={I18n.t('opencard.location_receive')}
              defaultValue={branch ? branch.branchName : I18n.t('opencard.location_receive_holder')}
              onPress={onSelectBranch}
            />
            <View style={styles.element}>
              <Text style={[styles.title]}>{I18n.t('opencard.sec_question_title')}</Text>
              <Text style={[styles.content, { color: '#15181B' }]}>
                {I18n.t('opencard.sec_question')}
              </Text>
              <TextInput
                style={[styles.content, { color: _.isEmpty(securityName) ? '#15181B' : '#81838A' }]}
                value={answer}
                placeholder={I18n.t('opencard.sec_question_holder')}
                placeholderTextColor="#81838A"
                onChangeText={(val) => {
                  setAnswer(val)
                }}
                multiline
                editable={_.isEmpty(securityName)}
                maxLength={30}
                returnKeyType="next"
              />
            </View>
            <Text style={[styles.content, { color: '#81838A', fontSize: 12, fontStyle: 'italic' }]}>
              {I18n.t('opencard.sec_question_holder_desc')}
            </Text>
          </View>
          {renderAutoPayment()}
        </View>
      </KeyboardAwareScrollView>
      <ConfirmButton onPress={() => onRegister()} />
    </Fragment>
  )
}
export default OpenCardInput
