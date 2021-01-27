import * as React from 'react'
import { View, StyleSheet, } from 'react-native'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../../theme'
import { Text, Success ,AmountLabel } from '../../../components'
import { useDispatch, useSelector } from 'react-redux'
import { odSavingOperations } from '../../../state/overdraftSaving'
import moment from 'moment'

const styles = StyleSheet.create({
  titleContent: {
    flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10,
    borderBottomColor: Colors.white, borderBottomWidth: 1
  },
  title: { color: Colors.white, textAlign: 'center', paddingVertical: 10 },
})

const CreateODSuccessScreen = (props) => {
  const dispatch = useDispatch()
  const { creationInfo, openODInfo, } = useSelector((state) => state.overdraft)
  const [expireDate, setExpireDate] = React.useState("")
  const momentFormat = "DD/MM/YYYY"
  // React.useEffect(() => {
    
  // }, [])
  React.useEffect(() => {
    console.log('openODInfo',openODInfo);
    let exp = moment(openODInfo?.expireDate).format(momentFormat)
    setExpireDate(exp)
  }, [openODInfo])
  
  const { content } = props.route.params
  const getSuccessContent = () => {
    return (
      <>
        <View style={styles.titleContent}>
          <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.overdraftLimit')}</Text>
          <AmountLabel style={styles.title} value={openODInfo?.odLimit} currency={'VND'} />
        </View>
        <View style={styles.titleContent}>
          <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.odInterestRate')}</Text>
          <Text style={styles.title}>{openODInfo?.rate}{I18n.t('overdraft.fromOnlineSaving.percentYear')}</Text>
        </View>
        <View style={styles.titleContent}>
          <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.expireDate')}</Text>
          <Text style={styles.title}>{expireDate}</Text>
        </View>
      </>
    )
  }
  return (
    <>
      <Success
        {...props}
        // redoTransaction={props.route.params.redoTransaction}
        // hideSaveInfo
        showButton={false}
        message={content}
        redoTransaction={'ODServiceScreen'}
        children={getSuccessContent()}
      // redoTransaction: 'CreditScreen',
      // onSwitchTransaction: reset

      />
    </>
  )
}

export default CreateODSuccessScreen
