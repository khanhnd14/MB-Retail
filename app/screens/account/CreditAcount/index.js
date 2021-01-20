import React, { useRef, useState, useEffect, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import I18n from 'i18n-js'
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Topbar, Icon, ConfirmButton, Text } from '../../../components'
import { Colors, Images, Metrics } from '../../../theme'
import { Utils, common } from '../../../utilities'
import { RESET_STORE, RESET_CARD_CHANGE_STATUS } from '../../../state/account/types'
import ActionBarPaymentAcount from '../../../components/Account/action_bar.component'
import {
  getCardList,
  getCardListFull,
  cardChangeStatus,
  makeTransactionAccount,
  sendOtp,
  getAcountList,
  getListSaveAcount,
} from '../../../state/account/actions'
import DataCard from '../DataCard'
import HistoryList from './HistoryList'
import AdvancedSearch from '../PaymentAcount/AdvancedSearch'
import { accountOperations } from '../../../state/account'
import { getCardCredit } from '../../../utilities/common'
import RollBackPayment from './RollBackPayment'
import ActiveCard from './ActiveCard'
import LockCard from './LockCard'
import * as Navigation from '../../../navigation'

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
    fontSize: 18,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: Colors.primary2,
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
    borderBottomRightRadius: Metrics.normal,
  },
})

const CreditAcountScreen = ({ navigation, route }) => {
  const { creditItem } = route.params

  const refSelectExchange = useRef()
  const [loadingCarousel, setLoadingCarousel] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useDispatch()
  const {
    cardList,
    cardListFull,
    transactionAccount,
    cardChangeComplete,
    cardChangeError,
    resultAmountStatus,
    resultRedeemGetUrl,
    historyCreditCard,
    historyCreditCardError,
    transAccountComplete,
    completeActiveCard,
    errorActiveCard,
  } = useSelector((state) => state.account)
  const [mapShow, setMapShow] = useState(new Map())
  const [isShowAdvancedSearch, setIsShowAdvancedSearch] = useState(false)
  const [isShowRecentExchange, setIsShowRecentExchange] = useState(true)

  const [loadingSearch, setLoadingSearch] = useState(false)
  const [valueSearch, setValueSearch] = useState({})
  const [dataCredit, setDataCredit] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLockedCard, setIsLockedCard] = useState(creditItem?.status === 'LOBC')
  const [isActiveCard, setIsActiveCard] = useState(creditItem?.productionStatus !== 'L')
  const refActiveCard = useRef()

  console.log('====================================')
  console.log('creditItem', creditItem)
  console.log('====================================')
  const cardInfo = useMemo(
    () => cardList.find((item) => item.contractNumber === creditItem?.contractNumber),
    [cardList, creditItem]
  )

  const infos = useMemo(
    () => [
      {
        label: I18n.t('account.available_balance'),
        content: `${Utils.formatAmountText(cardInfo?.availableBalance)} ${cardInfo?.currencyCode}`,
      },
      {
        label: I18n.t('account.credit_limit'),
        content: `${Utils.formatAmountText(cardInfo?.creditLimit)} ${cardInfo?.currencyCode}`,
      },
      {
        label: I18n.t('account.min_payment'),
        content: `${Utils.formatAmountText(cardInfo?.minPayment) || 0} ${cardInfo?.currencyCode}`,
      },
      {
        label: I18n.t('account.bill_amount'),
        content: `${Utils.formatAmountText(cardInfo?.billAmount) || 0} ${cardInfo?.currencyCode}`,
      },
      {
        label: I18n.t('account.due_date'),
        content: `${cardInfo?.dueDate}`,
      },
    ],
    [cardInfo]
  )

  console.log('====================================')
  console.log('infos', infos, cardInfo)
  console.log('====================================')
  useEffect(() => {
    const newCardList1 = cardList.map((item) => ({
      ...item,
      productionStatus: cardListFull.find((el) => el.contractNumber === item.contractNumber)
        ?.productionStatus,
      status: cardListFull.find((el) => el.contractNumber === item.contractNumber)?.status,
    }))
    const newListFull = _.map(cardListFull, (item) => ({
      contractNumber: item.contractNumber,
      cardNo: item.displayNumberCard,
      productionStatus: item?.productionStatus,
      status: item.status,
      cardType: item.cardType,
      cardCode: item.cardCode,
      cardName: item.productName,
      fi: item.fi,
      isVisaDining: item.isVisaDining
    }))
    let newCardList2 = []
    newCardList1.forEach((item) => {
      newListFull.forEach((el) => {
        if (el.contractNumber === item.contractNumber) {
          newCardList2 = [
            ...newCardList2,
            {
              ...item,
              productionStatus: el?.productionStatus,
              cardType: el.cardType,
              cardCode: el.cardCode,
              isVisaDining: el.isVisaDining,
              fi: el.fi,
              bonusPoint: item.bonusPoint,
              isActive: item.isActive,
            },
          ]
        }
      })
    })
    const diffArr = _.differenceBy(newListFull, newCardList2, 'contractNumber')
    setDataCredit(
      _.map(_.concat(newCardList2, diffArr), (item) => ({
        title: item.cardName,
        content: item.cardNo,
        amount: item.availableBalance,
        productionStatus: item?.productionStatus,
        status: item.status,
        contractNumber: item.contractNumber,
        cardType: item.cardType,
        cardCode: item.cardCode,
        currencyCode: item.currencyCode,
        availableBalance: item.availableBalance,
        fi: item.fi,
        bonusPoint: item.bonusPoint,
        isActive: item.isActive,
        isVisaDining: item.isVisaDining,
        toTime: item.toTime
      }))
    )
  }, [cardList, cardListFull])

  const Action = {
    BLOCK_CARD: 'BLOCK_CARD',
    PAY: 'PAY',
    HISTORY: 'HISTORY',
    DETAIL: 'DETAIL',
    ROLL_BACK_PAYMENT: 'ROLL_BACK_PAYMENT',
    CHANGE_GIFT: 'CHANGE_GIFT',
    PIN_CHANGE:'PIN_CHANGE'
  }

  console.log('cardList:', cardList);

  const actionData = useMemo(() => {
    let arr = []
    if (cardInfo) {
      if (creditItem.isVisaDining) {
        arr = [
          {
            title: I18n.t('account.card_payment.detail'),
            icon: 'account_chitiet',
            type: Action.DETAIL,
            disable: false,
          },
          // {
          //   title: isLockedCard ? 'Mở khóa thẻ' : 'Khóa thẻ',
          //   icon: 'account_khoathe',
          //   type: Action.BLOCK_CARD,
          //   disable: false,
          // },
          {
            title: I18n.t('account.card_payment.payment'),
            icon: 'account_thanhtoan2',
            type: Action.PAY,
            disable:
              dataCredit.find((item) => item.contractNumber === creditItem?.contractNumber)
                ?.cardType === 'D',
          },
          {
            title: I18n.t('account.card_payment.history'),
            icon: 'account_lichsu',
            type: Action.HISTORY,
            disable:
              dataCredit.find((item) => item.contractNumber === creditItem?.contractNumber)
                ?.cardType === 'D',
          },
          {
            title: I18n.t('account.card_payment.rollback_payment'),
            icon: 'account_hoantien',
            type: Action.ROLL_BACK_PAYMENT,
            disable:
              dataCredit.find((item) => item.contractNumber === creditItem?.contractNumber)
                ?.cardType === 'D',
          },
          {
            title: I18n.t('account.card_payment.change_gift'),
            icon: 'account_doiqua',
            type: Action.CHANGE_GIFT,
            disable:
              dataCredit.find((item) => item.contractNumber === creditItem?.contractNumber)
                ?.cardType === 'D',
          },
        ]
      } else {
        arr = [
          {
            title: I18n.t('account.card_payment.detail'),
            icon: 'account_chitiet',
            type: Action.DETAIL,
            disable: false,
          },
          // {
          //   title: I18n.t('account.card_payment.pin_change'),
          //   icon: 'account_chitiet',
          //   type: Action.PIN_CHANGE,
          //   disable: false,
          // },
          // {
          //   title: isLockedCard ? 'Mở khóa thẻ' : 'Khóa thẻ',
          //   icon: 'account_khoathe',
          //   type: Action.BLOCK_CARD,
          //   disable: false,
          // },
          {
            title: I18n.t('account.card_payment.payment'),
            icon: 'account_thanhtoan2',
            type: Action.PAY,
            disable:
              dataCredit.find((item) => item.contractNumber === creditItem?.contractNumber)
                ?.cardType === 'D',
          },
          {
            title: I18n.t('account.card_payment.history'),
            icon: 'account_lichsu',
            type: Action.HISTORY,
            disable:
              dataCredit.find((item) => item.contractNumber === creditItem?.contractNumber)
                ?.cardType === 'D',
          },
        ]
      }
    } else {
      arr = [
        // {
        //   title: isLockedCard ? 'Mở khóa thẻ' : 'Khóa thẻ',
        //   icon: 'account_khoathe',
        //   type: Action.BLOCK_CARD,
        //   disable: false,
        // },
        {
          title: I18n.t('account.card_payment.history'),
          icon: 'account_lichsu',
          type: Action.HISTORY,
          disable: false,
        },
      ]
    }
    return arr
  }, [cardInfo, isLockedCard])

  const currencyCode = cardList[0]?.currencyCode
  useEffect(() => {
    setTimeout(() => {
      setLoadingCarousel(false)
    }, 100)
  }, [])
  useEffect(() => {
    if (!cardList.length) {
      dispatch(getCardList())
    }
    if (!cardListFull.length) {
      dispatch(getCardListFull())
    }
  }, [])
  useEffect(() => {
    setLoading(false)
  }, [historyCreditCard, historyCreditCardError])

  // loading
  useEffect(() => {
    if (loading) {
      Utils.showLoading()
    } else {
      Utils.hideLoading()
    }
  }, [loading])
  // unmount
  useEffect(
    () => () => {
      dispatch([
        {
          type: RESET_CARD_CHANGE_STATUS,
        },
      ])
    },
    []
  )
  useEffect(() => {
    if (cardChangeComplete) {
      Utils.hideLoading()
      setLoading(false)
      if (isLockedCard) {
        setIsLockedCard(false)
        Utils.showToast(I18n.t('account.card_payment.unlock_success'))
      } else {
        setIsLockedCard(true)
        Utils.showToast(I18n.t('account.card_payment.lock_success'))
      }
    }
  }, [cardChangeComplete])
  useEffect(() => {
    if (cardChangeError) {
      Utils.hideLoading()
      setLoading(false)
      if (isLockedCard) {
        Utils.showToast(I18n.t('account.card_payment.unlock_fail'))
      } else {
        Utils.showToast(I18n.t('account.card_payment.lock_fail'))
      }
    }
  }, [cardChangeError])

  React.useEffect(() => {
    if (completeActiveCard) {
      console.log('====================================')
      console.log('OKKKK')
      console.log('====================================')
      Utils.hideLoading()
      Utils.showToast(I18n.t('account.card_payment.active_card_sccess'))
      setIsActiveCard(true)
      dispatch(getCardList())
      dispatch(getCardListFull())
    }
  }, [completeActiveCard])

  useEffect(() => {
    if (errorActiveCard) {
      Utils.hideLoading()
    }
  }, [errorActiveCard])

  useEffect(() => {
    if (transactionAccount) {
      dispatch(sendOtp({ transaction: transactionAccount.message }))
    }
  }, [transactionAccount])

  useEffect(() => {
    if (transAccountComplete) {
      setLoading(false)
      Utils.hideLoading()
      navigation.navigate('AccountOTPScreen', {
        contractNumber: creditItem?.contractNumber,
      })
    }
  }, [transAccountComplete])

  const updateMapShow = (k, v) => {
    [...mapShow.keys()].forEach((key) => {
      mapShow.set(key, false)
    })
    mapShow.set(k, v)
    setMapShow(new Map(mapShow))
  }

  const renderButtonLockCard = () => (
    <TouchableOpacity
      onPress={() => {
        setIsVisible(true)
        updateMapShow(Action.BLOCK_CARD, true)
        dispatch([
          {
            type: RESET_CARD_CHANGE_STATUS,
          },
        ])
      }}
      style={{
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary2,
        paddingVertical: Utils.getRatioDimension(8),
        paddingHorizontal: Utils.getRatioDimension(13),
        borderRadius: Utils.getRatioDimension(15),
        position: 'absolute',
        right: 0,
      }}
    >
      <Text
        style={{
          color: Colors.primary2,
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        {isLockedCard
          ? I18n.t('account.card_payment.unlock_card')
          : I18n.t('account.card_payment.locked_card')}
      </Text>
    </TouchableOpacity>
  )

  const _renderItem = (item) => (
    <View style={styles.viewAcount}>
      <Text style={styles.textTitleAcount}>{item?.title}</Text>
      <Text style={styles.textContentAcount}>{item?.content}</Text>
      <View
        style={{
          width: 317.33,
          height: 200,
          marginVertical: 15,
        }}
      >
        <Image
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
          source={getCardCredit(creditItem.cardType, creditItem.cardCode)}
        />
        <ActiveCard ref={refActiveCard} creditItem={creditItem} isActiveCard={isActiveCard} />
        <LockCard creditItem={creditItem} isLockedCard={isLockedCard} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          alignItems: 'center',
          paddingVertical: isActiveCard ? Utils.getRatioDimension(10) : 0,
          justifyContent: 'center',
        }}
      >
        <Text style={styles.textAmountAcount}>
          {item.amount ? `${Utils.formatAmountText(item.amount)} ${currencyCode}` : ''}
        </Text>
        {isActiveCard ? renderButtonLockCard() : null}
      </View>
    </View>
  )

  const renderButtonActiveCard = () => (
    <View style={{ alignSelf: 'center' }}>
      <TouchableOpacity
        onPress={() => refActiveCard.current.onActiveCard()}
        style={{
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.primary2,
          paddingVertical: Metrics.small,
          paddingHorizontal: Metrics.normal,
          borderRadius: Metrics.normal,
        }}
      >
        <Text
          style={{
            color: Colors.primary2,
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          Kích hoạt thẻ
        </Text>
      </TouchableOpacity>
    </View>
  )

  if (loadingCarousel) {
    return null
  }

  const getHistory = () => {
    setLoading(true)
    const contractNoEncode = creditItem?.contractNumber
    dispatch(accountOperations.getCardHistory(contractNoEncode))
  }

  const onAction = (item) => {
    // console.log('====================================')
    // console.log(item)
    // console.log('====================================')
    switch (item.type) {
      case Action.BLOCK_CARD:
        setIsVisible(true)
        updateMapShow(Action.BLOCK_CARD, true)
        break
      case Action.HISTORY:
        !mapShow.get(Action.HISTORY) && getHistory()
        updateMapShow(Action.HISTORY, true)
        break
      case Action.PAY:
        Navigation.push('CardService', { ...route.params })
        break
      case Action.DETAIL:
        updateMapShow(Action.BLOCK_CARD, true)
        break
      case Action.ROLL_BACK_PAYMENT:
        updateMapShow(Action.ROLL_BACK_PAYMENT, true)
        break
      case Action.CHANGE_GIFT:
        updateMapShow(Action.CHANGE_GIFT, true)
        break
      case Action.PIN_CHANGE:
        // debugger
        Navigation.push('CardPINChangeScreen', { ...route.params })
        break
      default:
        break
    }
  }

  const onAgreeModal = () => {
    setIsVisible(false)
    dispatch([
      {
        type: RESET_CARD_CHANGE_STATUS,
      },
    ])
    if (isLockedCard) {
      // mở thẻ
      Utils.showLoading()

      dispatch(makeTransactionAccount())
    } else {
      // khóa thẻ
      Utils.showLoading()

      dispatch(
        cardChangeStatus({
          contractNumber: creditItem?.contractNumber,
          status: 'CUS_LOCK',
          sessionId: '',
          otpInput: '',
        })
      )
    }
  }

  const onAdvancedSearch = () => {
    setIsShowAdvancedSearch(true)
    setIsShowRecentExchange(false)
    setLoadingSearch(false)
  }

  const onSearch = () => {
    setLoadingSearch(true)
    refSelectExchange && refSelectExchange.current.onSearch(1)
  }

  const onRollBack = () => {
    if (resultRedeemGetUrl) {
      Utils.openUrl(resultRedeemGetUrl.url)
    }
  }

  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView
        scrollEnabled={isShowAdvancedSearch}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <Topbar title={I18n.t('account.title_credit_screen')} background={Colors.white} />
        <View style={styles.viewDecoration} />
        {dataCredit?.length !== 0 ? (
          <>
            {_renderItem(creditItem)}
            {isActiveCard ? (
              <View style={{ alignItems: 'center', marginTop: Metrics.small }}>
                <ActionBarPaymentAcount data={actionData} onAction={(item) => onAction(item)} />
                {(mapShow.get(Action.BLOCK_CARD) || !mapShow.size) && (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollDetail}
                    scrollEnabled={!(Utils.getWindowHeight() > 800)}
                  >
                    {cardList.find((item) => item.contractNumber === creditItem?.contractNumber) ? (
                      <DataCard infos={infos} />
                    ) : null}
                  </ScrollView>
                )}
                {mapShow.get(Action.ROLL_BACK_PAYMENT) && (
                  <RollBackPayment
                    data={[
                      {
                        label: I18n.t('account.card_payment.total_amount'),
                        value: `${Utils.formatAmountText(resultAmountStatus?.totalAmount)} VND`,
                      },
                      {
                        label: I18n.t('account.card_payment.redeem_amount'),
                        value: `${Utils.formatAmountText(resultAmountStatus?.redeemAmount)} VND`,
                      },
                      {
                        label: I18n.t('account.card_payment.available_amount'),
                        value: `${Utils.formatAmountText(resultAmountStatus?.availableAmount)} VND`,
                      },
                    ]}
                    creditItem={creditItem}
                  />
                )}
                {mapShow.get(Action.CHANGE_GIFT) && (
                  <RollBackPayment
                    data={[
                      {
                        label: I18n.t('account.card_payment.total_point'),
                        value: `${Utils.formatAmountText(resultAmountStatus?.totalPoint)} VND`,
                      },
                      {
                        label: I18n.t('account.card_payment.redeem_point'),
                        value: `${Utils.formatAmountText(resultAmountStatus?.redeemPoint)} VND`,
                      },
                      {
                        label: I18n.t('account.card_payment.available_point'),
                        value: `${Utils.formatAmountText(resultAmountStatus?.availablePoint)} VND`,
                      },
                    ]}
                    creditItem={creditItem}
                  />
                )}
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
                            setIsShowRecentExchange(true)
                            getHistory()
                          }}
                          disabled={isShowRecentExchange}
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
                        <>
                          <AdvancedSearch
                            acctNo={route.params.accNo}
                            ref={refSelectExchange}
                            setIsShowAdvancedSearch={setIsShowAdvancedSearch}
                            valueSearch={valueSearch}
                            setValueSearch={(val) => setValueSearch(val)}
                            isCredit
                            contractNoEncode={creditItem?.contractNumber}
                            setLoadingSearch={setLoadingSearch}
                          />
                        </>
                      ) : (
                        <View style={{ backgroundColor: Colors.white, paddingBottom: 100 }}>
                          {mapShow.get(Action.HISTORY) ? <HistoryList /> : null}
                        </View>
                      )}
                    </>
                  ) : null}
                </View>
              </View>
            ) : (
              <>{renderButtonActiveCard()}</>
            )}
          </>
        ) : (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.viewAcount}>
              {!loading && <Text style={styles.textTitleAcount}>{I18n.t('account.card_payment.have_not_card')}</Text>}
              <View
                style={{
                  width: 240,
                  height: 154,
                  backgroundColor: !loading ? Colors.gray7 : Colors.primary2,
                  borderRadius: 10,
                  marginVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginTop: Metrics.medium * 4,
                }}
              >
                <Icon name="icon-dv-the" size={52} color={Colors.white} />
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginLeft: Metrics.medium,
                  }}
                >
                  {I18n.t('product.card').toLocaleUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Modal
          isVisible={isVisible}
          onBackdropPress={() => {
            setIsVisible(false)
          }}
          backdropTransitionOutTiming={0}
        >
          <View style={styles.viewAlert}>
            <View>
              <Text style={styles.titleModal}>
                {`${I18n.t('account.card_payment.you_sure')} ${
                    isLockedCard
                    ? `${I18n.t('action.open')} `
                    : ''
                }${I18n.t('account.card_payment.lock_card')}`}
              </Text>
              <View
                style={{
                  width: 240,
                  height: 154,
                  marginVertical: 5,
                }}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                  source={getCardCredit(creditItem.cardType, creditItem.cardCode)}
                />
              </View>
            </View>
            <View style={styles.viewBtnModal}>
              <TouchableOpacity style={styles.btnModal} onPress={() => setIsVisible(false)}>
                <Text style={styles.textBtnModal}>{I18n.t('action.action_cancel').toLocaleUpperCase()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.btnModal, backgroundColor: Colors.primary2 }}
                onPress={onAgreeModal}
              >
                <Text style={styles.textBtnModal}>{I18n.t('action.action_done').toLocaleUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
      {mapShow.get(Action.HISTORY) && isShowAdvancedSearch && (
        <ConfirmButton loading={loadingSearch} onPress={onSearch} text={'Tìm kiếm'.toUpperCase()} />
      )}
      {mapShow.get(Action.ROLL_BACK_PAYMENT) && (
        <ConfirmButton
          loading={loadingSearch}
          onPress={onRollBack}
          text={I18n.t('account.card_payment.rollback_payment').toUpperCase()}
        />
      )}
      {mapShow.get(Action.CHANGE_GIFT) && (
        <ConfirmButton
          loading={loadingSearch}
          onPress={onRollBack}
          text={I18n.t('account.card_payment.change_gift').toUpperCase()}
        />
      )}
    </View>
  )
}

export default CreditAcountScreen
