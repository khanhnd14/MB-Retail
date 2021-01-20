import * as React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../../theme'
import { Text, Success } from '../../../components'

const styles = StyleSheet.create({
  titleContent: { marginBottom: Metrics.medium },
  title: { fontWeight: 'bold', fontSize: 24, color: Colors.white, textAlign: 'center' },
})

const SuccessScreen = (props) => {
  const { redoTransaction, content, hideEmail } = props.route.params
  const onSaveBenefit = () => {

  }
  return (
    <>
      <Success
        {...props}
        redoTransaction={redoTransaction}
        hideSaveInfo
        message={content}
        onSave={onSaveBenefit}
        hideEmail={hideEmail}
      />
    </>
  )
}

export default SuccessScreen
