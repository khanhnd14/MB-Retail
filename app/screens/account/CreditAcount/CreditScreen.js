import React, { useEffect, useMemo } from 'react'
import { ScrollView, StyleSheet, RefreshControl, Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { View } from 'react-native-animatable'
import _ from 'lodash'
import DeviceInfo from 'react-native-device-info';
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../../theme'
import I18n from '../../../translations'
import { Topbar, MenuItem } from '../../../components'
import * as Navigation from '../../../navigation'
import { getCardList, getCardListFull } from '../../../state/account/actions'
import CollapsibleComponent from '../../../components/Account/collapsible.component'
import { Utils } from '../../../utilities'
import { openCardOperations } from '../../../state/opencard'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
  },
  item: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: Metrics.medium,
    height: Metrics.medium * 4,
    marginHorizontal: Metrics.normal,
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
    alignItems: 'center',
    ...ApplicationStyles.shadow,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.primary2,
    // flex: 8 / 10
  },
  icon: {
    color: Colors.iconGray,
    // fontSize: 40,
    // flex: 2 / 10
  },
  iconBack: {
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    right: Metrics.normal,
    top: '50%',
    marginTop: -10,
  },
  openSave: {
    paddingHorizontal: Metrics.normal,
  },
})

const CreditScreen = () => {
  const { cardList, cardListFull, errorGetAccount } = useSelector((state) => state.account)
  const { mPlusAppLink, mPlusAppLinkError } = useSelector((state) => state.opencard)
  const [loading, setLoading] = React.useState(false)

  const [dataCredit, setDataCredit] = React.useState([])
  const [dataDebit, setDataDebit] = React.useState([])

  const dispatch = useDispatch()

  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    dispatch(getCardList())
    dispatch(getCardListFull())
  }, [])

  useEffect(() => {
    setLoading(true)
    dispatch(getCardList())
    dispatch(getCardListFull())
  }, [])

  useEffect(() => {
    if (loading) {
      Utils.showLoading()
    } else {
      Utils.hideLoading()
    }
  }, [loading])

  useEffect(() => {
    if (errorGetAccount) {
      setLoading(false)
    }
  }, [errorGetAccount])

  useEffect(() => {
    if (mPlusAppLink) {
      Utils.hideLoading()
      // open app
      // Linking.openURL('app-settings:')
      Linking.openURL(mPlusAppLink.appURL)
    }
  }, [mPlusAppLink])

  useEffect(() => {
    if (mPlusAppLinkError) {
      Utils.hideLoading()
    }
  }, [mPlusAppLinkError])

  const mplus = () => {
    Utils.showLoading()
    DeviceInfo.getDeviceName().then((dname) => {
      const name = dname
      const params = {
        deviceName: name,
        deviceId: Utils.getUserDeviceID(),
      }
      dispatch(openCardOperations.getMPlusAppLink(params))
    })
  }

  useEffect(() => {
    setRefreshing(false)
    setLoading(false)
    const newCardList1 = cardList.map((item) => ({
      ...item,
      productionStatus: cardListFull.find((el) => el.contractNumber === item.contractNumber)
        ?.productionStatus,
      status: cardListFull.find((el) => el.contractNumber === item.contractNumber)?.status,
      isActive: item.status,
      bonusPoint: item.bonusPoint
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
    setDataCredit(_.filter(data, (item) => item.cardType === 'C'))
    setDataDebit(_.filter(data, (item) => item.cardType === 'D'))
  }, [cardList, cardListFull])

  const totalCredit = useMemo(
    () =>
      _.reduce(
        _.filter(dataCredit, (item) => item.currencyCode === 'VND'),
        (memo, num) => memo + num.amount,
        0
      ),
    [dataCredit]
  )

  console.log('====================================');
  console.log('dataCredit', dataCredit, dataDebit);
  console.log('====================================');
  return (
    <>
      <Topbar title={I18n.t('account.title_credit_screen')} background={Colors.mainBg} />
      <ScrollView
        style={[Helpers.fill, styles.container]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.openSave}>
          <MenuItem
            onPress={() => Navigation.push('CardService', { creditItem: dataCredit[0] })}
            text={I18n.t('account.title_payment_card')}
            leftColor={Colors.yellow}
          />
          <MenuItem
            onPress={mplus}
            text={I18n.t('account.title_advance_mplus')}// Quản lý thẻ nâng cao
            leftColor={Colors.yellow}
          />
        </View>
        <>
          {dataCredit.length !== 0 && (
            <CollapsibleComponent
              iconName="icon-dv-the"
              title={I18n.t('account.title_credit')}
              amount={dataCredit[0].availableBalance}
              data={dataCredit}
              currencyCode="VND"
              expand
              onItemPress={(element) => {
                Navigation.push('CreditAcountScreen', { creditItem: dataCredit[element] })
              }}
            />
          )}

          {dataDebit.length !== 0 && (
            <CollapsibleComponent
              iconName="icon-dv-the"
              title={I18n.t('account.title_debit')}
              amount=""
              data={dataDebit}
              currencyCode=""
              expand
              onItemPress={(element) => {
                Navigation.push('CreditAcountScreen', { creditItem: dataDebit[element] })
              }}
              hidePayment
            />
          )}

          {/* <Text style={{ fontSize: 14, fontWeight: 'bold', marginHorizontal: Metrics.normal, marginBottom: 10 }}>Thẻ tín dụng</Text>
            {_.filter(cardCredit, item => item.cardType === 'C').map((item, index) => (
              <TouchableOpacity key={index} style={styles.item} onPress={() => Navigation.push('CreditAcountScreen', { creditItem: item })}>
                <Icon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
                <View style={{ width: 60, alignItems: 'center', marginRight: 10 }}>
                  <Icon name="icon-dv-the" size={60} style={styles.icon} />
                </View>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={{ marginVertical: 5 }}>{item.content ? item.content : ''}</Text>
                  <Text>{item.amount ? `${Utils.amountFormat(item.amount)} ${item.currencyCode}` : ''}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginHorizontal: Metrics.normal, marginVertical: 10 }}>Thẻ ghi nợ</Text>
            {_.filter(cardCredit, item => item.cardType === 'D').map((item, index) => (
              <TouchableOpacity key={index} style={styles.item} onPress={() => Navigation.push('CreditAcountScreen', { creditItem: item })}>
                <Icon name="icon-back" size={24} color={Colors.check} style={styles.iconBack} />
                <View style={{ width: 60, alignItems: 'center', marginRight: 10 }}>
                  <Icon name="icon-dv-the" size={60} style={styles.icon} />
                </View>
                <View>
                  <Text style={styles.title}>{item.title ? item.title : 'Visa Debit'}</Text>
                  <Text style={{ marginVertical: 5 }}>{item.content ? item.content : ''}</Text>
                  <Text>{item.amount ? `${Utils.amountFormat(item.amount)} ${item.currencyCode}` : ''}</Text>
                </View>
              </TouchableOpacity>
            ))} */}
        </>
      </ScrollView>
    </>
  )
}

export default CreditScreen
