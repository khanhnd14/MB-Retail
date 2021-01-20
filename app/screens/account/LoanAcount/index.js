import React, { useRef, useState, useEffect, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import I18n from 'i18n-js'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Topbar, Icon, ConfirmButton, Text } from '../../../components'
import { Colors, Images, Metrics } from '../../../theme'
import { Utils } from '../../../utilities'
import ActionBarPaymentAcount from '../../../components/Account/action_bar.component'
import { getAcountList } from '../../../state/account/actions'
import DataCard from '../DataCard'
import HistoryList from './HistoryList'
import AdvancedSearch from '../PaymentAcount/AdvancedSearch'
import { accountOperations } from '../../../state/account'
import { RESET_STORE } from '../../../state/save/types'

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
  titleItem: { fontWeight: '500', fontFamily: 'Helvetica' },
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.gray9,
    paddingHorizontal: 5,
  },
  textContent: { fontFamily: 'Helvetica', color: Colors.gray1 },
  textAmount: {
    fontFamily: 'Helvetica',
    fontWeight: '600',
    color: Colors.amountMinus,
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
  },
  viewAcount: {
    width: '100%',
    marginHorizontal: 50,
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
  titleSaving: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewTitleSaving: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Utils.getWindowHeight() / 7,
  },
  credit: {
    height: Utils.getWindowHeight() / 5.5,
    aspectRatio: Utils.getImageParams(Images.credit).aspectRatio,
    marginVertical: 18,
  },
  creditAlert: {
    height: Utils.getWindowHeight() / 6,
    aspectRatio: Utils.getImageParams(Images.credit).aspectRatio,
    marginVertical: Utils.getWindowHeight() / 100,
  },
  viewAlert: {
    width: '85%',
    height: Utils.getWindowHeight() / 2.5,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: 7.5,
    alignItems: 'center',
    paddingVertical: Utils.getWindowHeight() / 25,
    paddingHorizontal: Utils.getWindowHeight() / 20,
    justifyContent: 'space-between',
  },
  titleModal: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    textAlign: 'center',
  },
  viewBtnModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btnModal: {
    height: Utils.getWindowHeight() / 30,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.getWindowHeight() / 60,
    backgroundColor: Colors.gray9,
  },
  textBtnModal: {
    color: Colors.white,
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollDetail: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Metrics.normal,
    borderBottomRightRadius: Metrics.normal
  }
})

const LoanAcountScreen = ({ navigation, route }) => {
  const Action = {
    HISTORY: 'HISTORY',
    DETAIL: 'DETAIL'
  }

  const actionData = [
    { title: I18n.t('account.card_payment.detail'), icon: 'account_chitiet', type: Action.DETAIL },
    { title: I18n.t('account.card_payment.history'), icon: 'account_lichsu', type: Action.HISTORY },
  ]
  const refSelectExchange = useRef()
  const carouselRef = useRef(null)
  const [loadingCarousel, setLoadingCarousel] = useState(true)
  const [indexCarousel, setIndexCarousel] = useState(route.params.index || 0)
  const dispatch = useDispatch()
  const { accountCredit } = useSelector((state) => state.account)
  const [mapShow, setMapShow] = useState(new Map())
  const [isShowAdvancedSearch, setIsShowAdvancedSearch] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [valueSearch, setValueSearch] = useState({})

  const dataCredit = useMemo(
    () =>
      _.map(accountCredit, (item) => ({
        title: item.alias,
        content: item.accountInString,
        amount: item.osPrincipal,
        acctNo: item.acctNo,
      })),
    [accountCredit]
  )
  console.log('--------------------------------------------------------')
  console.log('accountCredit', accountCredit)
  console.log('--------------------------------------------------------')
  const loanAccount = useMemo(() => accountCredit[indexCarousel], [accountCredit, indexCarousel])
  console.log('====================================');
  console.log('loanAccount', loanAccount);
  console.log('====================================');
  const infos = useMemo(() => [{
    label: I18n.t('account.os_principal'),
    content: `${Utils.formatAmountText(loanAccount?.osPrincipal)} ${loanAccount?.currencyCode}`
  }, {
    label: I18n.t('account.overdraft_limit'),
    content: `${Utils.formatAmountText(loanAccount?.overdraftLimit)} ${loanAccount?.currencyCode}`
  },
  {
    label: I18n.t('account.full_release_date'),
    content: moment(loanAccount?.fullReleaseDate).format('DD/MM/YYYY')
  },
  {
    label: I18n.t('account.maturity_date'),
    content: moment(loanAccount?.maturityDate).format('DD/MM/YYYY')
  }, {
    label: I18n.t('account.interest_rate'),
    content: loanAccount?.interestRate ? `${Math.round((loanAccount?.interestRate * 100) * 1000) / 1000}%/${I18n.t('saving.year')}` : ''
  }], [loanAccount])
  console.log('====================================');
  console.log(infos);
  console.log('====================================');
  const currencyCode = accountCredit[0]?.currencyCode
  useEffect(() => {
    setTimeout(() => {
      setLoadingCarousel(false)
    }, 100)
  }, [])
  useEffect(() => {}, [indexCarousel])
  useEffect(() => {
    if (!accountCredit.length) {
      dispatch(getAcountList())
    }
  }, [])

  // unmount
  useEffect(
    () => () => {
      dispatch({
        type: RESET_STORE,
      })
    },
    []
  )

  const _renderItem = ({ item, index }) => (
    <View key={index} style={styles.viewAcount}>
      <Text style={styles.textTitleAcount}>{item.title}</Text>
      <Text style={styles.textContentAcount}>{item.content}</Text>
      <Image
        style={{
          width: Metrics.small * 16.5,
          height: Metrics.small * 12.8,
          resizeMode: 'contain',
          marginVertical: Metrics.normal * 2,
        }}
        source={Images.vay}
      />

      {console.log('item', item)}
      <Text style={styles.textAmountAcount}>
        {`${Utils.formatAmountText(item.amount)} ${currencyCode}`}
      </Text>
    </View>
  )

  function pagination() {
    return (
      <Pagination
        dotsLength={dataCredit.length}
        activeDotIndex={indexCarousel}
        containerStyle={{ paddingVertical: 18 }}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    )
  }

  if (loadingCarousel) {
    return null
  }

  const updateMapShow = (k, v) => {
    [...mapShow.keys()].forEach((key) => {
      mapShow.set(key, false)
    })
    mapShow.set(k, v)
    setMapShow(new Map(mapShow))
  }

  const getHistory = () => {
    const acctNo = loanAccount?.acctNo
    const queryType = 0
    dispatch(accountOperations.historyByLoanAccount(acctNo, queryType))
  }

  const onAction = (item) => {
    switch (item.type) {
      case Action.HISTORY:
        updateMapShow(Action.HISTORY, true)
        getHistory()
        break
      case Action.DETAIL:
        updateMapShow(Action.DETAIL, true)
        break
      default:
        break
    }
  }

  const onAdvancedSearch = () => {
    setIsShowAdvancedSearch(true)
    setLoadingSearch(false)
  }

  const onSearch = () => {
    setLoadingSearch(true)
    refSelectExchange && refSelectExchange.current.onSearch(1)
  }

  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView
        scrollEnabled={isShowAdvancedSearch}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <Topbar title={I18n.t('account.title_rent')} background={Colors.white} />
        <View style={styles.viewDecoration} />
        {accountCredit.length !== 0 ? (
          <>
            <View>
              <Carousel
                layout="default"
                ref={carouselRef}
                data={dataCredit}
                renderItem={_renderItem}
                sliderWidth={Utils.getWindowWidth()}
                itemWidth={Utils.getWindowWidth()}
                firstItem={route.params.index}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                containerCustomStyle={{}}
                slideStyle={{ left: -50 }}
                onSnapToItem={(index) => {
                setIndexCarousel(index)
                updateMapShow(Action.RECHARGE, true)
                setIsShowAdvancedSearch(false)
              }}
              />
              {pagination()}
            </View>
            <View style={{ alignItems: 'center' }}>
              <ActionBarPaymentAcount data={actionData} onAction={(item) => onAction(item)} />
              {mapShow.get(Action.DETAIL) || !mapShow.size ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={[styles.scrollDetail]}
                >
                  <DataCard infos={infos} />
                </ScrollView>
            ) : null}
              <View
                style={{
                width: Utils.getWindowWidth() / 1.1,
              }}
              >
                {mapShow.get(Action.HISTORY) ? (
                  <>
                    <View style={{ ...styles.viewItemList, backgroundColor: Colors.white }}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsShowAdvancedSearch(false)
                        }}
                      >
                        <Text
                          style={[
                          styles.titleItem,
                          {
                            fontWeight: !isShowAdvancedSearch ? 'bold' : 'normal',
                            color: !isShowAdvancedSearch ? undefined : Colors.gray8,
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
                              fontWeight: isShowAdvancedSearch ? 'bold' : 'normal',
                              color: isShowAdvancedSearch ? undefined : Colors.gray8,
                            },
                          ]}
                        >
                          {I18n.t('account.card_payment.addvance_search')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {isShowAdvancedSearch ? (
                      <>
                        <AdvancedSearch
                          acctNo={accountCredit[indexCarousel].acctNo}
                          ref={refSelectExchange}
                          setIsShowAdvancedSearch={setIsShowAdvancedSearch}
                          valueSearch={valueSearch}
                          setValueSearch={(val) => setValueSearch(val)}
                        />
                      </>
                    ) : (
                      <View>
                        {mapShow.get(Action.HISTORY) ? <HistoryList /> : null}
                      </View>
                    )}
                  </>
              ) : null}
              </View>
            </View>
          </>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{I18n.t('application.message_empty_result')}</Text>
        </View>
      )}
      </KeyboardAwareScrollView>
      {(mapShow.get(Action.HISTORY) && isShowAdvancedSearch) && (
      <ConfirmButton
        loading={loadingSearch}
        onPress={onSearch}
        text={I18n.t('account.card_payment.search').toUpperCase()}
      />
)}
    </View>
  )
}

export default LoanAcountScreen
