import * as React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import I18n from 'i18n-js'
import { Success, Text } from '../../../../../components'
import { Colors, Metrics } from '../../../../../theme'

const styles = StyleSheet.create({
  titleContent: { marginBottom: Metrics.medium },
  title: { fontWeight: 'bold', fontSize: 16, color: Colors.white, textAlign: 'center' },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Metrics.small + Metrics.tiny,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white
  }
})

const BuyCardSuccessScreen = (props) => {
  const { redoTransaction, content, body } = props.route.params
  const onSaveBenefit = () => {

  }
  console.log('body', body)
  return (
    <>
      <Success {...props} showButton={false} redoTransaction={redoTransaction} message={content} onSave={onSaveBenefit}>
        {/* <View style={styles.titleContent}>
          <View style={styles.detailContainer}>
            <Text style={styles.title}>Số thẻ cào</Text>
            <Text style={styles.title}>92347263486872</Text>
          </View>
          <View style={{ ...styles.detailContainer, borderBottomWidth: 0 }}>
            <Text style={styles.title}>Số seri</Text>
            <Text style={styles.title}>43953847598754</Text>
          </View>
        </View> */}
      </Success>
    </>
  )
}

export default BuyCardSuccessScreen
