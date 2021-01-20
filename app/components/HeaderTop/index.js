import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.small * 4.5,
    borderTopStartRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Metrics.normal
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})

const HeaderTop = ({ title = '' }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
)

export default HeaderTop
