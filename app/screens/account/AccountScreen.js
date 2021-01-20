import React, { useEffect, useMemo, useCallback } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import I18n from 'i18n-js'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import styles from './AccountScreenStyle'
import Topbar from '../../components/Topbar'
import CollapsibleComponent from '../../components/Account/collapsible.component'
import {
  getAcountList,
  getListSaveAcount,
  getCardList,
  getCardListFull,
} from '../../state/account/actions'
import { Colors } from '../../theme'
import { Utils } from '../../utilities'

const AccountScreen = ({ navigation }) => {
  const {
    accountPayment,
    accountCredit,
    accountSave,
    cardList,
    cardListFull,
    errorGetAccount,
  } = useSelector((state) => state.account)
  const { savingOnlineAccounts, savingLocalizeAccounts, resultChangeAliasName } = useSelector(
    (state) => state.save
  )

  const dispatch = useDispatch()

  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    dispatch(getAcountList())
    dispatch(getListSaveAcount())
    dispatch(getCardList())
    dispatch(getCardListFull())
    // setRefreshing(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      dispatch(getAcountList())
      dispatch(getListSaveAcount())
      dispatch(getCardList())
      dispatch(getCardListFull())
      return () => {}
    }, [])
  )

  useEffect(() => {
    if (refreshing) {
      Utils.showLoading()
      setTimeout(() => {
        setRefreshing(false)
      }, 500)
    } else {
      setTimeout(() => {
        Utils.hideLoading()
      }, 500)
    }
  }, [refreshing])

  useEffect(() => {
    if (accountPayment) {
      setRefreshing(false)
    }
  }, [accountPayment])

  const paymentAmount = useMemo(
    () =>
      _.reduce(
        _.filter(accountPayment, (item) => item.currencyCode === 'VND'),
        (memo, num) => memo + num.availableBalance,
        0
      ),
    [accountPayment]
  )
  const creditAmount = useMemo(
    () =>
      _.reduce(
        _.filter(accountCredit, (item) => item.currencyCode === 'VND'),
        (memo, num) => memo + num.osPrincipal,
        0
      ),
    [accountCredit]
  )
  const saveAmount = useMemo(
    () =>
      _.reduce(
        _.filter(accountSave, (item) => item.currencyCode === 'VND'),
        (memo, num) => memo + num.currentCashValue,
        0
      ),
    [accountSave]
  )
  // const cardAmount = useMemo(() => _.reduce(_.filter(cardList, item => item.currencyCode === 'VND'), (memo, num) => memo + num.availableBalance, 0), [cardList])

  const dataPayment = useMemo(
    () =>
      _.map(accountPayment, (num) => ({
        title: num.alias,
        content: num.accountInString,
        amount: num.availableBalance,
        currencyCode: num.currencyCode,
      })),
    [accountPayment]
  )
  const dataCredit = useMemo(
    () =>
      _.map(accountCredit, (num) => ({
        title: num.alias,
        content: num.accountInString,
        amount: num.osPrincipal,
        currencyCode: num.currencyCode,
      })),
    [accountCredit]
  )
  const dataSaving = useMemo(() => {
    // lấy ra tại quầy
    const tq = _.compact(
      _.map(accountSave, (e) => {
        if (e.category === 'TQ') {
          return {
            title: e.alias,
            content: e.receiptNoInString,
            amount: e.currentCashValue,
            currencyCode: e.currencyCode,
            category: e.category,
          }
        }
      })
    )
    // lấy ra live
    const data = _.compact(
      _.map(accountSave, (num) => {
        if (num.category !== 'TQ') {
          return {
            title: num.alias,
            content: num.receiptNoInString,
            amount: num.currentCashValue,
            currencyCode: num.currencyCode,
            category: num.category,
          }
        }
      })
    )

    // cho tại quầy xuống cuối
    return [...data, ...tq]
  }, [accountSave])
  const cardCredit = useMemo(() => {
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
    const data = _.map(_.concat(newCardList2, diffArr), (item) => ({
      title: item.cardName,
      content: item.cardNo,
      amount: item.availableBalance,
      titleSaveing: I18n.t('account.live_save'),
      productionStatus: item?.productionStatus,
      status: item.status,
      contractNumber: item.contractNumber,
      cardType: item.cardType,
      currencyCode: item.currencyCode,
      cardCode: item.cardCode,
      availableBalance: item.availableBalance,
      fi: item.fi,
      bonusPoint: item.bonusPoint,
      isActive: item.isActive,
      isVisaDining: item.isVisaDining,
      toTime: item.toTime
    }))
    return _.filter(data, (item) => item.cardType === 'C')
  }, [cardList])

  const onItemPaymentPress = (index) => {
    navigation.push('PaymentAccountScreen', { accNo: accountPayment[index].acctNo })
  }
  const onItemCreditPress = (index) => {
    navigation.push('CreditAcountScreen', { creditItem: cardCredit[index] })
  }
  const onItemLoanPress = (index) => {
    navigation.push('LoanAcountScreen', { index })
  }

  return (
    <View style={{ flex: 1 }}>
      <Topbar title={I18n.t('account.title')} rightIcon={null} leftIcon={null} onLeftPress={null} />
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {dataPayment.length ? (
          <CollapsibleComponent
            iconName="icon-menu-account"
            title={I18n.t('account.title_payment_account')}
            amount={paymentAmount}
            data={dataPayment}
            onItemPress={onItemPaymentPress}
            currencyCode="VND"
            expand
            backgroundColor={Colors.white}
          />
        ) : null}
        {cardCredit.length ? (
          <CollapsibleComponent
            iconName="icon-dv-the"
            title={I18n.t('account.title_credit')}
            amount={cardList[0]?.availableBalance}
            data={cardCredit}
            onItemPress={onItemCreditPress}
            currencyCode="VND"
            expand
          />
        ) : null}
        {dataCredit.length ? (
          <CollapsibleComponent
            iconName="account_khoanvay"
            title={I18n.t('account.title_rent')}
            amount={creditAmount}
            data={dataCredit}
            onItemPress={onItemLoanPress}
            currencyCode="VND"
            expand
          />
        ) : null}
        {dataSaving.length ? (
          <CollapsibleComponent
            iconName="icon-tietkiem"
            title={I18n.t('account.title_saving')}
            amount={saveAmount}
            data={dataSaving}
            onItemPress={(element) => {
              navigation.push('SavingAcountScreen', {
                element:
                  dataSaving[element].category === 'TQ'
                    ? element - savingOnlineAccounts.length
                    : element,
                page: dataSaving[element].category === 'TQ' ? 'StoreSaveScreen' : 'LiveSaveScreen',
              })
            }}
            currencyCode="VND"
            expand
          />
        ) : null}
      </ScrollView>
    </View>
  )
}

export default AccountScreen
