/* eslint-disable react/destructuring-assignment */
import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import I18n from 'i18n-js'
import _ from 'lodash'
import * as Navigation from '../../../navigation'
import { Colors, Metrics, Helpers } from '../../../theme'
import { Text, Success } from '../../../components'
import { Utils } from '../../../utilities'
import SendMailDialog from '../../transfer/common/SendMailDialog'
import { saveOperations } from '../../../state/save'

const styles = StyleSheet.create({
  detailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  detail: { fontWeight: 'bold', fontSize: 14, color: Colors.white, textAlign: 'center' },
})

const SuccessSave = (props) => {
  const { content, typeSave } = props.route.params
  const { savingResult, resultCompleteSaving, categories } = useSelector((state) => state.save)
  const [isSendEmail, setSendEmail] = React.useState(false)
  const dispatch = useDispatch()

  const onSaveBenefit = () => {
    Navigation.push('SaveBenefit', props.route.params)
  }

  const onSendEmail = (email) => {
    const savingType = categories[_.findIndex(categories, (e) => e.catName === typeSave)].catCode
    const { tokenTransaction } = resultCompleteSaving
    dispatch(saveOperations.savingSendEmail(savingType, email, tokenTransaction))
  }

  console.log('--------------------------------------------------------')
  console.log('content', content)
  console.log('savingResult', savingResult)
  console.log('--------------------------------------------------------')

  return (
    <>
      <Success
        {...props}
        {...props.route.params}
        onEmail={() => setSendEmail(true)}
        message={!savingResult?.lblSysOnline ? savingResult?.lblSysOnlineMsg : content}
        onSave={onSaveBenefit}
        hideSaveInfo
      >
        <View>
          <View style={styles.detailContent}>
            <Text style={[styles.detail, { fontWeight: 'normal' }]}>{I18n.t('saving.noBook')}</Text>
            <Text style={styles.detail}>{resultCompleteSaving?.lblReceiptNo}</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={[styles.detail, { fontWeight: 'normal' }]}>{I18n.t('saving.payment')}</Text>
            <Text style={styles.detail}>{Utils.formatAmountText(savingResult?.lblAmount)} VND</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={[styles.detail, { fontWeight: 'normal' }]}>{I18n.t('saving.term')}</Text>
            <Text style={styles.detail}>{savingResult?.lblProductName.split('-')[0]}</Text>
          </View>
          <View style={[styles.detailContent, { borderBottomWidth: 0 }]}>
            <Text style={[styles.detail, { fontWeight: 'normal' }]}>{I18n.t('saving.interest_rate')}</Text>
            <Text style={styles.detail}>{savingResult?.lblProductName.split('-')[1]}</Text>
          </View>
        </View>
      </Success>
      <SendMailDialog
        visible={isSendEmail}
        handleModal={() => setSendEmail(false)}
        tokenTransaction={resultCompleteSaving.tokenTransaction}
        onSendEmail={onSendEmail}
      />
    </>
  )
}
export default SuccessSave
