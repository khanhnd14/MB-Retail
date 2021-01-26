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

const CreateODSuccessScreen = (props) => {
  
  
  const { content } = props.route.params
  console.log(props,props.route.params);
  const onSaveBenefit = () => {

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
        // redoTransaction: 'CreditScreen',
        // onSwitchTransaction: reset

      />
    </>
  )
}

export default CreateODSuccessScreen
