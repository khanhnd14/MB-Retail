import * as React from 'react'
import { View, StyleSheet, } from 'react-native'
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

const SuccessSaveDeposit = (props) => {
  const { content, typeSave, resultCreateCAtoFD } = props.route.params
  const { savingResult, resultCompleteCAtoFD, categories } = useSelector((state) => state.save)
  const [isSendEmail, setSendEmail] = React.useState(false)
  const dispatch = useDispatch()

  const onSaveBenefit = () => {
    Navigation.push('SaveBenefit', props.route.params)
  }

  const onSendEmail = (email) => {
    const savingType = categories[_.findIndex(categories, (e) => e.catName === typeSave)].catCode;
    const { tokenTransaction } = resultCompleteCAtoFD
    dispatch(saveOperations.savingSendEmail(savingType, email, tokenTransaction))
  }

  return (
    <>
      <Success {...props} onEmail={() => setSendEmail(true)} message={!savingResult?.lblSysOnline ? savingResult?.lblSysOnlineMsg : content} onSave={onSaveBenefit} hideSaveInfo>
        <View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('saving.noBook')}</Text>
            <Text style={styles.detail}>{resultCreateCAtoFD?.lblBenefitAcc}</Text>
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detail}>{I18n.t('saving.payment')}</Text>
            <Text style={styles.detail}>{Utils.formatAmountText(resultCreateCAtoFD?.lblAmount)} VND</Text>
          </View>

        </View>
      </Success>
      <SendMailDialog
        visible={isSendEmail}
        handleModal={() => setSendEmail(false)}
        tokenTransaction={resultCompleteCAtoFD?.tokenTransaction}
        onSendEmail={onSendEmail}
      />
    </>
  )
}
export default SuccessSaveDeposit
