/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { Text, Button, Topbar, LimitItem } from '../../components'
import { ApplicationStyles, Colors, Metrics, Helpers } from '../../theme'
import { settingOperations } from '../../state/setting'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: Metrics.medium * 4,
  },
  resendContainer: {
    marginVertical: Metrics.tiny,
    flexDirection: 'row',
  },
  input: {
    marginBottom: Metrics.small,
    marginTop: Metrics.medium * 2,
  },
  desc: {
    alignSelf: 'center',
    marginBottom: Metrics.small,
    color: Colors.textBlack,
  },
  buttonContainer: {
    alignSelf: 'center',
    paddingBottom: Metrics.medium * 2,
    paddingTop: Metrics.small,
  },
  button: {
    marginHorizontal: Metrics.small,
    width: Metrics.small * 15.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
})
var limitDataClone = []
const ChangeLimit = () => {
  const dispatch = useDispatch()
  const {
    limitDataComplete,
    validLimitComplete,
    validLimitError,
    setLimitComplete,
    setLimitError,
  } = useSelector((state) => state.setting)
  const [loading, setLoading] = useState(false)
  const [listData, setData] = useState(limitDataComplete)

  useEffect(() => {
    if (limitDataComplete) {
      limitDataClone = _.cloneDeep(limitDataComplete)
      setData(limitDataComplete)
    }
  }, [limitDataComplete])

  useEffect(() => {
    const params = {
      channelCode: 'MB',
    }
    dispatch(settingOperations.getLimitTransaction(params))
  }, [])

  useEffect(() => {
    if (validLimitComplete && loading) {
      onSetLimit()
    }
  }, [validLimitComplete])

  useEffect(() => {
    if (setLimitComplete && loading) {
      setLoading(false)
      const params = { paramsMessage: I18n.t('setting.changelimit_success') }
      Navigation.popToPop()
      Navigation.push('SuccessMess', params)
    }
  }, [setLimitComplete])
  useEffect(() => {
    if (setLimitError && loading) {
      setLoading(false)
      Navigation.popToPop()
      const redoTransaction = 'ChangeLimit'
      const params = { redoTransaction }
      Navigation.push('Failed', params)
    }
  }, [setLimitError])
  useEffect(() => {
    if (validLimitError && loading) {
      setLoading(false)
      const { data } = validLimitError
      let stopForEach = false
      if (data) {
        data.forEach((limitItem) => {
          if (stopForEach) {
            return
          }
          if (limitItem.messageError) {
            stopForEach = true
            Utils.toast(`${limitItem.displayName} : ${limitItem.messageError}`)
          }
        })
      }
    }
  }, [validLimitError])

  const onConfirm = () => {
    setLoading(true)
    if (!Utils.isArrayEmpty(limitDataClone)) {
      const params = {
        channelCode: 'MB',
        limitTransfer: JSON.stringify(limitDataClone),
        upgradeGourpId: 0,
      }
      dispatch(settingOperations.validLimitTransaction(params))
    }
  }

  const onSetLimit = () => {
    if (!Utils.isArrayEmpty(limitDataClone)) {
      const params = {
        channelCode: 'MB',
        limitTransfer: JSON.stringify(limitDataClone),
        upgradeGourpId: 0,
      }
      dispatch(settingOperations.setLimitTransaction(params))
    }
  }

  const onReset = () => {
    setData(_.cloneDeep(limitDataComplete))
    limitDataClone = _.cloneDeep(limitDataComplete)
  }

  const onChangeValue = (index, data) => {
    console.log(index, data)
    if (!Utils.isArrayEmpty(limitDataClone)) {
      limitDataClone[index] = data
    }
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('setting.change_limit')} isBottomSubLayout background={Colors.white} />
      <KeyboardAwareScrollView
        extraHeight={150}
        keyboardShouldPersistTaps="always"
        PersistTaps
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        <Text style={styles.desc}>{I18n.t('setting.desc_change_limit')}</Text>
        {listData &&
          listData.map((item, index) => (
            <LimitItem item={item} key={`${index}`} index={index} onChangeValue={onChangeValue} />
          ))}
      </KeyboardAwareScrollView>
      {!Utils.isArrayEmpty(listData) && (
        <View style={[Helpers.rowCross, styles.buttonContainer]}>
          <Button
            style={[ApplicationStyles.btnPrimary, styles.button]}
            onPress={() => onConfirm()}
            loading={loading}
          >
            <Text style={styles.buttonText}>{I18n.t('setting.action_complete').toUpperCase()}</Text>
          </Button>
          <Button
            style={[ApplicationStyles.btnPrimary, styles.button, { backgroundColor: Colors.gray9 }]}
            onPress={() => onReset()}
          >
            <Text style={styles.buttonText}>{I18n.t('setting.action_default').toUpperCase()}</Text>
          </Button>
        </View>
      )}
    </View>
  )
}

export default ChangeLimit
