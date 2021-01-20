/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, ConfirmButton, ConfirmItem } from '../../../components'
import I18n from '../../../translations'
import * as Navigation from '../../../navigation'
import { RESET_STORE } from '../../../state/save/types'
import { saveOperations } from '../../../state/save'
import { numberWithCommas } from '../../../utilities/common'
import * as saveTypes from '../../../state/save/types'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
  },
  contentContainer: {
    marginTop: Metrics.small,
    backgroundColor: Colors.white,
    width: '100%',
    paddingHorizontal: Metrics.small * 1.8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingBottom: Metrics.small,
  },
  formAmount: {
    fontSize: 12,
    paddingVertical: 4,
    color: Colors.gray1,
  },
  btnContinue: {
    padding: 12,
    ...Helpers.contentWidth,
    marginVertical: Metrics.normal,
  },
  content: {
    fontWeight: 'normal',
  },
})

const TransferConfirm = ({ route }) => {
  const { catCode, productCode, fromAcc, payment, account, title, terms, typeSave, lblInterest } = route.params
  const { rate } = useSelector((state) => state.save)
  const dispatch = useDispatch()
  const {
    savingResult,
    resultCompleteSaving,
    errorCompleteSaving,
    loadingCreateSaving
  } = useSelector((state) => state.save)

  const onConfirm = () => {
    dispatch(
      saveOperations.completeSavingOnline(
        savingResult.tokenTransaction,
        catCode,
        productCode,
        'Y'
      )
    )
  }

  const reset = () => {
    dispatch([{
      type: saveTypes.CREATE_SAVING_COMPLETED,
      payload: null,
    }, {
      type: saveTypes.COMPLETE_SAVING_ONLINE_COMPLETED,
      payload: null,
    }])
  }

  const onLeftPress = () => {
    Navigation.pop()
    reset()
  }

  // di sang màn error
  React.useEffect(() => {
    if (errorCompleteSaving) {
      Navigation.popToPop()
      Navigation.push('Failed', {
        route,
        redoTransaction: 'OpenSaveScreen',
        onSwitchTransaction: reset,
      })
    }
  }, [errorCompleteSaving])

  // di sang màn sucess
  React.useEffect(() => {
    console.log('resultCompleteSaving:', resultCompleteSaving);
    if (resultCompleteSaving) {
      Navigation.popToPop()
      Navigation.push('SuccessSave', {
        content: I18n.t('saving.success'),
        typeSave,
        redoTransaction: 'OpenSaveScreen',
        onSwitchTransaction: reset,
        ...resultCompleteSaving
      })
    }
  }, [resultCompleteSaving])

  return (
    <Fragment>
      <Topbar onLeftPress={onLeftPress} title={I18n.t('account.open_save')} subTitle={I18n.t('transfer.title_confirm')} />
      <View style={Helpers.fillColCross}>
        <KeyboardAwareScrollView
          style={Helpers.fullWidth}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Helpers.fillColCross, styles.container]}>
            <ConfirmItem
              style={[{ borderBottomWidth: 0, paddingHorizontal: Metrics.small * 1.8 }]}
              title={I18n.t('transfer.rollout_account')}
              content={`${account.find(item => item.acctNo === fromAcc)?.accountInString} - ${account.find(item => item.acctNo === fromAcc)?.alias}`}
              subContent={`${numberWithCommas(account.find(item => item.acctNo === fromAcc)?.availableBalance)} VND`}
            />
            <View style={styles.contentContainer}>
              <ConfirmItem
                title={I18n.t('saving.type_save')}
                content={title}
              />
              <ConfirmItem
                title={I18n.t('transfer.amount')}
                amount={payment}
              />
              <ConfirmItem
                title={I18n.t('saving.term')}
                content={terms?.find(item => item.productCode === productCode)?.termName}
                subContent={terms?.find(item => item.productCode === productCode)?.settlementDate}
              />
              <ConfirmItem
                title={I18n.t('saving.interest_rate')}
                content={`${rate}%/${I18n.t('saving.year')}`}
              />
              <ConfirmItem
                title={I18n.t('saving.rate_end_term')}
                content={`${Utils.formatAmountText(lblInterest)} VND`}
                style={{ borderBottomWidth: 0 }}
              />
              {!savingResult?.lblSysOnline && (
                <ConfirmItem
                  title="Lưu ý"
                  content={savingResult?.lblSysOnlineMsg}
                  style={{ borderBottomWidth: 0 }}
                  icon={false}
                />
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ConfirmButton onPress={onConfirm} disabled={loadingCreateSaving} loading={loadingCreateSaving} />
      </View>
    </Fragment>
  )
}
export default TransferConfirm
