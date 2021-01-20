import * as React from 'react'
import { ScrollView, View, Alert, StyleSheet } from 'react-native'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18n from 'i18n-js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import { Metrics, Colors } from '../../../theme'
import {
  Topbar,
  HeaderTop,
  SelectAccount,
  FieldInputCardPayment,
  Icon,
  SelectItemCard,
  FieldInputCheckBox,
  ConfirmButton,
  Text
} from '../../../components'
import { productOperations } from '../../../state/product'
import { accountOperations } from '../../../state/account'
import { Utils } from '../../../utilities'
import { removedSpecialCharacterFromNumber } from '../../../utilities/common'
import * as Navigation from '../../../navigation'
import { transferSelectors } from '../../../state/transfer'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.normal,
    marginTop: 1
  },
  contentLayout: {
    backgroundColor: Colors.white,
    padding: Utils.getWindowHeight() / 75,
    marginTop: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  btnLayout: {
    padding: Metrics.normal,
  },
  btn: {
    backgroundColor: Colors.primary2,
    height: 50,
    borderRadius: 38,

  },
  btnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  indicatorStyle: {
    backgroundColor: Colors.primary2,
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Utils.getWindowHeight() / 25
  },
  tabStyle: {
    minHeight: 0,
    padding: 0
  },
  tabBarStyle: { backgroundColor: Colors.white, elevation: 0 },
  titleTabBarStyle: {
    fontWeight: '600',
    fontFamily: 'Helvetica',
  },
  viewNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: Utils.getWindowHeight() / 75 },
  textNote: {
    color: Colors.gray1,
    fontSize: 14,
    fontFamily: 'Helvetica',
    marginHorizontal: 5
  },
})

function YourCard() {
  const dispatch = useDispatch()
  const { currentContractNumber } = useSelector((state) => state.account)
  React.useEffect(() => {
    dispatch(productOperations.getAccount())
  }, [])
  React.useEffect(() => () => {
    dispatch(accountOperations.setAccountCard())
  }, [])
  const account = useSelector((state) => state.product.account)
  const { cardList } = useSelector((state) => state.account)
  const [onSelectedCard, setOnSelectedCard] = React.useState(false)
  const onSelectCard = (val) => {
    setOnSelectedCard(true)
    dispatch(accountOperations.passedCardCurrentContractNumber(val))
  }
  const onSelectRolloutAccountNo = (val) => {
    dispatch(accountOperations.passedCardCurrentAccountSelect(val))
  }
  const selectedValueCheckBox = (val) => {
    dispatch(accountOperations.passedCardInputAmountPay(val))
  }
  React.useEffect(() => {
    if (onSelectedCard && currentContractNumber) dispatch(accountOperations.getContractBalance(currentContractNumber))
  }, [currentContractNumber])
  return (
    <ScrollView style={styles.scrollView}>
      <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
      <View style={styles.contentLayout}>
        <SelectItemCard title={I18n.t('account.card_payment.name')} showIconArrow dataCardList={cardList} onSelectCard={onSelectCard} />
        <FieldInputCheckBox
          title="Số tiền"
          isCheckBox
          isInput
          selectedValueCheckBox={selectedValueCheckBox}
          dataCheckBox={[
            { title: I18n.t('account.title_checkBox_1'), value: cardList.find(item => item.contractNumber === (currentContractNumber || cardList[0]?.contractNumber)) ? cardList.find(item => item.contractNumber === (currentContractNumber || cardList[0]?.contractNumber))?.minPayment : 0 },
            { title: I18n.t('account.title_checkBox_2'), value: cardList.find(item => item.contractNumber === (currentContractNumber || cardList[0]?.contractNumber)) ? cardList.find(item => item.contractNumber === (currentContractNumber || cardList[0]?.contractNumber))?.billAmount : 0 },
            { title: I18n.t('account.title_checkBox_3'), value: null },
          ]}
        />
        <View style={styles.viewNote}>
          <Icon name="icon-internet" color={Colors.gray1} size={Utils.getWindowHeight() / 100} />
          <Text style={styles.textNote}>{I18n.t('action.action_note')}</Text>
        </View>
      </View>
    </ScrollView>
  )
}
function PeopleCard() {
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(productOperations.getAccount())
  }, [])
  const [cardName, setCardName] = React.useState()
  const [amountToText, setAmountToText] = React.useState(I18n.t('account.title_show_amount_char'))
  const account = useSelector((state) => state.product.account)
  const { dataCheckCardName } = useSelector((state) => state.account)
  const inputCardName = (val) => {
    if (val) dispatch(accountOperations.checkCardName({ cardNo: val }))
  }
  const inputAmount = (val) => {
    setAmountToText(transferSelectors.amountToWord(removedSpecialCharacterFromNumber(val || 0)))
    dispatch(accountOperations.passedCardInputAmountPay(removedSpecialCharacterFromNumber(val)))
  }
  const inputNotes = () => {

  }
  React.useEffect(() => {
    if (dataCheckCardName) {
      setCardName(dataCheckCardName?.contractName)
      dispatch(accountOperations.passedCardCurrentContractNumber(dataCheckCardName?.contractNoEncode))
    }
  }, [dataCheckCardName])
  const onSelectRolloutAccountNo = (val) => {
    dispatch(accountOperations.passedCardCurrentAccountSelect(val))
  }
  return (
    <ScrollView style={styles.scrollView}>
      <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
      <View style={styles.contentLayout}>
        <FieldInputCardPayment
          title={I18n.t('account.card_payment.name')}
          content={cardName}
          onBlurValue={inputCardName}
          placeholder={I18n.t('product.input_card_number')}
        />
        <FieldInputCardPayment title={I18n.t('product.amount')} isNumber onBlurValue={inputAmount} content={amountToText} placeholder="Nhập số tiền" />
        <FieldInputCardPayment title={I18n.t('account.card_payment.content')} onBlurValue={inputNotes} placeholder="Nhập nội dung" />
        <View style={styles.viewNote}>
          <Icon name="icon-internet" color={Colors.gray1} size={Utils.getWindowHeight() / 100} />
          <Text style={styles.textNote}>{I18n.t('action.action_note')}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const CardService = () => {
  const dispatch = useDispatch()
  const [index, setIndex] = React.useState(0)
  React.useEffect(() => {
    dispatch(accountOperations.setAccountCard())
  }, [index])
  const [isContinue, setIsContinue] = React.useState(false)
  const { currentAccountSelected,
    currentContractNumber,
    inputAmountPay,
    cardPrePayApi,
    payApiCompleted
  } = useSelector((state) => state.account)
  const [routes] = React.useState([
    { key: 'YourCard', title: I18n.t('account.card_payment.your_card') },
    { key: 'PeopleCard', title: I18n.t('account.card_payment.other_card') },
  ])
  const renderScene = SceneMap({
    YourCard,
    PeopleCard,
  })
  const loading = useSelector((state) => state.account.loading)
  const onConfirm = () => {
    if (isContinue) {
      const body = {
        acctNo: currentAccountSelected,
        contractNoEncode: currentContractNumber,
        amount: removedSpecialCharacterFromNumber(inputAmountPay || 0),
        isOption: true,
        toTime: moment().format('DD/MM/YYYY'),
        isConfirm: true,
        isOtp: false,
      }
      dispatch(accountOperations.sendCardPrePayAPI(body))
    } else Utils.toast(I18n.t('application.input_empty'))
  }

  const formValidate = () => {
    if (currentAccountSelected && (currentContractNumber !== null)) {
      setIsContinue(inputAmountPay !== null)
    }
  }
  React.useEffect(() => {
    formValidate()
  }, [currentAccountSelected, currentContractNumber, inputAmountPay])
  const onConfirmCardPayApi = () => {
    const body = {
      acctNo: currentAccountSelected,
      contractNoEncode: currentContractNumber,
      amount: removedSpecialCharacterFromNumber(inputAmountPay || 0),
      isOption: true,
      toTime: moment().format('DD/MM/YYYY'),
      isConfirm: true,
      tokenTransaction: cardPrePayApi?.tokenTransaction,
    }
    dispatch(accountOperations.sendCardPayAPI(body))
  }
  const onDenyCardPayApi = () => {

  }
  React.useEffect(() => {
    if (payApiCompleted) {
      Navigation.navigate('SuccessCardPayment',
        {
          amount: removedSpecialCharacterFromNumber(inputAmountPay),
          customerInfo: currentAccountSelected,
          titleServices: I18n.t('account.title_payment_card')
        })
      setIsContinue(false)
      dispatch(accountOperations.setAccountCard())
    } else if (payApiCompleted === 0) { Navigation.push('FailedScreen') }
    return () => {
      dispatch(accountOperations.setAccountCard())
    }
  }, [payApiCompleted])
  React.useEffect(() => {
    if (isContinue && cardPrePayApi) {
      Alert.alert(I18n.t('application.title_alert_notification'), I18n.t('account.confirm_pay_card'),
      [
        { text: I18n.t('action.action_done'), onPress: () => onConfirmCardPayApi() },
        { text: I18n.t('action.action_cancel'), onPress: () => onDenyCardPayApi() },
      ])
    }
  }, [cardPrePayApi])
  return (

    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
      >
        <Topbar title={I18n.t('account.title_credit_screen')} />
        <HeaderTop title={I18n.t('account.title_payment_card')} />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={styles.indicatorStyle}
              contentContainerStyle={styles.contentContainerStyle}
              tabStyle={styles.tabStyle}
              style={styles.tabBarStyle}
              activeColor={Colors.white}
              inactiveColor={Colors.black}
              // scrollEnabled={true}
              renderLabel={({ route, focused }) => (
                <Text
                  style={{
                    color: !focused ? Colors.black : Colors.primary2,
                    ...styles.titleTabBarStyle,
                  }}
                >
                  {route.title}
                </Text>
              )}
            />
          )}
          lazy
        />
      </KeyboardAwareScrollView>
      <ConfirmButton onPress={onConfirm} loading={loading} />
    </View>
  )
}

export default CardService
