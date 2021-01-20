/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import {
  Topbar,
  Text,
  AmountLabel,
  Icon,
  AmountInputText,
  TextInput,
  Radio,
  ConfirmButton,
} from '../../../components'
import { transferOperations, transferSelectors } from '../../../state/transfer'
import { transferStockOperations } from '../../../state/stocktransfer'
import { Utils } from '../../../utilities'
import I18n from '../../../translations'
import AccountSheet from '../common/AccountSheet'
import StockBenefitSheet from './StockBenefitSheet'
import * as Navigation from '../../../navigation'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
  },
  element: {
    ...Helpers.rowCross,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    paddingVertical: Metrics.tiny / 2,
  },
  content: {
    color: Colors.textBlack,
    paddingVertical: Metrics.tiny / 2,
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny,
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
  btnContinue: {
    padding: 12,
    ...Helpers.contentWidth,
    marginVertical: Metrics.normal,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.medium,
    width: '100%',
    marginTop: Metrics.small,
    marginHorizontal: Metrics.small,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input: {
    paddingVertical: Metrics.normal,
  },
  queryButton: {
    width: Metrics.medium * 2,
    height: Metrics.medium * 2,
    borderRadius: Metrics.medium,
    backgroundColor: Colors.primary2

  }
})
var timeOut
const StockTransfer = () => {
  const { rolloutAcc } = useSelector((state) => state.transfer)
  const { listStock, benefitAcc, otpDataComplete, benefitAccError } = useSelector(
    (state) => state.stocktransfer
  )

  const [fromAcc, setFromAcc] = useState('')
  const [fromAccName, setFromAccName] = useState('')
  const [fromAccAmount, setFromAccAmount] = useState(0)
  const [amount, setAmount] = useState(0)
  const [amountInWord, setAmoutInWord] = useState(null)
  const [content, setContent] = useState('')
  const [stockAcc, setStockAcc] = useState('')
  const [isContinue, setContinue] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadBenefit, setLoadBenefit] = useState(false)
  const [stockSelected, setStock] = useState({})
  const [stockSubSelected, setSubStock] = useState({})
  const [selectedAcc, setSelectedAcc] = useState(null)

  const sheetAcc = useRef(null)
  const sheetBenefit = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    getData()
    return () => dispatch(transferStockOperations.reset())
  }, [])

  useEffect(() => {
    if (!Utils.isArrayEmpty(listStock)) {
      setStock(listStock[0])
    }
  }, [listStock])

  useEffect(() => {
    initData()
  }, [rolloutAcc])

  useEffect(() => {
    formValidate()
  }, [benefitAcc, amount, rolloutAcc, stockAcc])

  useEffect(() => {
    if (loadBenefit) {
      setLoadBenefit(false)
    }
    if (stockSelected.stockName === 'MSI') {
      setSubStock(benefitAcc.lstAcc ? benefitAcc.lstAcc[0] : {})
      sheetBenefit.current && sheetBenefit.current.show()
    }
  }, [benefitAcc])

  useEffect(() => {
    if (loadBenefit) {
      setLoadBenefit(false)
    }
  }, [benefitAccError])

  useEffect(() => {
    if (loading && otpDataComplete) {
      setLoading(false)
      Navigation.push('StockConfirm', {
        fromAcc,
        fromAccName,
        amountInWord,
        stockCode: stockSelected.stockCode,
      })
    }
  }, [otpDataComplete])

  const selectStock = (item) => {
    setStock(item)
    setSubStock({})
  }

  const getData = () => {
    dispatch(transferStockOperations.getListStock())
    dispatch(transferOperations.getRolloutAcc())
  }

  const onAmoutChange = (amount) => {
    setAmount(amount.replace(/,/g, ''))
    setAmoutInWord(transferSelectors.amountToWord(amount))
  }

  const onSelectAccount = (defaultAccount) => {
    if (defaultAccount) {
      setFromAcc(defaultAccount.acctNo)
      setFromAccName(defaultAccount.alias)
      setFromAccAmount(defaultAccount.availableBalance)
      setSelectedAcc(defaultAccount)
    }
  }

  const initData = () => {
    if (rolloutAcc) {
      const defaultAccount = rolloutAcc[0]
      if (defaultAccount) {
        setFromAcc(defaultAccount.acctNo)
        setFromAccName(defaultAccount.alias)
        setFromAccAmount(defaultAccount.availableBalance)
        setSelectedAcc(defaultAccount)
      }
    }
  }

  const formValidate = () => {
    if (fromAcc && benefitAcc && stockAcc) {
      setContinue(amount > 0)
    }
  }

  const onConfirm = () => {
    if (isContinue) {
      setLoading(true)
      const body = {
        fromAcc,
        amount,
        purpose: Utils.clean_vietnamese(content),
        stockAcc,
        stockAccName: benefitAcc.customername,
        stockAccCom: benefitAcc.stockAcc || '',
        subStockAcc: stockSubSelected.acctNo || '',
        stockCode: stockSelected.stockCode,
      }
      dispatch(transferStockOperations.getOtpTransfer(body))
    } else {
      Utils.toast(I18n.t('application.input_empty'))
    }
  }

  const selectAcc = () => {
    sheetAcc.current && sheetAcc.current.show()
  }

  const queryStockAcc = () => {
    if (timeOut) {
      clearTimeout(timeOut)
    }
    timeOut = setTimeout(() => {
      setLoadBenefit(true)
      dispatch(
        transferStockOperations.getBenefit({
          stockCode: stockSelected.stockCode,
          stockAcc,
        })
      )
    }, 300)
  }

  const onSelectSubBenefit = (subBenefit) => {
    setSubStock(subBenefit)
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.title')} subTitle={I18n.t('transfer.stock_transfer')} />
      <View style={[Helpers.fillColCross, { backgroundColor: Colors.mainBg }]}>
        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Helpers.fillColCross, styles.container]}>
            <TouchableOpacity
              style={[styles.element, { paddingHorizontal: Metrics.medium }]}
              onPress={selectAcc}
            >
              <View style={Helpers.fill}>
                <Text style={styles.title}>{I18n.t('transfer.rollout_account')}</Text>
                {selectedAcc ? (
                  <Text style={styles.contentBold}>
                    {`${selectedAcc.accountInString}-${fromAccName}`}
                  </Text>
                ) : (
                  <Text style={styles.content}>{I18n.t('transfer.holder_account')}</Text>
                )}
                <AmountLabel style={styles.contentAmount} value={fromAccAmount} currency="VND" />
              </View>
              <Icon name="icon-detail" size={20} color={Colors.check} />
            </TouchableOpacity>
            <View style={styles.contentContainer}>
              <View style={[styles.element]}>
                <View style={[Helpers.fill, { paddingVertical: Metrics.small }]}>
                  <Text style={styles.title}>{I18n.t('application.type')}</Text>
                  <View style={Helpers.rowCenter}>
                    {listStock.map((item, index) => (
                      <Radio
                        key={`${index}`}
                        textStyle={{ paddingRight: Metrics.medium * 1.5 }}
                        text={item.stockName === 'MSI' ? 'KBSV' : item.stockName}
                        checked={stockSelected.stockCode === item.stockCode}
                        onPress={() => selectStock(item)}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <View style={[styles.element]}>
                <View style={Helpers.fill}>
                  <Text style={styles.title}>{I18n.t('transfer.stockAcc')}</Text>
                  <TextInput
                    value={stockAcc}
                    style={styles.input}
                    onChangeText={(val) => setStockAcc(val)}
                    returnKeyType="search"
                    onSubmitEditing={() => queryStockAcc()}
                    maxLength={30}
                  />
                  <Text style={styles.contentAmount}>
                    {benefitAcc ? benefitAcc.customername : ''}
                  </Text>
                </View>
                <TouchableOpacity style={[Helpers.center, styles.queryButton]} onPress={queryStockAcc}>
                  {loadBenefit && <ActivityIndicator color="white" />}
                  {!loadBenefit && (
                  <Icon name="icon-search" color="white" size={16} />
                    )}
                </TouchableOpacity>
              </View>
              {stockSelected.stockName === 'MSI' && benefitAcc && (
                <View style={[styles.element]}>
                  <View style={Helpers.fill}>
                    <Text style={styles.contentAmount}>{I18n.t('stocktransfer.subAcc')}</Text>
                    <Text style={styles.contentAmount}>{stockSubSelected.acctNo}</Text>
                    <Text style={styles.contentAmount}>{I18n.t('stocktransfer.stockCompany')}</Text>
                    <Text style={styles.contentAmount}>{benefitAcc.stockAcc}</Text>
                  </View>
                </View>
              )}

              <View style={[styles.element]}>
                <View style={Helpers.fill}>
                  <Text style={styles.title}>{I18n.t('transfer.amount')}</Text>
                  <AmountInputText
                    style={styles.contentBold}
                    value={amount}
                    rightText="VND"
                    onChangeText={onAmoutChange}
                    returnKeyType="done"
                    maxLength={13}
                  />
                  {amountInWord && <Text style={styles.formAmount}>{amountInWord}</Text>}
                </View>
              </View>
              <View style={[styles.element, { borderBottomWidth: 0 }]}>
                <View style={Helpers.fill}>
                  <Text style={styles.title}>{I18n.t('transfer.content')}</Text>
                  <TextInput
                    value={content}
                    style={styles.input}
                    onChangeText={(val) => setContent(val)}
                    returnKeyType="done"
                    multiline
                    maxLength={150}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ConfirmButton onPress={onConfirm} loading={loading} />
      </View>
      <AccountSheet
        ref={sheetAcc}
        data={rolloutAcc}
        defaultValue={fromAcc}
        onSelect={onSelectAccount}
      />
      <StockBenefitSheet
        ref={sheetBenefit}
        data={benefitAcc}
        defaultValue={stockSubSelected}
        selectAcc={onSelectSubBenefit}
      />
    </Fragment>
  )
}
export default StockTransfer
