import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { Text, Topbar, AccountItemSetting } from '../../components'
import { Colors, Metrics, Helpers } from '../../theme'
import { settingOperations } from '../../state/setting'
import I18n from '../../translations'
import { Utils } from '../../utilities'

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
    paddingHorizontal: Metrics.medium,
    marginBottom: Metrics.small,
    color: Colors.textBlack,
  },
  buttonContainer: {
    alignSelf: 'center',
    paddingVertical: Metrics.medium * 2,
  },
  button: {
    marginHorizontal: Metrics.small,
  },
})

const ChangeAccount = () => {
  const dispatch = useDispatch()
  const { accountComplete } = useSelector((state) => state.setting)
  const [selectItem, setSelectItem] = useState({})
  useEffect(() => {
    if (!Utils.isArrayEmpty(accountComplete)) {
      const masterAccount = _.find(accountComplete, {
        isMaster: 'Y',
      })
      if (!masterAccount) {
        setSelectItem(accountComplete[0])
      } else {
        setSelectItem(masterAccount)
      }
    }
  }, [accountComplete])

  useEffect(() => {
    const params = {
      acctType: "'CA'",
      status: "'ACTV'",
      currencyCode: 'VND',
    }
    dispatch(settingOperations.getAccounts(params))
  }, [])

  const onSelectItem = (item) => {
    setSelectItem(item)
    const params = {
      accNo: item.acctNo,
    }
    dispatch(settingOperations.setDefaultAccount(params))
  }

  return (
    <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
      <Topbar title={I18n.t('setting.change_acount')} isBottomSubLayout background={Colors.white} />
      <KeyboardAwareScrollView
        extraHeight={150}
        keyboardShouldPersistTaps="always"
        PersistTaps
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        <Text style={styles.desc}>{I18n.t('setting.desc_change_account')}</Text>
        {accountComplete &&
          accountComplete.map((item, index) => (
            <AccountItemSetting
              checked={item.acctNo === selectItem.acctNo}
              item={item}
              key={`${index}`}
              onSelectItem={() => onSelectItem(item)}
            />
          ))}
      </KeyboardAwareScrollView>
    </View>
  )
}

export default ChangeAccount
