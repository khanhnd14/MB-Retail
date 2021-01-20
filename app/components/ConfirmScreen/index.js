import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import I18n from 'i18n-js'
import { useDispatch, useSelector } from 'react-redux'
import { Topbar, ConfirmButton, Icon } from '..'
import styles from './style'
import { Colors, Helpers, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import { saveOperations } from '../../state/save'
import * as saveTypes from '../../state/save/types'
import * as Navigation from '../../navigation'
import ConfirmItem from '../ConfirmItem'

const ConfirmScreen = ({ route }) => {
  const { acctNo, amount, fields } = route.params
  const { title, typeSave, catCode, index, savingOnlineAccounts, currentAccount } = route.params
  const dispatch = useDispatch()
  const {
    account,
    resultCheckHoliday,
    resultCreateCAtoFD,
    resultCompleteCAtoFD,
    errorCompleteCAtoFD
  } = useSelector((state) => state.save)

  const reset = () => {
    dispatch({
      type: saveTypes.RESET_STORE,
      payload: undefined,
    })
  }

  const onSubmit = () => {
//       tokenTransaction: cda90bac543e7035816c1483cc17c05fa9032877
      // category: FSDK
      // productType:
      // renewMatter:
      // tokenNo: 193b32be-0fe3-42e7-a683-67bca7359d1e
      // lang: vi_VN
      const body = {
        tokenTransaction: resultCreateCAtoFD.tokenTransaction,
        category: 'FSDK'
      }
      Utils.showLoading()
      dispatch(saveOperations.savingCompleteCAtoFD(body))
  }

  const onLeftPress = () => {
    Navigation.pop()
    dispatch([
      {
        type: saveTypes.RESET_HOLIDAY,
      },
      {
        type: saveTypes.RESET_CA_FD_FAILED,
      },
    ])
  }

    // di sang màn sucess
  React.useEffect(() => {
    if (resultCompleteCAtoFD) {
      Utils.hideLoading()
      Navigation.popToPop()
      Navigation.push('SuccessSaveDeposit', {
        content: I18n.t('saving.deposit_saving'),
        typeSave: 'FSOV',
        redoTransaction: 'OpenSaveScreen',
        onSwitchTransaction: reset,
        resultCreateCAtoFD
      })
    }
  }, [resultCompleteCAtoFD])

  useEffect(() => {
    if (errorCompleteCAtoFD) {
      Utils.hideLoading()
      Navigation.popToPop()
      Navigation.push('Failed', {
        route,
        redoTransaction: 'OpenSaveScreen',
        onSwitchTransaction: reset,
      })
    }
  }, [errorCompleteCAtoFD])

  return (
    <View style={styles.bodyContainer}>
      <Topbar onLeftPress={onLeftPress} subTitle={I18n.t('saving.deposit_saving')} title={I18n.t('product.recharge')} />
      <ScrollView>
        <View style={[Helpers.fillColCross, { paddingHorizontal: Metrics.small * 1.8 }]}>
          <ConfirmItem
            style={[{ borderBottomWidth: 0, paddingHorizontal: Metrics.small * 1.8 }]}
            title={I18n.t('transfer.rollout_account')}
            content={acctNo}
            subContent={Utils.formatAmountText(amount)}
            contentStyle={styles.contentValue}

          />
          <View style={styles.contentContainer}>
            {
                fields.map((value, i) => (
                  <ConfirmItem
                    key={i}
                    title={value.label}
                    content={value.value}
                    style={{ borderBottomWidth: i === fields.length - 1 ? 0 : 1 }}
                  />
                  ))
              }
          </View>
        </View>
      </ScrollView>

      <ConfirmButton onPress={onSubmit} loading={false} style={styles.buttonConfirm} />
    </View>
    )
}
export default ConfirmScreen
