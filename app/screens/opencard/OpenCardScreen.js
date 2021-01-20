/* eslint-disable array-callback-return */
/* eslint-disable no-empty */
/* eslint-disable radix */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../theme'
import {
  Topbar,
  Text,
  ConfirmButton,
  AmountLabel,
  PhotoSlider,
} from '../../components'
import * as Navigation from '../../navigation'
import { openCardOperations } from '../../state/opencard'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import Preview from './Preview'

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: Colors.mainBg,
    paddingTop: Metrics.medium,
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.mainBg,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: Metrics.medium,
    alignItems: 'center',
    width: '100%'
  },
  titleContainer: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    paddingBottom: Metrics.small,
    marginTop: Metrics.tiny,
  },
  contentContainer: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: Metrics.medium,
  },
  element: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  error: {
    color: Colors.error,
    fontSize: 12,
    paddingVertical: Utils.getRatioDimension(8),
  },
  title: {
    color: Colors.primary2,
    fontSize: 16,
    paddingVertical: Utils.getRatioDimension(10),
  },
  content: {
    flex: 1,
  },
  contentDetail: {
    color: Colors.primary2,
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
    paddingVertical: Metrics.normal,
  },
  textCheckBox: {
    fontSize: 12,
    color: '#171D33',
  },
  link: {
    fontSize: 12,
    color: '#00AEC7',
    textDecorationLine: 'underline',
    alignSelf: 'center',
    padding: Metrics.small
  }
})

const OpenCardScreen = () => {
  const dispatch = useDispatch()
  const { listData, listError, initData, initError } = useSelector((state) => state.opencard)
  const { listCreditCardInfo, creditCardMax } = listData || {}
  const [loading, setLoading] = useState(false)
  const [isInit, setInit] = useState(false)
  const [isShowError, setError] = useState(true)
  const [selectCard, setSelectCard] = useState({})

  useEffect(() => {
    setLoading(true)
    dispatch(openCardOperations.getListInfo({}))
  }, [])

  useEffect(() => {
    if (loading && listCreditCardInfo) {
      setLoading(false)
      setError(false)
      setSelectCard(listCreditCardInfo[0] || {})
    }
  }, [listCreditCardInfo])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      setError(true)
    }
  }, [listError])

  useEffect(() => {
    if (isInit) {
      setInit(false)
      Navigation.push('OpenCardInput', { selectCard })
    }
  }, [initData])

  useEffect(() => {
    if (isInit) {
      setInit(false)
    }
  }, [initError])

  const onSelect = (card) => {
    setSelectCard(card)
  }

  const onLink = () => {
    if (selectCard?.detailUrl) {
      Linking.openURL(selectCard?.detailUrl)
    }
  }

  const onRegister = () => {
    console.log('onRegister:', selectCard)
    try {
      const body = {
        cardCode: selectCard.cardCode,
        liabilityContract: selectCard.liabilityContract || null,
        creditCardMax
      }
      setInit(true)
      dispatch(openCardOperations.init(body))
    } catch (error) {}
  }

  const ItemDisplay = (title, content, isAmount = false) => (
    <View style={styles.element}>
      <Text style={[styles.content]}>{title}</Text>
      {!isAmount ? (
        <Text style={[styles.contentDetail, { flex: 2 }]}>{content}</Text>
      ) : (
        <View style={[Helpers.rowCross, { flex: 2 }]}>
          <AmountLabel style={styles.contentDetail} value={content || 0} />
          <Text style={styles.contentDetail}> VND</Text>
        </View>
      )}
    </View>
  )
  return (
    <Fragment>
      <Topbar title={I18n.t('opencard.title')} subTitle={I18n.t('opencard.sub_title')} />
      {loading && (
        <View style={[Helpers.fill, styles.container, Helpers.center]}>
          <ActivityIndicator
            style={Helpers.mainCenter}
            animating={loading}
            color={Colors.primary2}
            size="large"
          />
        </View>
      )}
      {!loading && isShowError && (
        <View style={[Helpers.fill, styles.container]}>
          <Text style={[Helpers.textCenter, { marginTop: Metrics.medium }]}>
            {listError?.message}
          </Text>
        </View>
      )}
      {!loading && !isShowError && (
      <View style={[Helpers.fill, styles.maincontainer]}>
        <View style={{ height: Utils.getRatioDimension(200) }}>
          <PhotoSlider
            height={Utils.getRatioDimension(180)}
            data={listCreditCardInfo}
            onPress={onSelect}
            contentRender={item => <Preview item={item} />}
          />
        </View>
        <View style={[Helpers.fill, styles.container]}>
          <KeyboardAwareScrollView
            style={[Helpers.fullWidth]}
            showsVerticalScrollIndicator
            extraHeight={300}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.titleContainer, Helpers.fullWidth]}>
              <Text style={styles.title}>{selectCard?.cardName.toUpperCase()}</Text>
              <Text style={styles.content}>{selectCard?.description}</Text>
              <TouchableOpacity onPress={onLink}>
                <Text style={styles.link}>{I18n.t('opencard.detail')}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.contentContainer, Helpers.fullWidth]}>
              {ItemDisplay(
                'Phí mở thẻ',
                selectCard.openFee === 0 ? I18n.t('opencard.free') : selectCard.openFee,
                selectCard.openFee !== 0,

              )}
              {ItemDisplay(
                'Phí thường niên',
                selectCard.annualFee === 0 ? I18n.t('opencard.free') : selectCard.annualFee,
                selectCard.annualFee !== 0,
              )}
              {ItemDisplay('Cashback', selectCard.cashBackDesc)}
            </View>
          </KeyboardAwareScrollView>
          <ConfirmButton onPress={onRegister} text={I18n.t('opencard.btn_open')} loading={isInit} />
        </View>
      </View>
      )}
    </Fragment>
  )
}
export default OpenCardScreen
