import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  subValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
})

const TypeSave = ({ typeSave }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{I18n.t('saving.type_save')}</Text>
    <View
      style={{
          marginVertical: Metrics.small,
        }}
    >
      <Text style={styles.subValue}>{typeSave}</Text>
    </View>
  </View>
  )

export default TypeSave
