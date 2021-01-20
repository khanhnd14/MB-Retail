import * as React from 'react'
import { ScrollView, View, Alert, StyleSheet, Keyboard } from 'react-native'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18n from 'i18n-js'
import { TabView, TabBar } from 'react-native-tab-view'
import { TouchableOpacity } from 'react-native-gesture-handler'
import _ from 'lodash'
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
  NoteSheet,
  Text,
} from '../../../components'
import { productOperations } from '../../../state/product'
import { accountOperations } from '../../../state/account'
import { Utils } from '../../../utilities'
import { removedSpecialCharacterFromNumber } from '../../../utilities/common'
import * as Navigation from '../../../navigation'
import { transferSelectors } from '../../../state/transfer'
import { CARD_PAY_API_FAILED, CARD_PRE_PAY_API_COMPLETED, PASSED_CARD_CURRENT_ACCOUNT_SELECT, PASSED_CARD_INPUT_AMOUNT_PAY } from '../../../state/account/types'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Metrics.normal,
    marginTop: 1,
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
    height: Utils.getWindowHeight() / 25,
  },
  tabStyle: {
    minHeight: 0,
    padding: 0,
  },
  tabBarStyle: { backgroundColor: Colors.white, elevation: 0 },
  titleTabBarStyle: {
    fontFamily: 'Helvetica',
  },
  viewNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Utils.getWindowHeight() / 75,
  },
  textNote: {
    color: Colors.gray1,
    fontSize: 14,
    fontFamily: 'Helvetica',
    marginHorizontal: 5,
  },
})

const YourCard = ({ openNote, creditCard, indexTab }) => {
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(productOperations.getAccount())
  }, [])
  React.useEffect(
    () => () => {
      dispatch(accountOperations.setAccountCard())
    },
    []
  )

  const accountList = useSelector((state) => state.product.account)
  const account = React.useMemo(() => accountList.filter((e) => e.currencyCode !== 'USD'), [accountList])
  const { cardList } = useSelector((state) => state.account)
  const { currentContractNumber, inputAmountPay } = useSelector((state) => state.account)
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
    if (onSelectedCard && currentContractNumber) {
      dispatch(accountOperations.getContractBalance(currentContractNumber))
    }
  }, [currentContractNumber])
  React.useEffect(() => {
    !indexTab && selectedValueCheckBox(_.find(cardList, (e) => e.contractNumber === currentContractNumber, [cardList, creditCard]))
  }, [cardList, currentContractNumber, indexTab])
  return (
    <>
      <View style={styles.scrollView}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <SelectItemCard
            indexTab={indexTab}
            title={I18n.t('account.card_payment.name')}
            showIconArrow
            dataCardList={cardList}
            onSelectCard={onSelectCard}
            creditCard={creditCard}
          />
          <FieldInputCheckBox
            indexTab={indexTab}
            title={I18n.t('product.amount')}
            isCheckBox
            isInput
            selectedValueCheckBox={selectedValueCheckBox}
            dataCheckBox={[
              {
                title: I18n.t('account.title_checkBox_1'),
                value: cardList.find(
                  (item) =>
                  item.contractNumber === currentContractNumber
                )
                  ? cardList.find(
                      (item) =>
                      item.contractNumber === currentContractNumber
                    )?.minPayment
                  : 0,
              },
              {
                title: I18n.t('account.title_checkBox_2'),
                value: cardList.find(
                  (item) =>
                  item.contractNumber === currentContractNumber
                  )
                  ? cardList.find(
                      (item) =>
                      item.contractNumber === currentContractNumber
                    )?.billAmount
                  : 0,
              },
              { title: I18n.t('account.title_checkBox_3'), value: null },
            ]}
          />
          <TouchableOpacity style={styles.viewNote} onPress={openNote}>
            <Icon name="icon-internet" color={Colors.gray1} size={Utils.getWindowHeight() / 100} />
            <Text style={styles.textNote}>{I18n.t('action.action_note')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}
const PeopleCard = ({ openNote, indexTab, setCardNo }) => {
  const [cardName, setCardName] = React.useState()
  const cardNumberRef = React.useRef()
  const refAmount = React.useRef()

  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(productOperations.getAccount())
  }, [])

  const [amountToText, setAmountToText] = React.useState(I18n.t('account.title_show_amount_char'))
  const accountList = useSelector((state) => state.product.account)
  const account = React.useMemo(() => accountList.filter((e) => e.currencyCode !== 'USD'), [accountList])
  const { dataCheckCardName, currentAccountSelected } = useSelector((state) => state.account)

  React.useEffect(() => {
    cardNumberRef.current.clear()
    setCardName(undefined)
    setAmountToText(I18n.t('account.title_show_amount_char'))
    refAmount.current.clear()
    dispatch(accountOperations.passedCardCurrentContractNumber(null))
    dispatch(accountOperations.passedCardInputAmountPay(null))
  }, [indexTab])

  const inputCardName = (val) => {
    if (val) {
      setCardNo(val)
      dispatch(accountOperations.checkCardName({ cardNo: val }))
    }
  }
  const onInputAmount = (val) => {
    if (val) {
      setAmountToText(transferSelectors.amountToWord(removedSpecialCharacterFromNumber(val || 0)))
      dispatch(accountOperations.passedCardInputAmountPay(removedSpecialCharacterFromNumber(val)))
    } else {
      setAmountToText(I18n.t('account.title_show_amount_char'))
      dispatch(accountOperations.passedCardInputAmountPay(removedSpecialCharacterFromNumber(val)))
    }
  }
  const inputNotes = () => {}
  React.useEffect(() => {
    if (dataCheckCardName) {
      setCardName(dataCheckCardName?.contractName)
      dispatch(
        accountOperations.passedCardCurrentContractNumber(dataCheckCardName?.contractNoEncode)
      )
    }
  }, [dataCheckCardName])
  const onSelectRolloutAccountNo = (val) => {
    (!currentAccountSelected || currentAccountSelected !== val) && dispatch(accountOperations.passedCardCurrentAccountSelect(val))
  }
  return (
    <>
      <View style={[styles.scrollView, { paddingBottom: 180 }]}>
        <SelectAccount data={account} onSelectRolloutAccountNo={onSelectRolloutAccountNo} />
        <View style={styles.contentLayout}>
          <FieldInputCardPayment
            title={I18n.t('product.card_number')}
            content={cardName}
            onBlurValue={inputCardName}
            placeholder={I18n.t('product.input_card_number')}
            inputRef={cardNumberRef}
          />
          <FieldInputCardPayment
            title={I18n.t('saving.payment')}
            isNumber
            onBlurValue={onInputAmount}
            content={amountToText}
            placeholder={I18n.t('product.holder_amount')}
            inputRef={refAmount}
          />
          <FieldInputCardPayment
            title={I18n.t('account.card_payment.content')}
            onBlurValue={inputNotes}
            placeholder={I18n.t('account.card_payment.input_content')}
          />
          <TouchableOpacity style={styles.viewNote} onPress={openNote}>
            <Icon name="icon-internet" color={Colors.gray1} size={Utils.getWindowHeight() / 100} />
            <Text style={styles.textNote}>{I18n.t('action.action_note')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const CardService = ({ route }) => {
  const { creditItem } = route.params
  const dispatch = useDispatch()
  const [index, setIndex] = React.useState(0)
  const [cardNoOther, setCardNoOther] = React.useState('')

  React.useEffect(() => {
    if (creditItem && !index) {
      dispatch(accountOperations.passedCardCurrentContractNumber(creditItem.contractNumber))
    }
  }, [creditItem, index])
  const [isContinue, setIsContinue] = React.useState(true)
  const {
    currentAccountSelected,
    currentContractNumber,
    inputAmountPay,
    cardPrePayApi,
    payApiCompleted,
    payApiFailed,
    cardList,
    errorCheckCardName
  } = useSelector((state) => state.account)

  const routes = React.useMemo(() => {
    if (cardList.length) {
      return [
        { key: 'YourCard', title: I18n.t('account.card_payment.your_card') },
        { key: 'PeopleCard', title: I18n.t('account.card_payment.other_card') },
      ]
    }
    return [{ key: 'PeopleCard', title: I18n.t('account.card_payment.other_card') }]
  })
  const sheetNote = React.useRef(null)
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'YourCard':
        return (
          <KeyboardAwareScrollView>
            <YourCard
              openNote={() => {
              sheetNote.current.show()
              }}
              creditCard={creditItem}
              indexTab={index}
            />
          </KeyboardAwareScrollView>
        )
      case 'PeopleCard':
        return (
          <KeyboardAwareScrollView>

            <PeopleCard
              openNote={() => {
              sheetNote.current.show()
            }}
              indexTab={index}
              setCardNo={setCardNoOther}
            />
          </KeyboardAwareScrollView>

        )
      default:
        return null
    }
  }
  const loading = useSelector((state) => state.account.loading)
  const onConfirm = () => {
    if (errorCheckCardName) {
      console.log('====================================');
      console.log('adasd', errorCheckCardName);
      Utils.alert(I18n.t('application.title_alert_notification'), errorCheckCardName.message, () => {})
      return
      // console.log('====================================');
    }
    if ((index || routes.length === 1) && !currentContractNumber) {
      Utils.showToast(I18n.t('account.card_payment.required_cardnumber'))
      return
    }
    if (!inputAmountPay) {
      Utils.showToast(I18n.t('product.service_list.error_payment'))
      return
    }
    const body = {
      acctNo: currentAccountSelected,
      contractNoEncode: currentContractNumber,
      amount:
        typeof inputAmountPay !== 'object'
          ? removedSpecialCharacterFromNumber(`${inputAmountPay}` || 0)
          : inputAmountPay.minPayment
          ? inputAmountPay.minPayment?.toString()
          : 0,
      isOption: true,
      toTime: index === 0 ? creditItem?.toTime : '',
      isConfirm: true,
      isOtp: false,
    }
    dispatch(accountOperations.sendCardPrePayAPI(body))
  }

  const onConfirmCardPayApi = () => {
    const body = {
      acctNo: currentAccountSelected,
      contractNoEncode: currentContractNumber,
      amount:
        typeof inputAmountPay !== 'object'
          ? removedSpecialCharacterFromNumber(`${inputAmountPay}` || 0)
          : inputAmountPay.minPayment
          ? inputAmountPay.minPayment?.toString()
          : 0,
      isOption: true,
      toTime: creditItem?.toTime,
      isConfirm: true,
      tokenTransaction: cardPrePayApi?.tokenTransaction,
    }
    dispatch(accountOperations.sendCardPayAPI(body))
  }
  const onDenyCardPayApi = () => {
    dispatch({
      type: CARD_PAY_API_FAILED,
      payload: null
    }, {
      type: CARD_PRE_PAY_API_COMPLETED,
      payload: null
    })
  }
  const cardNo = React.useMemo(
    () =>
      cardList.find(
        (item) => item.contractNumber === (currentContractNumber || creditItem.contractNumber)
      )?.cardNo,
    [currentContractNumber, cardList]
  )

  const reset = () => {
    dispatch([
      {
        type: PASSED_CARD_CURRENT_ACCOUNT_SELECT,
        payload: null
      },
      {
        type: PASSED_CARD_INPUT_AMOUNT_PAY,
        payload: null
      },
    ])
  }

  React.useEffect(() => {
    if (payApiCompleted && cardPrePayApi?.isTrust) {
      Navigation.popToPop()
      Navigation.navigate('SuccessScreen', {
        amount:
          typeof inputAmountPay !== 'object'
            ? removedSpecialCharacterFromNumber(`${inputAmountPay}` || 0)
            : inputAmountPay.minPayment
            ? inputAmountPay.minPayment?.toString()
            : 0,
        customerInfo: cardNoOther || cardNo,
        titleServices: I18n.t('account.title_payment_card'),
        hideEmail: true,
        hideSaveInfo: true,
        typeService: '4',
        redoTransaction: 'CreditScreen',
        onSwitchTransaction: reset

      })
      setIsContinue(false)
      dispatch(accountOperations.setAccountCard())
    }
  }, [payApiCompleted])
  React.useEffect(() => {
    if (payApiFailed && cardPrePayApi?.isTrust) {
      Keyboard.dismiss()
      Navigation.popToPop()
      Navigation.push('FailedScreen', {
        redoTransaction: 'CreditScreen',
        onSwitchTransaction: reset
      })
    }
  }, [payApiFailed])
  React.useEffect(() => {
    console.log('====================================')
    console.log(isContinue, cardPrePayApi)
    console.log('====================================')
    if (isContinue && cardPrePayApi) {
      const { isTrust } = cardPrePayApi
      if (isTrust) {
        setTimeout(() => {
          Alert.alert(
            I18n.t('application.title_alert_notification'),
            I18n.t('account.confirm_pay_card'),
            [
              { text: I18n.t('action.action_done'), onPress: () => onConfirmCardPayApi() },
              { text: I18n.t('action.action_cancel'), onPress: () => onDenyCardPayApi() },
            ]
          )
        }, 500)
      } else {
        Navigation.push('AccountOTPScreen', {
          type: 'PeopleCardCredit',
          amount:
            typeof inputAmountPay !== 'object'
              ? removedSpecialCharacterFromNumber(`${inputAmountPay}` || 0)
              : inputAmountPay.minPayment
              ? inputAmountPay.minPayment?.toString()
              : 0,
            customerInfo: cardNoOther || cardNo,
          toTime: index === 0 ? creditItem?.toTime : '',
        })
      }
    }
  }, [cardPrePayApi])

  React.useEffect(() => {
    if (loading) {
      Utils.showLoading()
    } else {
      Utils.hideLoading()
    }
  }, [loading])
  return (
    <View style={styles.container}>
      <Topbar
        subTitle={I18n.t('account.title_payment_card')}
        title={I18n.t('account.title_credit_screen')}
      />
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
      <ConfirmButton
        styleButton={{
          width: '100%',
        }}
        style={{
          paddingHorizontal: Metrics.medium,
        }}
        onPress={onConfirm}
      />
      <NoteSheet text={I18n.t('account.note_credit')} ref={sheetNote} />
    </View>
  )
}

export default CardService
