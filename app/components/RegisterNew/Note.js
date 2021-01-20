import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import MsbIcon from '../MsbIcon'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Metrics.tiny * 2,
    flexDirection: 'row'
  },
  note: {
    color: Colors.gray3,
    fontFamily: 'Helvetica',
    fontWeight: '300',
    marginLeft: Metrics.tiny
  }
})

const Note = () => (
  <View style={styles.container}>
    <MsbIcon size={Metrics.tiny * 2} name="icon-internet" color={Colors.gray3} />
    <Text style={styles.note}>Xem ghi chú</Text>
  </View>
  )

export default Note
