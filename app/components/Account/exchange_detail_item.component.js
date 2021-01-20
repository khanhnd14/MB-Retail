import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
    // backgroundColor: 'red'
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    color: Colors.gray1,
    fontSize: 14,
    height: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    fontSize: 14,
    marginTop: Metrics.small,
    fontWeight: 'bold',
  },
  note: {
    marginTop: Metrics.small,
    color: '#333333'
  }
})

const ExchangeDetailItem = ({ index, fields, label, value, note }) => (
  <View style={[styles.container, { borderBottomWidth: index === fields.length - 1 ? 0 : 1 }]}>
    <Text style={styles.title}>{label}</Text>
    {value ? (
      <View>
        <Text style={styles.subValue}>{value}</Text>
      </View>
    ) : null}
    {note ? (
      <View>
        <Text style={styles.note}>{note}</Text>
      </View>
    ) : null}
  </View>
  )

export default ExchangeDetailItem
