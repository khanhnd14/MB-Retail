import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import I18n from 'i18n-js'
import Carousel from 'react-native-snap-carousel'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'underscore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Topbar, ConfirmButton, Text } from '../../../components'
import { Colors, Metrics } from '../../../theme'
import { Utils } from '../../../utilities'
import ActionBarPaymentAcount from '../../../components/Account/action_bar.component'
import * as Navigation from '../../../navigation'
import AdvancedSearch from './AdvancedSearch'
import InputChangeName from './InputChangeName'
import { saveOperations } from '../../../state/save'
import { accountOperations } from '../../../state/account'
import { RESET_STORE } from '../../../state/save/types'
import Chart from './Chart'
import ListHistory from './ListHistory'
import DataCard from '../DataCard'

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.mainBg, flex: 1 },
  viewDecoration: {
    width: '100%',
    height: Utils.getWindowHeight() / 3.5,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'absolute',
    zIndex: -1,
  },
  titleItem: { fontFamily: 'Helvetica', fontSize: 12 },
  viewItemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Metrics.small,
    paddingBottom: Metrics.small,
    paddingTop: Metrics.small,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray9,
  },
  viewContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  textContent: {
    fontFamily: 'Helvetica',
    maxWidth: Metrics.medium * 10,
  },
  textAmount: {
    fontFamily: 'Helvetica',
    fontWeight: '600',
  },
  viewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.gray9,
    paddingHorizontal: 5,
  },
  dotStyle: {
    width: 15,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 0,
    backgroundColor: Colors.gray1,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gray7,
  },
  textAmountAcount: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: Colors.primary2,
    paddingVertical: 10,
  },
  viewAcount: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitleAcount: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  textContentAcount: {
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  notesChart: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    marginLeft: Metrics.medium * 2,
    marginTop: Metrics.tiny,
  },
  dotNotesChart_1: {
    backgroundColor: Colors.primary2,
    marginHorizontal: Metrics.tiny,
    height: Metrics.normal,
    width: Metrics.normal,
    borderRadius: Metrics.normal / 2,
  },
  dotNotesChart_2: {
    backgroundColor: Colors.second2,
    height: Metrics.normal,
    width: Metrics.normal,
    borderRadius: Metrics.normal / 2,
  },
  scrollDetail: {
    backgroundColor: Colors.white,
    // height: Utils.getWindowHeight() / 2.7,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal
  }
})

let refInputChangeName
const PaymentAccountScreen = (props) => {
  const actionData = [
    { title: I18n.t('account.card_payment.detail'), icon: 'account_chitiet', navigate: '' },
    { title: I18n.t('account.card_payment.trans'), icon: 'account_chuyenkhoan', navigate: 'TransferScreen' },
    { title: I18n.t('account.card_payment.payment'), icon: 'account_thanhtoan', navigate: 'HistoryBillPayment' },
    { title: I18n.t('account.card_payment.history'), icon: 'account_lichsu', navigate: '' },
    { title: I18n.t('account.card_payment.init_saving'), icon: 'account_tietkiem', navigate: 'SaveScreen' },
    { title: I18n.t('account.card_payment.recharge'), icon: 'account_naptien', navigate: 'RechargeScreen' },
    { title: I18n.t('account.card_payment.rename'), icon: 'account_doiten', navigate: '' },
  ]
  const refSelectExchange = useRef()
  const carouselRef = useRef(null)
  const [indexCarousel, setIndexCarousel] = useState(0)
  const dispatch = useDispatch()
  const {
    accountPayment,
    loadingHistoryExchange,
    caSaDetailResult,
    caSaDetailError
  } = useSelector((state) => state.account)
  const [isShowAdvancedSearch, setIsShowAdvancedSearch] = useState(false)
  const [isShowRecentExchange, setIsShowRecentExchange] = useState(true)

  const [isShowDetail, setIsShowDetail] = useState(true)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [isShowInput, setIsShowInput] = useState(false)
  const [name, setName] = useState('')
  const { resultChangeAliasName } = useSelector((state) => state.save)

  const dataPayment = useMemo(() => {
    const { accNo } = props.route.params
    return _.map(accountPayment, (num) => {
      if (accNo === num.acctNo) {
        return {
          title: num.alias,
          content: num.accountInString,
          amount: num.availableBalance,
          currencyCode: num.currencyCode,
          accountDetail: num,
        }
      }
    }).filter((e) => e !== undefined)
  }, [accountPayment])
  const infos = useMemo(() => [{
      label: I18n.t('account.card_payment.available_balance'),
      content: `${Utils.formatAmountText(dataPayment[0]?.accountDetail?.availableBalance)} ${dataPayment[0]?.accountDetail?.currencyCode}`
    }, {
      label: I18n.t('account.card_payment.ledger_balance'),
      content: `${dataPayment[0]?.accountDetail?.overdraftLimit > 0 ? `(${Utils.formatAmountText(dataPayment[0]?.accountDetail?.ledgerBalance)})` : Utils.formatAmountText(dataPayment[0]?.accountDetail?.ledgerBalance)} ${dataPayment[0]?.accountDetail?.currencyCode}`
    },
    // {
    //   label: I18n.t('account.card_payment.interest_rate'),
    //   content: `${`${parseFloat(dataPayment[0]?.accountDetail?.interestRate * 100).toFixed(2)}%/${I18n.t('saving.year')}`}`
    // },
    {
      label: I18n.t('account.card_payment.accured_interest'),
      content: `${Utils.formatAmountText(dataPayment[0]?.accountDetail?.accuredInterest) || 0} ${dataPayment[0]?.accountDetail?.currencyCode}`
    }, {
      label: I18n.t('account.card_payment.overdraft_limit'),
      content: `${Utils.formatAmountText(dataPayment[0]?.accountDetail?.overdraftLimit) || 0} ${dataPayment[0]?.accountDetail?.currencyCode}`
    },
    {
      label: I18n.t('account.card_payment.lai_thau_chi'),
      content: `${Utils.formatAmountText(caSaDetailResult?.laiThauChi)} ${dataPayment[0]?.accountDetail?.currencyCode}`
    },
    {
      label: I18n.t('account.card_payment.du_no_goc'),
      content: `${Utils.formatAmountText(caSaDetailResult?.duNoGoc)} ${dataPayment[0]?.accountDetail?.currencyCode}`
    }, {
      label: I18n.t('account.card_payment.lai_phat_thau_chi'),
      content: `${Utils.formatAmountText(caSaDetailResult?.laiPhatThauChi)} ${dataPayment[0]?.accountDetail?.currencyCode}`
    }, {
      label: I18n.t('account.card_payment.tong_tien_thanh_toan'),
      content: `${Utils.formatAmountText(caSaDetailResult?.tongTienThanhToan)} ${dataPayment[0]?.accountDetail?.currencyCode}`
    }], [dataPayment, caSaDetailResult])

  useEffect(() => {
    dispatch(accountOperations.getCaSaDetail(dataPayment[0]?.accountDetail?.acctNo))
  }, [dataPayment])

  useEffect(
    () => () => {
      dispatch({
        type: RESET_STORE,
      })
    },
    []
  )

  console.log('====================================');
  console.log('infos', infos);
  console.log('====================================');
  const _renderItem = ({ item, index }) => (
    <View key={index} style={styles.viewAcount}>
      <Text style={styles.textTitleAcount}>{name || item?.title}</Text>
      <Text style={styles.textContentAcount}>{item?.content}</Text>
      <Chart />
      <View style={styles.notesChart}>
        <View style={styles.dotNotesChart_1} />
        <Text style={{ marginHorizontal: Metrics.tiny * 2, fontSize: 10 }}>
          {I18n.t('account.title_note_chart_1')}
        </Text>
        <View style={styles.dotNotesChart_2} />
        <Text style={{ marginHorizontal: Metrics.tiny * 2, fontSize: 10 }}>
          {I18n.t('account.title_note_chart_2')}
        </Text>
      </View>
      <Text style={styles.textAmountAcount}>
        {`${Utils.formatAmountText(item?.amount)} ${item.currencyCode}`}
      </Text>
    </View>
  )

  const onAdvancedSearch = useCallback(() => {
    setLoadingSearch(false)
    setIsShowRecentExchange(false)
    setIsShowAdvancedSearch(true)
  }, [isShowAdvancedSearch])

  const onSearch = () => {
    refSelectExchange && refSelectExchange.current.onSearch(1)
  }

  const onActionPayment = (element) => {
    switch (element.title) {
      case I18n.t('account.card_payment.rename'):
        setIsShowInput(true)
        setTimeout(() => {
          refInputChangeName.onFocus()
        }, 0)
        break
      case I18n.t('account.card_payment.history'):
        setIsShowDetail(false)
        break;
      case I18n.t('account.card_payment.detail'):
        setIsShowDetail(true)
        break;
      default:
        element.navigate && Navigation.push(element.navigate)
        break
    }
  }

  const changeAliasAccount = (aliasName) => {
    const accNo = dataPayment[indexCarousel].content.replace(/-/g, '')
    dispatch(saveOperations.changeAliasName(accNo, aliasName))
    setName(aliasName)
  }

  const getAccount = () => {
    dispatch(accountOperations.getAcountList())
  }

  const getHistory = (callback, page = 1) => {
    const { accNo } = props.route.params
    const toDate = Utils.toStringDate(new Date())
    const fromAmount = 0
    const toAmount = '999999999999'
    const fromDate = Utils.toStringDate(new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000)));

    console.log('--------------------------------------------------------')
    console.log('fromDate', fromDate)
    console.log('toDate', toDate)
    console.log('--------------------------------------------------------')
    dispatch(callback(undefined, fromDate, toDate, fromAmount, toAmount, accNo, page, -1))
  }

  useEffect(() => {
    const callback = accountOperations.historyByAccount
    getHistory(callback, 1)
  }, [])

  useEffect(() => {
    if (loadingHistoryExchange) {
      Utils.showLoading()
    } else {
      setTimeout(() => {
        Utils.hideLoading()
      }, 1000);
    }
  }, [loadingHistoryExchange])

  useEffect(() => {
    if (caSaDetailError) {
      Utils.hideLoading()
    }
  }, [caSaDetailError])

  const { route } = props
  const [valueSearch, setValueSearch] = useState({})

  console.log('====================================');
  console.log('Utils.getWindowHeight()', Utils.getWindowHeight());
  console.log('====================================');
  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBg }}>
      <KeyboardAwareScrollView
        scrollEnabled={isShowAdvancedSearch}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <Topbar
          title={I18n.t('account.title')}
          background={Colors.white}
        />
        <View style={styles.viewDecoration} />
        <View>
          <Carousel
            layout="default"
            scrollEnabled={false}
            ref={carouselRef}
            data={dataPayment}
            renderItem={_renderItem}
            sliderWidth={Utils.getWindowWidth()}
            itemWidth={Utils.getWindowWidth()}
            firstItem={0}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            containerCustomStyle={{}}
            onSnapToItem={(index) => setIndexCarousel(index)}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <ActionBarPaymentAcount data={actionData} onAction={onActionPayment} />
          {!isShowDetail ? (
            <View
              style={{
              width: Utils.getWindowWidth() / 1.1,
            }}
            >
              <View style={{ ...styles.viewItemList, backgroundColor: Colors.white }}>
                <TouchableOpacity
                  onPress={() => {
                  setIsShowAdvancedSearch(false)
                  setIsShowRecentExchange(true)
                  const callback = accountOperations.historyByAccount
                  getHistory(callback, 1)
                }}
                >
                  <Text
                    style={[
                    styles.titleItem,
                    {
                      fontWeight: isShowRecentExchange ? 'bold' : 'normal',
                      color: isShowRecentExchange ? undefined : Colors.gray8,
                    },
                  ]}
                  >
                    {I18n.t('account.card_payment.recent_exchange')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAdvancedSearch}>
                  <Text
                    style={[
                      styles.titleItem,
                      {
                        fontWeight: !isShowRecentExchange ? 'bold' : 'normal',
                        color: !isShowRecentExchange ? undefined : Colors.gray8,
                      },
                    ]}
                  >
                    {I18n.t('account.card_payment.addvance_search')}
                  </Text>
                </TouchableOpacity>
              </View>
              {isShowAdvancedSearch ? (
                <AdvancedSearch
                  acctNo={route.params.accNo}
                  ref={refSelectExchange}
                  setIsShowAdvancedSearch={setIsShowAdvancedSearch}
                  valueSearch={valueSearch}
                  setValueSearch={(val) => setValueSearch(val)}
                  setLoadingSearch={setLoadingSearch}
                />
            ) : (
              <ListHistory
                {...props}
                acctNo={route.params.accNo}
                getHistory={getHistory}
                valueSearch={valueSearch}
              />
            )}
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.scrollDetail, { height: !(Utils.getWindowHeight() > 800) ? Utils.getWindowHeight() / 2.8 : undefined }]}
              scrollEnabled={!(Utils.getWindowHeight() > 800)}
            >
              <DataCard infos={infos} />
            </ScrollView>
          )}
        </View>

      </KeyboardAwareScrollView>
      <InputChangeName
        submitInput={changeAliasAccount}
        resultChangeAliasName={resultChangeAliasName}
        ref={(ref) => (refInputChangeName = ref)}
        account={dataPayment[indexCarousel]}
        getAccount={getAccount}
        setIsShowInput={setIsShowInput}
        isShowInput={isShowInput}
      />
      {isShowAdvancedSearch ? (
        <ConfirmButton
          loading={loadingSearch}
          onPress={onSearch}
          text={I18n.t('account.card_payment.search').toUpperCase()}
        />
        ) : null}
    </View>
  )
}

export default PaymentAccountScreen
