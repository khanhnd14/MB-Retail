import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native'
import I18n from 'i18n-js'
import Carousel from 'react-native-snap-carousel'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'underscore'
import { Topbar, Icon, TextInput, Text } from '../../../components'
import { Colors, Metrics, Images } from '../../../theme'
import { Utils } from '../../../utilities'
import ActionBarPaymentAcount from '../../../components/Account/action_bar.component'
import SelectAccount from './SelectAccount'
import { saveOperations } from '../../../state/save'
import AlertMessage from '../../../components/SaveMoney/AlertMessage'
import { RESULT_TYPE } from '../../../state/save/types'
import { accountOperations } from '../../../state/account'
import DetailAccount from '../../../components/SaveMoney/DetailAccount'
import * as Navigation from '../../../navigation'
import { RESET_CARD_CHANGE_STATUS } from '../../../state/account/types'

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
    height: Utils.getWindowHeight() / 35,
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
    paddingBottom: Metrics.tiny,
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
  cardSaving: {
    backgroundColor: Colors.transparent,
    width: Utils.getWindowHeight() / 3.5,
    aspectRatio: 240 / 154,
    borderRadius: 7.5,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Metrics.normal * 2,
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
  checkBox: {
    borderWidth: 1,
    height: Utils.getWindowHeight() / 45,
    aspectRatio: 1,
    borderRadius: Utils.getWindowHeight() / 90,
    borderColor: Colors.gray9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCheckBox: { alignItems: 'center', flexDirection: 'row', paddingVertical: 10 },
  inputRenameContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    width: Utils.getWindowWidth(),
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.normal,
  },
  buttonRename: {
    backgroundColor: Colors.primary2,
    width: Metrics.normal * 2,
    height: Metrics.normal * 2,
    borderRadius: Metrics.normal,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

let refAccount
let refInputChangeName
let keyboardDidShowListener
let keyboardDidHideListener
let aliasName
const SavingAcountScreen = ({ navigation, route }) => {
  const { savingOnlineAccounts, savingLocalizeAccounts, resultChangeAliasName } = useSelector(
    (state) => state.save
  )
  const accountSave =
    route.params.page === 'StoreSaveScreen' ? savingLocalizeAccounts : savingOnlineAccounts
  const { account, resultFinalization, errorSavingResult } = useSelector((state) => state.save)
  const dispatch = useDispatch()
  const scrollView = useRef(null)

  const dataSaving = useMemo(
    () =>
      _.map(accountSave, (num) => ({
        title: num.alias,
        content: num.receiptNoInString,
        amount: num.currentCashValue,
        titleSaveing:
          route.params.page !== 'StoreSaveScreen'
            ? I18n.t('account.live_save').toLocaleUpperCase()
            : I18n.t('account.store_save').toLocaleUpperCase(),
        category: num.category,
        currencyCode: num.currencyCode,
      })),
    [accountSave]
  )
  const [isShow, setIsShow] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const carouselRef = useRef(null)
  const [loadingCarousel, setLoadingCarousel] = useState(true)
  const [loadingRename, setLoadingRename] = useState(false)
  const [selectCheckbox, setSelectCheckbox] = useState(false)
  const [newName, setNewName] = useState('')
  const [indexCarousel, setIndexCarousel] = useState(route.params.element)
  const [keyboardOffset, setKeyboardOffset] = useState(-100)
  const [loading, setLoading] = useState(false)

  const actionData = useMemo(() => {
    if (accountSave[indexCarousel].category === 'FSOV') {
      return [
        { title: I18n.t('account.card_payment.detail'), icon: 'account_chitiet' },
        { title: I18n.t('saving.finalize'), icon: 'account_tattoan' },
        { title: I18n.t('account.card_payment.rename'), icon: 'account_doiten' },
        { title: I18n.t('saving.deposit'), icon: 'account_guigop' },
      ]
    }
    return [
      { title: I18n.t('account.card_payment.detail'), icon: 'account_chitiet' },
      { title: I18n.t('saving.finalize'), icon: 'account_tattoan' },
      { title: I18n.t('account.card_payment.rename'), icon: 'account_doiten' },
    ]
  }, [indexCarousel, accountSave])

  const _keyboardDidShow = (event) => {
    // scrollView.scrollToEnd({ animated: true })
    setKeyboardOffset(event.endCoordinates.height)
  }

  const _keyboardDidHide = () => {
    setKeyboardOffset(0)
  }

  useEffect(() => {
    dispatch(saveOperations.getAcount())
    setTimeout(() => {
      setLoadingCarousel(false)
    }, 100)
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow)
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide)
    return () => {
      keyboardDidShowListener && keyboardDidShowListener.remove()
      keyboardDidHideListener && keyboardDidHideListener.remove()
      dispatch(saveOperations.reset())
    }
  }, [])

  useEffect(() => {
    if (loading && resultFinalization) {
      setLoading(false)
      navigation.navigate('VerifyFinalization')
    }
  }, [resultFinalization])

  useEffect(() => {
    if (loading && errorSavingResult) {
      setLoading(false)
    }
  }, [errorSavingResult])

  useEffect(() => {
    if (loadingRename && resultChangeAliasName) {
      if (resultChangeAliasName === RESULT_TYPE.SUCCESS) {
        Keyboard.dismiss()
        setLoadingRename(false)
        aliasName = dataSaving[indexCarousel].title
        setNewName(aliasName)
        setTimeout(() => {
          Utils.alert(I18n.t('saving.change_name_success'), '', () => {
            navigation.goBack()
            dispatch(accountOperations.getListSaveAcount())
          })
        }, 500)
      } else if (resultChangeAliasName === RESULT_TYPE.FAIL) {
        setLoadingRename(false)
        setTimeout(() => {
          Alert.alert(I18n.t('saving.error'))
        }, 500)
      }
    }
  }, [resultChangeAliasName])

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

  // eslint-disable-next-line no-shadow
  const showAlert = (isShow, title, content) => {
    setIsShow(isShow)
    setTitle(title)
    setContent(content)
  }

  const _renderItem = ({ item, index }) => (
    <View key={index} style={styles.viewAcount}>
      <Text style={styles.textTitleAcount}>{newName || item.title}</Text>
      <Text style={styles.textContentAcount}>{item.content}</Text>
      {/* <Icon name="icon-tietkiem" size={120} color={Colors.yellow} /> */}
      {/* <View style={styles.viewTitleSaving}>
          <Text style={styles.titleSaving} numberOfLines={2}>
            {item.titleSaveing}
          </Text>
        </View> */}
      <Image
        style={{
          width: Metrics.small * 10.2,
          height: Metrics.small * 16.2,
          resizeMode: 'contain',
          marginVertical: Metrics.normal,
        }}
        source={Images.savePig}
      />
      <Text style={styles.textAmountAcount}>
        {`${Utils.formatAmountText(item.amount)} ${item.currencyCode}`}
      </Text>
    </View>
  )

  const onAction = (element) => {
    console.log('====================================')
    console.log(element, navigation, selectCheckbox, dataSaving[indexCarousel])
    console.log('====================================')
    switch (element.title) {
      case I18n.t('saving.finalize'):
        if (route.params.page !== 'StoreSaveScreen') {
          if (!selectCheckbox) {
            showAlert(true, I18n.t('saving.please'), I18n.t('saving.confirm_finalization'))
            scrollView?.current?.scrollToEnd({ animated: true })
            return
          }
          refAccount.current.setVisible(true)
        } else {
          showAlert(true, '', I18n.t('saving.confirm_store'))
        }
        break
      case I18n.t('account.card_payment.rename'):
        aliasName = dataSaving[indexCarousel].title
        refInputChangeName.focus()
        break
      case I18n.t('saving.deposit'):
        Navigation.push('DepositSaving', {
          ...route.params,
          savingOnlineAccounts,
          currentAccount: dataSaving[indexCarousel],
        })
        break
      default:
        break
    }
  }

  const changeFromAccount = useCallback(
    (acc) => {
      const bnfAcc = dataSaving[indexCarousel].content.replace(/-/g, '')
      const { category } = dataSaving[indexCarousel]
      setTimeout(() => {
        Utils.confirm(I18n.t('saving.confirm_final'), '', () => {
          setLoading(true)
          dispatch(saveOperations.createFinalization(bnfAcc, category, acc))
        })
      }, 500)
    },
    [dataSaving]
  )

  const changeAliasAccount = useCallback(() => {
    const accNo = dataSaving[indexCarousel].content.replace(/-/g, '')
    setLoadingRename(true)
    dispatch(saveOperations.changeAliasName(accNo, aliasName))
  }, [dataSaving])

  const onChangeAliasName = (text) => {
    aliasName = text
  }

  const setRefAccount = (ref) => {
    refAccount = ref
  }

  if (loadingCarousel) {
    return null
  }
  return (
    <View style={styles.container}>
      <SelectAccount
        changeFromAccount={changeFromAccount}
        data={account}
        setRef={setRefAccount}
        notPreSelect
      />
      <Topbar title={I18n.t('account.title')} background={Colors.white} />
      <View style={styles.viewDecoration} />
      <View>
        <Carousel
          layout="default"
          ref={carouselRef}
          data={[dataSaving[indexCarousel]]}
          renderItem={_renderItem}
          sliderWidth={Utils.getWindowWidth()}
          itemWidth={Utils.getWindowWidth()}
          firstItem={0}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          slideStyle={{ left: -50 }}
          onSnapToItem={(index) => setIndexCarousel(index)}
        />
      </View>
      <View
        style={[
          styles.inputRenameContainer,
          { position: 'absolute', bottom: keyboardOffset, zIndex: 999 },
        ]}
      >
        <TextInput
          // defaultValue={dataSaving[route.params.element].title}
          ref={(ref) => (refInputChangeName = ref)}
          onChangeText={onChangeAliasName}
          style={{
            width: Utils.getWindowWidth() * (8 / 10),
            paddingVertical: Metrics.tiny * 3,
            fontWeight: 'bold',
          }}
          defaultValue={dataSaving[indexCarousel].title}
        />
        <TouchableOpacity onPress={changeAliasAccount} style={styles.buttonRename}>
          {loadingRename ? (
            <ActivityIndicator />
          ) : (
            <Icon name="icon-check" size={Utils.getWindowHeight() / 100} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>
      <ActionBarPaymentAcount loading={loading} data={actionData} onAction={onAction} />

      <ScrollView
        ref={scrollView}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: Colors.white,
          marginHorizontal: Metrics.normal,
        }}
      >
        <View style={{ alignItems: 'center', paddingBottom: Metrics.normal * 3 }}>
          <View
            style={{
              width: Utils.getWindowWidth() / 1.1,
              backgroundColor: Colors.white,
              paddingHorizontal: Metrics.small,
            }}
          >
            <DetailAccount item={accountSave[indexCarousel]} />
            {route.params.page !== 'StoreSaveScreen' && (
              <TouchableOpacity
                onPress={() => {
                  scrollView?.current?.scrollTo(0)
                  setSelectCheckbox(!selectCheckbox)
                }}
                style={styles.viewCheckBox}
              >
                <TouchableOpacity
                  style={[
                    styles.checkBox,
                    {
                      backgroundColor: selectCheckbox ? Colors.primary2 : undefined,
                      borderWidth: selectCheckbox ? 0 : 1,
                    },
                  ]}
                  onPress={() => {
                    scrollView?.current?.scrollTo(0)
                    setSelectCheckbox(!selectCheckbox)
                  }}
                  activeOpacity={0.75}
                >
                  {selectCheckbox ? (
                    <Icon
                      name="icon-check"
                      size={Utils.getWindowHeight() / 100}
                      color={Colors.white}
                    />
                  ) : null}
                </TouchableOpacity>
                <Text style={{ ...styles.textContent, marginHorizontal: 18 }}>
                  {I18n.t('saving.agree_policy')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      {isShow ? <AlertMessage showAlert={showAlert} title={title} content={content} /> : null}
    </View>
  )
}

export default SavingAcountScreen
